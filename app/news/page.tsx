import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { getServerGeoLang, resolveCountry } from '@/lib/geo';
import { getBackendBaseUrl } from '@/lib/market';
import NewsClient from './NewsClient';
import type { CalendarEvent } from './types';

export const revalidate = 900;

const NEWS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Forex Economic Calendar',
  description: 'Economic events and news for forex traders — next 7 days',
  url: 'https://mindlura.com/news',
  provider: {
    '@type': 'Organization',
    name: 'Mindlura',
    url: 'https://mindlura.com',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerGeoLang();
  const isFa = lang === 'fa';

  const title = isFa
    ? 'تقویم اقتصادی فارکس و اخبار | ۷ روز آینده | مایندلورا'
    : 'Forex Economic Calendar & News | Next 7 Days | Mindlura';
  const description = isFa
    ? 'تقویم اقتصادی فارکس رایگان با رتبه‌بندی تأثیر لحظه‌ای. رویدادهای پراهمیت دلار، یورو، پوند و ین را در ۷ روز آینده با تحلیل هوش مصنوعی دنبال کنید.'
    : 'Free forex economic calendar with real-time impact ratings. Track high-impact USD, EUR, GBP, JPY events for the next 7 days with AI analysis.';

  return {
    title: { absolute: title },
    description,
    keywords: ['economic calendar', 'forex news', 'تقویم اقتصادی', 'اخبار فارکس'],
    alternates: { canonical: 'https://mindlura.com/news' },
    openGraph: { title, description, url: 'https://mindlura.com/news', siteName: 'Mindlura', type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

async function fetchCalendarEvents(): Promise<{ events: CalendarEvent[]; fetchedAt: string | null }> {
  try {
    const res = await fetch(`${getBackendBaseUrl()}/api/calendar/events`, {
      next: { revalidate: 900 },
    });
    if (!res.ok) return { events: [], fetchedAt: null };
    const data = await res.json();
    return { events: data.events ?? [], fetchedAt: data.fetched_at ?? null };
  } catch {
    return { events: [], fetchedAt: null };
  }
}

export default async function NewsPage() {
  const [headersList, { events, fetchedAt }] = await Promise.all([headers(), fetchCalendarEvents()]);
  const country = resolveCountry((name) => headersList.get(name));
  const lang = country === 'IR' ? 'fa' : 'en';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(NEWS_SCHEMA) }}
      />
      <NewsClient initialEvents={events} initialLang={lang} initialCountry={country} fetchedAt={fetchedAt} />
    </>
  );
}
