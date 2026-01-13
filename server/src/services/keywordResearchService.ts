import googleTrends from 'google-trends-api';

interface TrendingSearch {
  title: {
    query: string;
  };
}

export const getTrendingKeywords = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    googleTrends.dailyTrends(
      {
        trendDate: new Date(),
        geo: 'US',
      },
      function (err: any, results: string) {
        if (err) {
          console.error(
            'An error occurred while getting trending keywords',
            err
          );
          reject(err);
        } else {
          try {
            const data = JSON.parse(results);
            const trendingSearchesDays = data.default.trendingSearchesDays;
            if (!trendingSearchesDays || trendingSearchesDays.length === 0) {
                resolve([]);
                return;
            }
             const trendingSearches: TrendingSearch[] =
              trendingSearchesDays[0].trendingSearches;
            
            const keywords = trendingSearches.map(
              (search) => search.title.query
            );
            resolve(keywords);
          } catch (parseError) {
            reject(parseError);
          }
        }
      }
    );
  });
};
