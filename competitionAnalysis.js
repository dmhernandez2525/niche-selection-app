const { google } = require('googleapis');
const youtube = google.youtube('v3');
require('dotenv').config();

module.exports = {
  analyzeCompetition: async function (keyword) {
    try {
      const res = await youtube.search.list({
        part: 'snippet',
        q: keyword,
        type: 'channel',
        key: process.env.YOUR_YOUTUBE_API_KEY,
      });
      const channels = res.data.items;
      const competitionScore = channels.length; // More channels means more competition
      return competitionScore;
    } catch (error) {
      console.error(
        `An error occurred while analyzing competition for keyword: ${keyword}`,
        error
      );
      throw error;
    }
  },
};
