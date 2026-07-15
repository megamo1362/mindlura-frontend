import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { resolveCountry } from '@/lib/geo';
import { fetchPricingPlans } from '@/lib/pricing';
import { PricingPageContent } from '@/components/pages/PricingPage';

const siteUrl = 'https://mindlura.com';
const title = 'Pricing — Mindlura';
const description =
  "Simple, transparent pricing for forex traders. Start free, upgrade when you're ready.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: `${siteUrl}/pricing`,
    languages: { en: `${siteUrl}/pricing`, fa: `${siteUrl}/fa/pricing`, 'x-default': `${siteUrl}/pricing` },
  },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/pricing`,
    siteName: 'Mindlura',
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary', title, description },
};

export default async function PricingPage() {
  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));
  const plans = await fetchPricingPlans();

  return <PricingPageContent lang="en" plans={plans} isIran={country === 'IR'} />;
}
