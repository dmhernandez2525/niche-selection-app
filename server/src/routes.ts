import { Router } from 'express';
import { getNiches } from './controllers/nicheController.js';

export const nicheRouter = Router();

nicheRouter.get('/niche-selection', getNiches);
