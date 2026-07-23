'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { useLang } from '@/app/i18n/LangContext';
import type { Plan } from '@/types';

interface PlanFeature {
  id: number;
  key: string;
  label: string;
  description: string | null;
  is_enabled: boolean;
  label_en: string | null;
  label_fa: string | null;
}

const planAccent: Record<string, string> = {
  trial: '#8bacc0',
  basic: '#60a5fa',
  pro: '#00d4ff',
  elite: '#a78bfa',
};

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [saving, setSaving] = useState(false);

  const [featuresPlan, setFeaturesPlan] = useState<Plan | null>(null);
  const [features, setFeatures] = useState<PlanFeature[]>([]);
  const [featuresLoading, setFeaturesLoading] = useState(false);
  const [savingFeatures, setSavingFeatures] = useState(false);

  const fetchPlans = () => {
    apiFetch<{ plans: Plan[] }>('/admin/plans')
      .then(d => setPlans(d.plans ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlans(); }, []);

  const openFeatures = (plan: Plan) => {
    setFeaturesPlan(plan);
    setFeaturesLoading(true);
    apiFetch<{ features: PlanFeature[] }>(`/admin/plans/${plan.id}/features`)
      .then(d => setFeatures(d.features ?? []))
      .finally(() => setFeaturesLoading(false));
  };

  const savePlan = async () => {
    if (!editPlan) return;
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name: editPlan.name, price_usd: editPlan.price_usd,
        duration_days: editPlan.duration_days, max_mt5_accounts: editPlan.max_mt5_accounts,
        is_active: editPlan.is_active,
      };
      if (editPlan.price_usd_ir != null) body.price_usd_ir = editPlan.price_usd_ir;
      if (editPlan.coach_price_usd != null) body.coach_price_usd = editPlan.coach_price_usd;
      if (editPlan.coach_price_usd_ir != null) body.coach_price_usd_ir = editPlan.coach_price_usd_ir;
      if (editPlan.price_usdt_monthly != null) body.price_usdt_monthly = editPlan.price_usdt_monthly;
      if (editPlan.price_usdt_yearly != null) body.price_usdt_yearly = editPlan.price_usdt_yearly;
      if (editPlan.price_irr_monthly != null) body.price_irr_monthly = editPlan.price_irr_monthly;
      if (editPlan.price_irr_yearly != null) body.price_irr_yearly = editPlan.price_irr_yearly;
      if (editPlan.ai_monthly_limit == null) {
        body.ai_monthly_limit_clear = true;
      } else {
        body.ai_monthly_limit = editPlan.ai_monthly_limit;
      }
      await apiFetch(`/admin/plans/${editPlan.id}`, { method: 'PATCH', body });
      setEditPlan(null);
      fetchPlans();
    } finally {
      setSaving(false);
    }
  };

  const saveFeatures = async () => {
    if (!featuresPlan) return;
    setSavingFeatures(true);
    try {
      await apiFetch(`/admin/plans/${featuresPlan.id}/features`, {
        method: 'PATCH',
        body: {
          features: features.map(f => ({
            feature_id: f.id, is_enabled: f.is_enabled,
            label_en: f.label_en ?? '', label_fa: f.label_fa ?? '',
          })),
        },
      });
      setFeaturesPlan(null);
    } finally {
      setSavingFeatures(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t.admin_plans_title}</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">{t.admin_plans_sub}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map(plan => (
            <div
              key={plan.id}
              className="glass rounded-2xl p-6 border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-colors"
              style={{ borderTopColor: planAccent[plan.slug] ?? 'var(--color-border)', borderTopWidth: 2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black" style={{ color: planAccent[plan.slug] ?? 'var(--color-text-primary)' }}>
                  {plan.name}
                </h3>
                <Badge variant={plan.is_active ? 'green' : 'red'} dot>
                  {plan.is_active ? t.active : t.inactive}
                </Badge>
              </div>
              <div className="space-y-2 text-sm mb-5 text-[var(--color-text-secondary)]">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">{t.admin_plans_price}</span>
                  <span className="font-bold">${plan.price_usd}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">{t.admin_plans_duration}</span>
                  <span className="font-bold">{t.admin_plans_duration_val(plan.duration_days)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">{t.admin_plans_max_mt5}</span>
                  <span className="font-bold">{plan.max_mt5_accounts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">{t.admin_plans_ai_limit_label}</span>
                  <span className="font-bold">
                    {plan.ai_monthly_limit == null
                      ? t.admin_plans_ai_limit_unlimited
                      : plan.ai_monthly_limit === 0
                        ? t.admin_plans_ai_limit_none
                        : plan.ai_monthly_limit}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => setEditPlan({ ...plan })}>{t.admin_plans_edit_btn}</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openFeatures(plan)}>{t.admin_plans_features_btn}</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Plan Modal */}
      <Dialog open={!!editPlan} onOpenChange={open => { if (!open) setEditPlan(null); }}>
        <DialogContent size="md">
          <DialogHeader><DialogTitle>{t.admin_plans_edit_title}</DialogTitle></DialogHeader>
          {editPlan && (
            <div className="space-y-4">
              <Input label={t.admin_plans_name_label} value={editPlan.name} onChange={e => setEditPlan({ ...editPlan, name: e.target.value })} />
              <Input label={t.admin_plans_price_label} type="number" min={0} step={0.01} value={editPlan.price_usd}
                onChange={e => setEditPlan({ ...editPlan, price_usd: parseFloat(e.target.value) || 0 })} />
              <Input label={t.admin_plans_price_ir_label} type="number" min={0} step={0.01}
                placeholder={t.admin_plans_price_placeholder_default}
                value={editPlan.price_usd_ir ?? ''}
                onChange={e => {
                  const v = e.target.value;
                  setEditPlan({ ...editPlan, price_usd_ir: v === '' ? null : parseFloat(v) || 0 });
                }} />
              <Input label={t.admin_plans_coach_price_label} type="number" min={0} step={0.01}
                placeholder={t.admin_plans_price_placeholder_default}
                value={editPlan.coach_price_usd ?? ''}
                onChange={e => {
                  const v = e.target.value;
                  setEditPlan({ ...editPlan, coach_price_usd: v === '' ? null : parseFloat(v) || 0 });
                }} />
              <Input label={t.admin_plans_coach_price_ir_label} type="number" min={0} step={0.01}
                placeholder={t.admin_plans_price_placeholder_default}
                value={editPlan.coach_price_usd_ir ?? ''}
                onChange={e => {
                  const v = e.target.value;
                  setEditPlan({ ...editPlan, coach_price_usd_ir: v === '' ? null : parseFloat(v) || 0 });
                }} />
              <Input label={t.admin_plans_price_usdt_monthly_label} type="number" min={0} step={0.01}
                placeholder={t.admin_plans_price_placeholder_default}
                value={editPlan.price_usdt_monthly ?? ''}
                onChange={e => {
                  const v = e.target.value;
                  setEditPlan({ ...editPlan, price_usdt_monthly: v === '' ? null : parseFloat(v) || 0 });
                }} />
              <Input label={t.admin_plans_price_usdt_yearly_label} type="number" min={0} step={0.01}
                placeholder={t.admin_plans_price_placeholder_default}
                value={editPlan.price_usdt_yearly ?? ''}
                onChange={e => {
                  const v = e.target.value;
                  setEditPlan({ ...editPlan, price_usdt_yearly: v === '' ? null : parseFloat(v) || 0 });
                }} />
              <Input label={t.admin_plans_price_irr_monthly_label} type="number" min={0} step={1}
                placeholder={t.admin_plans_price_placeholder_default}
                value={editPlan.price_irr_monthly ?? ''}
                onChange={e => {
                  const v = e.target.value;
                  setEditPlan({ ...editPlan, price_irr_monthly: v === '' ? null : parseInt(v) || 0 });
                }} />
              <Input label={t.admin_plans_price_irr_yearly_label} type="number" min={0} step={1}
                placeholder={t.admin_plans_price_placeholder_default}
                value={editPlan.price_irr_yearly ?? ''}
                onChange={e => {
                  const v = e.target.value;
                  setEditPlan({ ...editPlan, price_irr_yearly: v === '' ? null : parseInt(v) || 0 });
                }} />
              <Input label={t.admin_plans_duration_label} type="number" min={1} value={editPlan.duration_days}
                onChange={e => setEditPlan({ ...editPlan, duration_days: parseInt(e.target.value) || 1 })} />
              <Input label={t.admin_plans_max_mt5_label} type="number" min={1} value={editPlan.max_mt5_accounts}
                onChange={e => setEditPlan({ ...editPlan, max_mt5_accounts: parseInt(e.target.value) || 1 })} />
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--color-text-muted)]">{t.admin_plans_ai_limit_label}</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min={0}
                    className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-deep)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-cyan)]"
                    value={editPlan.ai_monthly_limit ?? ''}
                    placeholder={t.admin_plans_ai_limit_unlimited}
                    onChange={e => {
                      const v = e.target.value;
                      setEditPlan({ ...editPlan, ai_monthly_limit: v === '' ? null : parseInt(v) || 0 });
                    }}
                  />
                </div>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  {t.admin_plans_ai_limit_unlimited} = leave blank · 0 = {t.admin_plans_ai_limit_none}
                </p>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-4 py-3">
                <span className="text-sm text-[var(--color-text-secondary)]">{t.admin_plans_status_label}</span>
                <Switch checked={editPlan.is_active} onCheckedChange={v => setEditPlan({ ...editPlan, is_active: v })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditPlan(null)}>{t.cancel}</Button>
            <Button onClick={savePlan} loading={saving}>{t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Features Modal */}
      <Dialog open={!!featuresPlan} onOpenChange={open => { if (!open) setFeaturesPlan(null); }}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>{featuresPlan ? t.admin_plans_features_title(featuresPlan.name) : ''}</DialogTitle>
          </DialogHeader>
          {featuresPlan && (
            <div>
              {featuresLoading ? (
                <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
              ) : features.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)] py-4 text-center">{t.admin_plans_no_features}</p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto mb-2">
                  {features.map(f => (
                    <div key={f.id} className="rounded-lg border border-[var(--color-border)] px-4 py-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">{f.label}</p>
                          {f.description && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{f.description}</p>}
                        </div>
                        <Switch
                          checked={f.is_enabled}
                          onCheckedChange={v => setFeatures(prev => prev.map(x => x.id === f.id ? { ...x, is_enabled: v } : x))}
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-deep)] px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-cyan)]"
                          placeholder={t.admin_plans_label_en_placeholder}
                          value={f.label_en ?? ''}
                          onChange={e => setFeatures(prev => prev.map(x => x.id === f.id ? { ...x, label_en: e.target.value } : x))}
                        />
                        <input
                          type="text"
                          dir="rtl"
                          className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-deep)] px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-cyan)]"
                          placeholder={t.admin_plans_label_fa_placeholder}
                          value={f.label_fa ?? ''}
                          onChange={e => setFeatures(prev => prev.map(x => x.id === f.id ? { ...x, label_fa: e.target.value } : x))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setFeaturesPlan(null)}>{t.cancel}</Button>
            <Button onClick={saveFeatures} loading={savingFeatures} disabled={features.length === 0}>{t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
