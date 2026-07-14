import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import type { NotificationsResponse, MyCoachNotificationsResponse } from '@/types';

export function useNotifications(category?: string) {
  const url = category ? `/notifications?category=${category}` : '/notifications';
  return useQuery<NotificationsResponse>({
    queryKey: ['notifications', category],
    queryFn: () => apiFetch(url),
    refetchInterval: 30_000,
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiFetch(`/notifications/${id}/read`, { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (category?: string) => {
      const url = category ? `/notifications/read-all?category=${category}` : '/notifications/read-all';
      return apiFetch(url, { method: 'POST' });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiFetch(`/notifications/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

// ── Notifications from coach ────────────────────────────────

export function useMyCoachNotifications(page: number = 1, limit: number = 20) {
  return useQuery<MyCoachNotificationsResponse>({
    queryKey: [...QUERY_KEYS.myCoachNotifications, page, limit],
    queryFn: () => apiFetch(`/notifications/my?page=${page}&limit=${limit}`),
    refetchInterval: 30_000,
  });
}

export function useMarkCoachNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiFetch(`/notifications/${id}/read`, { method: 'PATCH' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.myCoachNotifications }),
  });
}
