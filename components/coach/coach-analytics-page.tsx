'use client';

import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';
import { EmptyState } from '@/components/shared';
import { StatCardSkeleton } from '@/components/shared/skeletons';
import { useRosterAnalytics, useCoachEvents } from '@/hooks/use-coach';
import { useLang } from '@/app/i18n/LangContext';
import type { RosterPerformer } from '@/types';

function fmtProfit(n: number | null): string {
  if (n === null) return '—';
  return n >= 0 ? `+$${n.toFixed(2)}` : `-$${Math.abs(n).toFixed(2)}`;
}

function profitColor(n: number | null): string {
  if (n === null) return 'text-[var(--color-text-muted)]';
  return n >= 0 ? 'text-emerald-400' : 'text-red-400';
}

function fmtPct(n: number | null, digits = 1): string {
  return n === null ? '—' : `${n.toFixed(digits)}%`;
}

function Stat({ label, value, color = 'text-[var(--color-cyan)]', delay = 0 }: {
  label: string; value: ReactNode; color?: string; delay?: number;
}) {
  return (
    <motion.div
      className="card-surface rounded-2xl p-4 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <p className="text-[11px] text-[var(--color-text-muted)] mb-1.5">{label}</p>
      <p className={`text-lg font-black leading-none ${color}`}>{value}</p>
    </motion.div>
  );
}

function PerformerRow({ p }: { p: RosterPerformer }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3">
      <p className="font-medium text-[var(--color-text-primary)] truncate">{p.full_name}</p>
      <div className="flex items-center gap-3 flex-shrink-0 text-sm">
        <span className={`font-bold ${profitColor(p.profit)}`}>{fmtProfit(p.profit)}</span>
        <span className="text-[var(--color-text-muted)] hidden sm:inline">{fmtPct(p.win_rate)}</span>
        <span className="text-orange-400 hidden sm:inline">{fmtPct(p.drawdown)}</span>
      </div>
    </div>
  );
}

export function CoachAnalyticsPage() {
  const { t } = useLang();
  const [eventId, setEventId] = useState<number | null>(null);
  const { data, isLoading, isError } = useRosterAnalytics(eventId);
  const { data: events = [] } = useCoachEvents();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)]">{t.roster_analytics}</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{t.roster_analytics_desc}</p>
        </div>

        <select
          value={eventId ?? ''}
          onChange={(e) => setEventId(e.target.value ? Number(e.target.value) : null)}
          aria-label={t.filter_by_event}
          className="input-dark rounded-xl px-3 py-2 text-sm"
        >
          <option value="">{t.all_events}</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>{ev.name}</option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && <p className="text-sm text-[var(--color-status-error)]">{t.coach_error}</p>}

      {!isLoading && !isError && data && data.total_clients === 0 && (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title={t.coach_no_clients}
          description={t.coach_no_clients_desc}
        />
      )}

      {!isLoading && !isError && data && data.total_clients > 0 && (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Stat label={t.coach_tab_clients} value={data.total_clients} delay={0} />
            <Stat label={t.active_clients} value={data.active_clients} color="text-emerald-400" delay={0.03} />
            <Stat label={t.avg_profit} value={fmtProfit(data.avg_profit)} color={profitColor(data.avg_profit)} delay={0.06} />
            <Stat label={t.avg_drawdown} value={fmtPct(data.avg_drawdown)} color="text-orange-400" delay={0.09} />
            <Stat label={t.avg_win_rate} value={fmtPct(data.avg_win_rate)} delay={0.12} />
            <Stat label={t.avg_rr_ratio} value={data.avg_rr_ratio !== null ? data.avg_rr_ratio.toFixed(2) : '—'} delay={0.15} />
          </div>

          {/* Top performers / Needs attention */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              className="card-surface rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div className="px-5 py-3 border-b border-[var(--color-border)] flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <p className="text-sm font-bold text-[var(--color-text-secondary)]">{t.top_performers}</p>
              </div>
              {data.top_performers.length === 0 ? (
                <p className="px-5 py-6 text-sm text-[var(--color-text-muted)] text-center">{t.no_data_yet}</p>
              ) : (
                <div className="divide-y divide-[var(--color-border)]">
                  {data.top_performers.map((p) => (
                    <PerformerRow key={p.client_id} p={p} />
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              className="card-surface rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              <div className="px-5 py-3 border-b border-[var(--color-border)] flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-400" />
                <p className="text-sm font-bold text-[var(--color-text-secondary)]">{t.needs_attention}</p>
              </div>
              {data.needs_attention.length === 0 ? (
                <p className="px-5 py-6 text-sm text-[var(--color-text-muted)] text-center">{t.no_data_yet}</p>
              ) : (
                <div className="divide-y divide-[var(--color-border)]">
                  {data.needs_attention.map((p) => (
                    <PerformerRow key={p.client_id} p={p} />
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Event breakdown */}
          <motion.div
            className="card-surface rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="px-5 py-3 border-b border-[var(--color-border)]">
              <p className="text-sm font-bold text-[var(--color-text-secondary)]">{t.event_breakdown}</p>
            </div>
            {data.by_event.length === 0 ? (
              <p className="px-5 py-6 text-sm text-[var(--color-text-muted)] text-center">{t.no_events_yet}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider">
                      <th className="px-5 py-2 text-right font-medium">{t.event_name}</th>
                      <th className="px-5 py-2 text-center font-medium">{t.coach_tab_clients}</th>
                      <th className="px-5 py-2 text-center font-medium">{t.avg_profit}</th>
                      <th className="px-5 py-2 text-center font-medium">{t.avg_win_rate}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {data.by_event.map((e) => (
                      <tr key={e.event_id}>
                        <td className="px-5 py-3 font-medium text-[var(--color-text-primary)]">{e.event_name}</td>
                        <td className="px-5 py-3 text-center text-[var(--color-text-muted)]">{e.client_count}</td>
                        <td className={`px-5 py-3 text-center font-bold ${profitColor(e.avg_profit)}`}>{fmtProfit(e.avg_profit)}</td>
                        <td className="px-5 py-3 text-center text-[var(--color-cyan)]">{fmtPct(e.avg_win_rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
