import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type CreateNicheInput, type UpdateNicheInput } from '@/lib/api';

export const nicheKeys = {
  all: ['niches'] as const,
  lists: () => [...nicheKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...nicheKeys.lists(), filters] as const,
  details: () => [...nicheKeys.all, 'detail'] as const,
  detail: (id: string) => [...nicheKeys.details(), id] as const,
};

export function useNiches() {
  return useQuery({
    queryKey: nicheKeys.lists(),
    queryFn: () => api.getAllNiches(),
  });
}

export function useNiche(id: string) {
  return useQuery({
    queryKey: nicheKeys.detail(id),
    queryFn: () => api.getNicheById(id),
    enabled: !!id,
  });
}

export function useCreateNiche() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNicheInput) => api.createNiche(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nicheKeys.all });
    },
  });
}

export function useUpdateNiche() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNicheInput }) =>
      api.updateNiche(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: nicheKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: nicheKeys.lists() });
    },
  });
}

export function useDeleteNiche() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteNiche(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nicheKeys.all });
    },
  });
}
