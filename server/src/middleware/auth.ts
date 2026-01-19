import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { AuthenticationError, AuthorizationError } from '../utils/apiErrors.js';
import prisma from '../lib/db.js';

/**
 * JWT payload structure
 */
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Extended Express Request with user information
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

/**
 * Convert duration string to seconds
 * Supports formats like "7d", "24h", "30m", "60s"
 */
function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([dhms])$/);
  if (!match || match.length < 3) {
    // Default to 7 days if parsing fails
    return 7 * 24 * 60 * 60;
  }

  const value = parseInt(match[1]!, 10);
  const unit = match[2]!;

  switch (unit) {
    case 'd':
      return value * 24 * 60 * 60;
    case 'h':
      return value * 60 * 60;
    case 'm':
      return value * 60;
    case 's':
      return value;
    default:
      return 7 * 24 * 60 * 60;
  }
}

/**
 * Generate access token
 */
export function generateAccessToken(userId: string, email: string): string {
  const payload: JwtPayload = { userId, email };
  const expiresInSeconds = parseDuration(config.jwt.expiresIn);

  return jwt.sign(payload, config.jwt.secret, { expiresIn: expiresInSeconds });
}

/**
 * Generate refresh token
 */
export function generateRefreshToken(userId: string, email: string): string {
  const payload: JwtPayload = { userId, email };
  const expiresInSeconds = parseDuration(config.jwt.refreshExpiresIn);

  return jwt.sign(payload, config.jwt.secret, { expiresIn: expiresInSeconds });
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid token');
    }
    throw new AuthenticationError('Token verification failed');
  }
}

/**
 * Extract token from Authorization header
 */
function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  // Support "Bearer <token>" format
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return null;
}

/**
 * Authentication middleware - requires valid JWT token
 */
export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new AuthenticationError('No authentication token provided');
    }

    const payload = verifyToken(token);

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    next(error);
  }
}

/**
 * Optional authentication middleware - attaches user if token present, but doesn't require it
 */
export async function optionalAuthenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);

    if (!token) {
      next();
      return;
    }

    const payload = verifyToken(token);

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true },
    });

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
      };
    }

    next();
  } catch {
    // Token invalid but that's okay for optional auth
    next();
  }
}

/**
 * Middleware to check if user owns a resource
 */
export function requireOwnership(
  getUserIdFromRequest: (req: Request) => string | undefined
) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    const resourceUserId = getUserIdFromRequest(req);

    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (resourceUserId && resourceUserId !== req.user.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    next();
  };
}

/**
 * Create a protected route handler that requires authentication
 */
export function protectedRoute(
  handler: (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => Promise<void> | void
) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await authenticate(req, res, async (err) => {
      if (err) {
        next(err);
        return;
      }
      try {
        await handler(req, res, next);
      } catch (error) {
        next(error);
      }
    });
  };
}
