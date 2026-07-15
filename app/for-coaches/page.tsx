import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { resolveCountry } from '@/lib/geo';
import { ForCoachesPageContent } from '@/components/pages/ForCoachesPage';
import { FOR_COACHES_FAQ_EN } from '@/lib/forCoachesFaq';

const siteUrl = 'https://mindlura.com';
const title = 'For Coaches — Mindlura';
const description =
  'The professional platform for forex trading coaches. Manage clients, track behavioral performance, and deliver AI-powered insights.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: ['forex coaching platform', 'trading coach dashboard', 'coach client management', 'forex mentor tools', 'trading coach commission'],
  alternates: {
    canonical: `${siteUrl}/for-coaches`,
    languages: { en: `${siteUrl}/for-coaches`, fa: `${siteUrl}/fa/for-coaches`, 'x-default': `${siteUrl}/for-coaches` },
  },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/for-coaches`,
    siteName: 'Mindlura',
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary', title, description },
};

export default async function ForCoachesPage() {
  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FOR_COACHES_FAQ_EN.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ForCoachesPageContent lang="en" country={country} />
    </>
  );
}
