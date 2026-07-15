import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { resolveCountry } from '@/lib/geo';
import { fetchPricingPlans } from '@/lib/pricing';
import { PricingPageContent } from '@/components/pages/PricingPage';

const siteUrl = 'https://mindlura.com';
const title = 'قیمت‌ها — مایندلورا';
const description =
  'قیمت‌گذاری ساده و شفاف برای معامله‌گران فارکس. رایگان شروع کنید، هر زمان که آماده شدید ارتقا دهید.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: `${siteUrl}/fa/pricing`,
    languages: { en: `${siteUrl}/pricing`, fa: `${siteUrl}/fa/pricing`, 'x-default': `${siteUrl}/pricing` },
  },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/fa/pricing`,
    siteName: 'Mindlura',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: { card: 'summary', title, description },
};

export default async function FaPricingPage() {
  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));
  const plans = await fetchPricingPlans();

  return <PricingPageContent lang="fa" plans={plans} isIran={country === 'IR'} />;
}
