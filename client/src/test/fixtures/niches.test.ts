import { describe, it, expect } from 'vitest';
import {
  createMockNiche,
  createMockKeyword,
  mockNiches,
  mockKeywords,
  type Niche,
  type Keyword,
} from './niches';

describe('Niche Fixtures', () => {
  describe('createMockNiche', () => {
    it('creates a niche with required properties', () => {
      const niche = createMockNiche();

      expect(niche).toHaveProperty('id');
      expect(niche).toHaveProperty('keyword');
      expect(niche).toHaveProperty('score');
      expect(niche).toHaveProperty('competition');
      expect(niche).toHaveProperty('trends');
    });

    it('generates a valid UUID for id', () => {
      const niche = createMockNiche();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(niche.id).toMatch(uuidRegex);
    });

    it('generates score between 0 and 100', () => {
      for (let i = 0; i < 10; i++) {
        const niche = createMockNiche();
        expect(niche.score).toBeGreaterThanOrEqual(0);
        expect(niche.score).toBeLessThanOrEqual(100);
      }
    });

    it('generates valid competition values', () => {
      const validCompetitions = ['low', 'medium', 'high'];
      for (let i = 0; i < 10; i++) {
        const niche = createMockNiche();
        expect(validCompetitions).toContain(niche.competition);
      }
    });

    it('generates trends array with 6 entries', () => {
      const niche = createMockNiche();
      expect(niche.trends).toHaveLength(6);
    });

    it('generates trends with date and value properties', () => {
      const niche = createMockNiche();
      niche.trends.forEach((trend) => {
        expect(trend).toHaveProperty('date');
        expect(trend).toHaveProperty('value');
        expect(typeof trend.date).toBe('string');
        expect(typeof trend.value).toBe('number');
      });
    });

    it('allows overriding properties', () => {
      const overrides: Partial<Niche> = {
        keyword: 'custom keyword',
        score: 99,
        competition: 'low',
      };

      const niche = createMockNiche(overrides);

      expect(niche.keyword).toBe('custom keyword');
      expect(niche.score).toBe(99);
      expect(niche.competition).toBe('low');
    });

    it('generates unique IDs for different niches', () => {
      const niche1 = createMockNiche();
      const niche2 = createMockNiche();
      expect(niche1.id).not.toBe(niche2.id);
    });
  });

  describe('createMockKeyword', () => {
    it('creates a keyword with required properties', () => {
      const keyword = createMockKeyword();

      expect(keyword).toHaveProperty('id');
      expect(keyword).toHaveProperty('keyword');
      expect(keyword).toHaveProperty('volume');
    });

    it('generates a valid UUID for id', () => {
      const keyword = createMockKeyword();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(keyword.id).toMatch(uuidRegex);
    });

    it('generates volume in reasonable range', () => {
      for (let i = 0; i < 10; i++) {
        const keyword = createMockKeyword();
        expect(keyword.volume).toBeGreaterThanOrEqual(100);
        expect(keyword.volume).toBeLessThanOrEqual(50000);
      }
    });

    it('includes optional cpc property', () => {
      const keyword = createMockKeyword();
      expect(keyword).toHaveProperty('cpc');
      expect(typeof keyword.cpc).toBe('number');
    });

    it('includes optional competition property', () => {
      const keyword = createMockKeyword();
      expect(keyword).toHaveProperty('competition');
      expect(typeof keyword.competition).toBe('number');
    });

    it('generates cpc in reasonable range', () => {
      for (let i = 0; i < 10; i++) {
        const keyword = createMockKeyword();
        if (keyword.cpc !== undefined) {
          expect(keyword.cpc).toBeGreaterThanOrEqual(0.1);
          expect(keyword.cpc).toBeLessThanOrEqual(10);
        }
      }
    });

    it('generates competition between 0 and 1', () => {
      for (let i = 0; i < 10; i++) {
        const keyword = createMockKeyword();
        if (keyword.competition !== undefined) {
          expect(keyword.competition).toBeGreaterThanOrEqual(0);
          expect(keyword.competition).toBeLessThanOrEqual(1);
        }
      }
    });

    it('allows overriding properties', () => {
      const overrides: Partial<Keyword> = {
        keyword: 'custom keyword term',
        volume: 99999,
        cpc: 5.99,
      };

      const keyword = createMockKeyword(overrides);

      expect(keyword.keyword).toBe('custom keyword term');
      expect(keyword.volume).toBe(99999);
      expect(keyword.cpc).toBe(5.99);
    });

    it('generates unique IDs for different keywords', () => {
      const keyword1 = createMockKeyword();
      const keyword2 = createMockKeyword();
      expect(keyword1.id).not.toBe(keyword2.id);
    });
  });

  describe('mockNiches fixture', () => {
    it('contains predefined niches', () => {
      expect(mockNiches).toHaveLength(3);
    });

    it('includes gaming tutorials niche', () => {
      const gaming = mockNiches.find((n) => n.keyword === 'gaming tutorials');
      expect(gaming).toBeDefined();
      expect(gaming?.score).toBe(85);
      expect(gaming?.competition).toBe('high');
    });

    it('includes cooking recipes niche', () => {
      const cooking = mockNiches.find((n) => n.keyword === 'cooking recipes');
      expect(cooking).toBeDefined();
      expect(cooking?.score).toBe(70);
      expect(cooking?.competition).toBe('medium');
    });

    it('includes diy projects niche', () => {
      const diy = mockNiches.find((n) => n.keyword === 'diy projects');
      expect(diy).toBeDefined();
      expect(diy?.score).toBe(65);
      expect(diy?.competition).toBe('low');
    });

    it('all niches have valid structure', () => {
      mockNiches.forEach((niche) => {
        expect(niche).toHaveProperty('id');
        expect(niche).toHaveProperty('keyword');
        expect(niche).toHaveProperty('score');
        expect(niche).toHaveProperty('competition');
        expect(niche).toHaveProperty('trends');
        expect(Array.isArray(niche.trends)).toBe(true);
      });
    });
  });

  describe('mockKeywords fixture', () => {
    it('contains predefined keywords', () => {
      expect(mockKeywords).toHaveLength(3);
    });

    it('includes minecraft tips keyword', () => {
      const minecraft = mockKeywords.find((k) => k.keyword === 'minecraft tips');
      expect(minecraft).toBeDefined();
      expect(minecraft?.volume).toBe(25000);
    });

    it('includes easy dinner recipes keyword', () => {
      const dinner = mockKeywords.find((k) => k.keyword === 'easy dinner recipes');
      expect(dinner).toBeDefined();
      expect(dinner?.volume).toBe(18000);
    });

    it('includes home improvement ideas keyword', () => {
      const home = mockKeywords.find((k) => k.keyword === 'home improvement ideas');
      expect(home).toBeDefined();
      expect(home?.volume).toBe(12000);
    });

    it('all keywords have valid structure', () => {
      mockKeywords.forEach((keyword) => {
        expect(keyword).toHaveProperty('id');
        expect(keyword).toHaveProperty('keyword');
        expect(keyword).toHaveProperty('volume');
        expect(typeof keyword.id).toBe('string');
        expect(typeof keyword.keyword).toBe('string');
        expect(typeof keyword.volume).toBe('number');
      });
    });
  });
});
