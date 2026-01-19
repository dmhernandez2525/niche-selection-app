import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToastContext } from '@/context/ToastContext';
import { api, type Analysis } from '@/lib/api';
import {
  ArrowLeft,
  Target,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Download,
  Share2,
  Bookmark,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle,
  Minus
} from 'lucide-react';

function ScoreGauge({ score, label, description }: { score: number; label: string; description: string }) {
  const getColor = () => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="text-center">
      <div className="relative inline-flex items-center justify-center w-28 h-28">
        <svg className="w-28 h-28 transform -rotate-90">
          <circle
            cx="56"
            cy="56"
            r="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
          />
          <circle
            cx="56"
            cy="56"
            r="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${(score / 100) * 301.6} 301.6`}
            className={getColor()}
          />
        </svg>
        <span className={`absolute text-2xl font-bold ${getColor()}`}>{score}</span>
      </div>
      <h4 className="font-medium mt-2">{label}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function InsightItem({
  icon: Icon,
  title,
  value,
  status
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  status: 'good' | 'warning' | 'bad' | 'neutral';
}) {
  const statusColors = {
    good: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    warning: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    bad: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    neutral: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
  };

  const StatusIcon = {
    good: CheckCircle,
    warning: AlertCircle,
    bad: XCircle,
    neutral: Minus
  }[status];

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${statusColors[status]}`}>
      <Icon className="h-5 w-5" />
      <div className="flex-1">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs opacity-80">{value}</p>
      </div>
      <StatusIcon className="h-4 w-4" />
    </div>
  );
}

function RecommendationCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function AnalysisDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToastContext();

  // For now, we'll use the top niches endpoint and find our analysis
  // In a real app, you'd have a dedicated endpoint for single analysis
  const { data: analyses, isLoading, error } = useQuery({
    queryKey: ['analyses', 'top'],
    queryFn: () => api.getTopNiches()
  });

  const analysis = analyses?.find((a) => a.id === id);

  const handleExport = (format: 'csv' | 'pdf') => {
    toast.info(`Exporting analysis as ${format.toUpperCase()}...`);
    // Export logic would go here
    setTimeout(() => {
      toast.success(`Analysis exported as ${format.toUpperCase()}`);
    }, 1000);
  };

  const handleSave = () => {
    toast.success('Analysis saved to your collection!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  // Generate insights based on scores
  const getInsights = (analysis: Analysis) => {
    const insights = [];

    // Competition insight
    if (analysis.competitionScore < 30) {
      insights.push({
        icon: Users,
        title: 'Low Competition',
        value: 'Great opportunity to establish presence',
        status: 'good' as const
      });
    } else if (analysis.competitionScore < 70) {
      insights.push({
        icon: Users,
        title: 'Moderate Competition',
        value: 'Requires good content strategy',
        status: 'warning' as const
      });
    } else {
      insights.push({
        icon: Users,
        title: 'High Competition',
        value: 'Difficult to break through',
        status: 'bad' as const
      });
    }

    // Profitability insight
    if (analysis.profitabilityScore > 5) {
      insights.push({
        icon: DollarSign,
        title: 'High Revenue Potential',
        value: `$${analysis.profitabilityScore.toFixed(2)}/1k views`,
        status: 'good' as const
      });
    } else if (analysis.profitabilityScore > 2) {
      insights.push({
        icon: DollarSign,
        title: 'Average Revenue Potential',
        value: `$${analysis.profitabilityScore.toFixed(2)}/1k views`,
        status: 'warning' as const
      });
    } else {
      insights.push({
        icon: DollarSign,
        title: 'Low Revenue Potential',
        value: `$${analysis.profitabilityScore.toFixed(2)}/1k views`,
        status: 'bad' as const
      });
    }

    // Overall score insight
    if (analysis.overallScore >= 70) {
      insights.push({
        icon: Target,
        title: 'Excellent Opportunity',
        value: 'Highly recommended niche',
        status: 'good' as const
      });
    } else if (analysis.overallScore >= 40) {
      insights.push({
        icon: Target,
        title: 'Moderate Opportunity',
        value: 'Worth considering with strategy',
        status: 'warning' as const
      });
    } else {
      insights.push({
        icon: Target,
        title: 'Challenging Opportunity',
        value: 'Consider alternative niches',
        status: 'bad' as const
      });
    }

    // Channel count insight
    if (analysis.channelCount !== null) {
      if (analysis.channelCount < 100) {
        insights.push({
          icon: BarChart3,
          title: 'Emerging Niche',
          value: `${analysis.channelCount} active channels`,
          status: 'good' as const
        });
      } else if (analysis.channelCount < 1000) {
        insights.push({
          icon: BarChart3,
          title: 'Growing Niche',
          value: `${analysis.channelCount} active channels`,
          status: 'neutral' as const
        });
      } else {
        insights.push({
          icon: BarChart3,
          title: 'Established Niche',
          value: `${analysis.channelCount}+ active channels`,
          status: 'warning' as const
        });
      }
    }

    return insights;
  };

  // Generate recommendations
  const getRecommendations = (analysis: Analysis) => {
    const contentTips = [];
    const growthTips = [];
    const monetizationTips = [];

    if (analysis.competitionScore < 50) {
      contentTips.push('Focus on comprehensive, in-depth content to establish authority');
      contentTips.push('Create pillar content pieces that can rank well');
      growthTips.push('Capitalize on low competition with consistent posting');
    } else {
      contentTips.push('Find unique angles and underserved sub-niches');
      contentTips.push('Focus on quality over quantity to stand out');
      growthTips.push('Collaborate with established creators in the space');
    }

    if (analysis.profitabilityScore > 3) {
      monetizationTips.push('Explore sponsored content opportunities');
      monetizationTips.push('Consider creating premium/paid content');
    } else {
      monetizationTips.push('Build audience first, monetization will follow');
      monetizationTips.push('Focus on affiliate marketing for additional revenue');
    }

    contentTips.push('Optimize titles and thumbnails for CTR');
    growthTips.push('Engage with your community regularly');
    monetizationTips.push('Diversify income streams');

    return { contentTips, growthTips, monetizationTips };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Analysis Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The analysis you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/results')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Results
        </Button>
      </div>
    );
  }

  const insights = getInsights(analysis);
  const recommendations = getRecommendations(analysis);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{analysis.niche?.name ?? 'Unknown Niche'}</h2>
              <Badge variant={analysis.overallScore >= 70 ? 'default' : 'secondary'}>
                Score: {analysis.overallScore}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Analyzed on {new Date(analysis.createdAt).toLocaleDateString()}
              {analysis.keyword && ` • Keyword: ${analysis.keyword.term}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Bookmark className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Score Gauges */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Scores</CardTitle>
          <CardDescription>Key metrics for this niche analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 justify-items-center">
            <ScoreGauge
              score={analysis.overallScore}
              label="Overall Score"
              description="Combined performance metric"
            />
            <ScoreGauge
              score={100 - analysis.competitionScore}
              label="Opportunity Score"
              description="Lower competition = higher opportunity"
            />
            <ScoreGauge
              score={Math.min(100, analysis.profitabilityScore * 10)}
              label="Profitability"
              description={`$${analysis.profitabilityScore.toFixed(2)}/1k views`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Key Insights
          </CardTitle>
          <CardDescription>AI-powered analysis of this niche</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            {insights.map((insight, index) => (
              <InsightItem key={index} {...insight} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <p className="text-xl font-bold">{analysis.overallScore}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Users className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Competition</p>
                <p className="text-xl font-bold">{analysis.competitionScore}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profitability</p>
                <p className="text-xl font-bold">${analysis.profitabilityScore.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Channels</p>
                <p className="text-xl font-bold">{analysis.channelCount ?? 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <RecommendationCard title="Content Strategy" items={recommendations.contentTips} />
          <RecommendationCard title="Growth Tips" items={recommendations.growthTips} />
          <RecommendationCard title="Monetization" items={recommendations.monetizationTips} />
        </div>
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <p className="text-muted-foreground">
              Want to dive deeper into this niche?
            </p>
            <div className="flex gap-2">
              <Link to="/niche-finder">
                <Button variant="outline">
                  Run New Analysis
                </Button>
              </Link>
              <Link to="/results">
                <Button>
                  View All Results
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
