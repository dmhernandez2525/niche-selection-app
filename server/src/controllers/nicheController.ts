import type { Request, Response } from 'express';
import { selectNiche } from '../services/nicheService.js';

export const getNiches = async (req: Request, res: Response) => {
  try {
    const niches = await selectNiche();
    res.json(niches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while selecting niches.' });
  }
};
