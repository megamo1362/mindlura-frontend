import { getBackendBaseUrl } from './market';
import type { PricingPlan } from '@/types';

export const BILLING_PERIODS = ['1', '3', '6', '12'] as const;
export type BillingPeriod = (typeof BILLING_PERIODS)[number];

const FA_DIGITS: Record<string, string> = { '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴', '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹' };
export const toFaDigits = (s: string) => s.replace(/[0-9]/g, (d) => FA_DIGITS[d]);

function isHidden(plan: PricingPlan): boolean {
  const name = plan.name.trim().toLowerCase();
  const slug = String(plan.slug).trim().toLowerCase();
  return name === 'elite' || slug === 'elite';
}

/** Server-side fetch of public pricing data, filtered to display rules and sorted by price. */
export async function fetchPricingPlans(): Promise<PricingPlan[]> {
  try {
    const res = await fetch(`${getBackendBaseUrl()}/plans/pricing`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = (await res.json()) as { plans: PricingPlan[] };
    return (data.plans ?? [])
      .filter(p => !isHidden(p))
      .sort((a, b) => a.price_usd - b.price_usd);
  } catch {
    return [];
  }
}
