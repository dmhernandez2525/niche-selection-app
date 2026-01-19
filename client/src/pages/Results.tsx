import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useLatestAnalyses, useTopNiches } from '@/hooks/useAnalysis';
import {
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  Target,
  DollarSign,
  Users
} from 'lucide-react';

// Simple bar chart component
function SimpleBarChart({
  data,
  height = 200,
  barColor = 'bg-primary'
}: {
  data: { label: string; value: number; maxValue?: number }[];
  height?: number;
  barColor?: string;
}) {
  const maxValue = Math.max(...data.map((d) => d.maxValue ?? d.value), 1);

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-medium">{item.value}</span>
          <div
            className={`w-full ${barColor} rounded-t transition-all duration-500`}
            style={{
              height: `${(item.value / maxValue) * (height - 40)}px`,
              minHeight: 4
            }}
          />
          <span className="text-xs text-muted-foreground truncate max-w-full" title={item.label}>
            {item.label.length > 8 ? item.label.slice(0, 8) + '...' : item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// Donut chart segment
function DonutChart({
  segments,
  size = 160,
  strokeWidth = 20
}: {
  segments: { value: number; color: string; label: string }[];
  size?: number;
  strokeWidth?: number;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Pre-calculate cumulative percentages using reduce
  const segmentsWithOffset = useMemo(() => {
    const result: Array<{ value: number; color: string; label: string; percent: number; offset: number }> = [];
    let cumulative = 0;

    for (const segment of segments) {
      const percent = (segment.value / total) * 100;
      result.push({
        ...segment,
        percent,
        offset: cumulative
      });
      cumulative += percent;
    }

    return result;
  }, [segments, total]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {segmentsWithOffset.map((segment, index) => {
          const strokeDasharray = `${(segment.percent / 100) * circumference} ${circumference}`;
          const strokeDashoffset = -(segment.offset / 100) * circumference;

          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-2xl font-bold">{total}</span>
          <span className="text-xs text-muted-foreground block">Total</span>
        </div>
      </div>
    </div>
  );
}

// Score distribution component
function ScoreDistribution({ analyses }: { analyses: { overallScore: number }[] }) {
  const distribution = useMemo(() => {
    const ranges = [
      { label: '0-25', min: 0, max: 25, color: 'hsl(0, 84%, 60%)' },
      { label: '26-50', min: 26, max: 50, color: 'hsl(45, 84%, 60%)' },
      { label: '51-75', min: 51, max: 75, color: 'hsl(120, 50%, 50%)' },
      { label: '76-100', min: 76, max: 100, color: 'hsl(142, 76%, 36%)' }
    ];

    return ranges.map((range) => ({
      ...range,
      value: analyses.filter(
        (a) => a.overallScore >= range.min && a.overallScore <= range.max
      ).length
    }));
  }, [analyses]);

  return (
    <div className="flex items-center gap-6">
      <DonutChart segments={distribution} />
      <div className="flex flex-col gap-2">
        {distribution.map((segment) => (
          <div key={segment.label} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-sm">
              {segment.label}: <strong>{segment.value}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

type SortField = 'score' | 'competition' | 'profitability' | 'date';
type SortOrder = 'asc' | 'desc';

// Sort button component - moved outside Results to avoid recreation on render
function SortButton({
  field,
  label,
  sortField,
  sortOrder,
  onToggle
}: {
  field: SortField;
  label: string;
  sortField: SortField;
  sortOrder: SortOrder;
  onToggle: (field: SortField) => void;
}) {
  return (
    <Button
      variant={sortField === field ? 'secondary' : 'ghost'}
      size="sm"
      onClick={() => onToggle(field)}
      className="gap-1"
    >
      {label}
      {sortField === field &&
        (sortOrder === 'desc' ? (
          <SortDesc className="h-3 w-3" />
        ) : (
          <SortAsc className="h-3 w-3" />
        ))}
    </Button>
  );
}

export function Results() {
  const { data: latestAnalyses, isLoading: loadingLatest } = useLatestAnalyses();
  const { data: topNiches, isLoading: loadingTop } = useTopNiches();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const isLoading = loadingLatest || loadingTop;

  // Calculate insights
  const insights = useMemo(() => {
    if (!topNiches || topNiches.length === 0) {
      return {
        avgScore: 0,
        avgCompetition: 0,
        avgProfitability: 0,
        topPerformer: null,
        totalAnalyses: 0,
        highScoreCount: 0
      };
    }

    const avgScore = Math.round(
      topNiches.reduce((sum, n) => sum + n.overallScore, 0) / topNiches.length
    );
    const avgCompetition = Math.round(
      topNiches.reduce((sum, n) => sum + n.competitionScore, 0) / topNiches.length
    );
    const avgProfitability =
      topNiches.reduce((sum, n) => sum + n.profitabilityScore, 0) / topNiches.length;

    return {
      avgScore,
      avgCompetition,
      avgProfitability,
      topPerformer: topNiches[0],
      totalAnalyses: topNiches.length,
      highScoreCount: topNiches.filter((n) => n.overallScore >= 70).length
    };
  }, [topNiches]);

  // Filtered and sorted analyses
  const filteredAnalyses = useMemo(() => {
    if (!latestAnalyses) return [];

    const filtered = latestAnalyses.filter((analysis) =>
      searchTerm
        ? analysis.niche?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          analysis.keyword?.term?.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'score':
          comparison = a.overallScore - b.overallScore;
          break;
        case 'competition':
          comparison = a.competitionScore - b.competitionScore;
          break;
        case 'profitability':
          comparison = a.profitabilityScore - b.profitabilityScore;
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [latestAnalyses, searchTerm, sortField, sortOrder]);

  // Chart data for top niches
  const chartData = useMemo(() => {
    if (!topNiches) return [];
    return topNiches.slice(0, 6).map((analysis) => ({
      label: analysis.niche?.name ?? 'Unknown',
      value: analysis.overallScore,
      maxValue: 100
    }));
  }, [topNiches]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Results Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive analysis results and insights from your niche research.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/niche-finder">
            <Button>
              <Search className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{insights.avgScore}</p>
                )}
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Target className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-green-600">Above average</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Competition</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{insights.avgCompetition}</p>
                )}
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <Users className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              {insights.avgCompetition < 50 ? (
                <>
                  <ArrowDownRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-600">Low competition</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="h-3 w-3 text-yellow-500" />
                  <span className="text-yellow-600">Moderate</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Profitability</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">${insights.avgProfitability.toFixed(2)}</p>
                )}
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <span className="text-muted-foreground">per 1k views</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Performers</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{insights.highScoreCount}</p>
                )}
              </div>
              <div className="p-2 bg-purple-500/10 rounded-full">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <span className="text-muted-foreground">Score {'>='} 70</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Top Niches Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Niches by Score
            </CardTitle>
            <CardDescription>Performance comparison of top-ranking niches</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : chartData.length > 0 ? (
              <SimpleBarChart data={chartData} />
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Score Distribution
            </CardTitle>
            <CardDescription>Breakdown of analyses by score range</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : topNiches && topNiches.length > 0 ? (
              <div className="flex justify-center">
                <ScoreDistribution analyses={topNiches} />
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analysis List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Analyses</CardTitle>
              <CardDescription>{filteredAnalyses.length} results found</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search niches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-[200px]"
                />
              </div>
              <div className="flex items-center gap-1 bg-muted rounded-md p-1">
                <Filter className="h-4 w-4 text-muted-foreground ml-2" />
                <SortButton
                  field="score"
                  label="Score"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onToggle={toggleSort}
                />
                <SortButton
                  field="competition"
                  label="Competition"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onToggle={toggleSort}
                />
                <SortButton
                  field="date"
                  label="Date"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onToggle={toggleSort}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredAnalyses.length > 0 ? (
            <div className="space-y-3">
              {filteredAnalyses.map((analysis) => (
                <Link
                  key={analysis.id}
                  to={`/analysis/${analysis.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">
                        {analysis.niche?.name ?? 'Unknown Niche'}
                      </h4>
                      <Badge variant={analysis.overallScore >= 70 ? 'default' : 'secondary'}>
                        {analysis.overallScore}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {analysis.keyword?.term ?? 'No keyword'} •{' '}
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">Competition</p>
                      <p className="font-medium">{analysis.competitionScore}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">Profitability</p>
                      <p className="font-medium text-green-600">
                        ${analysis.profitabilityScore.toFixed(2)}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon-sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm
                  ? `No analyses found for "${searchTerm}"`
                  : 'No analyses yet. Start by running a niche analysis!'}
              </p>
              {!searchTerm && (
                <Link to="/niche-finder">
                  <Button variant="outline" className="mt-4">
                    <Search className="h-4 w-4 mr-2" />
                    Start Analysis
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
