import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useLatestAnalyses, useTopNiches } from '@/hooks/useAnalysis';
import { useNiches } from '@/hooks/useNiches';
import {
  Search,
  TrendingUp,
  BarChart3,
  Bookmark,
  ArrowRight,
  Target,
  Sparkles,
  Activity
} from 'lucide-react';

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  isLoading
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function QuickAction({
  title,
  description,
  icon: Icon,
  to
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  to: string;
}) {
  return (
    <Link to={to}>
      <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground truncate">{description}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  );
}

export function Dashboard() {
  const { data: latestAnalyses, isLoading: loadingLatest } = useLatestAnalyses();
  const { data: topNiches, isLoading: loadingTop } = useTopNiches();
  const { data: niches, isLoading: loadingNiches } = useNiches();

  const totalAnalyses = latestAnalyses?.length ?? 0;
  const totalNiches = niches?.length ?? 0;
  const avgScore = topNiches?.length
    ? Math.round(topNiches.reduce((sum, n) => sum + n.overallScore, 0) / topNiches.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your niche research.
          </p>
        </div>
        <Link to="/niche-finder">
          <Button>
            <Search className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Niches"
          value={totalNiches}
          description="Niches analyzed"
          icon={Target}
          isLoading={loadingNiches}
        />
        <StatCard
          title="Recent Analyses"
          value={totalAnalyses}
          description="In the last 30 days"
          icon={Activity}
          isLoading={loadingLatest}
        />
        <StatCard
          title="Avg. Score"
          value={avgScore}
          description="Across top niches"
          icon={TrendingUp}
          isLoading={loadingTop}
        />
        <StatCard
          title="Top Performer"
          value={topNiches?.[0]?.niche?.name ?? '-'}
          description={topNiches?.[0]?.overallScore ? `Score: ${topNiches[0].overallScore}` : 'No data'}
          icon={Sparkles}
          isLoading={loadingTop}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAction
            title="Find New Niche"
            description="Discover profitable content opportunities"
            icon={Search}
            to="/niche-finder"
          />
          <QuickAction
            title="View Results"
            description="See your analysis results and insights"
            icon={BarChart3}
            to="/results"
          />
          <QuickAction
            title="Saved Searches"
            description="Access your bookmarked niches"
            icon={Bookmark}
            to="/saved"
          />
        </div>
      </div>

      {/* Recent Activity & Top Niches */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Top Niches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Performing Niches
            </CardTitle>
            <CardDescription>
              Highest scoring niches based on competition and profitability
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingTop ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : topNiches && topNiches.length > 0 ? (
              <div className="space-y-3">
                {topNiches.slice(0, 5).map((analysis, index) => (
                  <Link
                    key={analysis.id}
                    to={`/analysis/${analysis.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground w-6">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{analysis.niche?.name ?? 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">
                          {analysis.keyword?.term ?? 'No keyword'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={analysis.overallScore > 70 ? 'default' : 'secondary'}>
                      {analysis.overallScore}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No niches analyzed yet. Start by running an analysis!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Analyses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest niche research and analyses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingLatest ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : latestAnalyses && latestAnalyses.length > 0 ? (
              <div className="space-y-3">
                {latestAnalyses.slice(0, 5).map((analysis) => (
                  <Link
                    key={analysis.id}
                    to={`/analysis/${analysis.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{analysis.niche?.name ?? 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Score: {analysis.overallScore}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No recent analyses. Start exploring niches!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
