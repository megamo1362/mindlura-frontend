'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import type { Lang } from '@/lib/useGeoLang';
import { getCounterpartPath, setLocaleCookie } from '@/lib/localePath';
import { AmbientOrbs } from '@/components/effects';
import LiveNewsTab from '../LiveNewsTab';
import type { ForexNewsItem } from '../types';

const displayFont = "'Fraunces', serif";

const COPY = {
  en: {
    dir: 'ltr' as const,
    back: '← Mindlura',
    eyebrow: 'Live Forex News',
    title: 'Live Forex News — Real-Time Market Updates',
    sub: 'The latest forex headlines and summaries from top financial sources, refreshed every few minutes.',
    navCalendar: '📅 Calendar',
    navLive: '📰 Live News',
    footer: 'News: Finnhub | For educational purposes only',
  },
  fa: {
    dir: 'rtl' as const,
    back: '→ مایندلورا',
    eyebrow: 'اخبار لحظه‌ای فارکس',
    title: 'اخبار لحظه‌ای فارکس — آپدیت‌های بازار',
    sub: 'جدیدترین سرخط‌ها و خلاصه‌های خبری فارکس از منابع معتبر مالی، هر چند دقیقه به‌روزرسانی می‌شود.',
    navCalendar: '📅 تقویم',
    navLive: '📰 اخبار لحظه‌ای',
    footer: 'منبع اخبار: Finnhub | صرفاً جهت آموزش',
  },
};

export default function LiveNewsClient({
  initialNews,
  initialLang,
  initialCountry,
}: {
  initialNews: ForexNewsItem[];
  initialLang: Lang;
  initialCountry: string;
}) {
  const lang = initialLang;
  const country = initialCountry;
  const router = useRouter();
  const pathname = usePathname();
  const showLangToggle = country === 'IR';
  const t = COPY[lang];
  const isFa = lang === 'fa';
  const bodyFont = isFa ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";
  const switchLang = () => {
    setLocaleCookie(isFa ? 'en' : 'fa');
    router.push(getCounterpartPath(pathname));
  };

  const calendarHref = isFa ? '/fa/news/calendar' : '/news/calendar';
  const liveHref = isFa ? '/fa/news/live' : '/news/live';

  return (
    <div
      dir={t.dir}
      style={{ backgroundColor: 'var(--color-void)', color: 'var(--color-text-primary)', fontFamily: bodyFont, minHeight: '100vh', position: 'relative' }}
    >
      <div className="fixed inset-0 z-0">
        <AmbientOrbs />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-50" style={{ backgroundColor: 'rgba(10,14,23,0.9)', backdropFilter: 'blur(8px)' }}>
          <div style={{ height: 1, background: 'var(--color-border)' }} />
          <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {t.back}
            </Link>
            {showLangToggle && (
              <button
                onClick={switchLang}
                className="text-xs italic"
                style={{ fontFamily: displayFont, color: 'var(--color-text-muted)' }}
              >
                {isFa ? 'English' : 'فارسی'}
              </button>
            )}
          </div>
        </header>

        <section className="max-w-screen-xl mx-auto px-6 pt-16 pb-2 flex gap-2">
          <Link
            href={calendarHref}
            className="px-4 py-2 rounded-lg border text-sm font-medium"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)', backgroundColor: 'transparent' }}
          >
            {t.navCalendar}
          </Link>
          <Link
            href={liveHref}
            className="px-4 py-2 rounded-lg border text-sm font-medium"
            style={{ borderColor: 'var(--color-cyan)', color: 'var(--color-cyan)', backgroundColor: 'var(--color-cyan-dim)' }}
          >
            {t.navLive}
          </Link>
        </section>

        <section className="max-w-screen-xl mx-auto px-6 pt-6 pb-8">
          <p className="text-sm italic mb-4" style={{ color: 'var(--color-cyan)', fontFamily: displayFont }}>{t.eyebrow}</p>
          <h1 className="text-3xl md:text-4xl mb-4 max-w-2xl" style={{ fontFamily: displayFont, fontWeight: 500 }}>{t.title}</h1>
          <p className="text-sm leading-relaxed max-w-xl" style={{ color: 'var(--color-text-muted)' }}>{t.sub}</p>
        </section>

        <section className="max-w-screen-xl mx-auto px-6 pb-20">
          <LiveNewsTab lang={lang} initialNews={initialNews} />
        </section>

        <div className="max-w-screen-xl mx-auto px-6"><div style={{ height: 1, background: 'var(--color-border)' }} /></div>
        <section className="max-w-screen-xl mx-auto px-6 py-10 text-center">
          <p className="text-xs" style={{ color: 'var(--color-text-disabled)' }}>{t.footer}</p>
        </section>
      </div>
    </div>
  );
}
