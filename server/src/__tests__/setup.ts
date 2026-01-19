import { jest, beforeEach, afterEach } from '@jest/globals';

// Mock Prisma client
export const mockPrisma = {
  niche: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  keyword: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  analysis: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

// Mock the db module
jest.unstable_mockModule('../lib/db.js', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

// Mock the analysis services
jest.unstable_mockModule('../services/competitionAnalysisService.js', () => ({
  analyzeCompetition: jest.fn().mockResolvedValue(50),
}));

jest.unstable_mockModule('../services/profitabilityAnalysisService.js', () => ({
  analyzeProfitability: jest.fn().mockResolvedValue(75),
}));

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Clean up after each test
afterEach(() => {
  jest.restoreAllMocks();
});
