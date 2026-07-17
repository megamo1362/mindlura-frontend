'use client';

import { useState } from 'react';
import { Calendar, Check, Copy, Pencil, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/redesign/ui/PageHeader';
import { Card } from '@/components/redesign/ui/Card';
import { Badge } from '@/components/redesign/ui/Badge';
import { Button } from '@/components/redesign/ui/Button';
import { EmptyState } from '@/components/redesign/ui/EmptyState';
import { Skeleton } from '@/components/redesign/ui/Skeleton';
import { RedesignEventModal } from './RedesignEventModal';
import { useCoachEvents, useDeleteCoachEvent, useUpdateCoachEvent } from '@/hooks/use-coach';
import { useLang } from '@/app/i18n/LangContext';
import type { CoachEvent } from '@/types';

function RedesignEventCard({ event, onEdit, onDelete }: { event: CoachEvent; onEdit: (e: CoachEvent) => void; onDelete: (e: CoachEvent) => void }) {
  const { t, lang } = useLang();
  const [copied, setCopied] = useState(false);
  const { mutate: updateEvent, isPending: toggling } = useUpdateCoachEvent();

  const handleCopy = () => {
    navigator.clipboard.writeText(event.event_code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const createdDate = new Date(event.created_at).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US');
  const canDelete = event.client_count === 0;

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="truncate text-[16px] font-semibold text-[var(--text-primary)]">{event.name}</h3>
        <button
          type="button"
          disabled={toggling}
          onClick={() => updateEvent({ id: event.id, data: { is_active: !event.is_active } })}
          aria-label={t.event_toggle_active}
          className="flex-shrink-0"
        >
          <Badge variant={event.is_active ? 'profit' : 'neutral'}>{event.is_active ? t.event_active : t.event_inactive}</Badge>
        </button>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex w-fit items-center gap-2 self-start rounded-full border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-2.5 py-1 font-mono text-xs font-bold tracking-widest text-[var(--accent)] transition-colors hover:brightness-110"
      >
        {event.event_code}
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </button>

      {event.description && <p className="line-clamp-2 text-sm text-[var(--text-muted)]">{event.description}</p>}

      <Badge variant="accent" className="w-fit">{t.clients_joined(event.client_count)}</Badge>

      <p className="text-xs text-[var(--text-muted)]">{t.event_created_at(createdDate)}</p>

      <div className="flex items-center gap-2 border-t border-[var(--border-subtle)] pt-3">
        <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(event)}>
          <Pencil className="h-3.5 w-3.5" />
          {t.edit}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(event)}
          disabled={!canDelete}
          title={!canDelete ? t.delete_event_has_clients : undefined}
          className={canDelete ? 'text-[var(--loss)] hover:bg-[var(--loss-soft)]' : ''}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}

export function RedesignCoachEventsPage() {
  const { t } = useLang();
  const { data: events = [], isLoading, isError } = useCoachEvents();
  const { mutate: deleteEvent } = useDeleteCoachEvent();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CoachEvent | null>(null);

  const openCreate = () => {
    setEditingEvent(null);
    setModalOpen(true);
  };

  const openEdit = (event: CoachEvent) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleDelete = (event: CoachEvent) => {
    if (window.confirm(t.delete_event_confirm)) {
      deleteEvent(event.id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.my_events}
        description={t.my_events_desc}
        actions={
          <Button variant="primary" size="sm" onClick={openCreate}>
            <Plus className="h-3.5 w-3.5" />
            {t.new_event}
          </Button>
        }
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
              <Skeleton className="mb-3 h-5 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-[var(--radius-md)] border border-[var(--loss)]/30 bg-[var(--loss-soft)] px-4 py-3 text-sm text-[var(--loss)]">
          {t.coach_error}
        </div>
      )}

      {!isLoading && !isError && events.length === 0 && (
        <EmptyState icon={<Calendar className="h-5 w-5" />} title={t.no_events_yet} description={t.no_events_description} />
      )}

      {!isLoading && events.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <RedesignEventCard key={event.id} event={event} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <RedesignEventModal open={modalOpen} onClose={() => setModalOpen(false)} event={editingEvent} />
    </div>
  );
}
