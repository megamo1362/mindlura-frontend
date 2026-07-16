'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, Search, Users } from 'lucide-react';
import { PageHeader } from '@/components/redesign/ui/PageHeader';
import { StatCard } from '@/components/redesign/ui/StatCard';
import { StatCardSkeletonRow } from '@/components/redesign/ui/Skeleton';
import { DataTable, type DataTableColumn } from '@/components/redesign/ui/DataTable';
import { Badge } from '@/components/redesign/ui/Badge';
import { useMyClients, useRosterAnalytics, type ClientSortBy, type SortDir } from '@/hooks/use-coach';
import { useDebounce } from '@/hooks/use-debounce';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import { useLang } from '@/app/i18n/LangContext';
import type { CoachClient } from '@/types';

export function RedesignCoachClientsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState<ClientSortBy>('joined_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const debouncedSearch = useDebounce(searchInput, 300);
  const { t } = useLang();

  const { data: clients = [], isLoading, isError } = useMyClients({
    search: debouncedSearch || undefined,
    sortBy,
    sortDir,
  });
  const { data: roster, isLoading: rosterLoading } = useRosterAnalytics();

  const columns: DataTableColumn<CoachClient>[] = [
    {
      key: 'client',
      header: t.coach_tab_clients,
      render: (c) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]">
            {getInitials(c.display_label || c.client_full_name || c.client_email)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[var(--text-primary)]">
              {c.display_label || c.client_full_name || c.client_email}
            </p>
            <p className="truncate text-xs text-[var(--text-muted)]">{c.client_email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'plan',
      header: t.profile_plan,
      render: (c) =>
        c.plan_name ? <Badge variant="accent">{c.plan_name}</Badge> : <span className="text-[var(--text-muted)]">—</span>,
    },
    {
      key: 'profit',
      header: t.sort_profit,
      numeric: true,
      sortable: true,
      sortValue: (c) => c.profit ?? 0,
      render: (c) =>
        c.profit === null ? (
          '—'
        ) : (
          <span className={c.profit >= 0 ? 'text-[var(--profit)]' : 'text-[var(--loss)]'}>
            {c.profit >= 0 ? '+' : ''}
            {formatCurrency(c.profit)}
          </span>
        ),
    },
    {
      key: 'win_rate',
      header: t.sort_win_rate,
      numeric: true,
      sortable: true,
      sortValue: (c) => c.win_rate ?? 0,
      render: (c) => (c.win_rate === null ? '—' : `${c.win_rate.toFixed(1)}%`),
    },
    {
      key: 'drawdown',
      header: t.sort_drawdown,
      numeric: true,
      sortable: true,
      sortValue: (c) => c.drawdown ?? 0,
      render: (c) => (c.drawdown === null ? '—' : <span className="text-[var(--loss)]">{c.drawdown.toFixed(2)}%</span>),
    },
    {
      key: 'trades',
      header: t.sort_trade_count,
      numeric: true,
      sortable: true,
      sortValue: (c) => c.trade_count ?? 0,
      render: (c) => c.trade_count ?? '—',
    },
    {
      key: 'connected',
      header: t.sort_joined_date,
      sortable: true,
      sortValue: (c) => c.connected_since ?? '',
      render: (c) => formatDate(c.connected_since),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t.coach_panel_title} description={t.coach_panel_desc} />

      {rosterLoading && <StatCardSkeletonRow count={4} />}
      {!rosterLoading && roster && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label={t.coach_tab_clients} value={roster.total_clients} />
          <StatCard label={t.account_active} value={roster.active_clients} trendPositive />
          <StatCard
            label={t.sort_profit}
            value={roster.avg_profit === null ? '—' : formatCurrency(roster.avg_profit)}
            trendPositive={(roster.avg_profit ?? 0) >= 0}
          />
          <StatCard label={t.sort_win_rate} value={roster.avg_win_rate === null ? '—' : `${roster.avg_win_rate.toFixed(1)}%`} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t.search_clients}
            className="h-9 w-full rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] ps-9 pe-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as ClientSortBy)}
          className="h-9 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
        >
          <option value="joined_at">{t.sort_joined_date}</option>
          <option value="profit">{t.sort_profit}</option>
          <option value="drawdown">{t.sort_drawdown}</option>
          <option value="win_rate">{t.sort_win_rate}</option>
          <option value="rr_ratio">{t.sort_rr_ratio}</option>
          <option value="trade_count">{t.sort_trade_count}</option>
        </select>
        <button
          type="button"
          onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          aria-label={t.sort_direction}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)]"
        >
          {sortDir === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {isError ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--loss)]/30 bg-[var(--loss-soft)] px-4 py-3 text-sm text-[var(--loss)]">
          {t.coach_error}
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={clients}
          rowKey={(c) => c.client_coach_id}
          loading={isLoading}
          emptyIcon={<Users className="h-5 w-5" />}
          emptyTitle={debouncedSearch ? t.no_clients_found : t.coach_no_clients}
          emptyDescription={!debouncedSearch ? t.coach_no_clients_desc : undefined}
        />
      )}
    </div>
  );
}
