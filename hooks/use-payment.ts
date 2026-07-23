'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, ApiError } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import { toast } from '@/store/toast';
import { useLang } from '@/app/i18n/LangContext';
import type {
  PaymentPlan,
  InitiatePaymentResponse,
  VerifyPaymentResponse,
  WalletAddressRow,
  AdminPaymentTransaction,
  FinanceSummary,
  FinancePaymentRow,
  CoachPayoutSummaryRow,
  CoachPayoutBreakdown,
} from '@/types';

// ── Dashboard: billing ──────────────────────────────────────

export function usePaymentPlans() {
  return useQuery({
    queryKey: QUERY_KEYS.paymentPlans,
    queryFn: async () => {
      const data = await apiFetch<{ plans: PaymentPlan[] }>('/payment/plans');
      return data.plans ?? [];
    },
  });
}

export interface InitiatePaymentInput {
  plan_id: number;
  duration_days: number;
  network: string;
}

export function useInitiatePayment() {
  return useMutation({
    mutationFn: (data: InitiatePaymentInput) =>
      apiFetch<InitiatePaymentResponse>('/payment/initiate', { method: 'POST', body: data }),
  });
}

export interface VerifyPaymentInput {
  transaction_id: number;
  txid: string;
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: (data: VerifyPaymentInput) =>
      apiFetch<VerifyPaymentResponse>('/payment/verify', { method: 'POST', body: data }),
  });
}

// ── Admin: wallet addresses ─────────────────────────────────

export function useWalletAddresses() {
  return useQuery({
    queryKey: QUERY_KEYS.walletAddresses,
    queryFn: async () => {
      const data = await apiFetch<{ wallets: WalletAddressRow[] }>('/admin/wallet-addresses');
      return data.wallets ?? [];
    },
  });
}

export function useUpdateWalletAddress() {
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ network, data }: { network: string; data: { address?: string; is_active?: boolean } }) =>
      apiFetch(`/admin/wallet-addresses/${network}`, { method: 'PATCH', body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.walletAddresses });
      toast.success(t.save);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t.error_generic);
    },
  });
}

// ── Admin: transactions ─────────────────────────────────────

export interface AdminTransactionsParams {
  status?: string;
  coachId?: number | null;
  dateFrom?: string;
  dateTo?: string;
  skip?: number;
  limit?: number;
}

export function useAdminTransactions(params: AdminTransactionsParams = {}) {
  const { status, coachId, dateFrom, dateTo, skip = 0, limit = 50 } = params;
  return useQuery({
    queryKey: [...QUERY_KEYS.adminTransactions, status ?? '', coachId ?? '', dateFrom ?? '', dateTo ?? '', skip, limit],
    queryFn: () => {
      const query = new URLSearchParams();
      if (status) query.set('status', status);
      if (coachId != null) query.set('coach_id', String(coachId));
      if (dateFrom) query.set('from_date', dateFrom);
      if (dateTo) query.set('to_date', dateTo);
      query.set('skip', String(skip));
      query.set('limit', String(limit));
      return apiFetch<{ total: number; transactions: AdminPaymentTransaction[] }>(
        `/admin/transactions?${query.toString()}`,
      );
    },
  });
}

export function useConfirmTransaction() {
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: number) =>
      apiFetch(`/admin/transactions/${transactionId}/confirm`, { method: 'POST' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.adminTransactions });
      toast.success(t.admin_tx_confirmed_msg);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t.error_generic);
    },
  });
}

// ── Admin: finance ───────────────────────────────────────────

export function useFinanceSummary() {
  return useQuery({
    queryKey: QUERY_KEYS.financeSummary,
    queryFn: () => apiFetch<FinanceSummary>('/admin/finance/summary'),
  });
}

export interface FinancePaymentsParams {
  status?: string;
  coachId?: number | null;
  dateFrom?: string;
  dateTo?: string;
}

export function useFinancePayments(params: FinancePaymentsParams = {}) {
  const { status, coachId, dateFrom, dateTo } = params;
  return useQuery({
    queryKey: [...QUERY_KEYS.financePayments, status ?? '', coachId ?? '', dateFrom ?? '', dateTo ?? ''],
    queryFn: () => {
      const query = new URLSearchParams();
      if (status) query.set('status', status);
      if (coachId != null) query.set('coach_id', String(coachId));
      if (dateFrom) query.set('from_date', dateFrom);
      if (dateTo) query.set('to_date', dateTo);
      return apiFetch<{ total: number; payments: FinancePaymentRow[] }>(
        `/admin/finance/payments?${query.toString()}`,
      );
    },
  });
}

export function useCoachPayoutsSummary() {
  return useQuery({
    queryKey: QUERY_KEYS.coachPayouts,
    queryFn: async () => {
      const data = await apiFetch<{ coaches: CoachPayoutSummaryRow[] }>('/admin/finance/coach-payouts');
      return data.coaches ?? [];
    },
  });
}

export function useCoachPayoutBreakdown(coachId: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.coachPayoutBreakdown(coachId ?? 0),
    queryFn: () => apiFetch<CoachPayoutBreakdown>(`/admin/finance/coach-payouts/${coachId}/breakdown`),
    enabled: coachId != null,
  });
}

export interface CreateCoachPayoutInput {
  coach_id: number;
  amount_usdt: number;
  note?: string;
  paid_at?: string;
}

export function useCreateCoachPayout() {
  const { t } = useLang();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCoachPayoutInput) =>
      apiFetch('/admin/finance/coach-payouts', { method: 'POST', body: data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.coachPayouts });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.financeSummary });
      toast.success(t.admin_finance_payout_saved_msg);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t.error_generic);
    },
  });
}
