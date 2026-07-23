'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { useLang } from '@/app/i18n/LangContext';
import { useAdminTransactions, useConfirmTransaction } from '@/hooks/use-payment';
import type { AdminPaymentTransaction, PaymentStatus } from '@/types';

const STATUS_BADGE: Record<PaymentStatus, 'green' | 'yellow' | 'red' | 'gray'> = {
  confirmed: 'green',
  pending: 'yellow',
  failed: 'red',
  duplicate: 'gray',
};

export default function AdminTransactionsPage() {
  const { t, lang } = useLang();
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [confirmTarget, setConfirmTarget] = useState<AdminPaymentTransaction | null>(null);

  const { data, isLoading } = useAdminTransactions({ status: status || undefined, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined });
  const confirmTx = useConfirmTransaction();

  const transactions = data?.transactions ?? [];

  const statusLabel = (s: PaymentStatus) => ({
    pending: t.admin_tx_status_pending,
    confirmed: t.admin_tx_status_confirmed,
    failed: t.admin_tx_status_failed,
    duplicate: t.admin_tx_status_duplicate,
  })[s];

  const doConfirm = async () => {
    if (!confirmTarget) return;
    await confirmTx.mutateAsync(confirmTarget.id);
    setConfirmTarget(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t.admin_tx_title}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{t.admin_tx_sub}</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue placeholder={t.admin_tx_filter_all} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t.admin_tx_filter_all}</SelectItem>
            <SelectItem value="pending">{t.admin_tx_status_pending}</SelectItem>
            <SelectItem value="confirmed">{t.admin_tx_status_confirmed}</SelectItem>
            <SelectItem value="failed">{t.admin_tx_status_failed}</SelectItem>
            <SelectItem value="duplicate">{t.admin_tx_status_duplicate}</SelectItem>
          </SelectContent>
        </Select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="h-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-glass)] px-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-cyan)]"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="h-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-glass)] px-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-cyan)]"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden border border-[var(--color-border)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-deep)] text-[var(--color-text-muted)]">
                <th className="px-4 py-3 text-right">{t.admin_tx_col_date}</th>
                <th className="px-4 py-3 text-right">{t.admin_tx_col_user}</th>
                <th className="px-4 py-3 text-center">{t.admin_tx_col_plan}</th>
                <th className="px-4 py-3 text-center">{t.admin_tx_col_duration}</th>
                <th className="px-4 py-3 text-center">{t.admin_tx_col_network}</th>
                <th className="px-4 py-3 text-center">{t.admin_tx_col_txid}</th>
                <th className="px-4 py-3 text-center">{t.admin_tx_col_amount}</th>
                <th className="px-4 py-3 text-center">{t.admin_tx_col_coach}</th>
                <th className="px-4 py-3 text-center">{t.admin_tx_col_coach_share}</th>
                <th className="px-4 py-3 text-center">{t.admin_tx_col_status}</th>
                <th className="px-4 py-3 text-center">{t.admin_tx_col_actions}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-[var(--color-border)] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-[var(--color-text-muted)] text-xs whitespace-nowrap">
                    {new Date(tx.created_at).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US')}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)] text-xs">{tx.user_email || '—'}</td>
                  <td className="px-4 py-3 text-center text-xs text-[var(--color-text-muted)]">{tx.plan_name || '—'}</td>
                  <td className="px-4 py-3 text-center text-xs text-[var(--color-text-muted)]">{tx.duration_days}d</td>
                  <td className="px-4 py-3 text-center text-xs">{tx.network}</td>
                  <td className="px-4 py-3 text-center font-mono text-[10px] text-[var(--color-text-muted)] max-w-[140px] truncate" title={tx.txid || ''}>
                    {tx.txid || '—'}
                  </td>
                  <td className="px-4 py-3 text-center text-xs font-bold text-[var(--color-text-primary)]">
                    {(tx.verified_amount ?? tx.expected_amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-[var(--color-text-muted)]">{tx.coach_email || '—'}</td>
                  <td className="px-4 py-3 text-center text-xs text-[var(--color-text-muted)]">
                    {tx.coach_share_usdt != null ? `${tx.coach_share_usdt.toFixed(2)} (${tx.coach_share_percent}%)` : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={STATUS_BADGE[tx.status]} dot>{statusLabel(tx.status)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {tx.status !== 'confirmed' && (
                      <Button variant="secondary" size="sm" onClick={() => setConfirmTarget(tx)}>
                        {t.admin_tx_confirm_btn}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
                    {t.no_data_available}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!confirmTarget} onOpenChange={(open) => { if (!open) setConfirmTarget(null); }}>
        <DialogContent size="sm">
          <DialogHeader><DialogTitle>{t.admin_tx_confirm_confirm_title}</DialogTitle></DialogHeader>
          <p className="text-sm text-[var(--color-text-secondary)]">{t.admin_tx_confirm_confirm_body}</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmTarget(null)}>{t.cancel}</Button>
            <Button onClick={doConfirm} loading={confirmTx.isPending}>
              <CheckCircle2 className="w-4 h-4" />
              {t.admin_tx_confirm_btn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
