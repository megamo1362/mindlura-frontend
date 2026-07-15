import { getBackendBaseUrl } from './market';
import type { PricingPlan } from '@/types';

export const BILLING_PERIODS = ['1', '3', '6', '12'] as const;
export type BillingPeriod = (typeof BILLING_PERIODS)[number];

function isHidden(plan: PricingPlan): boolean {
  const name = plan.name.trim().toLowerCase();
  const slug = plan.slug as string;
  if (name === 'elite' || slug === 'elite') return true;
  if (name === 'trial' || slug === 'trial' || plan.price_usd === 0) return true;
  return false;
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
