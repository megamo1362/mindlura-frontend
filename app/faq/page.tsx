import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { resolveCountry } from '@/lib/geo';
import { FaqPageContent } from '@/components/pages/FaqPage';

const siteUrl = 'https://mindlura.com';
const title = 'FAQ — Mindlura';
const description =
  'Frequently asked questions about Mindlura — connecting MT5, psychology scoring, coach dashboard, and more.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: `${siteUrl}/faq`,
    languages: { en: `${siteUrl}/faq`, fa: `${siteUrl}/fa/faq`, 'x-default': `${siteUrl}/faq` },
  },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/faq`,
    siteName: 'Mindlura',
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary', title, description },
};

export default async function FaqPage() {
  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));

  return <FaqPageContent lang="en" country={country} />;
}
