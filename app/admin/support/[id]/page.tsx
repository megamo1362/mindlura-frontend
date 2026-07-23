'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useLang } from '@/app/i18n/LangContext';
import { cn } from '@/lib/utils';
import type { AdminTicket, TicketStatus } from '@/types';

const STATUS_VARIANT: Record<TicketStatus, 'blue' | 'yellow' | 'gray'> = {
  open: 'blue',
  in_progress: 'yellow',
  closed: 'gray',
};

export default function AdminSupportTicketPage() {
  const { t, lang } = useLang();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const ticketId = params.id;
  const locale = lang === 'fa' ? 'fa-IR' : 'en-US';

  const [ticket, setTicket] = useState<AdminTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusLabel = (status: TicketStatus) => {
    if (status === 'open') return t.support_status_open;
    if (status === 'in_progress') return t.support_status_in_progress;
    return t.support_status_closed;
  };

  const fetchTicket = () => {
    setLoading(true);
    setError('');
    apiFetch<AdminTicket>(`/admin/tickets/${ticketId}`)
      .then((d) => setTicket(d))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : t.error_generic))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await apiFetch(`/admin/tickets/${ticketId}/reply`, { method: 'POST', body: { body: reply.trim() } });
      setReply('');
      fetchTicket();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t.admin_support_reply_error_msg);
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (status: TicketStatus) => {
    setUpdatingStatus(true);
    try {
      await apiFetch(`/admin/tickets/${ticketId}/status`, { method: 'PATCH', body: { status } });
      fetchTicket();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t.admin_support_status_error_msg);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading || !ticket) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-64 rounded-lg" />
        <div className="skeleton h-40 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <button
            onClick={() => router.push('/admin/support')}
            className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t.support_back_btn}
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">{ticket.subject}</h1>
            <Badge variant={STATUS_VARIANT[ticket.status]} dot>
              {statusLabel(ticket.status)}
            </Badge>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">{ticket.user_email}</p>
        </div>

        <div className="w-48">
          <Select
            value={ticket.status}
            onValueChange={(v) => updateStatus(v as TicketStatus)}
            disabled={updatingStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder={t.admin_support_status_label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">{t.support_status_open}</SelectItem>
              <SelectItem value="in_progress">{t.support_status_in_progress}</SelectItem>
              <SelectItem value="closed">{t.support_status_closed}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-[rgba(239,68,68,0.3)] bg-[var(--color-danger-dim)] px-4 py-3 text-sm text-[var(--color-danger)]">
          {error}
        </div>
      )}

      <div className="glass rounded-2xl border border-[var(--color-border)] p-4 space-y-4">
        {ticket.messages.map((m) => {
          const isAdmin = m.sender_role === 'admin';
          return (
            <div key={m.id} className={cn('flex', isAdmin ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[75%] rounded-xl px-4 py-3',
                  isAdmin ? 'bg-[var(--color-cyan-dim)]' : 'bg-[var(--color-elevated)]',
                )}
              >
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-[var(--color-text-muted)]">
                  <span>{isAdmin ? t.support_agent_label : ticket.user_email}</span>
                  <span className="font-normal">{new Date(m.created_at).toLocaleString(locale)}</span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-[var(--color-text-primary)]">{m.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-end gap-2">
        <Textarea
          className="flex-1"
          placeholder={t.admin_support_reply_placeholder}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={2}
        />
        <Button loading={sending} disabled={!reply.trim()} onClick={sendReply}>
          <Send className="w-4 h-4" />
          {t.admin_support_reply_btn}
        </Button>
      </div>
    </div>
  );
}
