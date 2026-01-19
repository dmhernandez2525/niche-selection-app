import { useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToastContext } from '@/context/ToastContext';
import { api } from '@/lib/api';
import {
  Search,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  AlertCircle,
  BarChart3
} from 'lucide-react';

function CompetitionIndicator({ score }: { score: number }) {
  if (score < 30) {
    return (
      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
        <TrendingDown className="h-4 w-4" />
        <span className="text-sm font-medium">Low</span>
      </div>
    );
  }
  if (score < 70) {
    return (
      <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
        <Minus className="h-4 w-4" />
        <span className="text-sm font-medium">Medium</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
      <TrendingUp className="h-4 w-4" />
      <span className="text-sm font-medium">High</span>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  let variant: 'default' | 'secondary' | 'destructive' = 'secondary';
  if (score >= 70) variant = 'default';
  else if (score < 40) variant = 'destructive';

  return (
    <Badge variant={variant} className="min-w-[3rem] justify-center">
      {score.toFixed(0)}
    </Badge>
  );
}

function CompetitionBar({ score }: { score: number }) {
  const getColor = () => {
    if (score < 30) return 'bg-green-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <CompetitionIndicator score={score} />
        <span className="text-xs text-muted-foreground">{score}/100</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export function NicheFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [savedKeywords, setSavedKeywords] = useState<Set<string>>(new Set());
  const toast = useToastContext();
  const queryClient = useQueryClient();

  // Fetch niche selection data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['niche-selection', searchTerm],
    queryFn: () => api.getNicheSelection(),
    enabled: true,
  });

  // Create niche mutation for saving
  const createNicheMutation = useMutation({
    mutationFn: (keyword: string) => api.createNiche({ name: keyword }),
    onSuccess: (_, keyword) => {
      setSavedKeywords((prev) => new Set([...prev, keyword]));
      toast.success(`"${keyword}" saved to your niches!`);
      queryClient.invalidateQueries({ queryKey: ['niches'] });
    },
    onError: (err) => {
      toast.error(`Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.warning('Please enter a keyword to search');
      return;
    }
    refetch();
    toast.info(`Analyzing "${searchTerm}"...`);
  };

  const handleSaveKeyword = (keyword: string) => {
    if (savedKeywords.has(keyword)) {
      toast.info('This keyword is already saved');
      return;
    }
    createNicheMutation.mutate(keyword);
  };

  const filteredData = data?.filter((niche) =>
    searchTerm
      ? niche.keyword.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Niche Finder</h2>
        <p className="text-muted-foreground">
          Discover profitable content niches with AI-powered analysis.
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Keywords
          </CardTitle>
          <CardDescription>
            Enter a seed keyword to discover related niches and analyze their potential.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter a seed keyword (e.g., 'gaming', 'cooking', 'fitness')"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-2" />
          Analysis uses YouTube and Google Trends data for accurate insights.
        </CardFooter>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                {filteredData?.length ?? 0} niches found. Ranked by potential profitability vs competition.
              </CardDescription>
            </div>
            {filteredData && filteredData.length > 0 && (
              <Link to="/results">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Results
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
              <p className="text-destructive font-medium">Error loading data</p>
              <p className="text-muted-foreground text-sm mt-1">
                Is the backend server running? Make sure it's started on port 3500.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : filteredData && filteredData.length > 0 ? (
            <div className="overflow-x-auto -mx-6">
              <div className="min-w-[600px] px-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Keyword</TableHead>
                      <TableHead className="w-[100px]">Score</TableHead>
                      <TableHead className="w-[200px]">Competition</TableHead>
                      <TableHead className="text-right">Profitability</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((niche) => (
                      <TableRow
                        key={niche.keyword}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">{niche.keyword}</TableCell>
                        <TableCell>
                          <ScoreBadge score={niche.score} />
                        </TableCell>
                        <TableCell>
                          <CompetitionBar score={niche.competitionScore} />
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            ${niche.profitabilityScore.toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground ml-1">/1k views</span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleSaveKeyword(niche.keyword)}
                            disabled={
                              createNicheMutation.isPending ||
                              savedKeywords.has(niche.keyword)
                            }
                            title={savedKeywords.has(niche.keyword) ? 'Saved' : 'Save keyword'}
                          >
                            {savedKeywords.has(niche.keyword) ? (
                              <BookmarkCheck className="h-4 w-4 text-primary" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm
                  ? `No results found for "${searchTerm}"`
                  : 'Enter a keyword to start analyzing niches'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Understanding the Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div>
              <h4 className="font-medium mb-1">Score</h4>
              <p className="text-sm text-muted-foreground">
                Overall niche score (0-100). Higher is better, combining competition and profitability factors.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Competition</h4>
              <p className="text-sm text-muted-foreground">
                How saturated the niche is. Lower competition means easier to rank and grow.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Profitability</h4>
              <p className="text-sm text-muted-foreground">
                Estimated revenue per 1,000 views based on CPM rates and ad performance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
