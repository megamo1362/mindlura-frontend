'use client';

import { useState } from 'react';
import { Bell, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InlineLoader, EmptyState } from '@/components/shared';
import { useCoachNotifications } from '@/hooks/use-coach';
import { useLang } from '@/app/i18n/LangContext';
import type { SentChannel } from '@/types';

const CHANNEL_VARIANT: Record<SentChannel, 'cyan' | 'blue' | 'purple' | 'gray'> = {
  telegram: 'blue',
  inapp: 'purple',
  both: 'cyan',
  inapp_only: 'gray',
};

export function CoachNotificationsPage() {
  const { t, lang } = useLang();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useCoachNotifications(page, 20);

  const items = data?.items ?? [];
  const pages = data?.pages ?? 1;

  const CHANNEL_LABEL: Record<SentChannel, string> = {
    telegram: t.channel_telegram,
    inapp: t.channel_inapp,
    both: t.channel_both,
    inapp_only: t.channel_inapp,
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text-primary)]">{t.notifications_history}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{t.notifications_history_desc}</p>
      </div>

      {isLoading && <InlineLoader />}
      {isError && <p className="text-sm text-[var(--color-status-error)]">{t.coach_error}</p>}

      {!isLoading && !isError && items.length === 0 && (
        <EmptyState
          icon={<Bell className="h-6 w-6" />}
          title={t.no_notifications}
        />
      )}

      {!isLoading && items.length > 0 && (
        <div className="card-surface rounded-2xl overflow-hidden">
          <div className="divide-y divide-[var(--color-border)]">
            {items.map((n) => (
              <div key={n.id} className="px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-[var(--color-text-primary)]">
                      {n.client_name ?? `#${n.client_id}`}
                    </span>
                    <Badge variant={CHANNEL_VARIANT[n.channel]}>{CHANNEL_LABEL[n.channel]}</Badge>
                    <Badge variant={n.is_read ? 'green' : 'yellow'}>
                      {n.is_read ? t.notification_read : t.notification_unread}
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] truncate">
                    {lang === 'fa' ? n.message_fa : n.message_en}
                  </p>
                </div>
                {n.sent_at && (
                  <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0">
                    {new Date(n.sent_at).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US')}
                  </span>
                )}
              </div>
            ))}
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border)]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
                {t.trades_prev}
              </Button>
              <span className="text-xs text-[var(--color-text-muted)]">{page} / {pages}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page >= pages}
              >
                {t.trades_next}
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
