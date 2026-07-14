'use client';

import { useEffect, useState } from 'react';
import { Send, MessageCircle, Smartphone, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useNotifyClients } from '@/hooks/use-coach';
import { ApiError } from '@/lib/api';
import { toast } from '@/store/toast';
import { useLang } from '@/app/i18n/LangContext';
import type { NotifyChannel } from '@/types';

interface NotificationComposeModalProps {
  open: boolean;
  onClose: () => void;
  clientIds: number[];
}

const CHANNEL_OPTIONS: { key: NotifyChannel; icon: typeof MessageCircle }[] = [
  { key: 'telegram', icon: MessageCircle },
  { key: 'inapp', icon: Smartphone },
  { key: 'both', icon: Layers },
];

export function NotificationComposeModal({ open, onClose, clientIds }: NotificationComposeModalProps) {
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
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{t.send_notification}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--color-text-muted)]">{t.notification_message}</label>
            <textarea
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)] resize-none h-20 focus:outline-none focus:border-[var(--color-cyan)]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[var(--color-text-muted)]">{t.select_channel}</label>
            <div className="flex gap-1 p-1 rounded-xl w-fit bg-[rgba(0,0,0,0.3)] border border-[var(--color-border)]">
              {CHANNEL_OPTIONS.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setChannel(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    channel === key
                      ? 'bg-[var(--color-cyan-dim)] text-[var(--color-cyan)] border border-[rgba(0,212,255,0.2)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {CHANNEL_LABEL[key]}
                </button>
              ))}
            </div>
          </div>

          {apiError && <p className="text-sm text-[var(--color-status-error)]">{apiError}</p>}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>{t.cancel}</Button>
          <Button onClick={handleSubmit} loading={isPending} disabled={!canSubmit}>
            <Send className="h-3.5 w-3.5 ml-1" />
            {t.send_to_clients(clientIds.length)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
