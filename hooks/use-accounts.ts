'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import { toast } from '@/store/toast';
import { ApiError } from '@/lib/api';
import { useLang } from '@/app/i18n/LangContext';
import type { MT5Account } from '@/types';

export function useAccounts() {
  return useQuery({
    queryKey: QUERY_KEYS.accounts,
    queryFn: async () => {
      const data = await apiFetch<{ accounts: MT5Account[] } | MT5Account[]>('/accounts/list');
      // Backend returns { accounts: [...] } or a plain array
      return Array.isArray(data) ? data : data.accounts ?? [];
    },
  });
}

interface AddAccountInput {
  login: string;
  investor_password: string;
  server: string;
  label?: string;
}

export function useAddAccount() {
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddAccountInput) =>
      apiFetch<MT5Account>('/accounts/add', { method: 'POST', body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
      toast.success(t.account_added_msg);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t.account_add_error_msg);
    },
  });
}

export function useDeleteAccount() {
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiFetch(`/accounts/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
      toast.success(t.account_deleted_msg);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t.account_delete_error_msg);
    },
  });
}

export function useSyncAccount() {
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/accounts/${id}/sync`, { method: 'POST' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
      toast.success(t.account_synced_msg);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t.account_sync_error_msg);
    },
  });
}
