import type { Request, Response, NextFunction } from 'express';
import { RateLimitError } from '../utils/apiErrors.js';
import { config } from '../config/env.js';

/**
 * Interface for rate limit store entry
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * In-memory rate limit store
 * In production, consider using Redis for distributed rate limiting
 */
class RateLimitStore {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Get or create entry for a key
   */
  get(key: string, windowMs: number): RateLimitEntry {
    const now = Date.now();
    const existing = this.store.get(key);

    if (existing && existing.resetTime > now) {
      return existing;
    }

    // Create new entry
    const entry: RateLimitEntry = {
      count: 0,
      resetTime: now + windowMs,
    };
    this.store.set(key, entry);
    return entry;
  }

  /**
   * Increment count for a key
   */
  increment(key: string, windowMs: number): RateLimitEntry {
    const entry = this.get(key, windowMs);
    entry.count++;
    return entry;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime <= now) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Stop cleanup interval (for testing/shutdown)
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.store.clear();
  }
}

// Global store instance
const globalStore = new RateLimitStore();

/**
 * Rate limiter options
 */
export interface RateLimiterOptions {
  windowMs?: number;
  maxRequests?: number;
  keyGenerator?: (req: Request) => string;
  skipFailedRequests?: boolean;
  skipSuccessfulRequests?: boolean;
  message?: string;
  handler?: (req: Request, res: Response, next: NextFunction) => void;
}

/**
 * Default key generator using IP address
 */
function defaultKeyGenerator(req: Request): string {
  // Try to get the real IP behind proxies
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    const firstIp = forwarded.split(',')[0];
    return firstIp?.trim() || 'unknown';
  }
  return req.ip ?? req.socket.remoteAddress ?? 'unknown';
}

/**
 * Create a rate limiter middleware
 */
export function createRateLimiter(options: RateLimiterOptions = {}) {
  const {
    windowMs = config.rateLimit.windowMs,
    maxRequests = config.rateLimit.maxRequests,
    keyGenerator = defaultKeyGenerator,
    message = 'Too many requests, please try again later',
    handler,
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `global:${keyGenerator(req)}`;
    const entry = globalStore.increment(key, windowMs);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000));

    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - Date.now()) / 1000);
      res.setHeader('Retry-After', retryAfter);

      if (handler) {
        handler(req, res, next);
        return;
      }

      res.status(429).json({
        error: message,
        retryAfter,
      });
      return;
    }

    next();
  };
}

/**
 * API-specific rate limiter for external service calls
 */
export interface ApiRateLimiterOptions {
  service: string;
  maxRequestsPerMinute: number;
}

/**
 * Create a rate limiter for specific API services
 */
export function createApiRateLimiter(options: ApiRateLimiterOptions) {
  const { service, maxRequestsPerMinute } = options;
  const windowMs = 60000; // 1 minute

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `api:${service}:${defaultKeyGenerator(req)}`;
    const entry = globalStore.increment(key, windowMs);

    if (entry.count > maxRequestsPerMinute) {
      const retryAfter = Math.ceil((entry.resetTime - Date.now()) / 1000);

      res.status(429).json({
        error: `${service} API rate limit exceeded`,
        retryAfter,
      });
      return;
    }

    next();
  };
}

/**
 * Strict rate limiter for sensitive endpoints (auth, etc.)
 */
export const strictRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 requests per 15 minutes
  message: 'Too many attempts, please try again later',
});

/**
 * Standard API rate limiter
 */
export const apiRateLimiter = createRateLimiter({
  windowMs: config.rateLimit.windowMs,
  maxRequests: config.rateLimit.maxRequests,
});

/**
 * YouTube API rate limiter
 */
export const youtubeRateLimiter = createApiRateLimiter({
  service: 'YouTube',
  maxRequestsPerMinute: config.youtube.rateLimit,
});

/**
 * Google Trends rate limiter
 */
export const googleTrendsRateLimiter = createApiRateLimiter({
  service: 'Google Trends',
  maxRequestsPerMinute: config.googleTrends.rateLimit,
});

// Export store for testing
export { globalStore as _testStore };
