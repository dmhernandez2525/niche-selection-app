import googleTrends from 'google-trends-api';
import { ExternalApiError } from '../utils/apiErrors.js';
import { config } from '../config/env.js';

/**
 * Interface for Google Trends interest data over time
 */
export interface TrendInterestData {
  date: string;
  value: number;
}

/**
 * Interface for trending search result
 */
export interface TrendingSearch {
  title: string;
  formattedTraffic: string;
  relatedQueries: string[];
}

/**
 * Interface for interest by region data
 */
export interface RegionInterest {
  geoCode: string;
  geoName: string;
  value: number;
}

/**
 * Interface for Google Trends service
 */
export interface IGoogleTrendsService {
  getTrendingSearches(geo?: string): Promise<TrendingSearch[]>;
  getInterestOverTime(keyword: string, geo?: string): Promise<TrendInterestData[]>;
  getInterestByRegion(keyword: string): Promise<RegionInterest[]>;
  getRelatedQueries(keyword: string): Promise<string[]>;
}

/**
 * Google Trends Service implementation
 * Provides methods to interact with Google Trends API
 */
class GoogleTrendsService implements IGoogleTrendsService {
  private readonly defaultGeo: string;
  private readonly maxRetries: number;

  constructor() {
    this.defaultGeo = config.googleTrends.defaultGeo;
    this.maxRetries = 3;
  }

  /**
   * Get daily trending searches for a specific region
   */
  async getTrendingSearches(geo: string = this.defaultGeo): Promise<TrendingSearch[]> {
    return this.executeWithRetry(async () => {
      return new Promise((resolve, reject) => {
        googleTrends.dailyTrends(
          {
            trendDate: new Date(),
            geo,
          },
          (err: Error | null, results: string) => {
            if (err) {
              reject(new ExternalApiError('Google Trends', 'Failed to fetch trending searches', err));
              return;
            }

            try {
              const data = JSON.parse(results);
              const trendingSearchesDays = data.default?.trendingSearchesDays;

              if (!trendingSearchesDays || trendingSearchesDays.length === 0) {
                resolve([]);
                return;
              }

              const trendingSearches: TrendingSearch[] =
                trendingSearchesDays[0].trendingSearches.map((search: any) => ({
                  title: search.title.query,
                  formattedTraffic: search.formattedTraffic || '0',
                  relatedQueries: search.relatedQueries?.map((q: any) => q.query) || [],
                }));

              resolve(trendingSearches);
            } catch (parseError) {
              reject(new ExternalApiError('Google Trends', 'Failed to parse trending searches response', parseError));
            }
          }
        );
      });
    });
  }

  /**
   * Get interest over time for a specific keyword
   */
  async getInterestOverTime(
    keyword: string,
    geo: string = this.defaultGeo
  ): Promise<TrendInterestData[]> {
    return this.executeWithRetry(async () => {
      return new Promise((resolve, reject) => {
        googleTrends.interestOverTime(
          {
            keyword,
            geo,
            startTime: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
          },
          (err: Error | null, results: string) => {
            if (err) {
              reject(new ExternalApiError('Google Trends', `Failed to fetch interest over time for "${keyword}"`, err));
              return;
            }

            try {
              const data = JSON.parse(results);
              const timelineData = data.default?.timelineData || [];

              const interestData: TrendInterestData[] = timelineData.map((item: any) => ({
                date: item.formattedTime,
                value: item.value?.[0] || 0,
              }));

              resolve(interestData);
            } catch (parseError) {
              reject(new ExternalApiError('Google Trends', 'Failed to parse interest over time response', parseError));
            }
          }
        );
      });
    });
  }

  /**
   * Get interest by region for a specific keyword
   */
  async getInterestByRegion(keyword: string): Promise<RegionInterest[]> {
    return this.executeWithRetry(async () => {
      return new Promise((resolve, reject) => {
        googleTrends.interestByRegion(
          {
            keyword,
            resolution: 'COUNTRY',
          },
          (err: Error | null, results: string) => {
            if (err) {
              reject(new ExternalApiError('Google Trends', `Failed to fetch interest by region for "${keyword}"`, err));
              return;
            }

            try {
              const data = JSON.parse(results);
              const geoMapData = data.default?.geoMapData || [];

              const regionInterest: RegionInterest[] = geoMapData.map((item: any) => ({
                geoCode: item.geoCode,
                geoName: item.geoName,
                value: item.value?.[0] || 0,
              }));

              resolve(regionInterest);
            } catch (parseError) {
              reject(new ExternalApiError('Google Trends', 'Failed to parse interest by region response', parseError));
            }
          }
        );
      });
    });
  }

  /**
   * Get related queries for a specific keyword
   */
  async getRelatedQueries(keyword: string): Promise<string[]> {
    return this.executeWithRetry(async () => {
      return new Promise((resolve, reject) => {
        googleTrends.relatedQueries(
          {
            keyword,
          },
          (err: Error | null, results: string) => {
            if (err) {
              reject(new ExternalApiError('Google Trends', `Failed to fetch related queries for "${keyword}"`, err));
              return;
            }

            try {
              const data = JSON.parse(results);
              const rankedList = data.default?.rankedList || [];

              const queries: string[] = [];
              rankedList.forEach((list: any) => {
                list.rankedKeyword?.forEach((item: any) => {
                  if (item.query) {
                    queries.push(item.query);
                  }
                });
              });

              resolve(queries);
            } catch (parseError) {
              reject(new ExternalApiError('Google Trends', 'Failed to parse related queries response', parseError));
            }
          }
        );
      });
    });
  }

  /**
   * Execute a function with exponential backoff retry logic
   */
  private async executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < this.maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }
}

// Export singleton instance
export const googleTrendsService = new GoogleTrendsService();

// Export class for testing
export { GoogleTrendsService };
