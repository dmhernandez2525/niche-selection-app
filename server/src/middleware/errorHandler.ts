import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError, isAppError, isExternalApiError, ValidationError } from '../utils/apiErrors.js';
import { config } from '../config/env.js';

/**
 * Log error details
 */
function logError(error: Error, req: Request): void {
  console.error('Error:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    error: {
      name: error.name,
      message: error.message,
      stack: config.isDevelopment ? error.stack : undefined,
    },
  });
}

/**
 * Global error handler middleware
 */
export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logError(error, req);

  // Handle Zod validation errors
  if (error.name === 'ZodError') {
    res.status(400).json({
      error: 'Validation failed',
      details: (error as any).issues,
    });
    return;
  }

  // Handle custom ValidationError
  if (error instanceof ValidationError) {
    res.status(error.statusCode).json({
      error: error.message,
      details: error.errors,
    });
    return;
  }

  // Handle ExternalApiError
  if (isExternalApiError(error)) {
    res.status(error.statusCode).json({
      error: error.getUserMessage(),
      service: error.service,
      ...(config.isDevelopment && { details: error.message }),
    });
    return;
  }

  // Handle other AppErrors
  if (isAppError(error)) {
    res.status(error.statusCode).json({
      error: error.message,
      ...(config.isDevelopment && { stack: error.stack }),
    });
    return;
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;

    switch (prismaError.code) {
      case 'P2002':
        res.status(409).json({
          error: 'A record with this value already exists',
          field: prismaError.meta?.target?.[0],
        });
        return;
      case 'P2025':
        res.status(404).json({
          error: 'Record not found',
        });
        return;
      default:
        res.status(500).json({
          error: 'Database error',
          ...(config.isDevelopment && { code: prismaError.code }),
        });
        return;
    }
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      error: 'Invalid token',
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      error: 'Token expired',
    });
    return;
  }

  // Default error response
  res.status(500).json({
    error: config.isProduction
      ? 'An unexpected error occurred'
      : error.message,
    ...(config.isDevelopment && { stack: error.stack }),
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export function asyncHandler<T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Not found handler for undefined routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
}
