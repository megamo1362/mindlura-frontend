'use client';

import { useMemo, useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/redesign/ui/PageHeader';
import { StatCard } from '@/components/redesign/ui/StatCard';
import { StatCardSkeletonRow } from '@/components/redesign/ui/Skeleton';
import { EmptyState } from '@/components/redesign/ui/EmptyState';
import { Button } from '@/components/redesign/ui/Button';
import { RedesignAccountCard } from './RedesignAccountCard';
import { AddAccountDialog } from '@/components/dashboard/add-account-dialog';
import { useAccounts } from '@/hooks/use-accounts';
import { formatCurrency } from '@/lib/utils';
import { useLang } from '@/app/i18n/LangContext';

export function RedesignAccountsOverview() {
  const [addOpen, setAddOpen] = useState(false);
  const { data: accounts, isLoading, isError } = useAccounts();
  const { t } = useLang();

  const stats = useMemo(() => {
    const list = accounts ?? [];
    const active = list.filter((a) => a.is_active).length;
    const totalBalance = list.reduce((sum, a) => sum + (a.balance ?? 0), 0);
    return { total: list.length, active, totalBalance };
  }, [accounts]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.accounts_title}
        description={accounts?.length ? t.accounts_connected(accounts.length) : t.accounts_none}
        actions={
          <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            {t.accounts_add}
          </Button>
        }
      />

      {isLoading && <StatCardSkeletonRow count={3} />}

      {!isLoading && accounts && accounts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label={t.accounts_title} value={stats.total} />
          <StatCard label={t.account_active} value={stats.active} trendPositive />
          <StatCard label={t.account_balance} value={formatCurrency(stats.totalBalance)} />
        </div>
      )}

      {isError && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--loss)]/30 bg-[var(--loss-soft)] px-4 py-3 text-sm text-[var(--loss)]">
          {t.accounts_error}
        </div>
      )}

      {!isLoading && !isError && accounts?.length === 0 && (
        <EmptyState
          icon={<Wallet className="h-5 w-5" />}
          title={t.accounts_empty_title}
          description={t.accounts_empty_desc}
          action={
            <Button variant="primary" onClick={() => setAddOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              {t.accounts_add_first}
            </Button>
          }
        />
      )}

      {!isLoading && accounts && accounts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account) => (
            <RedesignAccountCard key={account.id} account={account} />
          ))}
        </div>
      )}

      <AddAccountDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
