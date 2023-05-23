const keywordResearch = require('./keywordResearch');
const competitionAnalysis = require('./competitionAnalysis');
const profitabilityAnalysis = require('./profitabilityAnalysis');

module.exports = {
  selectNiche: async function () {
    try {
      const keywords = await keywordResearch.getTrendingKeywords();
      const niches = [];
      for (const keyword of keywords) {
        const competitionScore = await competitionAnalysis.analyzeCompetition(
          keyword
        );
        const profitabilityScore =
          await profitabilityAnalysis.analyzeProfitability(keyword);
        const score = profitabilityScore - competitionScore; // Higher score means better niche
        niches.push({ keyword, score });
      }
      niches.sort((a, b) => b.score - a.score); // Sort niches by score in descending order
      return niches.slice(0, 10); // Return the top 10 niches
    } catch (error) {
      console.error('An error occurred while selecting niches', error);
      throw error;
    }
  },
};
