const googleTrends = require('google-trends-api');

module.exports = {
  getTrendingKeywords: function () {
    return new Promise((resolve, reject) => {
      googleTrends.dailyTrends(
        {
          trendDate: new Date(),
          geo: 'US',
        },
        function (err, results) {
          if (err) {
            console.error(
              'An error occurred while getting trending keywords',
              err
            );
            reject(err);
          } else {
            const data = JSON.parse(results);
            const trendingSearches =
              data.default.trendingSearchesDays[0].trendingSearches;
            const keywords = trendingSearches.map(
              (search) => search.title.query
            );
            resolve(keywords);
          }
        }
      );
    });
  },
};
