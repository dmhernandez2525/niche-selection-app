import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  changePassword,
} from '../controllers/auth/authController.js';
import { authenticate } from '../middleware/auth.js';
import { strictRateLimiter, apiRateLimiter } from '../middleware/rateLimiter.js';

export const authRouter = Router();

/**
 * Public auth routes (rate limited strictly to prevent brute force)
 */

// POST /api/auth/register - Register a new user
authRouter.post('/register', strictRateLimiter, register);

// POST /api/auth/login - Login user
authRouter.post('/login', strictRateLimiter, login);

// POST /api/auth/refresh - Refresh access token
authRouter.post('/refresh', apiRateLimiter, refreshToken);

/**
 * Protected auth routes (require authentication)
 */

// POST /api/auth/logout - Logout user
authRouter.post('/logout', authenticate, logout);

// GET /api/auth/me - Get current user profile
authRouter.get('/me', authenticate, getCurrentUser);

// POST /api/auth/change-password - Change password
authRouter.post('/change-password', authenticate, strictRateLimiter, changePassword);
