'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { PageHeader } from '@/components/redesign/ui/PageHeader';
import { Badge } from '@/components/redesign/ui/Badge';
import { Button } from '@/components/redesign/ui/Button';
import { Skeleton } from '@/components/redesign/ui/Skeleton';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useLang } from '@/app/i18n/LangContext';
import { useTicket, useAddTicketMessage } from '@/hooks/use-tickets';
import { ROUTES } from '@/lib/constants';
import type { TicketStatus } from '@/types';

const STATUS_VARIANT: Record<TicketStatus, 'accent' | 'warning' | 'neutral'> = {
  open: 'accent',
  in_progress: 'warning',
  closed: 'neutral',
};

interface Props {
  ticketId: string;
}

export function RedesignSupportDetail({ ticketId }: Props) {
  const { t, lang } = useLang();
  const router = useRouter();
  const { data: ticket, isLoading } = useTicket(ticketId);
  const addMessage = useAddTicketMessage();
  const [reply, setReply] = useState('');

  const locale = lang === 'fa' ? 'fa-IR' : 'en-US';

  const statusLabel = (status: TicketStatus) => {
    if (status === 'open') return t.support_status_open;
    if (status === 'in_progress') return t.support_status_in_progress;
    return t.support_status_closed;
  };

  const sendReply = () => {
    if (!reply.trim()) return;
    addMessage.mutate(
      { id: ticketId, body: reply.trim() },
      { onSuccess: () => setReply('') },
    );
  };

  if (isLoading || !ticket) {
    return (
      <div className="space-y-6 pb-16">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        breadcrumb={
          <button
            onClick={() => router.push(ROUTES.support)}
            className="flex items-center gap-1 hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t.support_back_btn}
          </button>
        }
        title={
          <span className="flex items-center gap-3">
            {ticket.subject}
            <Badge variant={STATUS_VARIANT[ticket.status]}>{statusLabel(ticket.status)}</Badge>
          </span>
        }
      />

      <div className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
        {ticket.messages.map((m) => {
          const isUser = m.sender_role === 'user';
          return (
            <div key={m.id} className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[75%] rounded-[var(--radius-md)] px-4 py-3',
                  isUser
                    ? 'bg-[var(--accent-soft)] text-[var(--text-primary)]'
                    : 'bg-[var(--bg-surface-2)] text-[var(--text-primary)]',
                )}
              >
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
                  <span>{isUser ? t.support_you_label : t.support_agent_label}</span>
                  <span className="font-normal">{new Date(m.created_at).toLocaleString(locale)}</span>
                </div>
                <p className="whitespace-pre-wrap text-sm">{m.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      {ticket.status === 'closed' ? (
        <p className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-center text-sm text-[var(--text-muted)]">
          {t.support_closed_notice}
        </p>
      ) : (
        <div className="flex items-end gap-2">
          <Textarea
            className="flex-1"
            placeholder={t.support_reply_placeholder}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={2}
          />
          <Button
            variant="primary"
            loading={addMessage.isPending}
            disabled={!reply.trim()}
            onClick={sendReply}
          >
            <Send className="h-4 w-4" />
            {t.support_send_btn}
          </Button>
        </div>
      )}
    </div>
  );
}
