'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight, ChevronLeft, ArrowUpDown, DollarSign, Percent, Wallet, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatCard, EmptyState, InlineLoader } from '@/components/shared';
import { useLang } from '@/app/i18n/LangContext';
import { useCoachPurchases, useCoachEvents, useMyClients } from '@/hooks/use-coach';
import { PLAN_LABELS } from '@/lib/constants';

const PLAN_FILTER_SLUGS = ['pro', 'elite', 'basic'] as const;
const PAGE_LIMIT = 20;

function fmtAmount(amount: number, currency: string): string {
  const prefix = currency === 'USD' ? '$' : '';
  return `${prefix}${amount.toFixed(2)}`;
}

export function CoachPurchasesPage() {
  const { t, lang } = useLang();

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [planSlug, setPlanSlug] = useState('');
  const [eventId, setEventId] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const { data: events = [] } = useCoachEvents();
  const { data: clients = [] } = useMyClients();

  const clientId = useMemo(() => {
    const term = clientSearch.trim().toLowerCase();
    if (!term) return null;
    const match = clients.find(
      (c) => (c.client_full_name ?? c.client_email).toLowerCase() === term,
    );
    return match ? match.client_id : null;
  }, [clients, clientSearch]);

  const { data, isLoading, isError } = useCoachPurchases({
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    planSlug: planSlug || undefined,
    eventId: eventId ? Number(eventId) : null,
    clientId,
    sortBy,
    sortDir,
    page,
    limit: PAGE_LIMIT,
  });

  const items = data?.items ?? [];
  const pages = data?.pages ?? 1;
  const summary = data?.summary;

  const resetFilters = () => {
    setDateFrom('');
    setDateTo('');
    setPlanSlug('');
    setEventId('');
    setClientSearch('');
    setPage(1);
  };

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
    setPage(1);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text-primary)]">{t.client_purchases}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{t.client_purchases_desc}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label={t.total_revenue}
          value={summary ? fmtAmount(summary.total_revenue, 'USD') : '—'}
          icon={<DollarSign className="w-4 h-4" />}
          loading={isLoading}
        />
        <StatCard
          label={t.commission_rate}
          value={summary ? `${summary.commission_rate}%` : '—'}
          icon={<Percent className="w-4 h-4" />}
          loading={isLoading}
        />
        <StatCard
          label={t.your_commission}
          value={summary ? fmtAmount(summary.coach_commission, 'USD') : '—'}
          icon={<Wallet className="w-4 h-4" />}
          accentColor="var(--color-success)"
          loading={isLoading}
        />
        <StatCard
          label={t.total_purchases_count}
          value={summary ? summary.total_purchases : '—'}
          icon={<Receipt className="w-4 h-4" />}
          loading={isLoading}
        />
      </div>

      {/* Filters */}
      <div className="card-surface rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Input
            type="date"
            label={t.filter_date_from}
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
          />
          <Input
            type="date"
            label={t.filter_date_to}
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--color-text-muted)]">{t.filter_plan}</label>
            <select
              value={planSlug}
              onChange={(e) => { setPlanSlug(e.target.value); setPage(1); }}
              className="input-dark rounded-xl px-3 py-2 text-sm w-full h-10"
            >
              <option value="">{t.all_plans}</option>
              {PLAN_FILTER_SLUGS.map((slug) => (
                <option key={slug} value={slug}>{PLAN_LABELS[slug]}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--color-text-muted)]">{t.filter_by_event}</label>
            <select
              value={eventId}
              onChange={(e) => { setEventId(e.target.value); setPage(1); }}
              className="input-dark rounded-xl px-3 py-2 text-sm w-full h-10"
            >
              <option value="">{t.all_events}</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Input
              label={t.coach_tab_clients}
              list="coach-purchases-client-list"
              value={clientSearch}
              onChange={(e) => { setClientSearch(e.target.value); setPage(1); }}
            />
            <datalist id="coach-purchases-client-list">
              {clients.map((c) => (
                <option key={c.client_id} value={c.client_full_name ?? c.client_email} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" onClick={resetFilters}>{t.reset_filters}</Button>
        </div>
      </div>

      {/* Table */}
      {isLoading && <InlineLoader />}
      {isError && <p className="text-sm text-[var(--color-status-error)]">{t.coach_error}</p>}

      {!isLoading && !isError && items.length === 0 && (
        <EmptyState icon={<ShoppingBag className="h-6 w-6" />} title={t.no_purchases_yet} />
      )}

      {!isLoading && !isError && items.length > 0 && (
        <motion.div
          className="card-surface rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider">
                  <th className="px-5 py-2 text-right font-medium">{t.coach_tab_clients}</th>
                  <th className="px-5 py-2 text-right font-medium">{t.filter_plan}</th>
                  <th className="px-5 py-2 text-center font-medium">
                    <button
                      type="button"
                      onClick={() => toggleSort('amount')}
                      className="inline-flex items-center gap-1 hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      {t.purchase_amount}
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-5 py-2 text-center font-medium">
                    <button
                      type="button"
                      onClick={() => toggleSort('date')}
                      className="inline-flex items-center gap-1 hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      {t.purchase_date}
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-5 py-2 text-center font-medium">{t.event_name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {items.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3 font-medium text-[var(--color-text-primary)]">{p.client_name}</td>
                    <td className="px-5 py-3 text-[var(--color-text-muted)]">{p.plan_name}</td>
                    <td className="px-5 py-3 text-center font-bold text-emerald-400">{fmtAmount(p.amount, p.currency)}</td>
                    <td className="px-5 py-3 text-center text-[var(--color-text-muted)]">
                      {new Date(p.purchased_at).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}
                    </td>
                    <td className="px-5 py-3 text-center text-[var(--color-cyan)]">{p.event_name ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border)]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
                {t.trades_prev}
              </Button>
              <span className="text-xs text-[var(--color-text-muted)]">{page} / {pages}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page >= pages}
              >
                {t.trades_next}
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {summary && summary.total_purchases > 0 && (
        <p className="text-xs text-[var(--color-text-muted)]">{t.commission_note}</p>
      )}
    </div>
  );
}
