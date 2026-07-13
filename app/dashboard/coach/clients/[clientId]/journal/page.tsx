'use client';

import { useCallback, useEffect, useState } from 'react';
import { use } from 'react';
import { apiFetch, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JournalAnalysisView } from '@/app/dashboard/journal/JournalAnalysisView';
import { useLang } from '@/app/i18n/LangContext';
import type { JournalAnalysisData } from '@/types';

interface Account { id: number; login: string; server: string; label?: string | null; }

export default function CoachClientJournalPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountId, setAccountId] = useState('');
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState('');
  const [data, setData] = useState<JournalAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLang();

  useEffect(() => {
    setAccountsLoading(true);
    setAccountsError('');
    apiFetch<{ accounts: Account[] }>(`/coach/client/${clientId}/accounts`)
      .then(d => {
        console.log('[coach-client-journal] accounts response:', d);
        const list = d.accounts ?? [];
        setAccounts(list);
        if (list.length > 0) setAccountId(String(list[0].id));
      })
      .catch(e => {
        console.error('[coach-client-journal] failed to load accounts:', e);
        setAccountsError(e instanceof Error ? e.message : t.error_generic);
      })
      .finally(() => setAccountsLoading(false));
  }, [clientId, t.error_generic]);

  const load = useCallback(async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError('');
    setForbidden(false);
    try {
      const result = await apiFetch<JournalAnalysisData>(`/journal/analysis/${id}?client_id=${clientId}`);
      console.log('[coach-client-journal] analysis response:', result);
      setData(result);
    } catch (e) {
      console.error('[coach-client-journal] failed to load analysis:', e);
      if (e instanceof ApiError && e.status === 403) {
        setForbidden(true);
      } else {
        setError(e instanceof Error ? e.message : t.error_generic);
      }
    } finally {
      setLoading(false);
    }
  }, [clientId, t.error_generic]);

  // Auto-load analysis as soon as an account is selected, instead of waiting on a manual click.
  useEffect(() => {
    if (accountId) load(accountId);
  }, [accountId, load]);

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
        <Button onClick={() => load(accountId)} loading={loading} disabled={!accountId}>{t.coach_client_view_analysis}</Button>
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

      <JournalAnalysisView data={data} loading={loading} />
    </div>
  );
}
