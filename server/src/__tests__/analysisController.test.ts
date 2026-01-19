import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import type { Request, Response } from 'express';

// Type for mock functions
type MockFn = jest.Mock<(...args: unknown[]) => unknown>;

// Mock the db module before imports
const mockPrisma = {
  niche: {
    findUnique: jest.fn() as MockFn,
  },
  keyword: {
    findFirst: jest.fn() as MockFn,
    create: jest.fn() as MockFn,
  },
  analysis: {
    findMany: jest.fn() as MockFn,
    create: jest.fn() as MockFn,
  },
};

const mockAnalyzeCompetition = jest.fn() as MockFn;
const mockAnalyzeProfitability = jest.fn() as MockFn;

jest.unstable_mockModule('../lib/db.js', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

jest.unstable_mockModule('../services/competitionAnalysisService.js', () => ({
  analyzeCompetition: mockAnalyzeCompetition,
}));

jest.unstable_mockModule('../services/profitabilityAnalysisService.js', () => ({
  analyzeProfitability: mockAnalyzeProfitability,
}));

// Import controllers after mocking
const { getAnalysesByNiche, runAnalysis, getLatestAnalyses, getTopNiches } =
  await import('../controllers/crud/analysisController.js');

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

describe('Analysis Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAnalyzeCompetition.mockResolvedValue(50);
    mockAnalyzeProfitability.mockResolvedValue(75);
  });

  describe('getAnalysesByNiche', () => {
    it('should return analyses for a given niche', async () => {
      const mockAnalyses = [
        {
          id: 'analysis-1',
          competitionScore: 50,
          profitabilityScore: 75,
          overallScore: 25,
          channelCount: 50,
          nicheId: 'niche-1',
          keyword: { id: 'kw-1', term: 'gaming tutorials' },
          createdAt: new Date(),
        },
      ];

      mockPrisma.analysis.findMany.mockResolvedValue(mockAnalyses);

      const { req, res } = createMockReqRes({ params: { nicheId: 'niche-1' } });
      await getAnalysesByNiche(req, res);

      expect(mockPrisma.analysis.findMany).toHaveBeenCalledWith({
        where: { nicheId: 'niche-1' },
        include: { keyword: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(res.json).toHaveBeenCalledWith(mockAnalyses);
    });

    it('should return 500 on database error', async () => {
      mockPrisma.analysis.findMany.mockRejectedValue(new Error('Database error'));

      const { req, res } = createMockReqRes({ params: { nicheId: 'niche-1' } });
      await getAnalysesByNiche(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch analyses' });
    });
  });

  describe('runAnalysis', () => {
    it('should run analysis successfully with existing keyword', async () => {
      const mockNiche = { id: 'niche-1', name: 'Gaming' };
      const mockKeyword = { id: 'kw-1', term: 'gaming tutorials', nicheId: 'niche-1' };
      const mockAnalysis = {
        id: 'analysis-new',
        competitionScore: 50,
        profitabilityScore: 75,
        overallScore: 25,
        channelCount: 50,
        nicheId: 'niche-1',
        keywordId: 'kw-1',
        keyword: mockKeyword,
        niche: mockNiche,
        createdAt: new Date(),
      };

      mockPrisma.niche.findUnique.mockResolvedValue(mockNiche);
      mockPrisma.keyword.findFirst.mockResolvedValue(mockKeyword);
      mockPrisma.analysis.create.mockResolvedValue(mockAnalysis);

      const { req, res } = createMockReqRes({
        params: { nicheId: 'niche-1' },
        body: { keyword: 'gaming tutorials' },
      });
      await runAnalysis(req, res);

      expect(mockPrisma.niche.findUnique).toHaveBeenCalledWith({
        where: { id: 'niche-1' },
      });
      expect(mockAnalyzeCompetition).toHaveBeenCalledWith('gaming tutorials');
      expect(mockAnalyzeProfitability).toHaveBeenCalledWith('gaming tutorials');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockAnalysis);
    });

    it('should create new keyword when not exists', async () => {
      const mockNiche = { id: 'niche-1', name: 'Gaming' };
      const mockNewKeyword = { id: 'kw-new', term: 'new keyword', nicheId: 'niche-1' };
      const mockAnalysis = {
        id: 'analysis-new',
        competitionScore: 50,
        profitabilityScore: 75,
        overallScore: 25,
        channelCount: 50,
        nicheId: 'niche-1',
        keywordId: 'kw-new',
        keyword: mockNewKeyword,
        niche: mockNiche,
        createdAt: new Date(),
      };

      mockPrisma.niche.findUnique.mockResolvedValue(mockNiche);
      mockPrisma.keyword.findFirst.mockResolvedValue(null);
      mockPrisma.keyword.create.mockResolvedValue(mockNewKeyword);
      mockPrisma.analysis.create.mockResolvedValue(mockAnalysis);

      const { req, res } = createMockReqRes({
        params: { nicheId: 'niche-1' },
        body: { keyword: 'new keyword' },
      });
      await runAnalysis(req, res);

      expect(mockPrisma.keyword.create).toHaveBeenCalledWith({
        data: {
          term: 'new keyword',
          nicheId: 'niche-1',
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 404 when niche not found', async () => {
      mockPrisma.niche.findUnique.mockResolvedValue(null);

      const { req, res } = createMockReqRes({
        params: { nicheId: 'nonexistent' },
        body: { keyword: 'test keyword' },
      });
      await runAnalysis(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Niche not found' });
    });

    it('should return 400 for invalid input', async () => {
      const { req, res } = createMockReqRes({
        params: { nicheId: 'niche-1' },
        body: { keyword: '' }, // Empty keyword is invalid
      });
      await runAnalysis(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Invalid input' })
      );
    });

    it('should handle competition analysis failure gracefully', async () => {
      const mockNiche = { id: 'niche-1', name: 'Gaming' };
      const mockKeyword = { id: 'kw-1', term: 'gaming tutorials', nicheId: 'niche-1' };
      const mockAnalysis = {
        id: 'analysis-new',
        competitionScore: 999, // Penalty score
        profitabilityScore: 75,
        overallScore: -924, // 75 - 999
        channelCount: 999,
        nicheId: 'niche-1',
        keywordId: 'kw-1',
        keyword: mockKeyword,
        niche: mockNiche,
        createdAt: new Date(),
      };

      mockPrisma.niche.findUnique.mockResolvedValue(mockNiche);
      mockPrisma.keyword.findFirst.mockResolvedValue(mockKeyword);
      mockAnalyzeCompetition.mockRejectedValue(new Error('API Error'));
      mockPrisma.analysis.create.mockResolvedValue(mockAnalysis);

      const { req, res } = createMockReqRes({
        params: { nicheId: 'niche-1' },
        body: { keyword: 'gaming tutorials' },
      });
      await runAnalysis(req, res);

      // Should still create analysis with penalty score
      expect(mockPrisma.analysis.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            competitionScore: 999,
          }),
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('getLatestAnalyses', () => {
    it('should return the latest 20 analyses', async () => {
      const mockAnalyses = [
        {
          id: 'analysis-1',
          competitionScore: 50,
          profitabilityScore: 75,
          overallScore: 25,
          niche: { id: 'niche-1', name: 'Gaming' },
          keyword: { id: 'kw-1', term: 'gaming' },
          createdAt: new Date(),
        },
      ];

      mockPrisma.analysis.findMany.mockResolvedValue(mockAnalyses);

      const { req, res } = createMockReqRes();
      await getLatestAnalyses(req, res);

      expect(mockPrisma.analysis.findMany).toHaveBeenCalledWith({
        include: {
          niche: true,
          keyword: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
      expect(res.json).toHaveBeenCalledWith(mockAnalyses);
    });

    it('should return 500 on database error', async () => {
      mockPrisma.analysis.findMany.mockRejectedValue(new Error('Database error'));

      const { req, res } = createMockReqRes();
      await getLatestAnalyses(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch analyses' });
    });
  });

  describe('getTopNiches', () => {
    it('should return top 10 niches by overall score', async () => {
      const mockAnalyses = [
        {
          id: 'analysis-1',
          competitionScore: 30,
          profitabilityScore: 100,
          overallScore: 70,
          niche: { id: 'niche-1', name: 'Cooking' },
          keyword: { id: 'kw-1', term: 'cooking recipes' },
          createdAt: new Date(),
        },
      ];

      mockPrisma.analysis.findMany.mockResolvedValue(mockAnalyses);

      const { req, res } = createMockReqRes();
      await getTopNiches(req, res);

      expect(mockPrisma.analysis.findMany).toHaveBeenCalledWith({
        include: { niche: true, keyword: true },
        orderBy: { overallScore: 'desc' },
        take: 10,
      });
      expect(res.json).toHaveBeenCalledWith(mockAnalyses);
    });

    it('should return 500 on database error', async () => {
      mockPrisma.analysis.findMany.mockRejectedValue(new Error('Database error'));

      const { req, res } = createMockReqRes();
      await getTopNiches(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch top niches' });
    });
  });
});
