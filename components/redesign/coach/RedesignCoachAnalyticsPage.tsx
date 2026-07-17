'use client';

import { useState } from 'react';
import { TrendingDown, TrendingUp, Users } from 'lucide-react';
import { PageHeader } from '@/components/redesign/ui/PageHeader';
import { StatCard } from '@/components/redesign/ui/StatCard';
import { StatCardSkeletonRow } from '@/components/redesign/ui/Skeleton';
import { Card } from '@/components/redesign/ui/Card';
import { DataTable, type DataTableColumn } from '@/components/redesign/ui/DataTable';
import { EmptyState } from '@/components/redesign/ui/EmptyState';
import { useRosterAnalytics, useCoachEvents } from '@/hooks/use-coach';
import { formatCurrency } from '@/lib/utils';
import { useLang } from '@/app/i18n/LangContext';
import type { RosterEventBreakdown, RosterPerformer } from '@/types';

function PerformerRow({ p }: { p: RosterPerformer }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3">
      <p className="truncate text-sm font-medium text-[var(--text-primary)]">{p.full_name}</p>
      <div className="flex flex-shrink-0 items-center gap-3 text-sm">
        <span className={`rd-tabular font-semibold ${p.profit === null ? 'text-[var(--text-muted)]' : p.profit >= 0 ? 'text-[var(--profit)]' : 'text-[var(--loss)]'}`}>
          {p.profit === null ? '—' : `${p.profit >= 0 ? '+' : ''}${formatCurrency(p.profit)}`}
        </span>
        <span className="hidden rd-tabular text-[var(--text-muted)] sm:inline">{p.win_rate === null ? '—' : `${p.win_rate.toFixed(1)}%`}</span>
        <span className="hidden rd-tabular text-[var(--warning)] sm:inline">{p.drawdown === null ? '—' : `${p.drawdown.toFixed(1)}%`}</span>
      </div>
    </div>
  );
}

export function RedesignCoachAnalyticsPage() {
  const { t } = useLang();
  const [eventId, setEventId] = useState<number | null>(null);
  const { data, isLoading, isError } = useRosterAnalytics(eventId);
  const { data: events = [] } = useCoachEvents();

  const eventColumns: DataTableColumn<RosterEventBreakdown>[] = [
    { key: 'event', header: t.event_name, render: (e) => e.event_name },
    { key: 'clients', header: t.coach_tab_clients, numeric: true, render: (e) => e.client_count },
    {
      key: 'profit',
      header: t.avg_profit,
      numeric: true,
      render: (e) => (
        <span className={e.avg_profit === null ? 'text-[var(--text-muted)]' : e.avg_profit >= 0 ? 'text-[var(--profit)]' : 'text-[var(--loss)]'}>
          {e.avg_profit === null ? '—' : `${e.avg_profit >= 0 ? '+' : ''}${formatCurrency(e.avg_profit)}`}
        </span>
      ),
    },
    {
      key: 'win_rate',
      header: t.avg_win_rate,
      numeric: true,
      render: (e) => <span className="text-[var(--accent)]">{e.avg_win_rate === null ? '—' : `${e.avg_win_rate.toFixed(1)}%`}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.roster_analytics}
        description={t.roster_analytics_desc}
        actions={
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
        }
      />

      {isLoading && <StatCardSkeletonRow count={6} />}

      {isError && (
        <div className="rounded-[var(--radius-md)] border border-[var(--loss)]/30 bg-[var(--loss-soft)] px-4 py-3 text-sm text-[var(--loss)]">
          {t.coach_error}
        </div>
      )}

      {!isLoading && !isError && data && data.total_clients === 0 && (
        <EmptyState icon={<Users className="h-5 w-5" />} title={t.coach_no_clients} description={t.coach_no_clients_desc} />
      )}

      {!isLoading && !isError && data && data.total_clients > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            <StatCard label={t.coach_tab_clients} value={data.total_clients} />
            <StatCard label={t.active_clients} value={data.active_clients} trendPositive />
            <StatCard
              label={t.avg_profit}
              value={data.avg_profit === null ? '—' : formatCurrency(data.avg_profit)}
              trendPositive={data.avg_profit === null ? undefined : data.avg_profit >= 0}
            />
            <StatCard label={t.avg_drawdown} value={data.avg_drawdown === null ? '—' : `${data.avg_drawdown.toFixed(1)}%`} />
            <StatCard label={t.avg_win_rate} value={data.avg_win_rate === null ? '—' : `${data.avg_win_rate.toFixed(1)}%`} />
            <StatCard label={t.avg_rr_ratio} value={data.avg_rr_ratio === null ? '—' : data.avg_rr_ratio.toFixed(2)} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card
              padded={false}
              title={
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[var(--profit)]" />
                  {t.top_performers}
                </span>
              }
            >
              {data.top_performers.length === 0 ? (
                <p className="px-5 py-6 text-center text-sm text-[var(--text-muted)]">{t.no_data_yet}</p>
              ) : (
                <div className="divide-y divide-[var(--border-subtle)]">
                  {data.top_performers.map((p) => (
                    <PerformerRow key={p.client_id} p={p} />
                  ))}
                </div>
              )}
            </Card>

            <Card
              padded={false}
              title={
                <span className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-[var(--loss)]" />
                  {t.needs_attention}
                </span>
              }
            >
              {data.needs_attention.length === 0 ? (
                <p className="px-5 py-6 text-center text-sm text-[var(--text-muted)]">{t.no_data_yet}</p>
              ) : (
                <div className="divide-y divide-[var(--border-subtle)]">
                  {data.needs_attention.map((p) => (
                    <PerformerRow key={p.client_id} p={p} />
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-2">
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">{t.event_breakdown}</h3>
            <DataTable
              columns={eventColumns}
              rows={data.by_event}
              rowKey={(e) => e.event_id}
              emptyTitle={t.no_events_yet}
            />
          </div>
        </div>
      )}
    </div>
  );
}
