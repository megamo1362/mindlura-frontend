import type { Metadata } from 'next';
import { getBackendBaseUrl } from '@/lib/market';
import NewsClient from '@/app/news/NewsClient';
import type { CalendarEvent } from '@/app/news/types';

export const revalidate = 900;

const NEWS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'تقویم اقتصادی فارکس',
  description: 'رویدادها و اخبار اقتصادی برای تریدرهای فارکس — ۷ روز آینده',
  url: 'https://mindlura.com/fa/news',
  provider: {
    '@type': 'Organization',
    name: 'Mindlura',
    url: 'https://mindlura.com',
  },
};

export const metadata: Metadata = {
  title: { absolute: 'تقویم اقتصادی فارکس و اخبار | ۷ روز آینده | مایندلورا' },
  description:
    'تقویم اقتصادی فارکس رایگان با رتبه‌بندی تأثیر لحظه‌ای. رویدادهای پراهمیت دلار، یورو، پوند و ین را در ۷ روز آینده با تحلیل هوش مصنوعی دنبال کنید.',
  keywords: ['تقویم اقتصادی', 'اخبار فارکس', 'economic calendar', 'forex news'],
  alternates: {
    canonical: 'https://mindlura.com/fa/news',
    languages: { en: 'https://mindlura.com/news', fa: 'https://mindlura.com/fa/news', 'x-default': 'https://mindlura.com/news' },
  },
  openGraph: {
    title: 'تقویم اقتصادی فارکس و اخبار | ۷ روز آینده | مایندلورا',
    description: 'تقویم اقتصادی فارکس رایگان با رتبه‌بندی تأثیر لحظه‌ای.',
    url: 'https://mindlura.com/fa/news',
    siteName: 'Mindlura',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: { card: 'summary', title: 'تقویم اقتصادی فارکس و اخبار | مایندلورا' },
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

export default async function FaNewsPage() {
  const { events, fetchedAt } = await fetchCalendarEvents();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(NEWS_SCHEMA) }}
      />
      <NewsClient initialEvents={events} initialLang="fa" initialCountry="IR" fetchedAt={fetchedAt} />
    </>
  );
}
