import { faker } from '@faker-js/faker';

export interface Niche {
  id: string;
  keyword: string;
  score: number;
  competition: 'low' | 'medium' | 'high';
  trends: { date: string; value: number }[];
}

export interface Keyword {
  id: string;
  keyword: string;
  volume: number;
  cpc?: number;
  competition?: number;
}

// Factory functions
export function createMockNiche(overrides: Partial<Niche> = {}): Niche {
  return {
    id: faker.string.uuid(),
    keyword: faker.lorem.words(2),
    score: faker.number.int({ min: 0, max: 100 }),
    competition: faker.helpers.arrayElement(['low', 'medium', 'high']),
    trends: Array.from({ length: 6 }, (_, i) => ({
      date: `2024-0${i + 1}`,
      value: faker.number.int({ min: 30, max: 100 }),
    })),
    ...overrides,
  };
}

export function createMockKeyword(overrides: Partial<Keyword> = {}): Keyword {
  return {
    id: faker.string.uuid(),
    keyword: faker.lorem.words(3),
    volume: faker.number.int({ min: 100, max: 50000 }),
    cpc: faker.number.float({ min: 0.1, max: 10, fractionDigits: 2 }),
    competition: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
    ...overrides,
  };
}

// Pre-made fixtures
export const mockNiches: Niche[] = [
  createMockNiche({ keyword: 'gaming tutorials', score: 85, competition: 'high' }),
  createMockNiche({ keyword: 'cooking recipes', score: 70, competition: 'medium' }),
  createMockNiche({ keyword: 'diy projects', score: 65, competition: 'low' }),
];

export const mockKeywords: Keyword[] = [
  createMockKeyword({ keyword: 'minecraft tips', volume: 25000 }),
  createMockKeyword({ keyword: 'easy dinner recipes', volume: 18000 }),
  createMockKeyword({ keyword: 'home improvement ideas', volume: 12000 }),
];
