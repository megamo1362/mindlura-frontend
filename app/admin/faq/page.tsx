'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useLang } from '@/app/i18n/LangContext';
import type { FAQItem, FAQCategory } from '@/types';

const CATEGORIES: FAQCategory[] = ['general', 'coaches', 'payments', 'technical'];

const emptyForm = {
  question_en: '', question_fa: '', answer_en: '', answer_fa: '',
  category: 'general' as FAQCategory, sort_order: 0, is_active: true,
};

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const { t } = useLang();

  const [editFaq, setEditFaq] = useState<FAQItem | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FAQItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const categoryLabel: Record<FAQCategory, string> = {
    general: t.admin_faq_category_general,
    coaches: t.admin_faq_category_coaches,
    payments: t.admin_faq_category_payments,
    technical: t.admin_faq_category_technical,
  };

  const fetchFaqs = () => {
    setLoading(true);
    apiFetch<{ faqs: FAQItem[] }>('/admin/faqs')
      .then(d => setFaqs(d.faqs ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFaqs(); }, []);

  const visibleFaqs = filterCategory ? faqs.filter(f => f.category === filterCategory) : faqs;

  const openEdit = (faq: FAQItem) => {
    setEditFaq(faq);
    setForm({
      question_en: faq.question_en, question_fa: faq.question_fa,
      answer_en: faq.answer_en, answer_fa: faq.answer_fa,
      category: faq.category, sort_order: faq.sort_order, is_active: faq.is_active,
    });
  };

  const openCreate = () => {
    setForm(emptyForm);
    setShowCreate(true);
  };

  const closeModal = () => {
    setEditFaq(null);
    setShowCreate(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editFaq) {
        await apiFetch(`/admin/faqs/${editFaq.id}`, { method: 'PATCH', body: form });
      } else {
        await apiFetch('/admin/faqs', { method: 'POST', body: form });
      }
      closeModal();
      fetchFaqs();
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/admin/faqs/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      fetchFaqs();
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (faq: FAQItem) => {
    setTogglingId(faq.id);
    try {
      await apiFetch(`/admin/faqs/${faq.id}/toggle`, { method: 'PATCH' });
      fetchFaqs();
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t.admin_faq_title}</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{t.admin_faq_sub}</p>
        </div>
        <div className="flex gap-3">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t.admin_faq_filter_all}</SelectItem>
              {CATEGORIES.map(c => (
                <SelectItem key={c} value={c}>{categoryLabel[c]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openCreate}>{t.admin_faq_add}</Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
      ) : visibleFaqs.length === 0 ? (
        <p className="text-sm text-[var(--color-text-muted)] py-8 text-center">{t.admin_faq_none}</p>
      ) : (
        <div className="glass rounded-2xl overflow-hidden border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-deep)] text-[var(--color-text-muted)]">
                <th className="px-4 py-3 text-right">{t.admin_faq_col_question}</th>
                <th className="px-4 py-3 text-center">{t.admin_faq_col_category}</th>
                <th className="px-4 py-3 text-center">{t.admin_faq_col_sort}</th>
                <th className="px-4 py-3 text-center">{t.admin_faq_col_status}</th>
                <th className="px-4 py-3 text-center">{t.admin_faq_col_actions}</th>
              </tr>
            </thead>
            <tbody>
              {visibleFaqs.map(f => (
                <tr key={f.id} className="border-t border-[var(--color-border)] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 max-w-sm truncate text-[var(--color-text-primary)]">{f.question_en}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="blue">{categoryLabel[f.category]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-[var(--color-text-muted)]">{f.sort_order}</td>
                  <td className="px-4 py-3 text-center">
                    <Switch
                      checked={f.is_active}
                      onCheckedChange={() => toggleActive(f)}
                      disabled={togglingId === f.id}
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openEdit(f)}>{t.edit}</Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteTarget(f)}>{t.delete}</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Dialog open={showCreate || !!editFaq} onOpenChange={open => { if (!open) closeModal(); }}>
        <DialogContent size="lg">
          <DialogHeader><DialogTitle>{editFaq ? t.admin_faq_edit_title : t.admin_faq_create_title}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input label={t.admin_faq_question_en_label} value={form.question_en}
              onChange={e => setForm({ ...form, question_en: e.target.value })} />
            <Input label={t.admin_faq_question_fa_label} dir="rtl" value={form.question_fa}
              onChange={e => setForm({ ...form, question_fa: e.target.value })} />
            <Textarea label={t.admin_faq_answer_en_label} rows={3} value={form.answer_en}
              onChange={e => setForm({ ...form, answer_en: e.target.value })} />
            <Textarea label={t.admin_faq_answer_fa_label} dir="rtl" rows={3} value={form.answer_fa}
              onChange={e => setForm({ ...form, answer_fa: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--color-text-muted)]">{t.admin_faq_category_label}</label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v as FAQCategory })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c} value={c}>{categoryLabel[c]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input label={t.admin_faq_sort_order_label} type="number" value={form.sort_order}
                onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-4 py-3">
              <span className="text-sm text-[var(--color-text-secondary)]">{t.admin_faq_active_label}</span>
              <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={closeModal}>{t.cancel}</Button>
            <Button onClick={save} loading={saving}>{t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null); }}>
        <DialogContent size="sm">
          <DialogHeader><DialogTitle>{t.admin_faq_delete_confirm_title}</DialogTitle></DialogHeader>
          <p className="text-sm text-[var(--color-text-secondary)]">{t.admin_faq_delete_confirm_body}</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>{t.cancel}</Button>
            <Button variant="danger" onClick={confirmDelete} loading={deleting}>{t.delete}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
