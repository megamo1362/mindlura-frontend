'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import type { PricingPlan } from '@/types';
import { BILLING_PERIODS, type BillingPeriod } from '@/lib/pricing';

const accent = '#8B7CF6';
const MAX_FEATURES_SHOWN = 10;

const FA_DIGITS: Record<string, string> = { '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴', '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹' };
const toFaDigits = (s: string) => s.replace(/[0-9]/g, (d) => FA_DIGITS[d]);

const COPY = {
  en: {
    dir: 'ltr' as const,
    back: '← Mindlura',
    langToggleHref: '/fa/pricing',
    langToggleLabel: 'فارسی',
    heading: 'Simple, Transparent Pricing',
    sub: "No hidden fees. Cancel anytime. All plans include a free trial period.",
    annualSavings: 'Save up to 30% with annual billing',
    periods: { '1': 'Monthly', '3': '3 Months', '6': '6 Months', '12': 'Annual' } as Record<BillingPeriod, string>,
    perMonth: '/mo',
    mostPopular: 'Most Popular',
    cta: 'Get Started',
    ctaHref: '/register',
    andMore: (n: number) => `and ${n} more`,
    empty: 'Pricing is being updated — check back shortly.',
    total: (months: number, total: string) =>
      months === 12 ? `Billed $${total} per year` : `Billed $${total} every ${months} months`,
  },
  fa: {
    dir: 'rtl' as const,
    back: 'مایندلورا ←',
    langToggleHref: '/pricing',
    langToggleLabel: 'English',
    heading: 'قیمت‌گذاری ساده و شفاف',
    sub: 'بدون هزینه پنهان. هر زمان لغو کنید. همه پلن‌ها شامل دوره آزمایشی رایگان هستند.',
    annualSavings: 'با پرداخت سالانه تا ۳۰٪ صرفه‌جویی کنید',
    periods: { '1': 'ماهانه', '3': '۳ ماهه', '6': '۶ ماهه', '12': 'سالانه' } as Record<BillingPeriod, string>,
    perMonth: '/ماه',
    mostPopular: 'محبوب‌ترین',
    cta: 'شروع کنید',
    ctaHref: '/fa/register',
    andMore: (n: number) => `و ${n} مورد دیگر`,
    empty: 'قیمت‌گذاری در حال به‌روزرسانی است — کمی بعد دوباره سر بزنید.',
    total: (months: number, total: string) =>
      months === 12
        ? `${toFaDigits(total)} دلار سالانه پرداخت می‌شود`
        : `${toFaDigits(total)} دلار هر ${toFaDigits(String(months))} ماه پرداخت می‌شود`,
  },
};

export function PricingPageContent({
  lang,
  plans,
  isIran,
}: {
  lang: 'en' | 'fa';
  plans: PricingPlan[];
  isIran: boolean;
}) {
  const t = COPY[lang];
  const isFa = lang === 'fa';
  const [period, setPeriod] = useState<BillingPeriod>('1');

  const displayFont = isFa ? "'Vazirmatn', sans-serif" : "'Fraunces', serif";
  const bodyFont = isFa ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";

  return (
    <div dir={t.dir} style={{ backgroundColor: '#0A0E17', color: '#E9ECF3', fontFamily: bodyFont, minHeight: '100vh' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .pr-focus:focus-visible { outline: 1px solid ${accent}; outline-offset: 4px; }
      `}</style>

      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {/* ---------------- TOP BAR ---------------- */}
        <div className="flex items-center justify-between mb-16">
          <Link href={isFa ? '/fa' : '/'} className="text-sm hover:text-[#C7CBE0] transition-colors pr-focus" style={{ color: '#5A6178' }}>
            {t.back}
          </Link>
          <Link href={t.langToggleHref} className="text-xs italic pr-focus" style={{ fontFamily: displayFont, color: '#7C8296' }}>
            {t.langToggleLabel}
          </Link>
        </div>

        {/* ---------------- HEADING ---------------- */}
        <section className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl leading-[1.15] mb-5" style={{ fontFamily: displayFont, fontWeight: 500 }}>
            {t.heading}
          </h1>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: '#7C8296' }}>
            {t.sub}
          </p>
        </section>

        {/* ---------------- BILLING TOGGLE ---------------- */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {BILLING_PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className="px-4 py-2 text-xs pr-focus transition-colors"
              style={{
                border: `1px solid ${period === p ? accent : '#232332'}`,
                color: period === p ? accent : '#7C8296',
                fontFamily: displayFont,
              }}
            >
              {t.periods[p]}
            </button>
          ))}
        </div>
        <p className="text-xs italic text-center mb-16" style={{ color: '#5A6178', fontFamily: displayFont }}>
          {t.annualSavings}
        </p>

        {/* ---------------- PLAN CARDS ---------------- */}
        {plans.length === 0 ? (
          <p className="text-sm text-center py-16" style={{ color: '#5A6178' }}>{t.empty}</p>
        ) : (
          <div className={`grid gap-6 mb-10 ${plans.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'}`}>
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} period={period} isIran={isIran} t={t} isFa={isFa} displayFont={displayFont} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  period,
  isIran,
  t,
  isFa,
  displayFont,
}: {
  plan: PricingPlan;
  period: BillingPeriod;
  isIran: boolean;
  t: (typeof COPY)['en'] | (typeof COPY)['fa'];
  isFa: boolean;
  displayFont: string;
}) {
  const isPro = plan.slug === 'pro' || plan.name.toLowerCase() === 'pro';
  const months = period === '1' ? 1 : Number(period);
  const discountPct = period === '1' ? 0 : (plan.discounts[period] ?? 0);
  const displayMonthly = (isIran ? plan.price_usd_ir : plan.price_usd) * (1 - discountPct / 100);
  const totalPrice = displayMonthly * months;

  const features = plan.features;
  const shown = features.slice(0, MAX_FEATURES_SHOWN);
  const remaining = features.length - shown.length;

  return (
    <div
      className="p-8 flex flex-col relative"
      style={{
        border: isPro ? `1px solid ${accent}` : '1px solid #232332',
        boxShadow: isPro ? '0 0 32px rgba(139,124,246,0.18)' : 'none',
        backgroundColor: '#0D0D18',
      }}
    >
      {isPro && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wide px-3 py-1"
          style={{ backgroundColor: accent, color: '#0A0E17', fontFamily: displayFont }}
        >
          {t.mostPopular}
        </span>
      )}

      <h2 className="text-2xl mb-1" style={{ fontFamily: displayFont, fontWeight: 500, color: isPro ? accent : '#E9ECF3' }}>
        {plan.name}
      </h2>

      <div className="my-6">
        {isIran && (
          <div className="text-sm mb-1" style={{ color: '#5A6178', textDecoration: 'line-through' }}>
            ${plan.price_usd.toFixed(2)}{t.perMonth}
          </div>
        )}
        <div className="flex items-baseline gap-1">
          <span className="text-4xl" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#E9ECF3' }}>
            ${displayMonthly.toFixed(2)}
          </span>
          <span className="text-sm" style={{ color: '#7C8296' }}>{t.perMonth}</span>
        </div>
        {period !== '1' && (
          <div className="text-xs mt-1" style={{ color: '#5A6178' }}>
            {t.total(months, totalPrice.toFixed(2))}
          </div>
        )}
      </div>

      <ul className="space-y-2.5 mb-8 flex-1">
        {shown.map((f) => (
          <li key={f.key} className="flex items-start gap-2 text-sm" style={{ color: '#C7CBE0' }}>
            <Check size={15} strokeWidth={2} style={{ color: accent, marginTop: 2, flexShrink: 0 }} />
            <span>{isFa ? f.label_fa : f.label_en}</span>
          </li>
        ))}
        {remaining > 0 && (
          <li className="text-xs italic" style={{ color: '#5A6178', fontFamily: displayFont }}>
            {t.andMore(remaining)}
          </li>
        )}
      </ul>

      <Link
        href={t.ctaHref}
        className="text-center px-6 py-3 text-sm pr-focus"
        style={
          isPro
            ? { backgroundColor: accent, color: '#0A0E17', boxShadow: '0 0 24px rgba(139,124,246,0.4)' }
            : { border: '1px solid #232332', color: '#E9ECF3' }
        }
      >
        {t.cta}
      </Link>
    </div>
  );
}
