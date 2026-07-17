'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/redesign/ui/Button';
import { useCreateCoachEvent, useUpdateCoachEvent, useGenerateEventCode } from '@/hooks/use-coach';
import { ApiError } from '@/lib/api';
import { useLang } from '@/app/i18n/LangContext';
import type { CoachEvent } from '@/types';

const EVENT_CODE_PATTERN = /^[A-Z0-9]{4,20}$/;

interface RedesignEventModalProps {
  open: boolean;
  onClose: () => void;
  event?: CoachEvent | null;
}

export function RedesignEventModal({ open, onClose, event }: RedesignEventModalProps) {
  const { t } = useLang();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventCode, setEventCode] = useState('');

  const { mutate: generateCode, isPending: generating } = useGenerateEventCode();
  const { mutate: createEvent, isPending: creating, error: createError } = useCreateCoachEvent();
  const { mutate: updateEvent, isPending: updating, error: updateError } = useUpdateCoachEvent();

  const isEdit = !!event;
  const saving = creating || updating;
  const apiError = createError ?? updateError;
  const errorMessage = apiError instanceof ApiError ? apiError.message : null;

  useEffect(() => {
    if (!open) return;
    if (event) {
      setName(event.name);
      setDescription(event.description ?? '');
      setEventCode(event.event_code);
    } else {
      setName('');
      setDescription('');
      setEventCode('');
      generateCode(undefined, { onSuccess: (data) => setEventCode(data.event_code) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, event]);

  if (!open) return null;

  const handleRegenerate = () => {
    generateCode(undefined, { onSuccess: (data) => setEventCode(data.event_code) });
  };

  const nameValid = name.trim().length > 0 && name.trim().length <= 100;
  const codeValid = isEdit || EVENT_CODE_PATTERN.test(eventCode);
  const canSubmit = nameValid && codeValid && !saving;

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (isEdit && event) {
      updateEvent({ id: event.id, data: { name: name.trim(), description: description.trim() || null } }, { onSuccess: onClose });
    } else {
      createEvent({ name: name.trim(), description: description.trim() || null, event_code: eventCode }, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4">
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">{isEdit ? t.edit_event : t.new_event}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--text-muted)]">{t.event_name}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.event_name_placeholder}
              maxLength={100}
              className="h-9 w-full rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[var(--text-muted)]">{t.event_description}</label>
            <textarea
              className="h-20 w-full resize-none rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.event_description_placeholder}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[var(--text-muted)]">{t.event_code}</label>
            {isEdit ? (
              <div className="w-fit rounded-[var(--radius-sm)] border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3 py-2 font-mono text-sm font-bold tracking-widest text-[var(--accent)]">
                {eventCode}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <input
                    value={eventCode}
                    onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                    maxLength={20}
                    className="h-9 flex-1 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 font-mono text-sm tracking-widest text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={handleRegenerate} loading={generating} disabled={generating}>
                    <RefreshCw className="h-3.5 w-3.5" />
                    {t.regenerate_code}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--text-muted)]">{t.event_code_hint}</p>
                  <p className="rd-tabular text-xs text-[var(--text-muted)]">{eventCode.length}/20</p>
                </div>
              </>
            )}
          </div>

          {errorMessage && <p className="text-sm text-[var(--loss)]">{errorMessage}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--border-subtle)] px-5 py-3">
          <Button variant="secondary" size="sm" onClick={onClose}>{t.cancel}</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} loading={saving} disabled={!canSubmit}>
            {isEdit ? t.edit_event : t.create_event}
          </Button>
        </div>
      </div>
    </div>
  );
}
