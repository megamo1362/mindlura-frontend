'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch, ApiError } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import type { JournalAnalysisData } from '@/types';

export interface CoachClientAccount {
  id: number;
  login: string;
  server: string;
  label?: string | null;
}

export function useCoachClientAccounts(clientId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.coachClientAccounts(clientId),
    queryFn: async () => {
      const data = await apiFetch<{ accounts: CoachClientAccount[] }>(`/coach/client/${clientId}/accounts`);
      return data.accounts ?? [];
    },
  });
}

export function useCoachClientJournalAnalysis(clientId: string, accountId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.coachClientJournalAnalysis(clientId, accountId),
    queryFn: () => apiFetch<JournalAnalysisData>(`/journal/analysis/${accountId}?client_id=${clientId}`),
    enabled: Boolean(accountId),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 403) return false;
      return failureCount < 2;
    },
  });
}
