'use client';

import { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InlineLoader, EmptyState } from '@/components/shared';
import { EventCard } from './event-card';
import { EventModal } from './event-modal';
import { useCoachEvents, useDeleteCoachEvent } from '@/hooks/use-coach';
import { useLang } from '@/app/i18n/LangContext';
import type { CoachEvent } from '@/types';

export function CoachEventsPage() {
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
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)]">{t.my_events}</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{t.my_events_desc}</p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5 ml-1" />
          {t.new_event}
        </Button>
      </div>

      {isLoading && <InlineLoader />}
      {isError && <p className="text-sm text-[var(--color-status-error)]">{t.coach_error}</p>}

      {!isLoading && !isError && events.length === 0 && (
        <EmptyState
          icon={<Calendar className="h-6 w-6" />}
          title={t.no_events_yet}
          description={t.no_events_description}
        />
      )}

      {!isLoading && events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event, i) => (
            <EventCard
              key={event.id}
              event={event}
              index={i}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <EventModal open={modalOpen} onClose={() => setModalOpen(false)} event={editingEvent} />
    </div>
  );
}
