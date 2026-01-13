import { google } from 'googleapis';

const youtube = google.youtube('v3');

export const analyzeCompetition = async (keyword: string): Promise<number> => {
  try {
    const res = await youtube.search.list({
      part: ['snippet'],
      q: keyword,
      type: ['channel'],
      key: process.env.YOUR_YOUTUBE_API_KEY || '',
    });

    const channels = res.data.items || [];
    // More channels means more competition
    // This is the legacy logic, preserved for now.
    const competitionScore = channels.length; 
    return competitionScore;
  } catch (error) {
    console.error(
      `An error occurred while analyzing competition for keyword: ${keyword}`,
      error
    );
    // Return 0 or rethrow? Rethrowing seems safer for now to detect failures.
    throw error;
  }
};
