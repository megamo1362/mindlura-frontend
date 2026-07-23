'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import {
  Check, Copy, Loader2, ShieldAlert, Wallet, ArrowLeft, ArrowRight, PartyPopper, Star,
} from 'lucide-react';
import { PageHeader } from '@/components/redesign/ui/PageHeader';
import { Card } from '@/components/redesign/ui/Card';
import { Badge } from '@/components/redesign/ui/Badge';
import { Button } from '@/components/redesign/ui/Button';
import { usePaymentPlans, useInitiatePayment, useVerifyPayment } from '@/hooks/use-payment';
import { apiFetch, ApiError } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import { useLang } from '@/app/i18n/LangContext';
import type { Translations } from '@/app/i18n/translations';
import { cn } from '@/lib/utils';
import { BILLING_PERIODS, type BillingPeriod } from '@/lib/pricing';
import type { PaymentNetwork, InitiatePaymentResponse, ProfileResponse, PricingPlan } from '@/types';

type FlowStep = 'select' | 'network' | 'pay' | 'txid' | 'done';

const NETWORKS: { id: PaymentNetwork; name: string }[] = [
  { id: 'TRC20', name: 'TRC20 (Tron)' },
  { id: 'BEP20', name: 'BEP20 (BNB Chain)' },
];

const MAX_FEATURES_SHOWN = 6;

/**
 * The crypto payment backend only prices monthly and annual terms
 * (see /payment/plans → price_usdt_monthly / price_usdt_yearly). A 3- or
 * 6-month preview has no matching backend price, so the actual charge snaps
 * to the numerically closest supported term (monthly for 1/3/6, annual for
 * 12) while the grid still previews the full 1/3/6/12 pricing shown on the
 * public pricing page.
 */
function periodToDurationDays(period: BillingPeriod): 30 | 365 {
  return period === '12' ? 365 : 30;
}

const PERIOD_LABEL_KEYS: Record<BillingPeriod, (t: Translations) => string> = {
  '1': (t) => t.billing_monthly,
  '3': (t) => t.billing_period_3,
  '6': (t) => t.billing_period_6,
  '12': (t) => t.billing_yearly,
};

export function RedesignBillingPage({ plans, isIran }: { plans: PricingPlan[]; isIran: boolean }) {
  const { t, lang, isRTL } = useLang();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
    queryKey: QUERY_KEYS.user,
    queryFn: () => apiFetch<ProfileResponse>('/profile/me'),
  });

  const { data: paymentPlans = [] } = usePaymentPlans();
  const initiate = useInitiatePayment();
  const verify = useVerifyPayment();

  const [period, setPeriod] = useState<BillingPeriod>('1');
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [step, setStep] = useState<FlowStep>('select');
  const [paymentData, setPaymentData] = useState<InitiatePaymentResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [txid, setTxid] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const cycle = periodToDurationDays(period);
  const displayPlans = plans.filter((p) => p.slug !== 'trial' && p.price_usd > 0);

  const selectedPaymentPlan = paymentPlans.find((p) => p.id === selectedPlanId) ?? null;
  const selectedDuration = selectedPaymentPlan?.durations.find((d) => d.days === cycle) ?? null;

  const daysRemaining = profile?.subscription_days_remaining ?? null;
  const daysColor =
    daysRemaining == null ? 'text-[var(--text-muted)]' : daysRemaining > 3 ? 'text-[var(--profit)]' : daysRemaining > 0 ? 'text-[var(--warning)]' : 'text-[var(--loss)]';

  const resetFlow = () => {
    setStep('select');
    setSelectedPlanId(null);
    setPaymentData(null);
    setTxid('');
    setVerifyError('');
  };

  const pickPlan = (planId: number) => {
    setSelectedPlanId(planId);
    setStep('network');
  };

  const pickNetwork = async (net: PaymentNetwork) => {
    if (!selectedPaymentPlan || !selectedDuration) return;
    try {
      const res = await initiate.mutateAsync({
        plan_id: selectedPaymentPlan.id,
        duration_days: selectedDuration.days,
        network: net,
      });
      setPaymentData(res);
      setStep('pay');
    } catch {
      // toast/error is not shown here; the network mutation state (isError) drives inline UI
    }
  };

  const copyAddress = () => {
    if (!paymentData) return;
    navigator.clipboard.writeText(paymentData.wallet_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitTxid = async () => {
    if (!paymentData) return;
    setVerifyError('');
    try {
      const res = await verify.mutateAsync({ transaction_id: paymentData.transaction_id, txid });
      setExpiresAt(res.expires_at);
      setStep('done');
      refetchProfile();
    } catch (err) {
      setVerifyError(err instanceof ApiError ? err.message : t.error_generic);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title={t.billing_title} description={t.billing_desc} />

      {/* Section 1 — Current Subscription */}
      <Card>
        {profileLoading ? (
          <div className="skeleton h-16 rounded-lg" />
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">{t.billing_current_plan}</p>
              <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">{profile?.plan ?? '—'}</p>
              {profile?.subscription_expires_at && (
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {t.billing_expires}: {new Date(profile.subscription_expires_at).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}
                  {daysRemaining != null && (
                    <span className={cn('font-semibold', daysColor)}>
                      {' '}
                      · {daysRemaining > 0 ? t.billing_days_left(daysRemaining) : t.billing_expired}
                    </span>
                  )}
                </p>
              )}
            </div>
            {(!profile?.plan || (daysRemaining != null && daysRemaining <= 3)) && (
              <Badge variant="warning" icon={<ShieldAlert className="h-3 w-3" />}>{t.billing_upgrade}</Badge>
            )}
          </div>
        )}
      </Card>

      {/* Section 2 — Choose Plan */}
      {step === 'select' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">{t.billing_choose_plan}</h2>
            <div className="inline-flex flex-wrap rounded-[var(--radius-sm)] border border-[var(--border-subtle)] p-0.5">
              {BILLING_PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={cn(
                    'rounded-[calc(var(--radius-sm)-2px)] px-3 py-1.5 text-xs font-semibold transition-colors',
                    period === p ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)]',
                  )}
                >
                  {PERIOD_LABEL_KEYS[p](t)}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)]">{t.billing_savings_note}</p>

          {displayPlans.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--text-muted)]">{t.billing_plan_empty}</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {displayPlans.map((plan) => (
                <PricingPlanCard
                  key={plan.id}
                  plan={plan}
                  period={period}
                  isIran={isIran}
                  lang={lang}
                  t={t}
                  onSelect={() => pickPlan(plan.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section 3 — Payment Flow */}
      {step === 'network' && selectedPaymentPlan && selectedDuration && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">{t.billing_select_network}</h2>
            <Button variant="ghost" size="sm" onClick={resetFlow}>{t.cancel}</Button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {NETWORKS.map((n) => (
              <button
                key={n.id}
                type="button"
                disabled={initiate.isPending}
                onClick={() => pickNetwork(n.id)}
                className="flex flex-col items-start gap-1 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-start transition-colors hover:border-[var(--accent)] disabled:opacity-50"
              >
                <span className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
                  <Wallet className="h-4 w-4 text-[var(--accent)]" />
                  {n.name}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {n.id === 'TRC20' ? t.billing_trc20_desc : t.billing_bep20_desc}
                </span>
              </button>
            ))}
          </div>
          {initiate.isPending && (
            <p className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> {t.loading}
            </p>
          )}
          {initiate.isError && (
            <p className="text-xs text-[var(--loss)]">
              {initiate.error instanceof ApiError ? initiate.error.message : t.error_generic}
            </p>
          )}
        </Card>
      )}

      {step === 'pay' && paymentData && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">{t.billing_wallet_address}</h2>
            <Button variant="ghost" size="sm" onClick={resetFlow}>{t.cancel}</Button>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="rounded-[var(--radius-lg)] bg-white p-3">
              <QRCodeSVG value={paymentData.wallet_address} size={140} />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">{t.billing_send_amount}</p>
                <p className="rd-tabular text-2xl font-bold text-[var(--text-primary)]">
                  {paymentData.amount_usdt.toFixed(2)} USDT
                  <span className="ms-2 text-sm font-medium text-[var(--text-muted)]">({paymentData.network})</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">{t.billing_wallet_address}</p>
                <div className="mt-1 flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 py-2">
                  <code className="flex-1 break-all font-mono text-xs text-[var(--text-primary)]">{paymentData.wallet_address}</code>
                  <button type="button" onClick={copyAddress} className="shrink-0 text-[var(--text-muted)] hover:text-[var(--accent)]">
                    {copied ? <Check className="h-4 w-4 text-[var(--profit)]" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                {copied && <p className="mt-1 text-xs text-[var(--profit)]">{t.billing_copied}</p>}
              </div>
              <div className="rounded-[var(--radius-sm)] border border-[var(--warning)]/30 bg-[var(--warning-soft)] px-3 py-2 text-xs text-[var(--warning)]">
                {t.billing_warning_token(paymentData.network)}
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={() => setStep('txid')}>
            {t.billing_sent_payment} <ArrowIcon className="h-4 w-4" />
          </Button>
        </Card>
      )}

      {step === 'txid' && paymentData && (
        <Card className="space-y-4">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">{t.billing_enter_txid}</h2>
          <input
            type="text"
            value={txid}
            onChange={(e) => setTxid(e.target.value)}
            placeholder={t.billing_txid_placeholder}
            dir="ltr"
            className="h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 font-mono text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
          {verifyError && <p className="text-xs text-[var(--loss)]">{verifyError}</p>}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setStep('pay')}>{t.cancel}</Button>
            <Button className="flex-1" onClick={submitTxid} loading={verify.isPending} disabled={!txid.trim()}>
              {verify.isPending ? t.billing_verifying : t.billing_verify}
            </Button>
          </div>
        </Card>
      )}

      {step === 'done' && (
        <Card className="space-y-3 text-center">
          <PartyPopper className="mx-auto h-8 w-8 text-[var(--profit)]" />
          <h2 className="text-lg font-bold text-[var(--text-primary)]">{t.billing_success}</h2>
          {expiresAt && (
            <p className="text-sm text-[var(--text-muted)]">
              {t.billing_expires}: {new Date(expiresAt).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}
            </p>
          )}
          <Button variant="secondary" onClick={resetFlow}>{t.billing_try_again}</Button>
        </Card>
      )}
    </div>
  );
}

function PricingPlanCard({
  plan,
  period,
  isIran,
  lang,
  t,
  onSelect,
}: {
  plan: PricingPlan;
  period: BillingPeriod;
  isIran: boolean;
  lang: 'en' | 'fa';
  t: Translations;
  onSelect: () => void;
}) {
  const isPro = plan.slug === 'pro';
  const months = period === '1' ? 1 : Number(period);
  const discountPct = period === '1' ? 0 : (plan.discounts[period] ?? 0);
  const displayMonthly = (isIran ? plan.price_usd_ir : plan.price_usd) * (1 - discountPct / 100);
  const totalPrice = displayMonthly * months;

  const shown = plan.features.slice(0, MAX_FEATURES_SHOWN);
  const remaining = plan.features.length - shown.length;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex flex-col rounded-[var(--radius-lg)] border p-4 text-start transition-colors',
        isPro
          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent)]',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-[var(--text-primary)]">{plan.name}</span>
        {isPro && (
          <Badge variant="accent" icon={<Star className="h-3 w-3" />}>
            {t.billing_most_popular}
          </Badge>
        )}
      </div>

      <div className="mt-2">
        {isIran && (
          <div className="text-xs text-[var(--text-muted)] line-through">
            ${plan.price_usd.toFixed(2)}{t.billing_per_month}
          </div>
        )}
        <p className="rd-tabular text-2xl font-bold text-[var(--text-primary)]">
          ${displayMonthly.toFixed(2)}{' '}
          <span className="text-sm font-medium text-[var(--text-muted)]">{t.billing_per_month}</span>
        </p>
        {period !== '1' && (
          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            {t.billing_plan_total(months, totalPrice.toFixed(2))}
          </p>
        )}
      </div>

      <ul className="mt-3 space-y-1.5">
        {shown.map((f) => (
          <li key={f.key} className="flex items-start gap-1.5 text-xs text-[var(--text-secondary)]">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
            <span>{lang === 'fa' ? f.label_fa : f.label_en}</span>
          </li>
        ))}
        {remaining > 0 && (
          <li className="text-xs italic text-[var(--text-muted)]">{t.billing_plan_and_more(remaining)}</li>
        )}
      </ul>

      <span
        className={cn(
          'mt-3 inline-flex items-center justify-center rounded-[var(--radius-sm)] px-3 py-2 text-xs font-semibold',
          isPro ? 'bg-[var(--accent)] text-white' : 'border border-[var(--border-subtle)] text-[var(--text-primary)]',
        )}
      >
        {t.billing_select_plan}
      </span>
    </button>
  );
}
