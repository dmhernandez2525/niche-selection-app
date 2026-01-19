import { google, youtube_v3 } from 'googleapis';
import { ExternalApiError } from '../utils/apiErrors.js';
import { config } from '../config/env.js';

/**
 * Interface for YouTube channel data
 */
export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  thumbnailUrl: string;
}

/**
 * Interface for YouTube video data
 */
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  thumbnailUrl: string;
}

/**
 * Interface for YouTube search result
 */
export interface YouTubeSearchResult {
  id: string;
  kind: 'video' | 'channel' | 'playlist';
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnailUrl: string;
}

/**
 * Interface for competition analysis result
 */
export interface CompetitionAnalysis {
  totalChannels: number;
  totalVideos: number;
  avgSubscriberCount: number;
  avgViewCount: number;
  competitionScore: number;
  topChannels: YouTubeChannel[];
}

/**
 * Interface for YouTube API service
 */
export interface IYouTubeApiService {
  searchChannels(query: string, maxResults?: number): Promise<YouTubeSearchResult[]>;
  searchVideos(query: string, maxResults?: number): Promise<YouTubeSearchResult[]>;
  getChannelDetails(channelIds: string[]): Promise<YouTubeChannel[]>;
  getVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]>;
  analyzeCompetition(keyword: string): Promise<CompetitionAnalysis>;
}

/**
 * YouTube API Service implementation
 * Provides methods to interact with YouTube Data API v3
 */
class YouTubeApiService implements IYouTubeApiService {
  private readonly youtube: youtube_v3.Youtube;
  private readonly maxRetries: number;

  constructor() {
    // Initialize YouTube API client
    // Auth is set per-request via checkApiKey() to handle undefined cases
    this.youtube = google.youtube('v3');
    this.maxRetries = 3;
  }

  /**
   * Check if the API key is configured and return it
   */
  private getApiKey(): string {
    if (!config.youtube.apiKey) {
      throw new ExternalApiError(
        'YouTube API',
        'YouTube API key is not configured. Set YOUTUBE_API_KEY environment variable.',
        null
      );
    }
    return config.youtube.apiKey;
  }

  /**
   * Search for channels matching a query
   */
  async searchChannels(query: string, maxResults: number = 25): Promise<YouTubeSearchResult[]> {
    const apiKey = this.getApiKey();

    return this.executeWithRetry(async () => {
      try {
        const response = await this.youtube.search.list({
          key: apiKey,
          part: ['snippet'],
          q: query,
          type: ['channel'],
          maxResults,
        });

        const items = response.data.items || [];

        return items.map((item: youtube_v3.Schema$SearchResult) => ({
          id: item.id?.channelId || '',
          kind: 'channel' as const,
          title: item.snippet?.title || '',
          description: item.snippet?.description || '',
          channelTitle: item.snippet?.channelTitle || '',
          publishedAt: item.snippet?.publishedAt || '',
          thumbnailUrl: item.snippet?.thumbnails?.default?.url || '',
        }));
      } catch (error: unknown) {
        throw new ExternalApiError(
          'YouTube API',
          `Failed to search channels for "${query}"`,
          error
        );
      }
    });
  }

  /**
   * Search for videos matching a query
   */
  async searchVideos(query: string, maxResults: number = 25): Promise<YouTubeSearchResult[]> {
    const apiKey = this.getApiKey();

    return this.executeWithRetry(async () => {
      try {
        const response = await this.youtube.search.list({
          key: apiKey,
          part: ['snippet'],
          q: query,
          type: ['video'],
          maxResults,
        });

        const items = response.data.items || [];

        return items.map((item: youtube_v3.Schema$SearchResult) => ({
          id: item.id?.videoId || '',
          kind: 'video' as const,
          title: item.snippet?.title || '',
          description: item.snippet?.description || '',
          channelTitle: item.snippet?.channelTitle || '',
          publishedAt: item.snippet?.publishedAt || '',
          thumbnailUrl: item.snippet?.thumbnails?.default?.url || '',
        }));
      } catch (error: unknown) {
        throw new ExternalApiError(
          'YouTube API',
          `Failed to search videos for "${query}"`,
          error
        );
      }
    });
  }

  /**
   * Get detailed information for specific channels
   */
  async getChannelDetails(channelIds: string[]): Promise<YouTubeChannel[]> {
    const apiKey = this.getApiKey();

    if (channelIds.length === 0) {
      return [];
    }

    return this.executeWithRetry(async () => {
      try {
        const response = await this.youtube.channels.list({
          key: apiKey,
          part: ['snippet', 'statistics'],
          id: channelIds,
        });

        const items = response.data.items || [];

        return items.map((item: youtube_v3.Schema$Channel) => ({
          id: item.id || '',
          title: item.snippet?.title || '',
          description: item.snippet?.description || '',
          subscriberCount: parseInt(item.statistics?.subscriberCount || '0', 10),
          videoCount: parseInt(item.statistics?.videoCount || '0', 10),
          viewCount: parseInt(item.statistics?.viewCount || '0', 10),
          thumbnailUrl: item.snippet?.thumbnails?.default?.url || '',
        }));
      } catch (error: unknown) {
        throw new ExternalApiError(
          'YouTube API',
          'Failed to get channel details',
          error
        );
      }
    });
  }

  /**
   * Get detailed information for specific videos
   */
  async getVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
    const apiKey = this.getApiKey();

    if (videoIds.length === 0) {
      return [];
    }

    return this.executeWithRetry(async () => {
      try {
        const response = await this.youtube.videos.list({
          key: apiKey,
          part: ['snippet', 'statistics'],
          id: videoIds,
        });

        const items = response.data.items || [];

        return items.map((item: youtube_v3.Schema$Video) => ({
          id: item.id || '',
          title: item.snippet?.title || '',
          description: item.snippet?.description || '',
          channelId: item.snippet?.channelId || '',
          channelTitle: item.snippet?.channelTitle || '',
          publishedAt: item.snippet?.publishedAt || '',
          viewCount: parseInt(item.statistics?.viewCount || '0', 10),
          likeCount: parseInt(item.statistics?.likeCount || '0', 10),
          commentCount: parseInt(item.statistics?.commentCount || '0', 10),
          thumbnailUrl: item.snippet?.thumbnails?.default?.url || '',
        }));
      } catch (error: unknown) {
        throw new ExternalApiError(
          'YouTube API',
          'Failed to get video details',
          error
        );
      }
    });
  }

  /**
   * Analyze competition for a specific keyword
   * Returns a comprehensive competition analysis
   */
  async analyzeCompetition(keyword: string): Promise<CompetitionAnalysis> {
    // Validate API key before starting
    this.getApiKey();

    // Search for channels related to the keyword
    const channelResults = await this.searchChannels(keyword, 50);
    const channelIds = channelResults.map((r) => r.id).filter(Boolean);

    // Get detailed channel information
    const channels = channelIds.length > 0
      ? await this.getChannelDetails(channelIds)
      : [];

    // Search for videos to understand content landscape
    const videoResults = await this.searchVideos(keyword, 50);

    // Calculate statistics
    const totalChannels = channels.length;
    const totalVideos = videoResults.length;

    const avgSubscriberCount = totalChannels > 0
      ? channels.reduce((sum, ch) => sum + ch.subscriberCount, 0) / totalChannels
      : 0;

    const avgViewCount = totalChannels > 0
      ? channels.reduce((sum, ch) => sum + ch.viewCount, 0) / totalChannels
      : 0;

    // Calculate competition score (0-100)
    // Higher score = more competition
    const competitionScore = this.calculateCompetitionScore(
      totalChannels,
      avgSubscriberCount,
      avgViewCount
    );

    // Get top 5 channels by subscriber count
    const topChannels = [...channels]
      .sort((a, b) => b.subscriberCount - a.subscriberCount)
      .slice(0, 5);

    return {
      totalChannels,
      totalVideos,
      avgSubscriberCount: Math.round(avgSubscriberCount),
      avgViewCount: Math.round(avgViewCount),
      competitionScore,
      topChannels,
    };
  }

  /**
   * Calculate a competition score based on various metrics
   */
  private calculateCompetitionScore(
    channelCount: number,
    avgSubscribers: number,
    avgViews: number
  ): number {
    // Normalize each metric to 0-100 scale
    // Channel count: 0-50 channels maps to 0-100
    const channelScore = Math.min(100, (channelCount / 50) * 100);

    // Average subscribers: 0-1M maps to 0-100
    const subscriberScore = Math.min(100, (avgSubscribers / 1000000) * 100);

    // Average views: 0-10M maps to 0-100
    const viewScore = Math.min(100, (avgViews / 10000000) * 100);

    // Weighted average (channel count is most important)
    const score = channelScore * 0.5 + subscriberScore * 0.3 + viewScore * 0.2;

    return Math.round(score);
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

        // Check if it's a rate limit error (429)
        const isRateLimitError = (error as any)?.code === 429 ||
          (error as any)?.response?.status === 429;

        if (isRateLimitError && attempt < this.maxRetries - 1) {
          const delay = Math.pow(2, attempt + 1) * 1000; // Exponential backoff starting at 2s
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // For non-rate-limit errors, don't retry
        if (!isRateLimitError) {
          throw lastError;
        }
      }
    }

    throw lastError;
  }
}

// Export singleton instance
export const youtubeApiService = new YouTubeApiService();

// Export class for testing
export { YouTubeApiService };
