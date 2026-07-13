import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { resolveCountry } from '@/lib/geo';
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

export const metadata: Metadata = {
  title: { absolute: 'Forex Economic Calendar & News | Next 7 Days | Mindlura' },
  description:
    'Free forex economic calendar with real-time impact ratings. Track high-impact USD, EUR, GBP, JPY events for the next 7 days with AI analysis.',
  keywords: ['economic calendar', 'forex news'],
  alternates: {
    canonical: 'https://mindlura.com/news',
    languages: { en: 'https://mindlura.com/news', fa: 'https://mindlura.com/fa/news', 'x-default': 'https://mindlura.com/news' },
  },
  openGraph: {
    title: 'Forex Economic Calendar & News | Next 7 Days | Mindlura',
    description: 'Free forex economic calendar with real-time impact ratings.',
    url: 'https://mindlura.com/news',
    siteName: 'Mindlura',
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary', title: 'Forex Economic Calendar & News | Mindlura' },
};

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
  const [headersList, { events, fetchedAt }] = await Promise.all([
    headers(),
    fetchCalendarEvents(),
  ]);
  const country = resolveCountry((name) => headersList.get(name));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(NEWS_SCHEMA) }}
      />
      <NewsClient initialEvents={events} initialLang="en" initialCountry={country} fetchedAt={fetchedAt} />
    </>
  );
}
