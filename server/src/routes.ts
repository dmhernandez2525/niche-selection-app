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
import { authRouter } from './routes/authRoutes.js';
import { authenticate, optionalAuthenticate } from './middleware/auth.js';
import {
  apiRateLimiter,
  youtubeRateLimiter,
  googleTrendsRateLimiter,
} from './middleware/rateLimiter.js';

export const nicheRouter = Router();

// Apply general API rate limiting to all routes
nicheRouter.use(apiRateLimiter);

// Mount auth routes
nicheRouter.use('/auth', authRouter);

// Legacy route for niche selection algorithm (public)
nicheRouter.get('/niche-selection', getNiches);

// CRUD routes for niches
// Read operations are public, write operations require authentication
nicheRouter.get('/niches', optionalAuthenticate, getAllNiches);
nicheRouter.get('/niches/:id', optionalAuthenticate, getNicheById);
nicheRouter.post('/niches', authenticate, createNiche);
nicheRouter.put('/niches/:id', authenticate, updateNiche);
nicheRouter.delete('/niches/:id', authenticate, deleteNiche);

// Analysis routes
// Read operations are public, write operations require authentication and external API rate limiting
nicheRouter.get('/niches/:nicheId/analyses', optionalAuthenticate, getAnalysesByNiche);
nicheRouter.post(
  '/niches/:nicheId/analyses',
  authenticate,
  youtubeRateLimiter,
  googleTrendsRateLimiter,
  runAnalysis
);
nicheRouter.get('/analyses/latest', optionalAuthenticate, getLatestAnalyses);
nicheRouter.get('/analyses/top', optionalAuthenticate, getTopNiches);
