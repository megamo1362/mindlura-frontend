'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, ApiError } from '@/lib/api';
import { toast } from '@/store/toast';
import { useLang } from '@/app/i18n/LangContext';

export interface CalendarAlertSettings {
  enabled: boolean;
  minutes_before: number;
  impact_filter: string[];
  currency_filter: string[];
  notify_result: boolean;
}

const QUERY_KEY = ['calendar-alert-settings'] as const;

export function useCalendarAlertSettings() {
  return useQuery<CalendarAlertSettings>({
    queryKey: QUERY_KEY,
    queryFn: () => apiFetch('/calendar/alert-settings'),
  });
}

export function useUpdateCalendarAlertSettings() {
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CalendarAlertSettings) =>
      apiFetch<CalendarAlertSettings>('/calendar/alert-settings', { method: 'PUT', body: data }),
    onSuccess: (data) => {
      qc.setQueryData(QUERY_KEY, data);
      toast.success(t.settings_saved);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t.error_generic);
    },
  });
}
