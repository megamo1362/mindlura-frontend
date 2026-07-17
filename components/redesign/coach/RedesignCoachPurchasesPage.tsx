'use client';

import { useMemo, useState } from 'react';
import { ArrowUpDown, DollarSign, Percent, Receipt, ShoppingBag, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/redesign/ui/PageHeader';
import { StatCard } from '@/components/redesign/ui/StatCard';
import { Card } from '@/components/redesign/ui/Card';
import { Badge } from '@/components/redesign/ui/Badge';
import { Button } from '@/components/redesign/ui/Button';
import { DataTable, type DataTableColumn } from '@/components/redesign/ui/DataTable';
import { useCoachPurchases, useCoachEvents, useMyClients } from '@/hooks/use-coach';
import { PLAN_LABELS } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useLang } from '@/app/i18n/LangContext';
import type { CoachPurchase } from '@/types';

const PLAN_FILTER_SLUGS = ['pro', 'elite', 'basic'] as const;
const PAGE_LIMIT = 20;

export function RedesignCoachPurchasesPage() {
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
    const match = clients.find((c) => (c.client_full_name ?? c.client_email).toLowerCase() === term);
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

  const sortHeader = (label: string, field: 'date' | 'amount') => (
    <button type="button" onClick={() => toggleSort(field)} className="inline-flex items-center gap-1 hover:text-[var(--text-secondary)]">
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  const columns: DataTableColumn<CoachPurchase>[] = [
    { key: 'client', header: t.coach_tab_clients, render: (p) => <span className="font-medium text-[var(--text-primary)]">{p.client_name}</span> },
    { key: 'plan', header: t.filter_plan, render: (p) => <Badge variant="accent">{p.plan_name}</Badge> },
    {
      key: 'amount',
      header: sortHeader(t.purchase_amount, 'amount'),
      numeric: true,
      render: (p) => <span className="font-semibold text-[var(--profit)]">{formatCurrency(p.amount, p.currency)}</span>,
    },
    {
      key: 'date',
      header: sortHeader(t.purchase_date, 'date'),
      numeric: true,
      render: (p) => formatDate(p.purchased_at, lang === 'fa' ? 'fa-IR' : 'en-US'),
    },
    { key: 'event', header: t.event_name, render: (p) => p.event_name ?? '—' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t.client_purchases} description={t.client_purchases_desc} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label={t.total_revenue} value={summary ? formatCurrency(summary.total_revenue) : '—'} icon={<DollarSign className="h-4 w-4" />} loading={isLoading} />
        <StatCard label={t.commission_rate} value={summary ? `${summary.commission_rate}%` : '—'} icon={<Percent className="h-4 w-4" />} loading={isLoading} />
        <StatCard label={t.your_commission} value={summary ? formatCurrency(summary.coach_commission) : '—'} icon={<Wallet className="h-4 w-4" />} trendPositive loading={isLoading} />
        <StatCard label={t.total_purchases_count} value={summary ? summary.total_purchases : '—'} icon={<Receipt className="h-4 w-4" />} loading={isLoading} />
      </div>

      <Card className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-muted)]">{t.filter_date_from}</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="h-9 w-full rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-muted)]">{t.filter_date_to}</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="h-9 w-full rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-muted)]">{t.filter_plan}</label>
            <select
              value={planSlug}
              onChange={(e) => { setPlanSlug(e.target.value); setPage(1); }}
              className="h-9 w-full rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="">{t.all_plans}</option>
              {PLAN_FILTER_SLUGS.map((slug) => (
                <option key={slug} value={slug}>{PLAN_LABELS[slug]}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-muted)]">{t.filter_by_event}</label>
            <select
              value={eventId}
              onChange={(e) => { setEventId(e.target.value); setPage(1); }}
              className="h-9 w-full rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="">{t.all_events}</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-muted)]">{t.coach_tab_clients}</label>
            <input
              list="rd-coach-purchases-client-list"
              value={clientSearch}
              onChange={(e) => { setClientSearch(e.target.value); setPage(1); }}
              className="h-9 w-full rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
            <datalist id="rd-coach-purchases-client-list">
              {clients.map((c) => (
                <option key={c.client_id} value={c.client_full_name ?? c.client_email} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" onClick={resetFilters}>{t.reset_filters}</Button>
        </div>
      </Card>

      {isError ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--loss)]/30 bg-[var(--loss-soft)] px-4 py-3 text-sm text-[var(--loss)]">
          {t.coach_error}
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          rowKey={(p) => p.id}
          loading={isLoading}
          emptyIcon={<ShoppingBag className="h-5 w-5" />}
          emptyTitle={t.no_purchases_yet}
        />
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between">
          <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
            {t.trades_prev}
          </Button>
          <span className="rd-tabular text-xs text-[var(--text-muted)]">{page} / {pages}</span>
          <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages}>
            {t.trades_next}
          </Button>
        </div>
      )}

      {summary && summary.total_purchases > 0 && <p className="text-xs text-[var(--text-muted)]">{t.commission_note}</p>}
    </div>
  );
}
