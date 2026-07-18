import type { Metadata } from 'next';
import { getBackendBaseUrl } from '@/lib/market';
import NewsClient from '@/app/news/NewsClient';
import type { CalendarEvent } from '@/app/news/types';

export const revalidate = 900;

const CALENDAR_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'تقویم اقتصادی فارکس',
  description: 'رویدادها و اخبار اقتصادی برای تریدرهای فارکس — ۷ روز آینده',
  url: 'https://mindlura.com/fa/news/calendar',
  provider: {
    '@type': 'Organization',
    name: 'Mindlura',
    url: 'https://mindlura.com',
  },
};

export const metadata: Metadata = {
  title: { absolute: 'تقویم اقتصادی فارکس | ۷ روز آینده | مایندلورا' },
  description: 'تقویم اقتصادی فارکس رایگان با رتبه‌بندی تأثیر برای ۷ روز آینده',
  keywords: ['تقویم اقتصادی', 'economic calendar', 'forex calendar'],
  alternates: {
    canonical: 'https://mindlura.com/fa/news/calendar',
    languages: { en: 'https://mindlura.com/news/calendar', fa: 'https://mindlura.com/fa/news/calendar', 'x-default': 'https://mindlura.com/news/calendar' },
  },
  openGraph: {
    title: 'تقویم اقتصادی فارکس | ۷ روز آینده | مایندلورا',
    description: 'تقویم اقتصادی فارکس رایگان با رتبه‌بندی تأثیر برای ۷ روز آینده',
    url: 'https://mindlura.com/fa/news/calendar',
    siteName: 'Mindlura',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: { card: 'summary', title: 'تقویم اقتصادی فارکس | مایندلورا' },
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

export default async function FaNewsCalendarPage() {
  const { events, fetchedAt } = await fetchCalendarEvents();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CALENDAR_SCHEMA) }}
      />
      <NewsClient initialEvents={events} initialLang="fa" initialCountry="IR" fetchedAt={fetchedAt} />
    </>
  );
}
