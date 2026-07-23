'use client';

import { Fragment, useState } from 'react';
import { Wallet, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { useLang } from '@/app/i18n/LangContext';
import {
  useFinanceSummary, useFinancePayments, useCoachPayoutsSummary,
  useCoachPayoutBreakdown, useCreateCoachPayout,
} from '@/hooks/use-payment';
import type { CoachPayoutSummaryRow, PaymentStatus } from '@/types';

const STATUS_BADGE: Record<PaymentStatus, 'green' | 'yellow' | 'red' | 'gray'> = {
  confirmed: 'green',
  pending: 'yellow',
  failed: 'red',
  duplicate: 'gray',
};

function StatBlock({ label, allTime, month }: { label: string; allTime: number; month: number }) {
  return (
    <div className="glass rounded-2xl p-5 border border-[var(--color-border)]">
      <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-2">{label}</p>
      <p className="text-2xl font-black text-[var(--color-text-primary)]">{allTime.toFixed(2)} <span className="text-sm font-medium text-[var(--color-text-muted)]">USDT</span></p>
      <p className="text-xs text-[var(--color-text-muted)] mt-1">{month.toFixed(2)} USDT</p>
    </div>
  );
}

function exportCsv(rows: Record<string, unknown>[], filename: string) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminFinancePage() {
  const { t, lang } = useLang();

  const { data: summary, isLoading: summaryLoading } = useFinanceSummary();
  const { data: paymentsData, isLoading: paymentsLoading } = useFinancePayments();
  const { data: coaches = [], isLoading: coachesLoading } = useCoachPayoutsSummary();

  const [expandedCoach, setExpandedCoach] = useState<number | null>(null);
  const [payoutTarget, setPayoutTarget] = useState<CoachPayoutSummaryRow | null>(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutNote, setPayoutNote] = useState('');
  const [payoutDate, setPayoutDate] = useState('');

  const { data: breakdown } = useCoachPayoutBreakdown(expandedCoach);
  const createPayout = useCreateCoachPayout();

  const payments = paymentsData?.payments ?? [];

  const statusLabel = (s: PaymentStatus) => ({
    pending: t.admin_tx_status_pending,
    confirmed: t.admin_tx_status_confirmed,
    failed: t.admin_tx_status_failed,
    duplicate: t.admin_tx_status_duplicate,
  })[s];

  const openPayoutModal = (coach: CoachPayoutSummaryRow) => {
    setPayoutTarget(coach);
    setPayoutAmount(coach.pending > 0 ? coach.pending.toFixed(2) : '');
    setPayoutNote('');
    setPayoutDate('');
  };

  const savePayout = async () => {
    if (!payoutTarget) return;
    await createPayout.mutateAsync({
      coach_id: payoutTarget.coach_id,
      amount_usdt: parseFloat(payoutAmount) || 0,
      note: payoutNote || undefined,
      paid_at: payoutDate ? new Date(payoutDate).toISOString() : undefined,
    });
    setPayoutTarget(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t.admin_finance_title}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{t.admin_finance_sub}</p>
      </div>

      {summaryLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBlock label={t.admin_finance_total_revenue} allTime={summary?.total_revenue.all_time ?? 0} month={summary?.total_revenue.month ?? 0} />
          <StatBlock label={t.admin_finance_total_paid_coaches} allTime={summary?.total_paid_to_coaches.all_time ?? 0} month={summary?.total_paid_to_coaches.month ?? 0} />
          <StatBlock label={t.admin_finance_pending_payouts} allTime={summary?.pending_coach_payouts.all_time ?? 0} month={summary?.pending_coach_payouts.month ?? 0} />
          <StatBlock label={t.admin_finance_net_revenue} allTime={summary?.net_revenue.all_time ?? 0} month={summary?.net_revenue.month ?? 0} />
        </div>
      )}

      {/* Client Payments */}
      <div className="glass rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">
            {t.admin_finance_client_payments_title}
          </h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => exportCsv(
              payments.map((p) => ({
                date: p.created_at, client: p.user_email ?? '', plan: p.plan_name ?? '',
                duration_days: p.duration_days, amount_usdt: p.amount_usdt, network: p.network,
                coach: p.coach_email ?? '', coach_pct: p.coach_percent ?? '', coach_usdt: p.coach_usdt,
                mindlura_usdt: p.mindlura_usdt, status: p.status,
              })),
              'mindlura-payments.csv',
            )}
          >
            <Download className="w-3.5 h-3.5" />
            {t.admin_finance_export_csv}
          </Button>
        </div>
        {paymentsLoading ? (
          <div className="p-4 space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-10 rounded-xl" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-deep)] text-[var(--color-text-muted)]">
                  <th className="px-4 py-3 text-right">{t.admin_tx_col_date}</th>
                  <th className="px-4 py-3 text-right">{t.admin_finance_col_client}</th>
                  <th className="px-4 py-3 text-center">{t.admin_finance_col_plan}</th>
                  <th className="px-4 py-3 text-center">{t.admin_finance_col_duration}</th>
                  <th className="px-4 py-3 text-center">{t.admin_finance_col_amount}</th>
                  <th className="px-4 py-3 text-center">{t.admin_finance_col_network}</th>
                  <th className="px-4 py-3 text-center">{t.admin_finance_col_coach}</th>
                  <th className="px-4 py-3 text-center">{t.admin_finance_col_coach_pct}</th>
                  <th className="px-4 py-3 text-center">{t.admin_finance_col_coach_usdt}</th>
                  <th className="px-4 py-3 text-center">{t.admin_finance_col_mindlura_usdt}</th>
                  <th className="px-4 py-3 text-center">{t.admin_finance_col_status}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-[var(--color-border)]">
                    <td className="px-4 py-3 text-xs text-[var(--color-text-muted)] whitespace-nowrap">
                      {new Date(p.created_at).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--color-text-secondary)]">{p.user_email || '—'}</td>
                    <td className="px-4 py-3 text-center text-xs text-[var(--color-text-muted)]">{p.plan_name || '—'}</td>
                    <td className="px-4 py-3 text-center text-xs text-[var(--color-text-muted)]">{p.duration_days}d</td>
                    <td className="px-4 py-3 text-center text-xs font-bold text-[var(--color-text-primary)]">{p.amount_usdt.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center text-xs">{p.network}</td>
                    <td className="px-4 py-3 text-center text-xs text-[var(--color-text-muted)]">{p.coach_email || t.admin_finance_no_coach}</td>
                    <td className="px-4 py-3 text-center text-xs text-[var(--color-text-muted)]">{p.coach_percent != null ? `${p.coach_percent}%` : '—'}</td>
                    <td className="px-4 py-3 text-center text-xs text-[var(--color-text-muted)]">{p.coach_usdt.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center text-xs font-bold text-[var(--color-success)]">{p.mindlura_usdt.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center"><Badge variant={STATUS_BADGE[p.status]} dot>{statusLabel(p.status)}</Badge></td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr><td colSpan={11} className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">{t.no_data_available}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Coach Payouts */}
      <div className="glass rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">
            {t.admin_finance_coach_payouts_title}
          </h2>
        </div>
        {coachesLoading ? (
          <div className="p-4 space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-10 rounded-xl" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-deep)] text-[var(--color-text-muted)]">
                  <th className="px-4 py-3 text-right">{t.admin_finance_coach_col_name}</th>
                  <th className="px-4 py-3 text-right">{t.admin_finance_coach_col_email}</th>
                  <th className="px-4 py-3 text-center">{t.admin_finance_coach_col_active_clients}</th>
                  <th className="px-4 py-3 text-center">{t.admin_finance_coach_col_earned}</th>
                  <th className="px-4 py-3 text-center">{t.admin_finance_coach_col_paid}</th>
                  <th className="px-4 py-3 text-center">{t.admin_finance_coach_col_pending}</th>
                  <th className="px-4 py-3 text-center">{t.admin_finance_coach_col_action}</th>
                </tr>
              </thead>
              <tbody>
                {coaches.map((c) => (
                  <Fragment key={c.coach_id}>
                    <tr className="border-t border-[var(--color-border)]">
                      <td className="px-4 py-3 text-xs text-[var(--color-text-secondary)]">
                        <button
                          type="button"
                          className="flex items-center gap-1 hover:text-[var(--color-cyan)]"
                          onClick={() => setExpandedCoach((prev) => (prev === c.coach_id ? null : c.coach_id))}
                        >
                          {expandedCoach === c.coach_id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          {c.full_name || '—'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">{c.email}</td>
                      <td className="px-4 py-3 text-center text-xs text-[var(--color-text-muted)]">{c.active_clients}</td>
                      <td className="px-4 py-3 text-center text-xs font-bold text-[var(--color-text-primary)]">{c.total_earned.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center text-xs text-[var(--color-text-muted)]">{c.already_paid.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center text-xs font-bold text-[var(--color-warning)]">{c.pending.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <Button variant="secondary" size="sm" onClick={() => openPayoutModal(c)}>
                          <Wallet className="w-3.5 h-3.5" />
                          {t.admin_finance_mark_paid_btn}
                        </Button>
                      </td>
                    </tr>
                    {expandedCoach === c.coach_id && (
                      <tr className="border-t border-[var(--color-border)] bg-white/[0.02]">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                              <p className="font-semibold text-[var(--color-text-secondary)] mb-2">{t.admin_finance_client_payments_title}</p>
                              <div className="space-y-1 max-h-48 overflow-y-auto">
                                {(breakdown?.payments ?? []).map((pmt) => (
                                  <div key={pmt.id} className="flex justify-between text-[var(--color-text-muted)]">
                                    <span>{pmt.user_email} · {pmt.plan_name}</span>
                                    <span>{pmt.coach_usdt.toFixed(2)} USDT</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold text-[var(--color-text-secondary)] mb-2">{t.admin_finance_coach_payouts_title}</p>
                              <div className="space-y-1 max-h-48 overflow-y-auto">
                                {(breakdown?.payouts ?? []).map((po) => (
                                  <div key={po.id} className="flex justify-between text-[var(--color-text-muted)]">
                                    <span>{new Date(po.paid_at).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')} {po.note ? `· ${po.note}` : ''}</span>
                                    <span>{po.amount_usdt.toFixed(2)} USDT</span>
                                  </div>
                                ))}
                                {(breakdown?.payouts ?? []).length === 0 && <p className="text-[var(--color-text-muted)]">—</p>}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
                {coaches.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">{t.no_data_available}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!payoutTarget} onOpenChange={(open) => { if (!open) setPayoutTarget(null); }}>
        <DialogContent size="sm">
          <DialogHeader><DialogTitle>{t.admin_finance_mark_paid_title}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input
              label={t.admin_finance_payout_amount_label}
              type="number" min={0} step={0.01}
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
            />
            <Input
              label={t.admin_finance_payout_note_label}
              value={payoutNote}
              onChange={(e) => setPayoutNote(e.target.value)}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--color-text-muted)]">{t.admin_finance_payout_date_label}</label>
              <input
                type="date"
                value={payoutDate}
                onChange={(e) => setPayoutDate(e.target.value)}
                className="w-full h-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-deep)] px-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-cyan)]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setPayoutTarget(null)}>{t.cancel}</Button>
            <Button onClick={savePayout} loading={createPayout.isPending}>{t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
