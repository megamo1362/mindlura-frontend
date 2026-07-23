'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/redesign/ui/PageHeader';
import { DataTable, type DataTableColumn } from '@/components/redesign/ui/DataTable';
import { Badge } from '@/components/redesign/ui/Badge';
import { Button } from '@/components/redesign/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLang } from '@/app/i18n/LangContext';
import { useTickets, useCreateTicket } from '@/hooks/use-tickets';
import { ROUTES } from '@/lib/constants';
import type { TicketListItem, TicketStatus } from '@/types';

const STATUS_VARIANT: Record<TicketStatus, 'accent' | 'warning' | 'neutral'> = {
  open: 'accent',
  in_progress: 'warning',
  closed: 'neutral',
};

export function RedesignSupportPage() {
  const { t, lang } = useLang();
  const router = useRouter();
  const { data: tickets = [], isLoading } = useTickets();
  const createTicket = useCreateTicket();

  const [showNew, setShowNew] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const locale = lang === 'fa' ? 'fa-IR' : 'en-US';

  const statusLabel = (status: TicketStatus) => {
    if (status === 'open') return t.support_status_open;
    if (status === 'in_progress') return t.support_status_in_progress;
    return t.support_status_closed;
  };

  const submitNewTicket = () => {
    if (!subject.trim() || !body.trim()) return;
    createTicket.mutate(
      { subject: subject.trim(), body: body.trim() },
      {
        onSuccess: () => {
          setShowNew(false);
          setSubject('');
          setBody('');
        },
      },
    );
  };

  const columns: DataTableColumn<TicketListItem>[] = [
    { key: 'subject', header: t.support_col_subject, render: (row) => row.subject },
    {
      key: 'status',
      header: t.support_col_status,
      render: (row) => <Badge variant={STATUS_VARIANT[row.status]}>{statusLabel(row.status)}</Badge>,
    },
    {
      key: 'message_count',
      header: t.support_col_messages,
      numeric: true,
      render: (row) => row.message_count,
    },
    {
      key: 'created_at',
      header: t.support_col_date,
      render: (row) => new Date(row.created_at).toLocaleDateString(locale),
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title={t.support_title}
        description={t.support_desc}
        actions={
          <Button variant="primary" size="md" onClick={() => setShowNew(true)}>
            <Plus className="h-4 w-4" />
            {t.support_new_ticket_btn}
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={tickets}
        rowKey={(row) => row.id}
        loading={isLoading}
        emptyTitle={t.support_no_tickets_title}
        emptyDescription={t.support_no_tickets_desc}
        onRowClick={(row) => router.push(ROUTES.supportTicket(row.id))}
      />

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>{t.support_new_ticket_title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              label={t.support_subject_label}
              placeholder={t.support_subject_placeholder}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Textarea
              label={t.support_message_label}
              placeholder={t.support_message_placeholder}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowNew(false)}>
              {t.cancel}
            </Button>
            <Button
              variant="primary"
              loading={createTicket.isPending}
              disabled={!subject.trim() || !body.trim()}
              onClick={submitNewTicket}
            >
              {t.support_submit_btn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
