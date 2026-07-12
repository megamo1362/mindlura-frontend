import type { Metadata } from 'next';
import { getServerGeoLang } from '@/lib/geo';
import { getBackendBaseUrl } from '@/lib/market';
import NewsClient from './NewsClient';
import type { CalendarEvent } from './types';

export const revalidate = 900;

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerGeoLang();
  const isFa = lang === 'fa';

  const title = isFa
    ? 'تقویم اقتصادی فارکس | ۲۴ ساعت آینده | مایندلورا'
    : 'Economic Calendar | Next 24 Hours | Mindlura';
  const description = isFa
    ? 'رویدادهای اقتصادی و اخبار فارکس در ۲۴ ساعت آینده، به‌همراه پیش‌بینی، مقدار قبلی و نتیجه.'
    : 'Upcoming forex economic calendar events for the next 24 hours, with forecast, previous, and released values.';

  return {
    title: { absolute: title },
    description,
    keywords: ['economic calendar', 'forex news', 'تقویم اقتصادی', 'اخبار فارکس'],
    alternates: { canonical: '/news' },
    openGraph: { title, description, url: '/news', siteName: 'Mindlura', type: 'website' },
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
  const [lang, { events, fetchedAt }] = await Promise.all([getServerGeoLang(), fetchCalendarEvents()]);

  return <NewsClient initialEvents={events} initialLang={lang} fetchedAt={fetchedAt} />;
}
