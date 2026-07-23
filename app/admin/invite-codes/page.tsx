'use client';

import { useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useLang } from '@/app/i18n/LangContext';
import type { InviteCode, AdminCoach } from '@/types';

export default function AdminInviteCodesPage() {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterUsed, setFilterUsed] = useState('');
  const [copied, setCopied] = useState('');
  const { t, lang } = useLang();

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ code_type: 'client', count: 1, plan_slug: '', expires_days: '', label: '', plan_duration_days: '', max_uses: 1, coach_id: '' });
  const [creating, setCreating] = useState(false);
  const [newCodes, setNewCodes] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState('');
  const [coaches, setCoaches] = useState<AdminCoach[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<InviteCode | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCodes = (used = '') => {
    setLoading(true);
    apiFetch<{ codes: InviteCode[]; total: number }>(`/admin/invite-codes${used !== '' ? `?is_used=${used}` : ''}`)
      .then(d => { setCodes(d.codes ?? []); setTotal(d.total ?? 0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCodes(filterUsed); }, [filterUsed]);
  useEffect(() => {
    apiFetch<{ coaches: AdminCoach[] }>('/admin/coaches').then(d => setCoaches(d.coaches ?? []));
  }, []);

  const createCodes = async () => {
    setCreating(true);
    try {
      const body: Record<string, unknown> = { code_type: form.code_type, count: form.count };
      if (form.plan_slug) body.plan_slug = form.plan_slug;
      if (form.expires_days) body.expires_days = parseInt(form.expires_days);
      if (form.label) body.label = form.label;
      if (form.plan_duration_days) body.plan_duration_days = parseInt(form.plan_duration_days);
      if (form.max_uses) body.max_uses = form.max_uses;
      if (form.coach_id) body.coach_id = parseInt(form.coach_id);
      const data = await apiFetch<{ codes: string[] }>('/admin/invite-codes', { method: 'POST', body });
      setNewCodes(data.codes ?? []);
      fetchCodes(filterUsed);
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/admin/invite-codes/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      fetchCodes(filterUsed);
    } finally {
      setDeleting(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(''), 2000);
  };

  const copyLink = (code: string) => {
    navigator.clipboard.writeText(`https://mindlura.com/register?invite=${code}`);
    setCopiedLink(code);
    setTimeout(() => setCopiedLink(''), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(newCodes.join('\n'));
    setCopied('all');
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t.admin_codes_title}</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{t.admin_codes_total(total)}</p>
        </div>
        <div className="flex gap-3">
          <Select value={filterUsed} onValueChange={setFilterUsed}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t.admin_codes_filter_all}</SelectItem>
              <SelectItem value="false">{t.admin_codes_filter_unused}</SelectItem>
              <SelectItem value="true">{t.admin_codes_filter_used}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => { setShowCreate(true); setNewCodes([]); }}>{t.admin_codes_add}</Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-deep)] text-[var(--color-text-muted)]">
                <th className="px-4 py-3 text-right">{t.admin_codes_col_code}</th>
                <th className="px-4 py-3 text-right">{t.admin_codes_col_label}</th>
                <th className="px-4 py-3 text-center">{t.admin_codes_col_type}</th>
                <th className="px-4 py-3 text-center">{t.admin_codes_col_plan}</th>
                <th className="px-4 py-3 text-center">{t.admin_codes_col_duration}</th>
                <th className="px-4 py-3 text-center">{t.admin_codes_col_slots}</th>
                <th className="px-4 py-3 text-center">{t.admin_codes_col_status}</th>
                <th className="px-4 py-3 text-center">{t.admin_codes_col_expiry}</th>
                <th className="px-4 py-3 text-center">{t.admin_codes_col_copy}</th>
                <th className="px-4 py-3 text-center">{t.admin_codes_col_actions}</th>
              </tr>
            </thead>
            <tbody>
              {codes.map(c => (
                <tr key={c.id} className="border-t border-[var(--color-border)] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[var(--color-cyan)]">{c.code}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)] text-xs">{c.label || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={c.code_type === 'coach' ? 'purple' : 'blue'}>
                      {c.code_type === 'coach' ? t.admin_codes_type_coach : t.admin_codes_type_client}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-[var(--color-text-muted)] text-xs">
                    {c.plan_name || '—'}
                  </td>
                  <td className="px-4 py-3 text-center text-[var(--color-text-muted)] text-xs">
                    {c.plan_duration_days ? t.admin_plans_duration_val(c.plan_duration_days) : '—'}
                  </td>
                  <td className="px-4 py-3 text-center text-[var(--color-text-muted)] text-xs">
                    {c.used_count}{c.max_uses != null ? `/${c.max_uses}` : ''}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant={c.status === 'active' ? 'green' : c.status === 'expired' ? 'red' : 'gray'}
                      dot
                    >
                      {c.status === 'active' ? t.admin_codes_status_active
                        : c.status === 'expired' ? t.admin_codes_status_expired
                        : t.admin_codes_status_full}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-[var(--color-text-muted)] text-xs">
                    {c.expires_at ? new Date(c.expires_at).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US') : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon-sm" title={t.admin_codes_col_code} onClick={() => copyCode(c.code)}>
                        {copied === c.code ? <Check className="w-3.5 h-3.5 text-[var(--color-success)]" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => copyLink(c.code)}>
                        {copiedLink === c.code ? t.admin_codes_link_copied : t.admin_codes_copy_link}
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button variant="danger" size="sm" onClick={() => setDeleteTarget(c)}>{t.delete}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <Dialog open={showCreate} onOpenChange={open => { setShowCreate(open); if (!open) setNewCodes([]); }}>
        <DialogContent size="md">
          <DialogHeader><DialogTitle>{t.admin_codes_create_title}</DialogTitle></DialogHeader>
          {newCodes.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-bold text-[var(--color-success)]">{t.admin_codes_create_success(newCodes.length)}</p>
              <div className="rounded-xl border border-[var(--color-border)] p-3 space-y-2 max-h-48 overflow-y-auto">
                {newCodes.map(code => (
                  <div key={code} className="flex items-center justify-between">
                    <span className="font-mono text-[var(--color-cyan)] font-bold">{code}</span>
                    <Button variant="ghost" size="icon-sm" onClick={() => copyCode(code)}>
                      {copied === code ? <Check className="w-3.5 h-3.5 text-[var(--color-success)]" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="w-full" onClick={copyAll}>
                {copied === 'all' ? t.admin_codes_copied_all : t.admin_codes_copy_all}
              </Button>
              <Button className="w-full" onClick={() => { setShowCreate(false); setNewCodes([]); }}>{t.admin_codes_create_close}</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--color-text-muted)]">{t.admin_codes_code_type_label}</label>
                <Select value={form.code_type} onValueChange={v => setForm({ ...form, code_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">{t.admin_codes_type_client}</SelectItem>
                    <SelectItem value="coach">{t.admin_codes_type_coach}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input label={t.admin_codes_count_label} type="number" min={1} max={50} value={form.count}
                onChange={e => setForm({ ...form, count: parseInt(e.target.value) || 1 })} />
              <Input label={t.admin_codes_max_uses_label} hint={t.admin_codes_max_uses_hint} type="number" min={1}
                value={form.max_uses} onChange={e => setForm({ ...form, max_uses: parseInt(e.target.value) || 1 })} />
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--color-text-muted)]">{t.admin_codes_coach_label}</label>
                <Select value={form.coach_id} onValueChange={v => setForm({ ...form, coach_id: v })}>
                  <SelectTrigger><SelectValue placeholder={t.admin_codes_no_coach} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t.admin_codes_no_coach}</SelectItem>
                    {coaches.map(coach => (
                      <SelectItem key={coach.id} value={String(coach.id)}>{coach.full_name || coach.email}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--color-text-muted)]">{t.admin_codes_plan_label}</label>
                <Select value={form.plan_slug} onValueChange={v => setForm({ ...form, plan_slug: v })}>
                  <SelectTrigger><SelectValue placeholder={t.admin_codes_no_plan} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t.admin_codes_no_plan}</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="elite">Elite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input label={t.admin_codes_expires_label} type="number" placeholder={t.admin_codes_expires_placeholder}
                value={form.expires_days} onChange={e => setForm({ ...form, expires_days: e.target.value })} />
              <Input label={t.admin_codes_label_label} placeholder={t.admin_codes_label_placeholder}
                value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
              <Input label={t.admin_codes_plan_duration_label} type="number" hint={t.admin_codes_plan_duration_hint}
                value={form.plan_duration_days} onChange={e => setForm({ ...form, plan_duration_days: e.target.value })} />
              <DialogFooter>
                <Button variant="secondary" onClick={() => setShowCreate(false)}>{t.cancel}</Button>
                <Button onClick={createCodes} loading={creating}>{t.admin_codes_create_btn}</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null); }}>
        <DialogContent size="sm">
          <DialogHeader><DialogTitle>{t.admin_codes_delete_confirm_title}</DialogTitle></DialogHeader>
          <p className="text-sm text-[var(--color-text-secondary)]">{t.admin_codes_delete_confirm_body}</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>{t.cancel}</Button>
            <Button variant="danger" onClick={confirmDelete} loading={deleting}>{t.delete}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
