'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import { toast } from '@/store/toast';
import { ApiError } from '@/lib/api';
import { useLang } from '@/app/i18n/LangContext';
import type {
  CoachClient, InviteCode, DisplayMode, AccountPermissions, CoachEvent, RosterAnalytics,
  CoachNotificationsResponse, NotifyClientsInput, NotifyClientsResponse,
  CoachAIReportFilters, CoachAIReportResponse, CoachAIReportLatest, CoachAIReportStatus,
  CoachPurchasesResponse,
} from '@/types';

// ── Client-side types ──────────────────────────────────────

export interface MyCoach {
  coach_id: number;
  coach_name: string;
  coach_email: string;
  connected_since: string | null;
  display_mode: DisplayMode;
  display_label: string | null;
  shared_account_ids: number[];
  account_permissions: AccountPermissions[];
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
  account_permissions: AccountPermissions[];
}

// ── Coach: client list ─────────────────────────────────────

export type ClientSortBy = 'joined_at' | 'profit' | 'drawdown' | 'win_rate' | 'rr_ratio' | 'trade_count';
export type SortDir = 'asc' | 'desc';

export interface MyClientsParams {
  search?: string;
  sortBy?: ClientSortBy;
  sortDir?: SortDir;
  eventId?: number | null;
}

export function useMyClients(params: MyClientsParams = {}) {
  const { search, sortBy, sortDir, eventId } = params;
  return useQuery({
    queryKey: [...QUERY_KEYS.clients, search ?? '', sortBy ?? '', sortDir ?? '', eventId ?? ''],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (search) query.set('search', search);
      if (sortBy) query.set('sort_by', sortBy);
      if (sortDir) query.set('sort_dir', sortDir);
      if (eventId != null) query.set('event_id', String(eventId));
      const qs = query.toString();
      const data = await apiFetch<{ clients: CoachClient[] }>(`/coach/my-clients${qs ? `?${qs}` : ''}`);
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
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ConnectCoachInput) =>
      apiFetch('/client/connect-coach', { method: 'POST', body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.coaches });
      toast.success(t.coach_connected_msg);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t.coach_connect_error_msg);
    },
  });
}

// ── Client: disconnect from coach ─────────────────────────

export function useDisconnectCoach() {
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (coachId: number) =>
      apiFetch(`/client/disconnect-coach/${coachId}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.coaches });
      toast.success(t.coach_disconnected_msg);
    },
  });
}

// ── Coach: roster analytics ─────────────────────────────────

export function useRosterAnalytics(eventId?: number | null) {
  return useQuery({
    queryKey: [...QUERY_KEYS.coachRosterAnalytics, eventId ?? ''],
    queryFn: () => {
      const qs = eventId != null ? `?event_id=${eventId}` : '';
      return apiFetch<RosterAnalytics>(`/coach/analytics/roster${qs}`);
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
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInviteCodeInput) =>
      apiFetch('/coach/invite-codes', { method: 'POST', body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.inviteCodes });
      toast.success(t.coach_code_created_msg);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t.coach_code_error_msg);
    },
  });
}

export function useDeleteInviteCode() {
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/coach/invite-codes/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.inviteCodes });
      toast.success(t.coach_code_deleted_msg);
    },
  });
}

// ── Coach: events ──────────────────────────────────────────

export interface CreateCoachEventInput {
  name: string;
  description?: string | null;
  event_code: string;
}

export interface UpdateCoachEventInput {
  name?: string;
  description?: string | null;
  is_active?: boolean;
}

export function useCoachEvents() {
  return useQuery({
    queryKey: QUERY_KEYS.coachEvents,
    queryFn: () => apiFetch<CoachEvent[]>('/coach/events'),
  });
}

export function useGenerateEventCode() {
  return useMutation({
    mutationFn: () => apiFetch<{ event_code: string }>('/coach/events/generate-code'),
  });
}

export function useCreateCoachEvent() {
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCoachEventInput) =>
      apiFetch<CoachEvent>('/coach/events', { method: 'POST', body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.coachEvents });
      toast.success(t.event_created);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t.error_generic);
    },
  });
}

export function useUpdateCoachEvent() {
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCoachEventInput }) =>
      apiFetch<CoachEvent>(`/coach/events/${id}`, { method: 'PATCH', body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.coachEvents });
      toast.success(t.event_updated);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t.error_generic);
    },
  });
}

export function useDeleteCoachEvent() {
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiFetch(`/coach/events/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.coachEvents });
      toast.success(t.event_deleted);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t.error_generic);
    },
  });
}

// ── Coach: notify clients ───────────────────────────────────

export function useNotifyClients() {
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NotifyClientsInput) =>
      apiFetch<NotifyClientsResponse>('/coach/notify', { method: 'POST', body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.coachNotifications });
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t.error_generic);
    },
  });
}

export function useCoachNotifications(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: [...QUERY_KEYS.coachNotifications, page, limit],
    queryFn: () =>
      apiFetch<CoachNotificationsResponse>(`/coach/notifications?page=${page}&limit=${limit}`),
  });
}

// ── Coach: AI daily report ───────────────────────────────────

export function useAIReportStatus() {
  return useQuery({
    queryKey: QUERY_KEYS.coachAIReportStatus,
    queryFn: () => apiFetch<CoachAIReportStatus>('/coach/ai-report/status'),
  });
}

export function useLatestAIReport() {
  return useQuery({
    queryKey: QUERY_KEYS.coachAIReportLatest,
    queryFn: () => apiFetch<CoachAIReportLatest | null>('/coach/ai-report/latest'),
  });
}

export function useRequestAIReport() {
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (filters: CoachAIReportFilters) =>
      apiFetch<CoachAIReportResponse>('/coach/ai-report', { method: 'POST', body: { filters } }),
    onSuccess: (data) => {
      qc.setQueryData<CoachAIReportLatest>(QUERY_KEYS.coachAIReportLatest, {
        report_en: data.report_en,
        report_fa: data.report_fa,
        generated_at: data.generated_at,
        filters: null,
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.coachAIReportStatus });
    },
    onError: (err) => {
      if (!(err instanceof ApiError) || err.message !== 'already_requested_today') {
        toast.error(err instanceof ApiError ? err.message : t.error_generic);
      }
    },
  });
}

// ── Coach: purchase history ─────────────────────────────────

export interface CoachPurchasesParams {
  dateFrom?: string;
  dateTo?: string;
  planSlug?: string;
  eventId?: number | null;
  clientId?: number | null;
  sortBy?: 'date' | 'amount';
  sortDir?: SortDir;
  page?: number;
  limit?: number;
}

export function useCoachPurchases(params: CoachPurchasesParams = {}) {
  const {
    dateFrom, dateTo, planSlug, eventId, clientId, sortBy, sortDir, page = 1, limit = 20,
  } = params;
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.coachPurchases,
      dateFrom ?? '', dateTo ?? '', planSlug ?? '', eventId ?? '', clientId ?? '',
      sortBy ?? '', sortDir ?? '', page, limit,
    ],
    queryFn: () => {
      const query = new URLSearchParams();
      if (dateFrom) query.set('date_from', dateFrom);
      if (dateTo) query.set('date_to', dateTo);
      if (planSlug) query.set('plan_slug', planSlug);
      if (eventId != null) query.set('event_id', String(eventId));
      if (clientId != null) query.set('client_id', String(clientId));
      if (sortBy) query.set('sort_by', sortBy);
      if (sortDir) query.set('sort_dir', sortDir);
      query.set('page', String(page));
      query.set('limit', String(limit));
      return apiFetch<CoachPurchasesResponse>(`/coach/purchases?${query.toString()}`);
    },
  });
}
