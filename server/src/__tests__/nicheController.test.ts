import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import type { Request, Response } from 'express';

// Mock the db module before imports
const mockPrisma = {
  niche: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.unstable_mockModule('../lib/db.js', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

// Import controllers after mocking
const { getAllNiches, getNicheById, createNiche, updateNiche, deleteNiche } =
  await import('../controllers/crud/nicheController.js');

// Helper to create mock request/response
function createMockReqRes(options: {
  params?: Record<string, string>;
  body?: Record<string, unknown>;
} = {}) {
  const req = {
    params: options.params || {},
    body: options.body || {},
  } as unknown as Request;

  const res = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as unknown as Response;

  return { req, res };
}

describe('Niche Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllNiches', () => {
    it('should return all niches successfully', async () => {
      const mockNiches = [
        {
          id: 'niche-1',
          name: 'Gaming',
          description: 'Gaming content',
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { analyses: 5, keywords: 10 },
        },
        {
          id: 'niche-2',
          name: 'Cooking',
          description: 'Cooking tutorials',
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: { analyses: 3, keywords: 8 },
        },
      ];

      mockPrisma.niche.findMany.mockResolvedValue(mockNiches);

      const { req, res } = createMockReqRes();
      await getAllNiches(req, res);

      expect(mockPrisma.niche.findMany).toHaveBeenCalledWith({
        include: {
          _count: {
            select: { analyses: true, keywords: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(res.json).toHaveBeenCalledWith(mockNiches);
    });

    it('should return 500 on database error', async () => {
      mockPrisma.niche.findMany.mockRejectedValue(new Error('Database error'));

      const { req, res } = createMockReqRes();
      await getAllNiches(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch niches' });
    });
  });

  describe('getNicheById', () => {
    it('should return a niche by ID', async () => {
      const mockNiche = {
        id: 'niche-1',
        name: 'Gaming',
        description: 'Gaming content',
        createdAt: new Date(),
        updatedAt: new Date(),
        analyses: [],
        keywords: [],
      };

      mockPrisma.niche.findUnique.mockResolvedValue(mockNiche);

      const { req, res } = createMockReqRes({ params: { id: 'niche-1' } });
      await getNicheById(req, res);

      expect(mockPrisma.niche.findUnique).toHaveBeenCalledWith({
        where: { id: 'niche-1' },
        include: {
          analyses: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          keywords: true,
        },
      });
      expect(res.json).toHaveBeenCalledWith(mockNiche);
    });

    it('should return 404 when niche not found', async () => {
      mockPrisma.niche.findUnique.mockResolvedValue(null);

      const { req, res } = createMockReqRes({ params: { id: 'nonexistent' } });
      await getNicheById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Niche not found' });
    });
  });

  describe('createNiche', () => {
    it('should create a niche successfully', async () => {
      const mockNiche = {
        id: 'niche-new',
        name: 'Fitness',
        description: 'Fitness content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.niche.create.mockResolvedValue(mockNiche);

      const { req, res } = createMockReqRes({
        body: { name: 'Fitness', description: 'Fitness content' },
      });
      await createNiche(req, res);

      expect(mockPrisma.niche.create).toHaveBeenCalledWith({
        data: {
          name: 'Fitness',
          description: 'Fitness content',
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockNiche);
    });

    it('should return 400 for invalid input', async () => {
      const { req, res } = createMockReqRes({
        body: { name: '' }, // Empty name is invalid
      });
      await createNiche(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Invalid input' })
      );
    });

    it('should return 409 for duplicate niche name', async () => {
      const duplicateError = { code: 'P2002' };
      mockPrisma.niche.create.mockRejectedValue(duplicateError);

      const { req, res } = createMockReqRes({
        body: { name: 'Gaming' },
      });
      await createNiche(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        error: 'A niche with this name already exists',
      });
    });
  });

  describe('updateNiche', () => {
    it('should update a niche successfully', async () => {
      const mockUpdatedNiche = {
        id: 'niche-1',
        name: 'Updated Gaming',
        description: 'Updated description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.niche.update.mockResolvedValue(mockUpdatedNiche);

      const { req, res } = createMockReqRes({
        params: { id: 'niche-1' },
        body: { name: 'Updated Gaming', description: 'Updated description' },
      });
      await updateNiche(req, res);

      expect(mockPrisma.niche.update).toHaveBeenCalledWith({
        where: { id: 'niche-1' },
        data: { name: 'Updated Gaming', description: 'Updated description' },
      });
      expect(res.json).toHaveBeenCalledWith(mockUpdatedNiche);
    });

    it('should return 404 when updating non-existent niche', async () => {
      const notFoundError = { code: 'P2025' };
      mockPrisma.niche.update.mockRejectedValue(notFoundError);

      const { req, res } = createMockReqRes({
        params: { id: 'nonexistent' },
        body: { name: 'Test' },
      });
      await updateNiche(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Niche not found' });
    });
  });

  describe('deleteNiche', () => {
    it('should delete a niche successfully', async () => {
      mockPrisma.niche.delete.mockResolvedValue({});

      const { req, res } = createMockReqRes({ params: { id: 'niche-1' } });
      await deleteNiche(req, res);

      expect(mockPrisma.niche.delete).toHaveBeenCalledWith({
        where: { id: 'niche-1' },
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 when deleting non-existent niche', async () => {
      const notFoundError = { code: 'P2025' };
      mockPrisma.niche.delete.mockRejectedValue(notFoundError);

      const { req, res } = createMockReqRes({ params: { id: 'nonexistent' } });
      await deleteNiche(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Niche not found' });
    });
  });
});
