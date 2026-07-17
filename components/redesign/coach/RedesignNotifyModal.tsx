'use client';

import { useEffect, useState } from 'react';
import { Send, MessageCircle, Smartphone, Layers, X } from 'lucide-react';
import { Button } from '@/components/redesign/ui/Button';
import { useNotifyClients } from '@/hooks/use-coach';
import { ApiError } from '@/lib/api';
import { toast } from '@/store/toast';
import { useLang } from '@/app/i18n/LangContext';
import { cn } from '@/lib/utils';
import type { NotifyChannel } from '@/types';

interface RedesignNotifyModalProps {
  open: boolean;
  onClose: () => void;
  clientIds: number[];
}

const CHANNEL_OPTIONS: { key: NotifyChannel; icon: typeof MessageCircle }[] = [
  { key: 'telegram', icon: MessageCircle },
  { key: 'inapp', icon: Smartphone },
  { key: 'both', icon: Layers },
];

export function RedesignNotifyModal({ open, onClose, clientIds }: RedesignNotifyModalProps) {
  const { t } = useLang();
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<NotifyChannel>('both');

  const { mutate: sendNotification, isPending, error } = useNotifyClients();
  const apiError = error instanceof ApiError ? error.message : null;

  const CHANNEL_LABEL: Record<NotifyChannel, string> = {
    telegram: t.channel_telegram,
    inapp: t.channel_inapp,
    both: t.channel_both,
  };

  useEffect(() => {
    if (!open) return;
    setMessage('');
    setChannel('both');
  }, [open]);

  if (!open) return null;

  const canSubmit = message.trim().length > 0 && clientIds.length > 0 && !isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const trimmed = message.trim();
    sendNotification(
      { client_ids: clientIds, message_en: trimmed, message_fa: trimmed, channel },
      {
        onSuccess: (res) => {
          if (res.failed > 0) {
            toast.error(t.notification_failed);
          } else {
            toast.success(t.notification_sent(res.sent, clientIds.length));
          }
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4">
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">{t.send_notification}</h3>
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
            <label className="text-xs text-[var(--text-muted)]">{t.notification_message}</label>
            <textarea
              className="h-20 w-full resize-none rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[var(--text-muted)]">{t.select_channel}</label>
            <div className="flex w-fit gap-1 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-1">
              {CHANNEL_OPTIONS.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setChannel(key)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs font-medium transition-colors',
                    channel === key
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {CHANNEL_LABEL[key]}
                </button>
              ))}
            </div>
          </div>

          {apiError && <p className="text-sm text-[var(--loss)]">{apiError}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[var(--border-subtle)] px-5 py-3">
          <Button variant="secondary" size="sm" onClick={onClose}>{t.cancel}</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} loading={isPending} disabled={!canSubmit}>
            <Send className="h-3.5 w-3.5" />
            {t.send_to_clients(clientIds.length)}
          </Button>
        </div>
      </div>
    </div>
  );
}
