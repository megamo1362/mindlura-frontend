'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JournalAnalysisView } from '@/app/dashboard/journal/JournalAnalysisView';
import { useLang } from '@/app/i18n/LangContext';
import { ApiError } from '@/lib/api';
import { useCoachClientAccounts, useCoachClientJournalAnalysis } from '@/hooks/use-coach-client-journal';

export default function CoachClientJournalPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const [accountId, setAccountId] = useState('');
  const { t } = useLang();

  const { data: accounts = [], isLoading: accountsLoading, isError: accountsIsError } = useCoachClientAccounts(clientId);
  const accountsError = accountsIsError ? t.error_generic : '';

  useEffect(() => {
    if (!accountId && accounts.length > 0) setAccountId(String(accounts[0].id));
  }, [accounts, accountId]);

  const { data, isFetching: loading, error: queryError, refetch } = useCoachClientJournalAnalysis(clientId, accountId);
  const forbidden = queryError instanceof ApiError && queryError.status === 403;
  const error = queryError && !forbidden ? (queryError instanceof Error ? queryError.message : t.error_generic) : '';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t.coach_client_journal_title}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{t.coach_client_journal_desc}</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Select value={accountId} onValueChange={setAccountId}>
          <SelectTrigger className="w-64"><SelectValue placeholder={t.journal_select_account} /></SelectTrigger>
          <SelectContent>
            {accounts.map(a => (
              <SelectItem key={a.id} value={String(a.id)}>
                {a.label || a.login} — {a.server}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => refetch()} loading={loading} disabled={!accountId}>{t.coach_client_view_analysis}</Button>
      </div>

      {!accountsLoading && !accountsError && accounts.length === 0 && (
        <div className="glass rounded-2xl p-8 border border-[var(--color-border)] text-center">
          <p className="text-[var(--color-text-muted)]">{t.client_no_accounts}</p>
        </div>
      )}

      {accountsError && <p className="text-sm text-[var(--color-status-error)] mb-4">{accountsError}</p>}

      {forbidden && (
        <div className="glass rounded-2xl p-8 border border-[var(--color-border)] text-center">
          <p className="text-lg font-bold text-[var(--color-text-primary)] mb-2">{t.coach_client_no_access}</p>
        </div>
      )}

      {error && <p className="text-sm text-[var(--color-status-error)] mb-4">{error}</p>}

      <JournalAnalysisView data={data ?? null} loading={loading} />
    </div>
  );
}
