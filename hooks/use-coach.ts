'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import { toast } from '@/store/toast';
import { ApiError } from '@/lib/api';
import type { CoachClient, InviteCode, DisplayMode } from '@/types';

// ── Client-side types ──────────────────────────────────────

export interface MyCoach {
  coach_id: number;
  coach_name: string;
  coach_email: string;
  connected_since: string | null;
  display_mode: DisplayMode;
  display_label: string | null;
  shared_account_ids: number[];
}

export interface CoachLookupResult {
  id: number;
  full_name: string;
  email: string;
}

export interface ConnectCoachInput {
  coach_email: string;
  display_mode: DisplayMode;
  display_label?: string;
  account_ids: number[];
}

// ── Coach: client list ─────────────────────────────────────

export function useMyClients() {
  return useQuery({
    queryKey: QUERY_KEYS.clients,
    queryFn: async () => {
      const data = await apiFetch<{ clients: CoachClient[] }>('/coach/my-clients');
      return data.clients ?? [];
    },
  });
}

// ── Client: coach list ─────────────────────────────────────

export function useMyCoaches() {
  return useQuery({
    queryKey: QUERY_KEYS.coaches,
    queryFn: async () => {
      const data = await apiFetch<{ coaches: MyCoach[] }>('/client/my-coaches');
      return data.coaches ?? [];
    },
  });
}

// ── Client: lookup coach by email ──────────────────────────

export function useLookupCoach() {
  return useMutation({
    mutationFn: (email: string) =>
      apiFetch<CoachLookupResult>(
        `/coach/lookup?email=${encodeURIComponent(email)}`,
      ),
  });
}

// ── Client: connect to coach ───────────────────────────────

export function useConnectCoach() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ConnectCoachInput) =>
      apiFetch('/client/connect-coach', { method: 'POST', body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.coaches });
      toast.success('اتصال به کوچ برقرار شد');
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : 'خطا در اتصال');
    },
  });
}

// ── Client: disconnect from coach ─────────────────────────

export function useDisconnectCoach() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (coachId: number) =>
      apiFetch(`/client/disconnect-coach/${coachId}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.coaches });
      toast.success('ارتباط با کوچ قطع شد');
    },
  });
}

// ── Coach: invite codes ────────────────────────────────────

export function useInviteCodes() {
  return useQuery({
    queryKey: QUERY_KEYS.inviteCodes,
    queryFn: async () => {
      const data = await apiFetch<{ codes: InviteCode[] }>('/coach/invite-codes');
      return data.codes ?? [];
    },
  });
}

interface CreateInviteCodeInput {
  expires_days?: number;
  max_uses?: number;
}

export function useCreateInviteCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInviteCodeInput) =>
      apiFetch('/coach/invite-codes', { method: 'POST', body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.inviteCodes });
      toast.success('کد دعوت ساخته شد');
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : 'خطا در ساخت کد');
    },
  });
}

export function useDeleteInviteCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/coach/invite-codes/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.inviteCodes });
      toast.success('کد دعوت حذف شد');
    },
  });
}
