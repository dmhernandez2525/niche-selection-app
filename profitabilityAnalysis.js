const { google } = require('googleapis');
const adsense = google.adsense('v1.4');
require('dotenv').config();

module.exports = {
  analyzeProfitability: async function (keyword) {
    try {
      const res = await adsense.reports.generate({
        startDate: '1 year ago',
        endDate: 'today',
        filter: [process.env.AD_CLIENT_ID],
        metric: ['EARNINGS'],
        dimension: ['MONTH'],
        sort: ['-MONTH'],
        key: process.env.YOUR_ADSENSE_API_KEY,
      });
      const earnings = res.data.totals[0]; // Total earnings in the last year
      const profitabilityScore = earnings; // Higher earnings means higher profitability
      return profitabilityScore;
    } catch (error) {
      console.error(
        `An error occurred while analyzing profitability for keyword: ${keyword}`,
        error
      );
      throw error;
    }
  },
};
