'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tooltip } from '@/components/ui/tooltip';
import { useUpdateCoachEvent } from '@/hooks/use-coach';
import { useLang } from '@/app/i18n/LangContext';
import type { CoachEvent } from '@/types';

interface EventCardProps {
  event: CoachEvent;
  index?: number;
  onEdit: (event: CoachEvent) => void;
  onDelete: (event: CoachEvent) => void;
}

export function EventCard({ event, index = 0, onEdit, onDelete }: EventCardProps) {
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
    <motion.div
      className="card-surface rounded-2xl p-5 flex flex-col gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-lg text-[var(--color-text-primary)] truncate">{event.name}</h3>
        <Switch
          checked={event.is_active}
          disabled={toggling}
          onCheckedChange={(checked) => updateEvent({ id: event.id, data: { is_active: checked } })}
        />
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-2 self-start px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-widest bg-[rgba(0,212,255,0.12)] text-[var(--color-cyan)] border border-[rgba(0,212,255,0.25)] hover:bg-[rgba(0,212,255,0.2)] transition-colors"
      >
        {event.event_code}
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </button>

      {event.description && (
        <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">{event.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={event.is_active ? 'green' : 'gray'}>
          {event.is_active ? t.event_active : t.event_inactive}
        </Badge>
        <Badge variant="purple">{t.clients_joined(event.client_count)}</Badge>
      </div>

      <p className="text-xs text-[var(--color-text-muted)]/60">{t.event_created_at(createdDate)}</p>

      <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-border)]">
        <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(event)}>
          <Pencil className="h-3.5 w-3.5 ml-1" />
          {t.edit}
        </Button>
        {canDelete ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(event)}
            className="text-[var(--color-status-error)] hover:bg-[rgba(239,68,68,0.08)]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Tooltip content={t.delete_event_has_clients}>
            <span>
              <Button variant="ghost" size="sm" disabled className="text-[var(--color-text-muted)]">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </span>
          </Tooltip>
        )}
      </div>
    </motion.div>
  );
}
