'use client';

import { useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { useLang } from '@/app/i18n/LangContext';
import type { EATokenRow } from '@/types';

type BadgeVariant = 'green' | 'yellow' | 'gray' | 'red';

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  active: 'green',
  plan_expired: 'yellow',
  feature_not_in_plan: 'gray',
  revoked: 'red',
};

function relativeTime(dateStr: string | null, lang: 'en' | 'fa'): string {
  if (!dateStr) return lang === 'fa' ? 'هرگز' : 'Never';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return lang === 'fa' ? 'همین الان' : 'Just now';
  if (diff < 3600) {
    const m = Math.floor(diff / 60);
    return lang === 'fa' ? `${m} دقیقه پیش` : `${m}m ago`;
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return lang === 'fa' ? `${h} ساعت پیش` : `${h}h ago`;
  }
  const d = Math.floor(diff / 86400);
  return lang === 'fa' ? `${d} روز پیش` : `${d}d ago`;
}

const PAGE_SIZE = 20;

export default function AdminEATokensPage() {
  const { t, lang } = useLang();

  // List state
  const [rows, setRows] = useState<EATokenRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Client-side search on current page
  // TODO: replace with server-side ?q= param when /admin/ea-tokens supports it
  const [search, setSearch] = useState('');

  // Issue / Re-issue flow
  const [issueTarget, setIssueTarget] = useState<EATokenRow | null>(null);
  const [issuing, setIssuing] = useState(false);
  const [issuedToken, setIssuedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Revoke flow
  const [revokeTarget, setRevokeTarget] = useState<EATokenRow | null>(null);
  const [revoking, setRevoking] = useState(false);

  // Reset binding flow
  const [resetTarget, setResetTarget] = useState<EATokenRow | null>(null);
  const [resetting, setResetting] = useState(false);

  // Shared action error
  const [actionError, setActionError] = useState('');

  useEffect(() => { fetchRows(page); }, [page]);

  function fetchRows(p: number) {
    setLoading(true);
    apiFetch<{ items: EATokenRow[]; total: number }>(`/admin/ea-tokens?page=${p}&size=${PAGE_SIZE}`)
      .then(d => { setRows(d.items ?? []); setTotal(d.total); })
      .finally(() => setLoading(false));
  }

  // Client-side filter on current page
  const filtered = search
    ? rows.filter(r => {
        const q = search.toLowerCase();
        return r.email.toLowerCase().includes(q) || (r.full_name?.toLowerCase() ?? '').includes(q);
      })
    : rows;

  async function issueToken() {
    if (!issueTarget) return;
    setIssuing(true);
    setActionError('');
    try {
      const data = await apiFetch<{ token: string }>(
        `/admin/ea-tokens/${issueTarget.user_id}/issue`,
        { method: 'POST' },
      );
      setIssueTarget(null);
      setIssuedToken(data.token);
      setCopied(false);
      fetchRows(page);
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : t.error_generic);
    } finally {
      setIssuing(false);
    }
  }

  async function revokeToken() {
    if (!revokeTarget) return;
    setRevoking(true);
    setActionError('');
    try {
      await apiFetch(`/admin/ea-tokens/${revokeTarget.user_id}/revoke`, { method: 'POST' });
      setRevokeTarget(null);
      fetchRows(page);
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : t.error_generic);
    } finally {
      setRevoking(false);
    }
  }

  async function resetBinding() {
    if (!resetTarget) return;
    setResetting(true);
    setActionError('');
    try {
      await apiFetch(`/admin/ea-tokens/${resetTarget.user_id}/reset-binding`, { method: 'POST' });
      setResetTarget(null);
      fetchRows(page);
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : t.error_generic);
    } finally {
      setResetting(false);
    }
  }

  function copyToken() {
    if (!issuedToken) return;
    navigator.clipboard.writeText(issuedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const statusLabel: Record<string, string> = {
    active: t.admin_ea_status_active,
    plan_expired: t.admin_ea_status_plan_expired,
    feature_not_in_plan: t.admin_ea_status_feature_not_in_plan,
    revoked: t.admin_ea_status_revoked,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t.admin_ea_title}</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{t.admin_ea_total(total)}</p>
        </div>
      </div>

      {/* Search filter */}
      <div className="mb-4 max-w-sm">
        <Input
          placeholder={t.admin_ea_filter_placeholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          dir="auto"
        />
        {search && (
          <p className="text-xs text-[var(--color-text-muted)] mt-1">{t.admin_ea_search_note}</p>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden border border-[var(--color-border)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-deep)] text-[var(--color-text-muted)]">
                  <th className="px-4 py-3 text-right">{t.admin_ea_col_user}</th>
                  <th className="px-4 py-3 text-center">{t.admin_ea_col_token}</th>
                  <th className="px-4 py-3 text-center">{t.admin_ea_col_status}</th>
                  <th className="px-4 py-3 text-center">{t.admin_ea_col_bound}</th>
                  <th className="px-4 py-3 text-center">{t.admin_ea_col_version}</th>
                  <th className="px-4 py-3 text-center">{t.admin_ea_col_last_used}</th>
                  <th className="px-4 py-3 text-center">{t.admin_ea_col_actions}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[var(--color-text-muted)]">
                      {t.no_data_available}
                    </td>
                  </tr>
                ) : filtered.map(row => {
                  const isReissue = !row.is_revoked;
                  return (
                    <tr key={row.id} className="border-t border-[var(--color-border)] hover:bg-white/[0.02] transition-colors">
                      {/* User */}
                      <td className="px-4 py-3">
                        <p className="font-medium text-[var(--color-text-primary)]">{row.full_name || '—'}</p>
                        <p className="text-[var(--color-text-muted)] text-xs mt-0.5">{row.email}</p>
                      </td>

                      {/* Token prefix — always LTR */}
                      <td className="px-4 py-3 text-center">
                        <span
                          dir="ltr"
                          className="font-mono text-xs text-[var(--color-cyan)] bg-[var(--color-deep)] px-2 py-1 rounded"
                        >
                          {row.prefix}…
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <Badge variant={STATUS_VARIANT[row.access_status] ?? 'gray'} dot>
                          {statusLabel[row.access_status] ?? row.access_status}
                        </Badge>
                      </td>

                      {/* Bound account — numbers LTR */}
                      <td className="px-4 py-3 text-center">
                        {row.bound_account_login != null ? (
                          <div>
                            <span dir="ltr" className="text-xs font-mono text-[var(--color-text-primary)]">
                              {row.bound_account_login}
                            </span>
                            {row.bound_broker && (
                              <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{row.bound_broker}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[var(--color-text-muted)]">—</span>
                        )}
                      </td>

                      {/* EA Version — always LTR */}
                      <td className="px-4 py-3 text-center text-xs text-[var(--color-text-muted)]">
                        {row.ea_version ? <span dir="ltr">{row.ea_version}</span> : '—'}
                      </td>

                      {/* Last used — relative */}
                      <td className="px-4 py-3 text-center text-xs text-[var(--color-text-muted)]">
                        {relativeTime(row.last_used_at, lang)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-1 justify-center">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title={isReissue ? t.admin_ea_reissue_btn : t.admin_ea_issue_btn}
                            onClick={() => { setActionError(''); setIssueTarget(row); }}
                          >
                            🔑
                          </Button>
                          {!row.is_revoked && (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title={t.admin_ea_revoke_btn}
                              onClick={() => { setActionError(''); setRevokeTarget(row); }}
                            >
                              🚫
                            </Button>
                          )}
                          {row.bound_account_login != null && !row.is_revoked && (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title={t.admin_ea_reset_binding_btn}
                              onClick={() => { setActionError(''); setResetTarget(row); }}
                            >
                              🔓
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-[var(--color-text-muted)]">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} / {total}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 text-xs rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] disabled:opacity-30 hover:text-[var(--color-text-primary)] transition-colors"
            >
              ‹ {t.trades_prev}
            </button>
            <button
              disabled={page * PAGE_SIZE >= total}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 text-xs rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] disabled:opacity-30 hover:text-[var(--color-text-primary)] transition-colors"
            >
              {t.trades_next} ›
            </button>
          </div>
        </div>
      )}

      {/* ── Issue / Re-issue confirm modal ─────────────────── */}
      <Dialog open={!!issueTarget} onOpenChange={open => { if (!open) setIssueTarget(null); }}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>
              {issueTarget && !issueTarget.is_revoked ? t.admin_ea_reissue_title : t.admin_ea_issue_title}
            </DialogTitle>
          </DialogHeader>
          {issueTarget && (
            <div className="space-y-3">
              <p className="text-sm text-[var(--color-text-muted)]">{issueTarget.email}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">{t.admin_ea_issue_confirm}</p>
              {actionError && <p className="text-xs text-[var(--color-danger)]">{actionError}</p>}
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIssueTarget(null)}>{t.cancel}</Button>
            <Button onClick={issueToken} loading={issuing}>{t.admin_ea_issue_btn}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── One-time token reveal modal ────────────────────── */}
      <Dialog
        open={issuedToken !== null}
        onOpenChange={open => { if (!open) { setIssuedToken(null); setCopied(false); } }}
      >
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>{t.admin_ea_token_issued_title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm font-semibold text-[var(--color-warning)]">
              {t.admin_ea_token_once_warning}
            </p>
            <div className="relative">
              <pre
                dir="ltr"
                className="font-mono text-sm bg-[var(--color-deep)] border border-[var(--color-border)] rounded-xl px-4 py-3 break-all whitespace-pre-wrap text-[var(--color-cyan)] select-all"
              >
                {issuedToken}
              </pre>
              {/* Copy icon inside token box */}
              <button
                onClick={copyToken}
                className="absolute top-2 end-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title={copied ? t.admin_ea_copied : t.admin_ea_copy_token}
              >
                {copied
                  ? <Check className="w-4 h-4 text-[var(--color-success)]" />
                  : <Copy className="w-4 h-4 text-[var(--color-text-muted)]" />
                }
              </button>
            </div>
            <Button variant="secondary" className="w-full" onClick={copyToken}>
              {copied ? t.admin_ea_copied : t.admin_ea_copy_token}
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => { setIssuedToken(null); setCopied(false); }}>{t.close}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Revoke confirm modal ───────────────────────────── */}
      <Dialog open={!!revokeTarget} onOpenChange={open => { if (!open) setRevokeTarget(null); }}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>{t.admin_ea_revoke_title}</DialogTitle>
          </DialogHeader>
          {revokeTarget && (
            <div className="space-y-3">
              <p className="text-sm text-[var(--color-text-muted)]">
                {t.admin_ea_revoke_confirm(revokeTarget.email)}
              </p>
              {actionError && <p className="text-xs text-[var(--color-danger)]">{actionError}</p>}
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setRevokeTarget(null)}>{t.cancel}</Button>
            <Button variant="danger" onClick={revokeToken} loading={revoking}>{t.admin_ea_revoke_btn}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reset binding confirm modal ────────────────────── */}
      <Dialog open={!!resetTarget} onOpenChange={open => { if (!open) setResetTarget(null); }}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>{t.admin_ea_reset_title}</DialogTitle>
          </DialogHeader>
          {resetTarget && (
            <div className="space-y-3">
              <p className="text-sm text-[var(--color-text-muted)]">{resetTarget.email}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">{t.admin_ea_reset_confirm}</p>
              {actionError && <p className="text-xs text-[var(--color-danger)]">{actionError}</p>}
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setResetTarget(null)}>{t.cancel}</Button>
            <Button onClick={resetBinding} loading={resetting}>{t.admin_ea_reset_binding_btn}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
