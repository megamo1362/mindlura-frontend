'use client';

import Link from 'next/link';
import { ArrowRight, BarChart2, BookOpen, Users } from 'lucide-react';
import { PageHeader } from '@/components/redesign/ui/PageHeader';
import { StatCard } from '@/components/redesign/ui/StatCard';
import { StatCardSkeletonRow } from '@/components/redesign/ui/Skeleton';
import { Card } from '@/components/redesign/ui/Card';
import { Badge } from '@/components/redesign/ui/Badge';
import { Button } from '@/components/redesign/ui/Button';
import { EmptyState } from '@/components/redesign/ui/EmptyState';
import { useMyClients } from '@/hooks/use-coach';
import { formatCurrency, getInitials } from '@/lib/utils';
import { useLang } from '@/app/i18n/LangContext';
import type { CoachClientAccount } from '@/types';

function getDisplayName(client: { display_mode: string; display_label: string | null; client_full_name: string | null; client_email: string }): string {
  const fallback = client.client_full_name || client.client_email;
  if (client.display_mode === 'email') return client.client_email;
  if (client.display_mode === 'both') {
    const name = client.display_label || fallback;
    return `${name} (${client.client_email})`;
  }
  return client.display_label || fallback;
}

const PERMISSIONS: { key: keyof CoachClientAccount; labelKey: 'perm_balance' | 'perm_trades' | 'perm_analysis' | 'perm_journal' }[] = [
  { key: 'allow_balance', labelKey: 'perm_balance' },
  { key: 'allow_trades', labelKey: 'perm_trades' },
  { key: 'allow_analysis', labelKey: 'perm_analysis' },
  { key: 'allow_journal', labelKey: 'perm_journal' },
];

export function RedesignCoachClientDetail({ clientId }: { clientId: string }) {
  const { t } = useLang();
  const { data: clients = [], isLoading } = useMyClients();
  const client = clients.find((c) => String(c.client_id) === clientId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <StatCardSkeletonRow count={1} />
        <StatCardSkeletonRow count={4} />
      </div>
    );
  }

  if (!client) {
    return (
      <EmptyState
        icon={<Users className="h-5 w-5" />}
        title={t.coach_no_client_found}
        action={
          <Button variant="secondary" size="sm" asChild>
            <Link href="/redesign/coach/clients">{t.coach_back_to_clients}</Link>
          </Button>
        }
      />
    );
  }

  const name = getDisplayName(client);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={
          <Link href="/redesign/coach/clients" className="inline-flex items-center gap-1 hover:text-[var(--text-secondary)]">
            <ArrowRight className="h-3 w-3 rtl:rotate-180" />
            {t.coach_back_to_clients}
          </Link>
        }
        title={
          <span className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent)]">
              {getInitials(name)}
            </span>
            {name}
          </span>
        }
        description={t.coach_client_detail_desc}
        actions={client.plan_name ? <Badge variant="accent">{client.plan_name}</Badge> : undefined}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label={t.sort_profit}
          value={client.profit === null ? '—' : formatCurrency(client.profit)}
          trendPositive={client.profit === null ? undefined : client.profit >= 0}
        />
        <StatCard label={t.sort_win_rate} value={client.win_rate === null ? '—' : `${client.win_rate.toFixed(1)}%`} />
        <StatCard
          label={t.sort_drawdown}
          value={client.drawdown === null ? '—' : `${client.drawdown.toFixed(2)}%`}
          trendPositive={client.drawdown === null ? undefined : false}
        />
        <StatCard label={t.sort_trade_count} value={client.trade_count ?? '—'} />
      </div>

      <Card title={t.coach_connected_accounts} padded={false} footer={
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/redesign/coach/clients/${clientId}/journal`}>
            <BookOpen className="h-3.5 w-3.5" />
            {t.coach_view_journal}
          </Link>
        </Button>
      }>
        {client.accounts.length === 0 ? (
          <div className="px-5 py-6 text-sm text-[var(--text-muted)]">{t.client_no_accounts}</div>
        ) : (
          <div className="divide-y divide-[var(--border-subtle)]">
            {client.accounts.map((acc) => (
              <div key={acc.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <Badge variant={acc.is_demo ? 'warning' : 'loss'}>{acc.is_demo ? t.account_type_demo : t.account_type_real}</Badge>
                  <span className="rd-tabular font-mono text-sm font-bold text-[var(--text-primary)]">{acc.login}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="hidden items-center gap-1 sm:flex">
                    {PERMISSIONS.map(({ key, labelKey }) => {
                      const allowed = acc[key] as boolean;
                      return (
                        <Badge key={key} variant={allowed ? 'accent' : 'neutral'} className={allowed ? '' : 'opacity-50'}>
                          {t[labelKey]}
                        </Badge>
                      );
                    })}
                  </div>

                  {acc.has_snapshot && (
                    <>
                      <div className="hidden text-center sm:block">
                        <p className="text-[10px] text-[var(--text-muted)]">{t.client_balance}</p>
                        <p className="rd-tabular text-sm font-bold text-[var(--accent)]">
                          {acc.allow_balance && acc.balance !== null ? formatCurrency(acc.balance) : '●●●●●'}
                        </p>
                      </div>
                      <div className="hidden text-center md:block">
                        <p className="text-[10px] text-[var(--text-muted)]">{t.client_drawdown}</p>
                        <p className="rd-tabular text-sm font-bold text-[var(--warning)]">
                          {acc.max_drawdown !== null ? `${acc.max_drawdown.toFixed(1)}%` : '—'}
                        </p>
                      </div>
                    </>
                  )}

                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/redesign/dashboard/analyze/${acc.id}?coach=true`}>
                      <BarChart2 className="h-3.5 w-3.5" />
                      {t.client_analyze}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
