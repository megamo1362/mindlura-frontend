'use client';

'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InlineLoader } from '@/components/shared';
import { DisplaySettings } from './display-settings';
import {
  useMyCoaches,
  useConnectCoach,
  useDisconnectCoach,
  type MyCoach,
  type ConnectCoachInput,
} from '@/hooks/use-coach';
import { useAccounts } from '@/hooks/use-accounts';
import { getInitials } from '@/lib/utils';
import { ApiError } from '@/lib/api';
import { useLang } from '@/app/i18n/LangContext';
import type { DisplayMode, AccountPermissions } from '@/types';

const PERMISSION_KEYS: Array<keyof Omit<AccountPermissions, 'account_id'>> = [
  'allow_balance',
  'allow_trades',
  'allow_analysis',
  'allow_journal',
];

const PERMISSION_LABELS: Record<string, string> = {
  allow_balance: 'موجودی',
  allow_trades: 'معاملات',
  allow_analysis: 'آنالیز',
  allow_journal: 'ژورنال',
};

function defaultPerms(accountId: number): AccountPermissions {
  return { account_id: accountId, allow_balance: true, allow_trades: true, allow_analysis: true, allow_journal: false };
}

function EditPanel({
  coach,
  onClose,
}: {
  coach: MyCoach;
  onClose: () => void;
}) {
  const { data: accounts = [] } = useAccounts();
  const [mode, setMode] = useState<DisplayMode>(coach.display_mode);
  const [label, setLabel] = useState(coach.display_label ?? '');
  const [selectedIds, setSelectedIds] = useState<number[]>(coach.shared_account_ids);
  const [perms, setPerms] = useState<Record<number, AccountPermissions>>(() => {
    const map: Record<number, AccountPermissions> = {};
    for (const p of coach.account_permissions ?? []) map[p.account_id] = p;
    return map;
  });
  const { mutate: connect, isPending: saving, error } = useConnectCoach();
  const { t } = useLang();

  const apiError = error instanceof ApiError ? error.message : null;
  const needsLabel = mode === 'name' || mode === 'both';
  const canSave = selectedIds.length > 0 && (!needsLabel || label.trim().length > 0);

  const toggleId = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (!perms[id]) setPerms((p) => ({ ...p, [id]: defaultPerms(id) }));
      return [...prev, id];
    });
  };

  const togglePerm = (accountId: number, key: keyof Omit<AccountPermissions, 'account_id'>) => {
    setPerms((prev) => ({
      ...prev,
      [accountId]: { ...(prev[accountId] ?? defaultPerms(accountId)), [key]: !prev[accountId]?.[key] },
    }));
  };

  const handleSave = () => {
    const payload: ConnectCoachInput = {
      coach_email: coach.coach_email,
      display_mode: mode,
      account_ids: selectedIds,
      account_permissions: selectedIds.map((id) => perms[id] ?? defaultPerms(id)),
    };
    if (needsLabel && label.trim()) payload.display_label = label.trim();
    connect(payload, { onSuccess: onClose });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden border-t border-[var(--color-border)]"
    >
      <div className="px-5 py-4 space-y-4">
        <DisplaySettings
          mode={mode}
          label={label}
          onModeChange={setMode}
          onLabelChange={setLabel}
        />

        <div>
          <p className="text-xs text-[var(--color-text-muted)] mb-2">{t.connect_shared_accounts}</p>
          <div className="space-y-3">
            {accounts.map((acc) => {
              const selected = selectedIds.includes(acc.id);
              const p = perms[acc.id] ?? defaultPerms(acc.id);
              return (
                <div
                  key={acc.id}
                  className="rounded-xl border transition-all overflow-hidden"
                  style={{
                    background: selected ? 'var(--color-cyan-dim)' : 'var(--color-elevated)',
                    borderColor: selected ? 'var(--color-cyan-glow)' : 'var(--color-border)',
                  }}
                >
                  <label className="flex items-center gap-3 px-3 py-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleId(acc.id)}
                      className="accent-cyan-400"
                    />
                    <span className="font-mono text-sm font-bold text-[var(--color-text-primary)]">{acc.login}</span>
                  </label>

                  {selected && (
                    <div className="px-3 pb-3 flex flex-wrap gap-2 border-t border-[var(--color-cyan-dim)]" style={{ paddingTop: 8 }}>
                      {PERMISSION_KEYS.map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => togglePerm(acc.id, key)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border"
                          style={{
                            background: p[key] ? 'var(--color-cyan-dim)' : 'var(--color-elevated)',
                            borderColor: p[key] ? 'var(--color-cyan-glow)' : 'var(--color-border)',
                            color: p[key] ? 'var(--color-cyan)' : 'var(--color-text-muted)',
                          }}
                        >
                          <span>{p[key] ? '✓' : '✗'}</span>
                          {PERMISSION_LABELS[key]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {apiError && (
          <p className="text-sm text-[var(--color-status-error)]">{apiError}</p>
        )}

        <div className="flex gap-2">
          <Button variant="primary" size="sm" className="flex-1" onClick={handleSave} loading={saving} disabled={!canSave || saving}>
            {t.connect_save}
          </Button>
          <Button variant="ghost" size="sm" className="flex-1" onClick={onClose}>{t.cancel}</Button>
        </div>
      </div>
    </motion.div>
  );
}

function MyCoachesList() {
  const { data: coaches = [], isLoading } = useMyCoaches();
  const { mutate: disconnect, isPending: disconnecting, variables: disconnectingId } = useDisconnectCoach();
  const [editingId, setEditingId] = useState<number | null>(null);
  const { t } = useLang();

  if (isLoading) return <InlineLoader />;

  if (coaches.length === 0) {
    return (
      <div className="card-surface rounded-2xl p-8 text-center">
        <Link2 className="h-8 w-8 text-[var(--color-text-muted)] mx-auto mb-2" />
        <p className="text-sm text-[var(--color-text-muted)]">{t.connect_no_coaches}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {coaches.map((c) => (
        <div key={c.coach_id} className="card-surface rounded-2xl overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-teal)] to-[var(--color-cyan)] flex items-center justify-center text-xs font-bold text-[var(--color-void)] flex-shrink-0">
                {getInitials(c.coach_name)}
              </div>
              <div>
                <p className="font-bold text-[var(--color-text-primary)]">{c.coach_name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{c.coach_email}</p>
                {c.connected_since && (
                  <p className="text-xs text-[var(--color-text-muted)]/60 mt-0.5">
                    {t.connect_since(new Date(c.connected_since).toLocaleDateString('fa-IR'))}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditingId(editingId === c.coach_id ? null : c.coach_id)}
              >
                {editingId === c.coach_id ? t.connect_close : t.connect_edit}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => disconnect(c.coach_id)}
                loading={disconnecting && disconnectingId === c.coach_id}
                className="text-[var(--color-status-error)] hover:bg-[var(--color-danger-dim)]"
              >
                {t.connect_disconnect}
              </Button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {editingId === c.coach_id && (
              <EditPanel coach={c} onClose={() => setEditingId(null)} />
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export function ConnectCoachPage() {
  const { t } = useLang();
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text-primary)]">{t.connect_title}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{t.connect_desc}</p>
      </div>
      <MyCoachesList />
    </div>
  );
}
