'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, ApiError } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import { toast } from '@/store/toast';
import { useLang } from '@/app/i18n/LangContext';
import type { Ticket, TicketListItem } from '@/types';

export function useTickets() {
  return useQuery({
    queryKey: QUERY_KEYS.supportTickets,
    queryFn: () => apiFetch<TicketListItem[]>('/tickets/'),
  });
}

export function useTicket(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.supportTicket(id),
    queryFn: () => apiFetch<Ticket>(`/tickets/${id}`),
    enabled: !!id,
  });
}

interface CreateTicketInput {
  subject: string;
  body: string;
}

export function useCreateTicket() {
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTicketInput) => apiFetch<Ticket>('/tickets/', { method: 'POST', body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.supportTickets });
      toast.success(t.support_created_msg);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t.support_create_error_msg);
    },
  });
}

interface AddTicketMessageInput {
  id: number | string;
  body: string;
}

export function useAddTicketMessage() {
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: AddTicketMessageInput) =>
      apiFetch<Ticket>(`/tickets/${id}/messages`, { method: 'POST', body: { body } }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.supportTicket(variables.id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.supportTickets });
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t.support_message_sent_error_msg);
    },
  });
}
