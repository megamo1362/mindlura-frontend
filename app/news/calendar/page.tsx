import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { resolveCountry } from '@/lib/geo';
import { getBackendBaseUrl } from '@/lib/market';
import NewsClient from '../NewsClient';
import type { CalendarEvent } from '../types';

export const revalidate = 900;

const CALENDAR_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Forex Economic Calendar',
  description: 'Economic events and news for forex traders — next 7 days',
  url: 'https://mindlura.com/news/calendar',
  provider: {
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
    ? 'تقویم اقتصادی فارکس | ۷ روز آینده | مایندلورا'
    : 'Forex Economic Calendar | Next 7 Days | Mindlura';
  const description = isFa
    ? 'تقویم اقتصادی فارکس رایگان با رتبه‌بندی تأثیر برای ۷ روز آینده'
    : 'Free forex economic calendar with real-time impact ratings for the next 7 days';

  return {
    title: { absolute: title },
    description,
    keywords: ['economic calendar', 'forex calendar', 'تقویم اقتصادی'],
    alternates: { canonical: 'https://mindlura.com/news/calendar' },
    openGraph: { title, description, url: 'https://mindlura.com/news/calendar', siteName: 'Mindlura', type: 'website' },
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

export default async function NewsCalendarPage() {
  const [headersList, { events, fetchedAt }] = await Promise.all([headers(), fetchCalendarEvents()]);
  const country = resolveCountry((name) => headersList.get(name));
  const lang = country === 'IR' ? 'fa' : 'en';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CALENDAR_SCHEMA) }}
      />
      <NewsClient initialEvents={events} initialLang={lang} initialCountry={country} fetchedAt={fetchedAt} />
    </>
  );
}
