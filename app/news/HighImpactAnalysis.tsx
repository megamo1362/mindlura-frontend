'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import type { Lang } from '@/lib/useGeoLang';
import { formatEventDateTime } from './dateFormat';
import type { EventAnalysis, AnalysisScenario } from './types';

const COPY = {
  en: {
    header: '🔴 Key Events — Past & Next 7 Days — AI Analysis',
    noEvents: 'No high-impact events in the past or next 7 days',
    whyMatters: '📌 Why it matters',
    bullish: (country: string) => `📈 Bullish ${country}`,
    bearish: (country: string) => `📉 Bearish ${country}`,
    level: 'Level',
    keyInsight: '⚡ Key Insight',
    forecast: 'Forecast',
    previous: 'Previous',
  },
  fa: {
    header: '🔴 رویدادهای کلیدی — ۷ روز گذشته و آینده — تحلیل هوش مصنوعی',
    noEvents: 'رویداد پراهمیتی در ۷ روز گذشته یا آینده وجود ندارد',
    whyMatters: '📌 چرا اهمیت دارد',
    bullish: (country: string) => `📈 صعودی ${country}`,
    bearish: (country: string) => `📉 نزولی ${country}`,
    level: 'سطح',
    keyInsight: '⚡ نکته کلیدی',
    forecast: 'پیش‌بینی',
    previous: 'قبلی',
  },
};

function SkeletonCard() {
  return (
    <div className="animate-pulse p-4" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
      <div className="h-4 w-2/3 rounded mb-3" style={{ backgroundColor: 'var(--color-border)' }} />
      <div className="h-3 w-1/3 rounded" style={{ backgroundColor: 'var(--color-border)' }} />
    </div>
  );
}

function ScenarioColumn({
  scenario,
  label,
  levelLabel,
  tint,
}: {
  scenario: AnalysisScenario;
  label: string;
  levelLabel: string;
  tint: 'success' | 'danger';
}) {
  const borderColor = tint === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)';
  const textColor = tint === 'success' ? 'var(--color-success)' : 'var(--color-danger)';
  return (
    <div className="p-3 rounded-lg space-y-2" style={{ border: `1px solid ${borderColor}` }}>
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: textColor }}>{label}</p>
      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{scenario.probability}</p>
      <div className="space-y-1.5">
        {scenario.pairs.map((p, i) => (
          <div key={`${p.pair}-${i}`} className="text-xs">
            <span className="font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p.pair}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>: {p.outlook}</span>
            <div style={{ color: 'var(--color-text-disabled)' }}>{levelLabel}: {p.level}</div>
          </div>
        ))}
      </div>
      <p className="text-xs italic" style={{ color: 'var(--color-text-secondary)' }}>{scenario.insight}</p>
    </div>
  );
}

export default function HighImpactAnalysis({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const isFa = lang === 'fa';
  const [data, setData] = useState<EventAnalysis[] | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ analyses: EventAnalysis[] }>('/api/calendar/analysis')
      .then((res) => {
        if (cancelled) return;
        const analyses = res.analyses ?? [];
        setData(analyses);
        if (analyses.length > 0) setExpandedId(analyses[0].event.id);
      })
      .catch(() => {
        if (!cancelled) setData([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="max-w-screen-xl mx-auto px-6 pb-8" dir={isFa ? 'rtl' : 'ltr'}>
      <h2 className="text-lg font-semibold mb-4">{t.header}</h2>

      {data === null && (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {data !== null && data.length === 0 && (
        <p className="text-sm py-6 text-center" style={{ color: 'var(--color-text-disabled)' }}>{t.noEvents}</p>
      )}

      {data !== null && data.length > 0 && (
        <div className="space-y-3">
          {data.map(({ event, analysis }) => {
            const content = analysis[lang];
            const expanded = expandedId === event.id;
            return (
              <div key={event.id} style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : event.id)}
                  className="w-full px-4 py-3"
                  style={{ textAlign: isFa ? 'right' : 'left' }}
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-sm font-medium flex items-center gap-2">
                      🔴 {event.title} <span style={{ color: 'var(--color-text-muted)' }}>{event.country}</span>
                    </span>
                    <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                      {formatEventDateTime(event.datetime_utc, lang)}
                      {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    {t.forecast}: {event.forecast || '—'} | {t.previous}: {event.previous || '—'}
                  </div>
                </button>

                {expanded && (
                  <div className="px-4 pb-4 space-y-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <div className="pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-cyan)' }}>{t.whyMatters}</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{content.why_matters}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <ScenarioColumn scenario={content.bullish} label={t.bullish(event.country)} levelLabel={t.level} tint="success" />
                      <ScenarioColumn scenario={content.bearish} label={t.bearish(event.country)} levelLabel={t.level} tint="danger" />
                    </div>

                    <div className="text-sm pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                      <span className="font-semibold">{t.keyInsight}:</span>{' '}
                      <span style={{ color: 'var(--color-text-secondary)' }}>{content.key_insight}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
