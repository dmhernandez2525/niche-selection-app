import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

interface NicheResult {
  keyword: string;
  score: number;
  competitionScore: number;
  profitabilityScore: number;
}

export function NicheFinder() {
  // Hardcoded for now until we connect to real backend fully
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['niches'],
    queryFn: async () => {
        const res = await fetch('http://localhost:3500/api/niche-selection');
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json() as Promise<NicheResult[]>;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Niche Finder</h2>
        <p className="text-muted-foreground">Discover profitable content niches with AI-powered analysis.</p>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input 
            placeholder="Enter a seed keyword..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit"><Search className="h-4 w-4 mr-2"/> Analyze</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Results</CardTitle>
          <CardDescription>Ranked by potential profitability vs competition.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
            ) : error ? (
                <div className="text-destructive">Error loading data. Is the backend running?</div>
            ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Keyword</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Competition</TableHead>
                        <TableHead className="text-right">Profitability</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {data?.map((niche) => (
                        <TableRow key={niche.keyword}>
                        <TableCell className="font-medium">{niche.keyword}</TableCell>
                        <TableCell>
                            <Badge variant={niche.score > 50 ? "default" : "secondary"}>
                                {niche.score.toFixed(0)}
                            </Badge>
                        </TableCell>
                        <TableCell>{niche.competitionScore}</TableCell>
                        <TableCell className="text-right">${niche.profitabilityScore.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
