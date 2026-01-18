import { google } from 'googleapis';

const adsense = google.adsense('v1.4');

export const analyzeProfitability = async (keyword: string): Promise<number> => {
  try {
    const res = await adsense.reports.generate({
      startDate: '1 year ago',
      endDate: 'today',
      filter: [process.env.AD_CLIENT_ID || ''],
      metric: ['EARNINGS'],
      dimension: ['MONTH'],
      sort: ['-MONTH'],
      key: process.env.YOUR_ADSENSE_API_KEY || '',
    });

    const totals = res.data.totals;
    if (!totals || totals.length === 0 || !totals[0]) {
        return 0;
    }

    const earnings = parseFloat(totals[0]); // Total earnings in the last year
    return earnings;
  } catch (error) {
    console.error(
      `An error occurred while analyzing profitability for keyword: ${keyword}`,
      error
    );
    throw error;
  }
};
