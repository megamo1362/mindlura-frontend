'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, KeyRound, Plus, Copy, Check, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InlineLoader } from '@/components/shared';
import { ClientCard } from './client-card';
import { useMyClients, useInviteCodes, useCreateInviteCode, useDeleteInviteCode } from '@/hooks/use-coach';

// ── Invite codes panel ─────────────────────────────────────

function InviteCodesPanel() {
  const { data: codes = [], isLoading } = useInviteCodes();
  const { mutate: create, isPending: creating } = useCreateInviteCode();
  const { mutate: remove, isPending: deletingAny, variables: deletingId } = useDeleteInviteCode();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expiresDays, setExpiresDays] = useState('30');
  const [maxUses, setMaxUses] = useState('');

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
      {/* Create panel */}
      <div className="card-surface rounded-2xl p-5">
        <h3 className="font-bold text-[var(--color-text-primary)] mb-4">ساخت کد دعوت جدید</h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--color-text-muted)]">انقضا</label>
            <select
              value={expiresDays}
              onChange={(e) => setExpiresDays(e.target.value)}
              className="input-dark rounded-xl px-3 py-2 text-sm"
            >
              <option value="7">۷ روز</option>
              <option value="14">۱۴ روز</option>
              <option value="30">۳۰ روز</option>
              <option value="90">۳ ماه</option>
              <option value="0">بدون انقضا</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[var(--color-text-muted)]">
              تعداد استفاده
              <span className="mr-1 text-[var(--color-text-muted)]/60 text-[10px]">(خالی = یک‌بار)</span>
            </label>
            <input
              type="number"
              min="1"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              placeholder="مثلا ۵"
              className="input-dark rounded-xl px-3 py-2 text-sm w-24"
            />
          </div>

          <Button variant="primary" size="sm" onClick={handleCreate} loading={creating} disabled={creating}>
            <Plus className="h-3.5 w-3.5 ml-1" />
            ساخت کد
          </Button>
        </div>
      </div>

      {isLoading && <InlineLoader label="در حال بارگذاری کدها..." />}

      {/* Active codes */}
      {activeCodes.length > 0 && (
        <div className="card-surface rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--color-border)]">
            <p className="text-sm font-bold text-[var(--color-text-secondary)]">
              کدهای فعال
              <Badge variant="cyan" className="mr-2">{activeCodes.length}</Badge>
            </p>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {activeCodes.map((c) => (
              <div key={c.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-lg font-black tracking-[0.2em] text-[var(--color-cyan)]">
                    {c.code}
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {c.max_uses !== null ? (
                      <Badge variant="purple">{c.used_count}/{c.max_uses} استفاده</Badge>
                    ) : (
                      <span className="text-xs text-[var(--color-text-muted)]">یک‌بار</span>
                    )}
                    {c.expires_at && (
                      <span className="text-xs text-[var(--color-text-muted)]">
                        تا {new Date(c.expires_at).toLocaleDateString('fa-IR')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(c.id, c.code)}
                    className={copiedId === c.id ? 'text-[var(--color-success)]' : ''}
                  >
                    {copiedId === c.id
                      ? <Check className="h-3.5 w-3.5" />
                      : <Copy className="h-3.5 w-3.5" />}
                    <span className="mr-1.5 text-xs">{copiedId === c.id ? 'کپی شد' : 'کپی'}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => remove(c.id)}
                    disabled={deletingAny && deletingId === c.id}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-status-error)] hover:bg-[rgba(239,68,68,0.08)]"
                  >
                    {deletingAny && deletingId === c.id
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Trash2 className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Used codes */}
      {usedCodes.length > 0 && (
        <div className="card-surface rounded-2xl overflow-hidden opacity-60">
          <div className="px-5 py-3 border-b border-[var(--color-border)]">
            <p className="text-sm font-bold text-[var(--color-text-muted)]">تکمیل‌شده</p>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {usedCodes.map((c) => (
              <div key={c.id} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-bold tracking-widest line-through text-[var(--color-text-muted)]">
                    {c.code}
                  </span>
                  {c.used_by_name && (
                    <span className="text-xs text-[var(--color-text-muted)]">{c.used_by_name}</span>
                  )}
                </div>
                {c.used_at && (
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {new Date(c.used_at).toLocaleDateString('fa-IR')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && codes.length === 0 && (
        <div className="card-surface rounded-2xl p-12 text-center">
          <KeyRound className="h-10 w-10 text-[var(--color-text-muted)] mx-auto mb-3" />
          <p className="text-[var(--color-text-muted)]">هنوز کد دعوتی نساختید</p>
          <p className="text-sm text-[var(--color-text-muted)]/60 mt-1">
            کلاینت‌ها با کد دعوت شما ثبت‌نام می‌کنند
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────

type Tab = 'clients' | 'invite-codes';

export function CoachClientsPage() {
  const [tab, setTab] = useState<Tab>('clients');
  const { data: clients = [], isLoading, isError } = useMyClients();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text-primary)]">پنل کوچ</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">مدیریت کلاینت‌ها و کدهای دعوت</p>
      </div>

      {/* Tab pills */}
      <div className="flex gap-1 p-1 rounded-xl w-fit bg-[rgba(0,0,0,0.3)] border border-[var(--color-border)]">
        {([
          { key: 'clients' as const, label: 'کلاینت‌ها', icon: Users, count: clients.length as number | undefined },
          { key: 'invite-codes' as const, label: 'کدهای دعوت', icon: KeyRound, count: undefined as number | undefined },
        ]).map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? 'bg-[var(--color-cyan-dim)] text-[var(--color-cyan)] border border-[rgba(0,212,255,0.2)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {count !== undefined && !isLoading && (
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-[rgba(0,212,255,0.1)] text-[var(--color-cyan)]">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {tab === 'clients' && (
          <motion.div key="clients" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {isLoading && <InlineLoader label="در حال بارگذاری کلاینت‌ها..." />}
            {isError && (
              <p className="text-sm text-[var(--color-status-error)]">خطا در دریافت اطلاعات</p>
            )}
            {!isLoading && !isError && clients.length === 0 && (
              <div className="card-surface rounded-2xl p-16 text-center">
                <Users className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-3" />
                <p className="text-[var(--color-text-muted)] text-lg">هنوز کلاینتی متصل نشده</p>
                <p className="text-sm text-[var(--color-text-muted)]/60 mt-1">
                  کلاینت‌ها با کد دعوت شما ثبت‌نام می‌کنند
                </p>
              </div>
            )}
            {!isLoading && clients.length > 0 && (
              <div className="space-y-4">
                {clients.map((c, i) => (
                  <ClientCard key={c.client_coach_id} client={c} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === 'invite-codes' && (
          <motion.div key="invite-codes" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <InviteCodesPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
