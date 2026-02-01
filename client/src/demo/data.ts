import type { NicheResult, Niche, Analysis } from '@/lib/api';
import type { SavedSearch } from '@/hooks/useSavedSearches';

// Demo niche selection results (for Niche Finder)
export const demoNicheResults: NicheResult[] = [
  {
    keyword: 'personal finance tips',
    score: 87,
    competitionScore: 25,
    profitabilityScore: 8.50,
  },
  {
    keyword: 'home workout routines',
    score: 82,
    competitionScore: 35,
    profitabilityScore: 5.20,
  },
  {
    keyword: 'minimalist lifestyle',
    score: 79,
    competitionScore: 28,
    profitabilityScore: 4.80,
  },
  {
    keyword: 'productivity hacks',
    score: 76,
    competitionScore: 42,
    profitabilityScore: 6.30,
  },
  {
    keyword: 'sustainable living',
    score: 74,
    competitionScore: 31,
    profitabilityScore: 4.50,
  },
  {
    keyword: 'tech reviews budget',
    score: 71,
    competitionScore: 55,
    profitabilityScore: 7.80,
  },
  {
    keyword: 'plant-based cooking',
    score: 68,
    competitionScore: 38,
    profitabilityScore: 3.90,
  },
  {
    keyword: 'digital nomad tips',
    score: 65,
    competitionScore: 45,
    profitabilityScore: 5.60,
  },
  {
    keyword: 'diy home decor',
    score: 62,
    competitionScore: 48,
    profitabilityScore: 3.20,
  },
  {
    keyword: 'meditation for beginners',
    score: 58,
    competitionScore: 52,
    profitabilityScore: 4.10,
  },
];

// Demo niches
export const demoNiches: Niche[] = [
  {
    id: 'demo-niche-1',
    name: 'Personal Finance',
    description: 'Content about budgeting, investing, and financial independence',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-20T14:30:00Z',
    _count: { analyses: 5, keywords: 12 },
  },
  {
    id: 'demo-niche-2',
    name: 'Fitness & Health',
    description: 'Workout routines, nutrition tips, and wellness content',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-18T09:15:00Z',
    _count: { analyses: 3, keywords: 8 },
  },
  {
    id: 'demo-niche-3',
    name: 'Productivity',
    description: 'Time management, focus techniques, and efficiency tips',
    createdAt: '2025-01-05T12:00:00Z',
    updatedAt: '2025-01-16T16:45:00Z',
    _count: { analyses: 4, keywords: 10 },
  },
  {
    id: 'demo-niche-4',
    name: 'Sustainable Living',
    description: 'Eco-friendly lifestyle, zero waste, and environmental tips',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-12T11:20:00Z',
    _count: { analyses: 2, keywords: 6 },
  },
];

// Demo analyses (for Results and Dashboard)
export const demoAnalyses: Analysis[] = [
  {
    id: 'demo-analysis-1',
    competitionScore: 25,
    profitabilityScore: 8.50,
    overallScore: 87,
    channelCount: 156,
    createdAt: '2025-01-20T14:30:00Z',
    nicheId: 'demo-niche-1',
    keywordId: 'demo-keyword-1',
    niche: demoNiches[0],
    keyword: { id: 'demo-keyword-1', term: 'personal finance tips' },
  },
  {
    id: 'demo-analysis-2',
    competitionScore: 35,
    profitabilityScore: 5.20,
    overallScore: 82,
    channelCount: 342,
    createdAt: '2025-01-18T09:15:00Z',
    nicheId: 'demo-niche-2',
    keywordId: 'demo-keyword-2',
    niche: demoNiches[1],
    keyword: { id: 'demo-keyword-2', term: 'home workout routines' },
  },
  {
    id: 'demo-analysis-3',
    competitionScore: 28,
    profitabilityScore: 4.80,
    overallScore: 79,
    channelCount: 89,
    createdAt: '2025-01-16T16:45:00Z',
    nicheId: 'demo-niche-4',
    keywordId: 'demo-keyword-3',
    niche: demoNiches[3],
    keyword: { id: 'demo-keyword-3', term: 'minimalist lifestyle' },
  },
  {
    id: 'demo-analysis-4',
    competitionScore: 42,
    profitabilityScore: 6.30,
    overallScore: 76,
    channelCount: 278,
    createdAt: '2025-01-15T10:00:00Z',
    nicheId: 'demo-niche-3',
    keywordId: 'demo-keyword-4',
    niche: demoNiches[2],
    keyword: { id: 'demo-keyword-4', term: 'productivity hacks' },
  },
  {
    id: 'demo-analysis-5',
    competitionScore: 55,
    profitabilityScore: 7.80,
    overallScore: 71,
    channelCount: 512,
    createdAt: '2025-01-12T11:20:00Z',
    nicheId: 'demo-niche-1',
    keywordId: 'demo-keyword-5',
    niche: demoNiches[0],
    keyword: { id: 'demo-keyword-5', term: 'investment strategies' },
  },
  {
    id: 'demo-analysis-6',
    competitionScore: 38,
    profitabilityScore: 3.90,
    overallScore: 68,
    channelCount: 198,
    createdAt: '2025-01-10T08:00:00Z',
    nicheId: 'demo-niche-2',
    keywordId: 'demo-keyword-6',
    niche: demoNiches[1],
    keyword: { id: 'demo-keyword-6', term: 'plant-based cooking' },
  },
  {
    id: 'demo-analysis-7',
    competitionScore: 45,
    profitabilityScore: 5.60,
    overallScore: 65,
    channelCount: 234,
    createdAt: '2025-01-08T14:00:00Z',
    nicheId: 'demo-niche-3',
    keywordId: 'demo-keyword-7',
    niche: demoNiches[2],
    keyword: { id: 'demo-keyword-7', term: 'time management tips' },
  },
  {
    id: 'demo-analysis-8',
    competitionScore: 52,
    profitabilityScore: 4.10,
    overallScore: 58,
    channelCount: 423,
    createdAt: '2025-01-05T12:00:00Z',
    nicheId: 'demo-niche-4',
    keywordId: 'demo-keyword-8',
    niche: demoNiches[3],
    keyword: { id: 'demo-keyword-8', term: 'meditation for beginners' },
  },
];

// Demo saved searches
export const demoSavedSearches: SavedSearch[] = [
  {
    id: 'demo-saved-1',
    keyword: 'personal finance tips',
    nicheId: 'demo-analysis-1',
    nicheName: 'Personal Finance',
    createdAt: '2025-01-20T14:30:00Z',
    notes: 'High potential, low competition - prioritize this niche',
    collection: 'Top Picks',
  },
  {
    id: 'demo-saved-2',
    keyword: 'home workout routines',
    nicheId: 'demo-analysis-2',
    nicheName: 'Fitness & Health',
    createdAt: '2025-01-18T09:15:00Z',
    notes: 'Evergreen content opportunity',
    collection: 'Top Picks',
  },
  {
    id: 'demo-saved-3',
    keyword: 'productivity hacks',
    nicheId: 'demo-analysis-4',
    nicheName: 'Productivity',
    createdAt: '2025-01-15T10:00:00Z',
    collection: 'Research',
  },
  {
    id: 'demo-saved-4',
    keyword: 'sustainable living',
    nicheId: 'demo-analysis-3',
    nicheName: 'Sustainable Living',
    createdAt: '2025-01-12T11:20:00Z',
    notes: 'Growing trend, good for long-term',
    collection: 'Research',
  },
  {
    id: 'demo-saved-5',
    keyword: 'tech reviews budget',
    createdAt: '2025-01-10T08:00:00Z',
    collection: 'Ideas',
  },
];

// Helper to get top niches (sorted by overall score)
export function getDemoTopNiches(): Analysis[] {
  return [...demoAnalyses].sort((a, b) => b.overallScore - a.overallScore);
}

// Helper to get latest analyses (sorted by date)
export function getDemoLatestAnalyses(): Analysis[] {
  return [...demoAnalyses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Helper to filter niche results by search term
export function filterDemoNicheResults(searchTerm: string): NicheResult[] {
  if (!searchTerm.trim()) return demoNicheResults;
  const term = searchTerm.toLowerCase();
  return demoNicheResults.filter((niche) =>
    niche.keyword.toLowerCase().includes(term)
  );
}
