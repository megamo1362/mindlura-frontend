'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Search, Send, Users } from 'lucide-react';
import { PageHeader } from '@/components/redesign/ui/PageHeader';
import { StatCard } from '@/components/redesign/ui/StatCard';
import { StatCardSkeletonRow } from '@/components/redesign/ui/Skeleton';
import { DataTable, type DataTableColumn } from '@/components/redesign/ui/DataTable';
import { Badge } from '@/components/redesign/ui/Badge';
import { Button } from '@/components/redesign/ui/Button';
import { Tabs } from '@/components/redesign/ui/Tabs';
import { RedesignInviteCodes } from './RedesignInviteCodes';
import { RedesignNotifyModal } from './RedesignNotifyModal';
import {
  useMyClients, useRosterAnalytics, useCoachEvents, useCoachPurchases,
  type ClientSortBy, type SortDir,
} from '@/hooks/use-coach';
import { useDebounce } from '@/hooks/use-debounce';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import { useLang } from '@/app/i18n/LangContext';
import type { CoachClient } from '@/types';

type Tab = 'clients' | 'invite-codes';

export function RedesignCoachClientsPage() {
  const [tab, setTab] = useState<Tab>('clients');
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState<ClientSortBy>('joined_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [eventId, setEventId] = useState<number | null>(null);
  const debouncedSearch = useDebounce(searchInput, 300);
  const { t } = useLang();

  const { data: clients = [], isLoading, isError } = useMyClients({
    search: debouncedSearch || undefined,
    sortBy,
    sortDir,
    eventId,
  });
  const { data: roster, isLoading: rosterLoading } = useRosterAnalytics();
  const { data: events = [] } = useCoachEvents();
  const { data: purchases, isLoading: purchasesLoading } = useCoachPurchases({ limit: 1 });

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const allSelected = clients.length > 0 && selectedIds.length === clients.length;

  const toggleSelect = (clientId: number) => {
    setSelectedIds((prev) => (prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]));
  };

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : clients.map((c) => c.client_id));
  };

  const columns: DataTableColumn<CoachClient>[] = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleSelectAll}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 cursor-pointer rounded border-[var(--border-subtle)] accent-[var(--accent)]"
          aria-label={t.select_all}
        />
      ),
      width: '40px',
      render: (c) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(c.client_id)}
          onChange={() => toggleSelect(c.client_id)}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 cursor-pointer rounded border-[var(--border-subtle)] accent-[var(--accent)]"
        />
      ),
    },
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
      key: 'connected',
      header: t.sort_joined_date,
      sortable: true,
      sortValue: (c) => c.connected_since ?? '',
      render: (c) => formatDate(c.connected_since),
    },
    {
      key: 'action',
      header: '',
      render: (c) => (
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/dashboard/coach/clients/${c.client_id}`}>{t.coach_view_client}</Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      <PageHeader title={t.coach_panel_title} description={t.coach_panel_desc} />

      {(rosterLoading || purchasesLoading) && <StatCardSkeletonRow count={4} />}
      {!rosterLoading && !purchasesLoading && roster && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label={t.coach_tab_clients} value={roster.total_clients} />
          <StatCard label={t.active_clients} value={roster.active_clients} trendPositive />
          <StatCard
            label={t.avg_profit}
            value={roster.avg_profit === null ? '—' : formatCurrency(roster.avg_profit)}
            trendPositive={(roster.avg_profit ?? 0) >= 0}
          />
          <StatCard
            label={t.your_commission}
            value={purchases ? formatCurrency(purchases.summary.coach_commission) : '—'}
          />
        </div>
      )}

      <Tabs
        tabs={[
          { key: 'clients', label: t.coach_tab_clients, count: clients.length },
          { key: 'invite-codes', label: t.coach_tab_codes },
        ]}
        activeKey={tab}
        onChange={(k) => setTab(k as Tab)}
      />

      <AnimatePresence mode="wait">
        {tab === 'clients' && (
          <motion.div key="clients" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
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
                aria-label={t.sort_by}
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
              <select
                value={eventId ?? ''}
                onChange={(e) => setEventId(e.target.value ? Number(e.target.value) : null)}
                aria-label={t.filter_by_event}
                className="h-9 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="">{t.all_events}</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.name}</option>
                ))}
              </select>
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
                emptyTitle={debouncedSearch || eventId !== null ? t.no_clients_found : t.coach_no_clients}
                emptyDescription={!debouncedSearch && eventId === null ? t.coach_no_clients_desc : undefined}
              />
            )}
          </motion.div>
        )}

        {tab === 'invite-codes' && (
          <motion.div key="invite-codes" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RedesignInviteCodes />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tab === 'clients' && selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-3 shadow-xl"
          >
            <span className="text-sm text-[var(--text-muted)]">{t.notification_selected_count(selectedIds.length)}</span>
            <Button variant="primary" size="sm" onClick={() => setNotifyOpen(true)}>
              <Send className="h-3.5 w-3.5" />
              {t.send_to_clients(selectedIds.length)}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <RedesignNotifyModal
        open={notifyOpen}
        onClose={() => { setNotifyOpen(false); setSelectedIds([]); }}
        clientIds={selectedIds}
      />
    </div>
  );
}
