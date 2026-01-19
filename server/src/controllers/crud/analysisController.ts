import type { Request, Response } from 'express';
import prisma from '../../lib/db.js';
import { analyzeCompetition } from '../../services/competitionAnalysisService.js';
import { analyzeProfitability } from '../../services/profitabilityAnalysisService.js';
import { z } from 'zod';

const RunAnalysisSchema = z.object({
  keyword: z.string().min(1).max(200),
});

export const getAnalysesByNiche = async (req: Request, res: Response) => {
  try {
    const { nicheId } = req.params;
    const analyses = await prisma.analysis.findMany({
      where: { nicheId },
      include: { keyword: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(analyses);
  } catch (error) {
    console.error('Error fetching analyses:', error);
    res.status(500).json({ error: 'Failed to fetch analyses' });
  }
};

export const runAnalysis = async (req: Request, res: Response) => {
  try {
    const { nicheId } = req.params;
    const parsed = RunAnalysisSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });
      return;
    }

    const { keyword: keywordTerm } = parsed.data;

    // Verify niche exists
    const niche = await prisma.niche.findUnique({ where: { id: nicheId } });
    if (!niche) {
      res.status(404).json({ error: 'Niche not found' });
      return;
    }

    // Create or find keyword
    let keyword = await prisma.keyword.findFirst({
      where: { term: keywordTerm, nicheId },
    });

    if (!keyword) {
      keyword = await prisma.keyword.create({
        data: {
          term: keywordTerm,
          nicheId,
        },
      });
    }

    // Run analysis
    let competitionScore = 0;
    let channelCount = 0;
    let profitabilityScore = 0;

    try {
      competitionScore = await analyzeCompetition(keywordTerm);
      channelCount = competitionScore; // The service returns channel count as competition score
    } catch (e) {
      console.error('Competition analysis failed:', e);
      competitionScore = 999; // High penalty on error
    }

    try {
      profitabilityScore = await analyzeProfitability(keywordTerm);
    } catch (e) {
      console.error('Profitability analysis failed:', e);
      profitabilityScore = 0; // Zero profitability on error
    }

    const overallScore = profitabilityScore - competitionScore;

    // Save analysis
    const analysis = await prisma.analysis.create({
      data: {
        competitionScore,
        profitabilityScore,
        overallScore,
        channelCount,
        nicheId,
        keywordId: keyword.id,
      },
      include: { keyword: true, niche: true },
    });

    res.status(201).json(analysis);
  } catch (error) {
    console.error('Error running analysis:', error);
    res.status(500).json({ error: 'Failed to run analysis' });
  }
};

export const getLatestAnalyses = async (_req: Request, res: Response) => {
  try {
    const analyses = await prisma.analysis.findMany({
      include: {
        niche: true,
        keyword: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json(analyses);
  } catch (error) {
    console.error('Error fetching analyses:', error);
    res.status(500).json({ error: 'Failed to fetch analyses' });
  }
};

export const getTopNiches = async (_req: Request, res: Response) => {
  try {
    const analyses = await prisma.analysis.findMany({
      include: { niche: true, keyword: true },
      orderBy: { overallScore: 'desc' },
      take: 10,
    });
    res.json(analyses);
  } catch (error) {
    console.error('Error fetching top niches:', error);
    res.status(500).json({ error: 'Failed to fetch top niches' });
  }
};
