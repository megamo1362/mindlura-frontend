'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  useCreateCoachEvent,
  useUpdateCoachEvent,
  useGenerateEventCode,
} from '@/hooks/use-coach';
import { ApiError } from '@/lib/api';
import { useLang } from '@/app/i18n/LangContext';
import type { CoachEvent } from '@/types';

const EVENT_CODE_PATTERN = /^[A-Z0-9]{4,20}$/;

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  event?: CoachEvent | null;
}

export function EventModal({ open, onClose, event }: EventModalProps) {
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
  }, [open, event]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRegenerate = () => {
    generateCode(undefined, { onSuccess: (data) => setEventCode(data.event_code) });
  };

  const nameValid = name.trim().length > 0 && name.trim().length <= 100;
  const codeValid = isEdit || EVENT_CODE_PATTERN.test(eventCode);
  const canSubmit = nameValid && codeValid && !saving;

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (isEdit && event) {
      updateEvent(
        { id: event.id, data: { name: name.trim(), description: description.trim() || null } },
        { onSuccess: onClose },
      );
    } else {
      createEvent(
        { name: name.trim(), description: description.trim() || null, event_code: eventCode },
        { onSuccess: onClose },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{isEdit ? t.edit_event : t.new_event}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            label={t.event_name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.event_name_placeholder}
            maxLength={100}
          />

          <div className="space-y-1.5">
            <label className="text-xs text-[var(--color-text-muted)]">{t.event_description}</label>
            <textarea
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)] resize-none h-20 focus:outline-none focus:border-[var(--color-cyan)]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.event_description_placeholder}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[var(--color-text-muted)]">{t.event_code}</label>
            {isEdit ? (
              <div className="font-mono text-sm font-bold tracking-widest text-[var(--color-cyan)] px-3 py-2 rounded-xl bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.2)] w-fit">
                {eventCode}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Input
                    value={eventCode}
                    onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                    maxLength={20}
                    className="font-mono tracking-widest"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleRegenerate}
                    loading={generating}
                    disabled={generating}
                  >
                    <RefreshCw className="h-3.5 w-3.5 ml-1" />
                    {t.regenerate_code}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--color-text-muted)]">{t.event_code_hint}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{eventCode.length}/20</p>
                </div>
              </>
            )}
          </div>

          {errorMessage && <p className="text-sm text-[var(--color-status-error)]">{errorMessage}</p>}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>{t.cancel}</Button>
          <Button onClick={handleSubmit} loading={saving} disabled={!canSubmit}>
            {isEdit ? t.edit_event : t.create_event}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
