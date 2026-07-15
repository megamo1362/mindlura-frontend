import type { Metadata } from 'next';
import { FaqPageContent } from '@/components/pages/FaqPage';

const siteUrl = 'https://mindlura.com';
const title = 'سوالات متداول — مایندلورا';
const description =
  'سوالات پرتکرار درباره مایندلورا — اتصال MT5، امتیاز روان‌شناختی، داشبورد کوچ و بیشتر.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: `${siteUrl}/fa/faq`,
    languages: { en: `${siteUrl}/faq`, fa: `${siteUrl}/fa/faq`, 'x-default': `${siteUrl}/faq` },
  },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/fa/faq`,
    siteName: 'Mindlura',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: { card: 'summary', title, description },
};

export default function FaFaqPage() {
  return <FaqPageContent lang="fa" />;
}
