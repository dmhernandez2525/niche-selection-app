import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:3500';

export const handlers = [
  // Health check
  http.get(`${API_URL}/health`, () => {
    return HttpResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }),

  // Niche analysis
  http.post(`${API_URL}/api/niches/analyze`, async ({ request }) => {
    const body = await request.json() as { keyword: string };

    return HttpResponse.json({
      id: 'niche-1',
      keyword: body.keyword,
      score: 75,
      competition: 'medium',
      trends: [
        { date: '2024-01', value: 50 },
        { date: '2024-02', value: 55 },
        { date: '2024-03', value: 60 },
      ],
    });
  }),

  // Get keywords
  http.get(`${API_URL}/api/keywords/:niche`, ({ params }) => {
    const { niche } = params;

    return HttpResponse.json([
      { id: 'kw-1', keyword: `${niche} tutorial`, volume: 5000 },
      { id: 'kw-2', keyword: `best ${niche}`, volume: 3000 },
      { id: 'kw-3', keyword: `${niche} for beginners`, volume: 2500 },
    ]);
  }),
];
