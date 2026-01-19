import type { Request, Response } from 'express';
import prisma from '../../lib/db.js';
import { z } from 'zod';

const CreateNicheSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

const UpdateNicheSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const getAllNiches = async (_req: Request, res: Response) => {
  try {
    const niches = await prisma.niche.findMany({
      include: {
        _count: {
          select: { analyses: true, keywords: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(niches);
  } catch (error) {
    console.error('Error fetching niches:', error);
    res.status(500).json({ error: 'Failed to fetch niches' });
  }
};

export const getNicheById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const niche = await prisma.niche.findUnique({
      where: { id },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        keywords: true,
      },
    });

    if (!niche) {
      res.status(404).json({ error: 'Niche not found' });
      return;
    }

    res.json(niche);
  } catch (error) {
    console.error('Error fetching niche:', error);
    res.status(500).json({ error: 'Failed to fetch niche' });
  }
};

export const createNiche = async (req: Request, res: Response) => {
  try {
    const parsed = CreateNicheSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });
      return;
    }

    const niche = await prisma.niche.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description ?? null,
      },
    });

    res.status(201).json(niche);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'A niche with this name already exists' });
      return;
    }
    console.error('Error creating niche:', error);
    res.status(500).json({ error: 'Failed to create niche' });
  }
};

export const updateNiche = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const parsed = UpdateNicheSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });
      return;
    }

    const updateData: { name?: string; description?: string | null } = {};
    if (parsed.data.name !== undefined) {
      updateData.name = parsed.data.name;
    }
    if (parsed.data.description !== undefined) {
      updateData.description = parsed.data.description ?? null;
    }

    const niche = await prisma.niche.update({
      where: { id },
      data: updateData,
    });

    res.json(niche);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Niche not found' });
      return;
    }
    console.error('Error updating niche:', error);
    res.status(500).json({ error: 'Failed to update niche' });
  }
};

export const deleteNiche = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await prisma.niche.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Niche not found' });
      return;
    }
    console.error('Error deleting niche:', error);
    res.status(500).json({ error: 'Failed to delete niche' });
  }
};
