'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Search, Users, X } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { useLang } from '@/app/i18n/LangContext';
import { formatDate } from '@/lib/utils';
import type { AdminCoach, AdminCoachClientRow, AdminUnassignedClient } from '@/types';

export default function AdminCoachesPage() {
  const { t, lang, isRTL } = useLang();
  const locale = lang === 'fa' ? 'fa-IR' : 'en-US';

  const [coaches, setCoaches] = useState<AdminCoach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [copiedSlug, setCopiedSlug] = useState('');

  // client drawer
  const [drawerCoach, setDrawerCoach] = useState<AdminCoach | null>(null);
  const [drawerClients, setDrawerClients] = useState<AdminCoachClientRow[]>([]);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerError, setDrawerError] = useState('');
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // detach confirm
  const [detachTarget, setDetachTarget] = useState<AdminCoachClientRow | null>(null);
  const [detaching, setDetaching] = useState(false);
  const [detachError, setDetachError] = useState('');

  // attach modal
  const [showAttach, setShowAttach] = useState(false);
  const [unassigned, setUnassigned] = useState<AdminUnassignedClient[]>([]);
  const [attachLoading, setAttachLoading] = useState(false);
  const [attachError, setAttachError] = useState('');
  const [attachSearch, setAttachSearch] = useState('');
  const [attachingId, setAttachingId] = useState<number | null>(null);

  const fetchCoaches = () => {
    setLoading(true);
    setError('');
    apiFetch<{ coaches: AdminCoach[] }>('/admin/coaches')
      .then(d => setCoaches(d.coaches ?? []))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : t.error_generic))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoaches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCoaches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return coaches;
    return coaches.filter(c =>
      (c.full_name || '').toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    );
  }, [coaches, search]);

  const fetchDrawerClients = (coachId: number) => {
    setDrawerLoading(true);
    setDrawerError('');
    apiFetch<{ clients: AdminCoachClientRow[] }>(`/admin/coaches/${coachId}/clients`)
      .then(d => setDrawerClients(d.clients ?? []))
      .catch((e: unknown) => setDrawerError(e instanceof Error ? e.message : t.error_generic))
      .finally(() => setDrawerLoading(false));
  };

  const openDrawer = (coach: AdminCoach) => {
    setDrawerCoach(coach);
    fetchDrawerClients(coach.id);
  };

  const closeDrawer = () => {
    setDrawerCoach(null);
    setDrawerClients([]);
    setDrawerError('');
  };

  const copySlug = (slug: string) => {
    navigator.clipboard.writeText(`https://mindlura.com/r/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(''), 2000);
  };

  const toggleClientAccess = async (client: AdminCoachClientRow, next: boolean) => {
    if (!drawerCoach) return;
    setTogglingId(client.client_id);
    setDrawerError('');
    try {
      if (next) {
        await apiFetch(`/admin/coaches/${drawerCoach.id}/attach-client`, {
          method: 'POST', body: { client_id: client.client_id },
        });
      } else {
        await apiFetch(`/admin/coaches/${drawerCoach.id}/clients/${client.client_id}`, { method: 'DELETE' });
      }
      fetchDrawerClients(drawerCoach.id);
      fetchCoaches();
    } catch (e: unknown) {
      setDrawerError(e instanceof Error ? e.message : t.error_generic);
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDetach = async () => {
    if (!drawerCoach || !detachTarget) return;
    setDetaching(true);
    setDetachError('');
    try {
      await apiFetch(`/admin/coaches/${drawerCoach.id}/clients/${detachTarget.client_id}`, { method: 'DELETE' });
      setDetachTarget(null);
      fetchDrawerClients(drawerCoach.id);
      fetchCoaches();
    } catch (e: unknown) {
      setDetachError(e instanceof Error ? e.message : t.error_generic);
    } finally {
      setDetaching(false);
    }
  };

  const openAttach = () => {
    setShowAttach(true);
    setAttachSearch('');
    setAttachError('');
    setAttachLoading(true);
    apiFetch<{ clients: AdminUnassignedClient[] }>('/admin/clients-without-coach')
      .then(d => setUnassigned(d.clients ?? []))
      .catch((e: unknown) => setAttachError(e instanceof Error ? e.message : t.error_generic))
      .finally(() => setAttachLoading(false));
  };

  const filteredUnassigned = useMemo(() => {
    const q = attachSearch.trim().toLowerCase();
    if (!q) return unassigned;
    return unassigned.filter(c =>
      (c.full_name || '').toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    );
  }, [unassigned, attachSearch]);

  const attachClient = async (client: AdminUnassignedClient) => {
    if (!drawerCoach) return;
    setAttachingId(client.id);
    setAttachError('');
    try {
      await apiFetch(`/admin/coaches/${drawerCoach.id}/attach-client`, {
        method: 'POST', body: { client_id: client.id },
      });
      setUnassigned(prev => prev.filter(c => c.id !== client.id));
      fetchDrawerClients(drawerCoach.id);
      fetchCoaches();
    } catch (e: unknown) {
      setAttachError(e instanceof Error ? e.message : t.error_generic);
    } finally {
      setAttachingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t.admin_coaches_title}</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{t.admin_coaches_total(coaches.length)}</p>
        </div>
        <div className="w-full sm:w-72">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.admin_coaches_search_placeholder}
            iconLeft={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-[rgba(239,68,68,0.3)] bg-[var(--color-danger-dim)] px-4 py-3 text-sm text-[var(--color-danger)]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
      ) : filteredCoaches.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-[var(--color-border)]">
          <p className="text-[var(--color-text-muted)]">{t.admin_coaches_none}</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-deep)] text-[var(--color-text-muted)]">
                <th className="px-4 py-3 text-right">{t.admin_coaches_col_coach}</th>
                <th className="px-4 py-3 text-center">{t.admin_coaches_col_slug}</th>
                <th className="px-4 py-3 text-center">{t.admin_coaches_col_clients}</th>
                <th className="px-4 py-3 text-center">{t.admin_coaches_col_invites}</th>
                <th className="px-4 py-3 text-center">{t.admin_coaches_col_status}</th>
                <th className="px-4 py-3 text-center">{t.admin_coaches_col_actions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoaches.map(coach => (
                <tr key={coach.id} className="border-t border-[var(--color-border)] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--color-text-primary)]">{coach.full_name || '—'}</p>
                    <p className="text-[var(--color-text-muted)] text-xs mt-0.5">{coach.email}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {coach.referral_slug ? (
                      <button
                        onClick={() => copySlug(coach.referral_slug!)}
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-cyan)] hover:opacity-70 transition-opacity"
                      >
                        {coach.referral_slug}
                        {copiedSlug === coach.referral_slug
                          ? <Check className="w-3 h-3 text-[var(--color-success)]" />
                          : <Copy className="w-3 h-3" />
                        }
                      </button>
                    ) : (
                      <span className="text-[var(--color-text-muted)] text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => openDrawer(coach)}
                      className="font-bold text-[var(--color-cyan)] hover:opacity-70 transition-opacity"
                    >
                      {coach.client_count}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center text-[var(--color-text-secondary)]">
                    {coach.active_invite_codes_count}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={coach.is_active ? 'green' : 'red'} dot>
                      {coach.is_active ? t.active : t.inactive}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button variant="secondary" size="sm" onClick={() => openDrawer(coach)}>
                      <Users className="w-3.5 h-3.5" />
                      {t.admin_coaches_view_clients}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Client Drawer */}
      <AnimatePresence>
        {drawerCoach && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[100] bg-[rgba(2,5,16,0.85)] backdrop-blur-[8px]"
              onClick={closeDrawer}
            />
            <motion.div
              initial={{ x: isRTL ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '-100%' : '100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} z-[101] w-full max-w-md glass-elevated ${isRTL ? 'border-r' : 'border-l'} border-[var(--color-border)] overflow-y-auto p-6`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                  {t.admin_coaches_drawer_title(drawerCoach.full_name || drawerCoach.email)}
                </h2>
                <button
                  onClick={closeDrawer}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/[0.06] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <Button className="w-full mb-5" onClick={openAttach}>{t.admin_coaches_attach_btn}</Button>

              {drawerError && (
                <div className="mb-4 rounded-xl border border-[rgba(239,68,68,0.3)] bg-[var(--color-danger-dim)] px-4 py-3 text-sm text-[var(--color-danger)]">
                  {drawerError}
                </div>
              )}

              {drawerLoading ? (
                <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
              ) : drawerClients.length === 0 ? (
                <div className="rounded-xl border border-[var(--color-border)] p-8 text-center">
                  <p className="text-[var(--color-text-muted)] text-sm">{t.admin_coaches_drawer_no_clients}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {drawerClients.map(client => (
                    <div key={client.client_id} className="rounded-xl border border-[var(--color-border)] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--color-text-primary)] truncate">{client.full_name || '—'}</p>
                          <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">{client.email}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={client.permission_status === 'active' ? 'green' : 'gray'} dot>
                              {client.permission_status === 'active' ? t.active : t.admin_coaches_status_revoked}
                            </Badge>
                            {client.connected_since && (
                              <span className="text-[10px] text-[var(--color-text-muted)]">
                                {formatDate(client.connected_since, locale)}
                              </span>
                            )}
                          </div>
                        </div>
                        <Switch
                          checked={client.permission_status === 'active'}
                          disabled={togglingId === client.client_id}
                          onCheckedChange={v => toggleClientAccess(client, v)}
                        />
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => { setDetachTarget(client); setDetachError(''); }}
                      >
                        {t.admin_coaches_detach_btn}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Attach Client Modal */}
      <Dialog open={showAttach} onOpenChange={setShowAttach}>
        <DialogContent size="md">
          <DialogHeader><DialogTitle>{t.admin_coaches_attach_title}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input
              value={attachSearch}
              onChange={e => setAttachSearch(e.target.value)}
              placeholder={t.admin_coaches_attach_search_placeholder}
              iconLeft={<Search className="w-4 h-4" />}
            />
            {attachError && <p className="text-xs text-[var(--color-danger)]">{attachError}</p>}
            {attachLoading ? (
              <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
            ) : filteredUnassigned.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)] text-center py-6">{t.admin_coaches_attach_none}</p>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-2">
                {filteredUnassigned.map(client => (
                  <div key={client.id} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-4 py-2.5">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{client.full_name || '—'}</p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate">{client.email}</p>
                    </div>
                    <Button
                      size="sm"
                      loading={attachingId === client.id}
                      onClick={() => attachClient(client)}
                    >
                      {t.admin_coaches_attach_confirm_btn}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowAttach(false)}>{t.close}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detach Confirm Modal */}
      <Dialog open={!!detachTarget} onOpenChange={open => { if (!open) setDetachTarget(null); }}>
        <DialogContent size="sm">
          <DialogHeader><DialogTitle>{t.admin_coaches_detach_confirm_title}</DialogTitle></DialogHeader>
          {detachTarget && (
            <div className="space-y-3">
              <p className="text-sm text-[var(--color-text-secondary)]">
                {t.admin_coaches_detach_confirm_body(detachTarget.full_name || detachTarget.email)}
              </p>
              {detachError && <p className="text-xs text-[var(--color-danger)]">{detachError}</p>}
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDetachTarget(null)}>{t.cancel}</Button>
            <Button variant="danger" onClick={confirmDetach} loading={detaching}>{t.admin_coaches_detach_btn}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
