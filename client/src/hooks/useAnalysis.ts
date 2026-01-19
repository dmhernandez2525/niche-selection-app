import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type RunAnalysisInput } from '@/lib/api';

export const analysisKeys = {
  all: ['analyses'] as const,
  latest: () => [...analysisKeys.all, 'latest'] as const,
  top: () => [...analysisKeys.all, 'top'] as const,
  byNiche: (nicheId: string) => [...analysisKeys.all, 'niche', nicheId] as const,
};

export function useLatestAnalyses() {
  return useQuery({
    queryKey: analysisKeys.latest(),
    queryFn: () => api.getLatestAnalyses(),
  });
}

export function useTopNiches() {
  return useQuery({
    queryKey: analysisKeys.top(),
    queryFn: () => api.getTopNiches(),
  });
}

export function useAnalysesByNiche(nicheId: string) {
  return useQuery({
    queryKey: analysisKeys.byNiche(nicheId),
    queryFn: () => api.getAnalysesByNiche(nicheId),
    enabled: !!nicheId,
  });
}

export function useRunAnalysis(nicheId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RunAnalysisInput) => api.runAnalysis(nicheId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: analysisKeys.all });
      queryClient.invalidateQueries({ queryKey: ['niches'] });
    },
  });
}
