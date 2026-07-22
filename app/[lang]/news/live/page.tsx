import type { Metadata } from 'next';
import { getBackendBaseUrl } from '@/lib/market';
import LiveNewsClient from '@/app/news/live/LiveNewsClient';
import type { ForexNewsItem } from '@/app/news/types';

export const revalidate = 300;

const LIVE_NEWS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaObject',
  name: 'اخبار لحظه‌ای فارکس',
  description: 'آخرین اخبار فارکس و آپدیت‌های لحظه‌ای بازار از منابع معتبر مالی',
  url: 'https://mindlura.com/fa/news/live',
  publisher: {
    '@type': 'Organization',
    name: 'Mindlura',
    url: 'https://mindlura.com',
  },
};

export const metadata: Metadata = {
  title: { absolute: 'اخبار لحظه‌ای فارکس | آپدیت‌های بازار | مایندلورا' },
  description: 'آخرین اخبار فارکس و آپدیت‌های لحظه‌ای بازار از منابع معتبر مالی',
  keywords: ['اخبار فارکس', 'forex news', 'live market news'],
  alternates: {
    canonical: 'https://mindlura.com/fa/news/live',
    languages: { en: 'https://mindlura.com/news/live', fa: 'https://mindlura.com/fa/news/live', 'x-default': 'https://mindlura.com/news/live' },
  },
  openGraph: {
    title: 'اخبار لحظه‌ای فارکس | آپدیت‌های بازار | مایندلورا',
    description: 'آخرین اخبار فارکس و آپدیت‌های لحظه‌ای بازار از منابع معتبر مالی',
    url: 'https://mindlura.com/fa/news/live',
    siteName: 'Mindlura',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: { card: 'summary', title: 'اخبار لحظه‌ای فارکس | مایندلورا' },
};

async function fetchLiveNews(): Promise<ForexNewsItem[]> {
  try {
    const res = await fetch(`${getBackendBaseUrl()}/api/news/forex?lang=fa`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.news ?? [];
  } catch {
    return [];
  }
}

export default async function FaNewsLivePage() {
  const news = await fetchLiveNews();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LIVE_NEWS_SCHEMA) }}
      />
      <LiveNewsClient initialNews={news} initialLang="fa" initialCountry="IR" />
    </>
  );
}
