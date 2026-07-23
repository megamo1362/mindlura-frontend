'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLang } from '@/app/i18n/LangContext';
import { formatDate } from '@/lib/utils';
import type { AdminTicketListItem, TicketStatus } from '@/types';

const STATUS_VARIANT: Record<TicketStatus, 'blue' | 'yellow' | 'gray'> = {
  open: 'blue',
  in_progress: 'yellow',
  closed: 'gray',
};

type FilterValue = 'all' | TicketStatus;

export default function AdminSupportPage() {
  const { t, lang } = useLang();
  const router = useRouter();
  const locale = lang === 'fa' ? 'fa-IR' : 'en-US';

  const [tickets, setTickets] = useState<AdminTicketListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterValue>('all');

  const statusLabel = (status: TicketStatus) => {
    if (status === 'open') return t.support_status_open;
    if (status === 'in_progress') return t.support_status_in_progress;
    return t.support_status_closed;
  };

  useEffect(() => {
    setLoading(true);
    setError('');
    const qs = filter === 'all' ? '' : `?status=${filter}`;
    apiFetch<AdminTicketListItem[]>(`/admin/tickets/${qs}`)
      .then((d) => setTickets(d ?? []))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : t.error_generic))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t.admin_support_title}</h1>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterValue)}>
          <TabsList variant="pills">
            <TabsTrigger value="all">{t.admin_support_filter_all}</TabsTrigger>
            <TabsTrigger value="open">{t.admin_support_filter_open}</TabsTrigger>
            <TabsTrigger value="in_progress">{t.admin_support_filter_in_progress}</TabsTrigger>
            <TabsTrigger value="closed">{t.admin_support_filter_closed}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-[rgba(239,68,68,0.3)] bg-[var(--color-danger-dim)] px-4 py-3 text-sm text-[var(--color-danger)]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
      ) : tickets.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-[var(--color-border)]">
          <p className="text-[var(--color-text-muted)]">{t.admin_support_no_tickets}</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-deep)] text-[var(--color-text-muted)]">
                <th className="px-4 py-3 text-right">{t.admin_support_col_user}</th>
                <th className="px-4 py-3 text-right">{t.admin_support_col_subject}</th>
                <th className="px-4 py-3 text-center">{t.admin_support_col_status}</th>
                <th className="px-4 py-3 text-center">{t.admin_support_col_messages}</th>
                <th className="px-4 py-3 text-center">{t.admin_support_col_date}</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => router.push(`/admin/support/${ticket.id}`)}
                  className="border-t border-[var(--color-border)] hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{ticket.user_email || '—'}</td>
                  <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">{ticket.subject}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={STATUS_VARIANT[ticket.status]} dot>
                      {statusLabel(ticket.status)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-[var(--color-text-secondary)]">{ticket.message_count}</td>
                  <td className="px-4 py-3 text-center text-[var(--color-text-muted)]">
                    {formatDate(ticket.created_at, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
