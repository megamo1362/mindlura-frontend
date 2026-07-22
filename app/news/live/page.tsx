import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { resolveCountry } from '@/lib/geo';
import { getBackendBaseUrl } from '@/lib/market';
import LiveNewsClient from './LiveNewsClient';
import type { ForexNewsItem } from '../types';

export const revalidate = 300;

const LIVE_NEWS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaObject',
  name: 'Live Forex News',
  description: 'Latest forex news and real-time market updates from top financial sources',
  url: 'https://mindlura.com/news/live',
  publisher: {
    '@type': 'Organization',
    name: 'Mindlura',
    url: 'https://mindlura.com',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));
  const isFa = country === 'IR';

  const title = isFa
    ? 'اخبار لحظه‌ای فارکس | آپدیت‌های بازار | مایندلورا'
    : 'Live Forex News | Real-Time Market Updates | Mindlura';
  const description = isFa
    ? 'آخرین اخبار فارکس و آپدیت‌های لحظه‌ای بازار از منابع معتبر مالی'
    : 'Latest forex news and real-time market updates from top financial sources';

  return {
    title: { absolute: title },
    description,
    keywords: ['forex news', 'live market news', 'اخبار فارکس'],
    alternates: { canonical: 'https://mindlura.com/news/live' },
    openGraph: { title, description, url: 'https://mindlura.com/news/live', siteName: 'Mindlura', type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

async function fetchLiveNews(lang: 'en' | 'fa'): Promise<ForexNewsItem[]> {
  try {
    const path = lang === 'fa' ? '/api/news/forex?lang=fa' : '/api/news/forex';
    const res = await fetch(`${getBackendBaseUrl()}${path}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.news ?? [];
  } catch {
    return [];
  }
}

export default async function NewsLivePage() {
  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));
  const lang = country === 'IR' ? 'fa' : 'en';
  const news = await fetchLiveNews(lang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LIVE_NEWS_SCHEMA) }}
      />
      <LiveNewsClient initialNews={news} initialLang={lang} initialCountry={country} />
    </>
  );
}
