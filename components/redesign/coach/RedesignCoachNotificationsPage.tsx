'use client';

import { useState } from 'react';
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/redesign/ui/PageHeader';
import { Card } from '@/components/redesign/ui/Card';
import { Badge, type BadgeVariant } from '@/components/redesign/ui/Badge';
import { Button } from '@/components/redesign/ui/Button';
import { EmptyState } from '@/components/redesign/ui/EmptyState';
import { Skeleton } from '@/components/redesign/ui/Skeleton';
import { useCoachNotifications } from '@/hooks/use-coach';
import { useLang } from '@/app/i18n/LangContext';
import type { SentChannel } from '@/types';

const CHANNEL_VARIANT: Record<SentChannel, BadgeVariant> = {
  telegram: 'accent',
  inapp: 'neutral',
  both: 'accent',
  inapp_only: 'neutral',
};

export function RedesignCoachNotificationsPage() {
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
    <div className="space-y-6">
      <PageHeader title={t.notifications_history} description={t.notifications_history_desc} />

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-[var(--radius-md)] border border-[var(--loss)]/30 bg-[var(--loss-soft)] px-4 py-3 text-sm text-[var(--loss)]">
          {t.coach_error}
        </div>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <EmptyState icon={<Bell className="h-5 w-5" />} title={t.no_notifications} />
      )}

      {!isLoading && items.length > 0 && (
        <Card
          padded={false}
          footer={
            pages > 1 ? (
              <div className="flex items-center justify-between">
                <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                  <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  {t.trades_prev}
                </Button>
                <span className="rd-tabular text-xs text-[var(--text-muted)]">{page} / {pages}</span>
                <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages}>
                  {t.trades_next}
                  <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" />
                </Button>
              </div>
            ) : undefined
          }
        >
          <div className="divide-y divide-[var(--border-subtle)]">
            {items.map((n) => (
              <div key={n.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{n.client_name ?? `#${n.client_id}`}</span>
                    <Badge variant={CHANNEL_VARIANT[n.channel]}>{CHANNEL_LABEL[n.channel]}</Badge>
                    {!n.is_read && <Badge variant="warning">{t.notification_unread}</Badge>}
                  </div>
                  <p className="truncate text-sm text-[var(--text-muted)]">{lang === 'fa' ? n.message_fa : n.message_en}</p>
                </div>
                {n.sent_at && (
                  <span className="flex-shrink-0 text-xs text-[var(--text-muted)]">
                    {new Date(n.sent_at).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
