'use client';

import { useEffect, useRef, useState } from 'react';
import { Newspaper } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';
import type { Lang } from '@/lib/useGeoLang';
import { formatTimeAgo } from './dateFormat';
import type { ForexNewsItem } from './types';

const COPY = {
  en: {
    loading: 'Loading live news…',
    empty: 'No live news available right now.',
    readMore: 'Read more ↗',
  },
  fa: {
    loading: 'در حال بارگذاری اخبار…',
    empty: 'در حال حاضر خبری موجود نیست.',
    readMore: 'ادامه مطلب ↗',
  },
};

export default function LiveNewsTab({
  lang,
  initialNews,
}: {
  lang: Lang;
  /** SSR-prefetched news (from /news/live's page.tsx) — skips the redundant client fetch on mount. */
  initialNews?: ForexNewsItem[];
}) {
  const t = COPY[lang];
  const [news, setNews] = useState<ForexNewsItem[] | null>(initialNews ?? null);
  // Lazy-loaded on first render of this tab, not on page mount — guards
  // against React StrictMode's dev-mode double-invoke the same way the
  // AI-analysis fetch does (see NewsClient.tsx). Keyed by lang (not a plain
  // boolean) so a genuine lang change still re-fetches with the right query param.
  // Seeded to the current lang when initialNews is provided, so the effect below
  // skips its fetch entirely on mount instead of duplicating the SSR fetch.
  const lastFetchedLang = useRef<Lang | null>(initialNews ? lang : null);

  useEffect(() => {
    if (lastFetchedLang.current === lang) return;
    lastFetchedLang.current = lang;

    let cancelled = false;
    const path = lang === 'fa' ? '/api/news/forex?lang=fa' : '/api/news/forex';
    apiFetch<{ news: ForexNewsItem[] }>(path)
      .then((res) => {
        if (!cancelled) setNews(res.news ?? []);
      })
      .catch(() => {
        if (!cancelled) setNews([]);
      });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  if (news === null) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Spinner size="md" />
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{t.loading}</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <p className="text-sm py-10 text-center" style={{ color: 'var(--color-text-disabled)' }}>{t.empty}</p>
    );
  }

  return (
    <div className="space-y-3">
      {news.map((item) => {
        const headline = lang === 'fa' && item.headline_fa ? item.headline_fa : item.headline;
        const summary = lang === 'fa' && item.summary_fa ? item.summary_fa : item.summary;
        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col sm:flex-row gap-4 p-4 transition-colors"
            style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element -- external Finnhub CDN image, not worth configuring next/image remotePatterns for
              <img
                src={item.image}
                alt=""
                className="w-full sm:w-32 h-32 sm:h-20 object-cover flex-shrink-0 rounded"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div
                className="w-full sm:w-32 h-32 sm:h-20 flex items-center justify-center flex-shrink-0 rounded"
                style={{ backgroundColor: 'var(--color-elevated)' }}
              >
                <Newspaper size={24} style={{ color: 'var(--color-text-disabled)' }} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold mb-1 line-clamp-2" style={{ color: 'var(--color-text-primary)' }}>
                {headline}
              </h3>
              <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
                {item.source} • {formatTimeAgo(item.datetime, lang)}
              </p>
              <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                {summary}
              </p>
              <span className="text-xs font-medium" style={{ color: 'var(--color-cyan)' }}>
                {t.readMore}
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
