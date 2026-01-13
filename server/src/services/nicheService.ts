import { getTrendingKeywords } from './keywordResearchService.js';
import { analyzeCompetition } from './competitionAnalysisService.js';
import { analyzeProfitability } from './profitabilityAnalysisService.js';

export interface NicheResult {
  keyword: string;
  score: number;
  competitionScore: number;
  profitabilityScore: number;
}

export const selectNiche = async (): Promise<NicheResult[]> => {
  try {
    const keywords = await getTrendingKeywords();
    const niches: NicheResult[] = [];

    // Process sequentially to avoid rate limits (or use Promise.all with concurrency limit if needed later)
    for (const keyword of keywords) {
      // Parallelize analysis for single keyword
      const [competitionScore, profitabilityScore] = await Promise.all([
        analyzeCompetition(keyword).catch((e) => {
            console.error(`Failed to analyze competition for ${keyword}`, e);
            return 999; // High competition penalty on error
        }),
        analyzeProfitability(keyword).catch((e) => {
            console.error(`Failed to analyze profitability for ${keyword}`, e);
            return 0; // Zero profitability on error
        }),
      ]);

      const score = profitabilityScore - competitionScore; // Higher score means better niche
      niches.push({ keyword, score, competitionScore, profitabilityScore });
    }

    niches.sort((a, b) => b.score - a.score); // Sort niches by score in descending order
    return niches.slice(0, 10); // Return the top 10 niches
  } catch (error) {
    console.error('An error occurred while selecting niches', error);
    throw error;
  }
};
