import { z } from 'zod';

/**
 * Environment variable schema with validation
 */
const envSchema = z.object({
  // Server configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3500').transform(Number),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // YouTube API
  YOUTUBE_API_KEY: z.string().optional(),

  // Google Trends configuration (no API key required, uses public endpoints)
  GOOGLE_TRENDS_DEFAULT_GEO: z.string().default('US'),

  // AdSense API (optional)
  ADSENSE_API_KEY: z.string().optional(),
  AD_CLIENT_ID: z.string().optional(),

  // JWT Authentication
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters').optional(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),

  // API rate limits (per minute)
  YOUTUBE_RATE_LIMIT: z.string().default('60').transform(Number),
  GOOGLE_TRENDS_RATE_LIMIT: z.string().default('30').transform(Number),
});

type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validated environment configuration
 */
function loadConfig(): EnvConfig {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('Environment validation errors:');
    result.error.issues.forEach((issue) => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });

    // In development, warn but continue; in production, throw
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid environment configuration');
    }

    // Return a partial config with defaults for development
    return envSchema.parse({
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
    });
  }

  return result.data;
}

const envConfig = loadConfig();

/**
 * Application configuration object
 */
export const config = {
  env: envConfig.NODE_ENV,
  port: envConfig.PORT,
  isProduction: envConfig.NODE_ENV === 'production',
  isDevelopment: envConfig.NODE_ENV === 'development',
  isTest: envConfig.NODE_ENV === 'test',

  database: {
    url: envConfig.DATABASE_URL,
  },

  youtube: {
    apiKey: envConfig.YOUTUBE_API_KEY,
    rateLimit: envConfig.YOUTUBE_RATE_LIMIT,
  },

  googleTrends: {
    defaultGeo: envConfig.GOOGLE_TRENDS_DEFAULT_GEO,
    rateLimit: envConfig.GOOGLE_TRENDS_RATE_LIMIT,
  },

  adsense: {
    apiKey: envConfig.ADSENSE_API_KEY,
    clientId: envConfig.AD_CLIENT_ID,
  },

  jwt: {
    secret: envConfig.JWT_SECRET || 'development-secret-change-in-production',
    expiresIn: envConfig.JWT_EXPIRES_IN,
    refreshExpiresIn: envConfig.JWT_REFRESH_EXPIRES_IN,
  },

  rateLimit: {
    windowMs: envConfig.RATE_LIMIT_WINDOW_MS,
    maxRequests: envConfig.RATE_LIMIT_MAX_REQUESTS,
  },
} as const;

export type Config = typeof config;
