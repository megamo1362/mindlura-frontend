'use client';

import { useState } from 'react';
import { Check, Copy, KeyRound, Loader2, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/redesign/ui/Card';
import { Button } from '@/components/redesign/ui/Button';
import { Badge } from '@/components/redesign/ui/Badge';
import { EmptyState } from '@/components/redesign/ui/EmptyState';
import { Skeleton } from '@/components/redesign/ui/Skeleton';
import { useInviteCodes, useCreateInviteCode, useDeleteInviteCode } from '@/hooks/use-coach';
import { useLang } from '@/app/i18n/LangContext';

export function RedesignInviteCodes() {
  const { data: codes = [], isLoading } = useInviteCodes();
  const { mutate: create, isPending: creating } = useCreateInviteCode();
  const { mutate: remove, isPending: deletingAny, variables: deletingId } = useDeleteInviteCode();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expiresDays, setExpiresDays] = useState('30');
  const [maxUses, setMaxUses] = useState('');
  const { t } = useLang();

  const handleCreate = () => {
    const body: { expires_days?: number; max_uses?: number } = {};
    const days = parseInt(expiresDays);
    if (days > 0) body.expires_days = days;
    const uses = parseInt(maxUses);
    if (uses > 1) body.max_uses = uses;
    create(body);
  };

  const handleCopy = (id: number, code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeCodes = codes.filter((c) => !c.is_used);
  const usedCodes = codes.filter((c) => c.is_used);

  return (
    <div className="space-y-5">
      <Card title={t.coach_create_code_title}>
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--text-muted)]">{t.coach_expiry_label}</label>
            <select
              value={expiresDays}
              onChange={(e) => setExpiresDays(e.target.value)}
              className="h-9 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="7">{t.coach_expiry_7}</option>
              <option value="14">{t.coach_expiry_14}</option>
              <option value="30">{t.coach_expiry_30}</option>
              <option value="90">{t.coach_expiry_90}</option>
              <option value="0">{t.coach_expiry_none}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[var(--text-muted)]">
              {t.coach_uses_label}
              <span className="mx-1 text-[10px] text-[var(--text-muted)]">{t.coach_uses_hint}</span>
            </label>
            <input
              type="number"
              min="1"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              placeholder={t.coach_uses_placeholder}
              className="h-9 w-24 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <Button variant="primary" size="sm" onClick={handleCreate} loading={creating} disabled={creating}>
            <Plus className="h-3.5 w-3.5" />
            {t.coach_create_code_btn}
          </Button>
        </div>
      </Card>

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      )}

      {!isLoading && activeCodes.length > 0 && (
        <Card
          title={
            <span className="flex items-center gap-2">
              {t.coach_active_codes}
              <Badge variant="accent">{activeCodes.length}</Badge>
            </span>
          }
          padded={false}
        >
          <div className="divide-y divide-[var(--border-subtle)]">
            {activeCodes.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="rd-tabular font-mono text-lg font-black tracking-[0.2em] text-[var(--accent)]">
                    {c.code}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {c.max_uses !== null ? (
                      <Badge variant="neutral">{t.coach_uses_count(c.used_count, c.max_uses)}</Badge>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">{t.coach_single_use}</span>
                    )}
                    {c.expires_at && (
                      <span className="text-xs text-[var(--text-muted)]">
                        {t.coach_code_until(new Date(c.expires_at).toLocaleDateString('fa-IR'))}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(c.id, c.code)}>
                    {copiedId === c.id ? <Check className="h-3.5 w-3.5 text-[var(--profit)]" /> : <Copy className="h-3.5 w-3.5" />}
                    <span className="text-xs">{copiedId === c.id ? t.coach_copied : t.coach_copy}</span>
                  </Button>
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    disabled={deletingAny && deletingId === c.id}
                    className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] transition-colors hover:bg-[var(--loss-soft)] hover:text-[var(--loss)]"
                  >
                    {deletingAny && deletingId === c.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {!isLoading && usedCodes.length > 0 && (
        <Card title={t.coach_completed_codes} padded={false} className="opacity-60">
          <div className="divide-y divide-[var(--border-subtle)]">
            {usedCodes.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="rd-tabular font-mono text-base font-bold tracking-widest text-[var(--text-muted)] line-through">
                    {c.code}
                  </span>
                  {c.used_by_name && <span className="text-xs text-[var(--text-muted)]">{c.used_by_name}</span>}
                </div>
                {c.used_at && (
                  <span className="text-xs text-[var(--text-muted)]">{new Date(c.used_at).toLocaleDateString('fa-IR')}</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {!isLoading && codes.length === 0 && (
        <EmptyState icon={<KeyRound className="h-5 w-5" />} title={t.coach_no_codes} description={t.coach_no_codes_desc} />
      )}
    </div>
  );
}
