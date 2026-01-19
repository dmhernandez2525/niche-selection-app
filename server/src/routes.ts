import { Router } from 'express';
import { getNiches } from './controllers/nicheController.js';
import {
  getAllNiches,
  getNicheById,
  createNiche,
  updateNiche,
  deleteNiche,
} from './controllers/crud/nicheController.js';
import {
  getAnalysesByNiche,
  runAnalysis,
  getLatestAnalyses,
  getTopNiches,
} from './controllers/crud/analysisController.js';

export const nicheRouter = Router();

// Legacy route for niche selection algorithm
nicheRouter.get('/niche-selection', getNiches);

// CRUD routes for niches
nicheRouter.get('/niches', getAllNiches);
nicheRouter.get('/niches/:id', getNicheById);
nicheRouter.post('/niches', createNiche);
nicheRouter.put('/niches/:id', updateNiche);
nicheRouter.delete('/niches/:id', deleteNiche);

// Analysis routes
nicheRouter.get('/niches/:nicheId/analyses', getAnalysesByNiche);
nicheRouter.post('/niches/:nicheId/analyses', runAnalysis);
nicheRouter.get('/analyses/latest', getLatestAnalyses);
nicheRouter.get('/analyses/top', getTopNiches);
