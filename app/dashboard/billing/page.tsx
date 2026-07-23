import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { resolveCountry } from '@/lib/geo';
import { fetchPricingPlans } from '@/lib/pricing';
import { RedesignBillingPage } from '@/components/redesign/billing/RedesignBillingPage';

export const metadata: Metadata = { title: 'Billing' };

export default async function BillingRoute() {
  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));
  const plans = await fetchPricingPlans();

  return <RedesignBillingPage plans={plans} isIran={country === 'IR'} />;
}
