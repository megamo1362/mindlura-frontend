'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';
import { PageHeader } from '@/components/redesign/ui/PageHeader';
import { EmptyState } from '@/components/redesign/ui/EmptyState';
import { JournalAnalysisView } from '@/app/dashboard/journal/JournalAnalysisView';
import { useCoachClientAccounts, useCoachClientJournalAnalysis } from '@/hooks/use-coach-client-journal';
import { ApiError } from '@/lib/api';
import { useLang } from '@/app/i18n/LangContext';

export function RedesignCoachClientJournal({ clientId }: { clientId: string }) {
  const { t } = useLang();
  const [accountId, setAccountId] = useState('');

  const { data: accounts = [], isLoading: accountsLoading, isError: accountsIsError } = useCoachClientAccounts(clientId);

  useEffect(() => {
    if (!accountId && accounts.length > 0) setAccountId(String(accounts[0].id));
  }, [accounts, accountId]);

  const { data, isFetching: loading, error: queryError } = useCoachClientJournalAnalysis(clientId, accountId);
  const forbidden = queryError instanceof ApiError && queryError.status === 403;
  const error = queryError && !forbidden ? (queryError instanceof Error ? queryError.message : t.error_generic) : '';

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={
          <Link href={`/dashboard/coach/clients/${clientId}`} className="inline-flex items-center gap-1 hover:text-[var(--text-secondary)]">
            <ArrowRight className="h-3 w-3 rtl:rotate-180" />
            {t.coach_back_to_clients}
          </Link>
        }
        title={t.coach_client_journal_title}
        description={t.coach_client_journal_desc}
        actions={
          accounts.length > 0 ? (
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              aria-label={t.journal_select_account}
              className="h-9 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.label || a.login} — {a.server}</option>
              ))}
            </select>
          ) : undefined
        }
      />

      {!accountsLoading && accounts.length === 0 && !accountsIsError && (
        <EmptyState title={t.client_no_accounts} />
      )}

      {accountsIsError && (
        <div className="rounded-[var(--radius-md)] border border-[var(--loss)]/30 bg-[var(--loss-soft)] px-4 py-3 text-sm text-[var(--loss)]">
          {t.coach_error}
        </div>
      )}

      {forbidden && (
        <EmptyState icon={<Lock className="h-5 w-5" />} title={t.coach_client_no_access} />
      )}

      {error && (
        <div className="rounded-[var(--radius-md)] border border-[var(--loss)]/30 bg-[var(--loss-soft)] px-4 py-3 text-sm text-[var(--loss)]">
          {error}
        </div>
      )}

      {!forbidden && (accountsLoading || accounts.length > 0) && (
        <div className="rd-journal-legacy">
          <JournalAnalysisView data={data ?? null} loading={loading || accountsLoading} />
        </div>
      )}
    </div>
  );
}
