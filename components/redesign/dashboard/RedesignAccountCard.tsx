'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RefreshCw, TrendingUp, Trash2, Clock, Server } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Card } from '@/components/redesign/ui/Card';
import { Badge } from '@/components/redesign/ui/Badge';
import { Button } from '@/components/redesign/ui/Button';
import { useDeleteAccount, useSyncAccount } from '@/hooks/use-accounts';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useLang } from '@/app/i18n/LangContext';
import type { MT5Account } from '@/types';

export function RedesignAccountCard({ account }: { account: MT5Account }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: sync, isPending: syncing } = useSyncAccount();
  const { mutate: deleteAccount, isPending: deleting } = useDeleteAccount();
  const { t } = useLang();

  return (
    <>
      <Card className="rd-fade-up" bodyClassName="p-5">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-soft)]">
              <span className="text-xs font-bold text-[var(--accent)]">MT5</span>
            </div>
            <div>
              <p className="rd-tabular text-base font-bold text-[var(--text-primary)]" dir="ltr">
                {account.login}
              </p>
              {account.label && <p className="mt-0.5 text-xs text-[var(--text-muted)]">{account.label}</p>}
            </div>
          </div>
          <Badge variant={account.is_active ? 'profit' : 'neutral'}>
            {account.is_active ? t.account_active : t.account_inactive}
          </Badge>
        </div>

        <div className="mb-4 flex items-center gap-1.5 text-xs text-[var(--text-muted)]" dir="ltr">
          <Server className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{account.server}</span>
        </div>

        <div className="mb-4 rounded-[var(--radius-sm)] bg-[var(--bg-surface-2)] px-4 py-3">
          <p className="text-xs text-[var(--text-muted)]">{t.account_balance}</p>
          <p className="rd-tabular mt-0.5 text-xl font-bold text-[var(--text-primary)]">
            {account.balance !== null ? formatCurrency(account.balance) : '—'}
          </p>
        </div>

        {account.last_sync_at && (
          <div className="mb-4 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <Clock className="h-3.5 w-3.5 flex-shrink-0" />
            <span>
              {t.account_last_sync} {formatDate(account.last_sync_at)}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-[var(--border-subtle)] pt-3">
          <Button variant="primary" size="sm" className="flex-1" asChild>
            <Link href={`/redesign/dashboard/analyze/${account.id}`}>
              <TrendingUp className="h-3.5 w-3.5" />
              {t.account_analyze}
            </Link>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => sync(account.id)} loading={syncing} title={t.account_sync}>
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="hover:bg-[var(--loss-soft)] hover:text-[var(--loss)]"
            title={t.account_delete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.account_delete_title}</DialogTitle>
            <DialogDescription>{t.account_delete_desc(account.login)}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">{t.cancel}</Button>
            </DialogClose>
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteAccount(account.id, { onSuccess: () => setDeleteOpen(false) })}
              loading={deleting}
            >
              {t.account_delete_confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
