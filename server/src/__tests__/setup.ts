import { jest, beforeEach, afterEach } from '@jest/globals';

// Type for mock functions that can resolve to any value
type MockFn = jest.Mock<(...args: unknown[]) => unknown>;

// Mock Prisma client with proper typing
export const mockPrisma = {
  niche: {
    findMany: jest.fn() as MockFn,
    findUnique: jest.fn() as MockFn,
    create: jest.fn() as MockFn,
    update: jest.fn() as MockFn,
    delete: jest.fn() as MockFn,
  },
  keyword: {
    findFirst: jest.fn() as MockFn,
    create: jest.fn() as MockFn,
  },
  analysis: {
    findMany: jest.fn() as MockFn,
    create: jest.fn() as MockFn,
  },
  $connect: jest.fn() as MockFn,
  $disconnect: jest.fn() as MockFn,
};

// Mock the db module
jest.unstable_mockModule('../lib/db.js', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

// Mock the analysis services
jest.unstable_mockModule('../services/competitionAnalysisService.js', () => ({
  analyzeCompetition: jest.fn(() => Promise.resolve(50)),
}));

jest.unstable_mockModule('../services/profitabilityAnalysisService.js', () => ({
  analyzeProfitability: jest.fn(() => Promise.resolve(75)),
}));

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Clean up after each test
afterEach(() => {
  jest.restoreAllMocks();
});
