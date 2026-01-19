import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api, ApiError } from './api';

describe('API Module', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('getNicheSelection', () => {
    it('returns niche selection data on success', async () => {
      const mockData = [
        { keyword: 'gaming', score: 85, competitionScore: 50, profitabilityScore: 75 },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await api.getNicheSelection();

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3500/api/niche-selection');
      expect(result).toEqual(mockData);
    });

    it('throws ApiError on failure', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      });

      await expect(api.getNicheSelection()).rejects.toThrow(ApiError);
      await expect(api.getNicheSelection()).rejects.toMatchObject({
        status: 500,
        message: 'Server error',
      });
    });
  });

  describe('getAllNiches', () => {
    it('returns all niches on success', async () => {
      const mockNiches = [
        { id: '1', name: 'Gaming', description: 'Gaming content', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockNiches),
      });

      const result = await api.getAllNiches();

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3500/api/niches');
      expect(result).toEqual(mockNiches);
    });
  });

  describe('getNicheById', () => {
    it('returns a specific niche on success', async () => {
      const mockNiche = { id: '1', name: 'Gaming', description: 'Gaming content', createdAt: '2024-01-01', updatedAt: '2024-01-01' };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockNiche),
      });

      const result = await api.getNicheById('1');

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3500/api/niches/1');
      expect(result).toEqual(mockNiche);
    });

    it('throws ApiError when niche not found', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Niche not found' }),
      });

      await expect(api.getNicheById('nonexistent')).rejects.toThrow(ApiError);
      await expect(api.getNicheById('nonexistent')).rejects.toMatchObject({
        status: 404,
        message: 'Niche not found',
      });
    });
  });

  describe('createNiche', () => {
    it('creates a new niche on success', async () => {
      const newNiche = { name: 'Cooking', description: 'Cooking content' };
      const mockResponse = { id: '2', ...newNiche, createdAt: '2024-01-01', updatedAt: '2024-01-01' };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.createNiche(newNiche);

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3500/api/niches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNiche),
      });
      expect(result).toEqual(mockResponse);
    });

    it('throws ApiError on duplicate niche', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ error: 'A niche with this name already exists' }),
      });

      await expect(api.createNiche({ name: 'Gaming' })).rejects.toThrow(ApiError);
      await expect(api.createNiche({ name: 'Gaming' })).rejects.toMatchObject({
        status: 409,
      });
    });
  });

  describe('updateNiche', () => {
    it('updates a niche on success', async () => {
      const updateData = { name: 'Updated Gaming' };
      const mockResponse = { id: '1', name: 'Updated Gaming', description: null, createdAt: '2024-01-01', updatedAt: '2024-01-02' };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.updateNiche('1', updateData);

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3500/api/niches/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(mockResponse);
    });

    it('throws ApiError when updating non-existent niche', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Niche not found' }),
      });

      await expect(api.updateNiche('nonexistent', { name: 'Test' })).rejects.toThrow(ApiError);
    });
  });

  describe('deleteNiche', () => {
    it('deletes a niche on success', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        json: () => Promise.reject(), // 204 has no body
      });

      await expect(api.deleteNiche('1')).resolves.toBeUndefined();

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3500/api/niches/1', {
        method: 'DELETE',
      });
    });

    it('throws ApiError when deleting non-existent niche', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Niche not found' }),
      });

      await expect(api.deleteNiche('nonexistent')).rejects.toThrow(ApiError);
    });
  });

  describe('getAnalysesByNiche', () => {
    it('returns analyses for a niche on success', async () => {
      const mockAnalyses = [
        { id: 'a1', competitionScore: 50, profitabilityScore: 75, overallScore: 25, nicheId: '1' },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockAnalyses),
      });

      const result = await api.getAnalysesByNiche('1');

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3500/api/niches/1/analyses');
      expect(result).toEqual(mockAnalyses);
    });
  });

  describe('runAnalysis', () => {
    it('runs analysis and returns result on success', async () => {
      const analysisData = { keyword: 'gaming tutorials' };
      const mockResponse = {
        id: 'a2',
        competitionScore: 50,
        profitabilityScore: 75,
        overallScore: 25,
        nicheId: '1',
        keywordId: 'kw1',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.runAnalysis('1', analysisData);

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3500/api/niches/1/analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisData),
      });
      expect(result).toEqual(mockResponse);
    });

    it('throws ApiError when niche not found', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Niche not found' }),
      });

      await expect(api.runAnalysis('nonexistent', { keyword: 'test' })).rejects.toThrow(ApiError);
    });
  });

  describe('getLatestAnalyses', () => {
    it('returns latest analyses on success', async () => {
      const mockAnalyses = [
        { id: 'a1', competitionScore: 50, profitabilityScore: 75, overallScore: 25, nicheId: '1' },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockAnalyses),
      });

      const result = await api.getLatestAnalyses();

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3500/api/analyses/latest');
      expect(result).toEqual(mockAnalyses);
    });
  });

  describe('getTopNiches', () => {
    it('returns top niches on success', async () => {
      const mockAnalyses = [
        { id: 'a1', competitionScore: 30, profitabilityScore: 100, overallScore: 70, nicheId: '1' },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockAnalyses),
      });

      const result = await api.getTopNiches();

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3500/api/analyses/top');
      expect(result).toEqual(mockAnalyses);
    });
  });

  describe('Error handling', () => {
    it('handles network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(api.getAllNiches()).rejects.toThrow('Network error');
    });

    it('handles invalid JSON response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      await expect(api.getAllNiches()).rejects.toThrow(ApiError);
      await expect(api.getAllNiches()).rejects.toMatchObject({
        message: 'Unknown error',
      });
    });
  });
});
