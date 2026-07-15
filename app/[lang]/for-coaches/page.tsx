import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { resolveCountry } from '@/lib/geo';
import { ForCoachesPageContent } from '@/components/pages/ForCoachesPage';
import { FOR_COACHES_FAQ_FA } from '@/lib/forCoachesFaq';

const siteUrl = 'https://mindlura.com';
const title = 'برای کوچ‌ها — مایندلورا';
const description =
  'پلتفرم حرفه‌ای برای کوچ‌های فارکس. مدیریت کلاینت‌ها، پیگیری عملکرد رفتاری و ارائه بینش‌های هوش مصنوعی.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: ['پلتفرم کوچینگ فارکس', 'داشبورد کوچ معاملاتی', 'مدیریت کلاینت کوچ', 'همکاری با مایندلورا', 'کمیسیون کوچ فارکس'],
  alternates: {
    canonical: `${siteUrl}/fa/for-coaches`,
    languages: { en: `${siteUrl}/for-coaches`, fa: `${siteUrl}/fa/for-coaches`, 'x-default': `${siteUrl}/for-coaches` },
  },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/fa/for-coaches`,
    siteName: 'Mindlura',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: { card: 'summary', title, description },
};

export default async function FaForCoachesPage() {
  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FOR_COACHES_FAQ_FA.map((item) => ({
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
      <ForCoachesPageContent lang="fa" country={country} />
    </>
  );
}
