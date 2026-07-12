'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useGeoLang, type Lang } from '@/lib/useGeoLang';
import { AmbientOrbs } from '@/components/effects';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { apiFetch } from '@/lib/api';
import { dateKeyOf, formatDateHeader } from './dateFormat';
import AnalysisPanel from './AnalysisPanel';
import type { CalendarEvent, EventAnalysis } from './types';

const displayFont = "'Fraunces', serif";

const COPY = {
  en: {
    dir: 'ltr' as const,
    back: '← Mindlura',
    eyebrow: 'Economic Calendar',
    title: 'Economic Calendar — Next 7 Days',
    sub: 'Live forex economic events, forecasts, and released results, updated every 1 hour.',
    filterAll: 'All',
    colTime: 'Time (UTC)',
    colCurrency: 'Currency',
    colEvent: 'Event',
    colImpact: 'Impact',
    colForecast: 'Forecast',
    colPrevious: 'Previous',
    colActual: 'Actual',
    today: 'Today',
    noEvents: 'No events in the next 7 days.',
    noAnalysis: 'AI analysis not available for this event yet.',
    footer: 'Source: Forex Factory | For educational purposes only',
    inTime: (label: string) => `in ${label}`,
  },
  fa: {
    dir: 'rtl' as const,
    back: '→ مایندلورا',
    eyebrow: 'تقویم اقتصادی',
    title: 'تقویم اقتصادی — ۷ روز آینده',
    sub: 'رویدادهای اقتصادی فارکس، پیش‌بینی‌ها و نتایج منتشرشده، هر ۱ ساعت به‌روزرسانی می‌شود.',
    filterAll: 'همه',
    colTime: 'زمان (UTC)',
    colCurrency: 'ارز',
    colEvent: 'رویداد',
    colImpact: 'اهمیت',
    colForecast: 'پیش‌بینی',
    colPrevious: 'قبلی',
    colActual: 'واقعی',
    today: 'امروز',
    noEvents: 'رویدادی در ۷ روز آینده نیست.',
    noAnalysis: 'تحلیل هوش مصنوعی هنوز برای این رویداد موجود نیست.',
    footer: 'منبع: Forex Factory | صرفاً جهت آموزش',
    inTime: (label: string) => `${label} دیگر`,
  },
};

const IMPACT_LEVELS = ['High', 'Medium', 'Low'] as const;
const IMPACT_EMOJI: Record<string, string> = { High: '🔴', Medium: '🟡', Low: '⚪', Holiday: '🏳️' };
const IMPACT_VARIANT: Record<string, 'red' | 'yellow' | 'gray'> = { High: 'red', Medium: 'yellow', Low: 'gray', Holiday: 'gray' };

function parseNumeric(value: string): number | null {
  if (!value) return null;
  const cleaned = value.replace(/[%,KMB]/gi, '').trim();
  const n = parseFloat(cleaned);
  return Number.isNaN(n) ? null : n;
}

function actualColor(event: CalendarEvent): string | undefined {
  if (!event.is_released) return undefined;
  const actual = parseNumeric(event.actual);
  const forecast = parseNumeric(event.forecast);
  if (actual === null || forecast === null) return undefined;
  if (actual === forecast) return 'var(--color-text-muted)';
  return actual > forecast ? 'var(--color-success)' : 'var(--color-danger)';
}

function formatCountdown(deltaMs: number, lang: Lang): string {
  if (deltaMs <= 0) return lang === 'fa' ? 'اکنون' : 'now';
  const totalMinutes = Math.floor(deltaMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function ImpactBadge({ impact }: { impact: string }) {
  return (
    <Badge variant={IMPACT_VARIANT[impact] ?? 'gray'} className="whitespace-nowrap">
      {IMPACT_EMOJI[impact] ?? '⚪'} {impact}
    </Badge>
  );
}

function AiButton({ active, isFa, onClick }: { active: boolean; isFa: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2 py-0.5 rounded-md border text-[10px] font-medium whitespace-nowrap"
      style={{
        borderColor: 'rgba(0,212,255,0.35)',
        color: 'var(--color-cyan)',
        backgroundColor: active ? 'var(--color-cyan-dim)' : 'transparent',
      }}
    >
      🤖 {isFa ? 'تحلیل' : 'AI'}
    </button>
  );
}

export default function NewsClient({
  initialEvents,
  initialLang,
  initialCountry,
  fetchedAt,
}: {
  initialEvents: CalendarEvent[];
  initialLang: Lang;
  initialCountry: string;
  fetchedAt: string | null;
}) {
  const { lang, setLang, country } = useGeoLang(initialLang, initialCountry);
  const showLangToggle = country === 'IR';
  const t = COPY[lang];
  const isFa = lang === 'fa';
  const bodyFont = isFa ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";

  const [impactFilter, setImpactFilter] = useState<string | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const [analysisData, setAnalysisData] = useState<EventAnalysis[] | null>(null);
  const [expandedAnalysisId, setExpandedAnalysisId] = useState<string | null>(null);
  // Guards against React StrictMode's dev-mode double-invoke of effects — a ref
  // (unlike state) persists across that mount→unmount→remount cycle, so this
  // fetch fires exactly once per real mount no matter how many times buttons
  // are clicked afterward or how effects re-run in development.
  const hasFetchedAnalysis = useRef(false);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (hasFetchedAnalysis.current) return;
    hasFetchedAnalysis.current = true;

    let cancelled = false;
    apiFetch<{ analyses: EventAnalysis[] }>('/api/calendar/analysis')
      .then((res) => {
        if (!cancelled) setAnalysisData(res.analyses ?? []);
      })
      .catch(() => {
        if (!cancelled) setAnalysisData([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const analysisById = useMemo(() => {
    const map = new Map<string, EventAnalysis['analysis']>();
    (analysisData ?? []).forEach((a) => map.set(a.event.id, a.analysis));
    return map;
  }, [analysisData]);

  const toggleAnalysis = (id: string) => setExpandedAnalysisId((prev) => (prev === id ? null : id));

  const filtered = useMemo(
    () => (impactFilter ? initialEvents.filter((e) => e.impact === impactFilter) : initialEvents),
    [initialEvents, impactFilter],
  );

  // filtered is already chronologically sorted (backend sorts by datetime_utc), so grouping by
  // insertion order via Map keeps each day's group in the right place without re-sorting.
  const groups = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of filtered) {
      const key = dateKeyOf(event.datetime_utc);
      const bucket = map.get(key);
      if (bucket) bucket.push(event);
      else map.set(key, [event]);
    }
    return Array.from(map.entries()).map(([dateKey, events]) => ({ dateKey, events }));
  }, [filtered]);

  const todayKey = now !== null ? dateKeyOf(new Date(now).toISOString()) : null;

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
                onClick={() => setLang(isFa ? 'en' : 'fa')}
                className="text-xs italic"
                style={{ fontFamily: displayFont, color: 'var(--color-text-muted)' }}
              >
                {isFa ? 'English' : 'فارسی'}
              </button>
            )}
          </div>
        </header>

        <section className="max-w-screen-xl mx-auto px-6 pt-16 pb-8">
          <p className="text-sm italic mb-4" style={{ color: 'var(--color-cyan)', fontFamily: displayFont }}>{t.eyebrow}</p>
          <h1 className="text-3xl md:text-4xl mb-4 max-w-2xl" style={{ fontFamily: displayFont, fontWeight: 500 }}>{t.title}</h1>
          <p className="text-sm leading-relaxed max-w-xl" style={{ color: 'var(--color-text-muted)' }}>{t.sub}</p>
          {fetchedAt && (
            <p className="text-xs mt-3" style={{ color: 'var(--color-text-disabled)' }}>
              {new Date(fetchedAt).toISOString().slice(11, 16)} UTC
            </p>
          )}
        </section>

        <section className="max-w-screen-xl mx-auto px-6 pb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setImpactFilter(null)}
            className="px-3 py-1.5 rounded-lg border text-xs font-medium"
            style={{
              borderColor: impactFilter === null ? 'var(--color-cyan)' : 'var(--color-border)',
              color: impactFilter === null ? 'var(--color-cyan)' : 'var(--color-text-secondary)',
              backgroundColor: impactFilter === null ? 'var(--color-cyan-dim)' : 'transparent',
            }}
          >
            {t.filterAll}
          </button>
          {IMPACT_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setImpactFilter(level)}
              className="px-3 py-1.5 rounded-lg border text-xs font-medium"
              style={{
                borderColor: impactFilter === level ? 'var(--color-cyan)' : 'var(--color-border)',
                color: impactFilter === level ? 'var(--color-cyan)' : 'var(--color-text-secondary)',
                backgroundColor: impactFilter === level ? 'var(--color-cyan-dim)' : 'transparent',
              }}
            >
              {IMPACT_EMOJI[level]} {level}
            </button>
          ))}
        </section>

        <section className="max-w-screen-xl mx-auto px-6 pb-20">
          {filtered.length === 0 ? (
            <p className="text-sm py-10 text-center" style={{ color: 'var(--color-text-disabled)' }}>{t.noEvents}</p>
          ) : (
            <div className="hidden md:block" style={{ border: '1px solid var(--color-border)' }}>
              <div
                className="grid text-[11px] uppercase tracking-wide px-4 py-3"
                style={{ gridTemplateColumns: '110px 90px 1fr 110px 100px 100px 100px', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
              >
                <span>{t.colTime}</span>
                <span>{t.colCurrency}</span>
                <span>{t.colEvent}</span>
                <span>{t.colImpact}</span>
                <span>{t.colForecast}</span>
                <span>{t.colPrevious}</span>
                <span>{t.colActual}</span>
              </div>
              {groups.map((group) => (
                <div key={group.dateKey}>
                  <div
                    className="sticky flex items-center gap-3 px-4 z-40"
                    style={{ top: 65, backgroundColor: 'var(--color-cyan-dim)' }}
                  >
                    <div className="flex-1" style={{ height: 1, background: 'var(--color-cyan)' }} />
                    <span className="text-[10px] py-1 uppercase tracking-wide" style={{ color: 'var(--color-cyan)' }}>
                      ── {formatDateHeader(group.dateKey, lang, group.dateKey === todayKey)} ──
                    </span>
                    <div className="flex-1" style={{ height: 1, background: 'var(--color-cyan)' }} />
                  </div>
                  {group.events.map((event) => {
                    const isHigh = event.impact === 'High';
                    const expanded = isHigh && expandedAnalysisId === event.id;
                    const eventAnalysis = analysisById.get(event.id);
                    return (
                      <div key={event.id}>
                        <div
                          className="grid items-center px-4 py-3 text-sm"
                          style={{ gridTemplateColumns: '110px 90px 1fr 110px 100px 100px 100px', borderBottom: expanded ? 'none' : '1px solid var(--color-border)' }}
                        >
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--color-text-muted)' }}>
                            {new Date(event.datetime_utc).toISOString().slice(11, 16)}
                          </span>
                          <span className="font-medium">{event.country}</span>
                          <span>{event.title}</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <ImpactBadge impact={event.impact} />
                            {isHigh && (
                              <AiButton active={expanded} isFa={isFa} onClick={() => toggleAnalysis(event.id)} />
                            )}
                          </div>
                          <span style={{ color: 'var(--color-text-muted)' }}>{event.forecast || '—'}</span>
                          <span style={{ color: 'var(--color-text-muted)' }}>{event.previous || '—'}</span>
                          <span style={{ color: actualColor(event) ?? 'var(--color-text-secondary)' }}>
                            {event.is_released ? (event.actual || '—') : (now !== null ? t.inTime(formatCountdown(new Date(event.datetime_utc).getTime() - now, lang)) : '')}
                          </span>
                        </div>
                        {expanded && (
                          <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                            {analysisData === null ? (
                              <div className="flex items-center justify-center py-6"><Spinner size="sm" /></div>
                            ) : eventAnalysis ? (
                              <AnalysisPanel event={event} content={eventAnalysis[lang]} lang={lang} />
                            ) : (
                              <p className="text-xs py-4 text-center" style={{ color: 'var(--color-text-disabled)' }}>{t.noAnalysis}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {groups.map((group) => (
              <div key={group.dateKey}>
                <div className="sticky flex items-center gap-3 z-40 py-1" style={{ top: 65, backgroundColor: 'var(--color-void)' }}>
                  <div className="flex-1" style={{ height: 1, background: 'var(--color-cyan)' }} />
                  <span className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--color-cyan)' }}>
                    ── {formatDateHeader(group.dateKey, lang, group.dateKey === todayKey)} ──
                  </span>
                  <div className="flex-1" style={{ height: 1, background: 'var(--color-cyan)' }} />
                </div>
                <div className="space-y-3 mt-3">
                  {group.events.map((event) => {
                    const isHigh = event.impact === 'High';
                    const expanded = isHigh && expandedAnalysisId === event.id;
                    const eventAnalysis = analysisById.get(event.id);
                    return (
                      <div key={event.id} className="p-4" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <ImpactBadge impact={event.impact} />
                            {isHigh && (
                              <AiButton active={expanded} isFa={isFa} onClick={() => toggleAnalysis(event.id)} />
                            )}
                          </div>
                          <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--color-text-muted)' }}>
                            {new Date(event.datetime_utc).toISOString().slice(11, 16)} UTC
                          </span>
                        </div>
                        <div className="text-sm font-medium mb-1">{event.country} — {event.title}</div>
                        <div className="flex gap-4 text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                          <span>{t.colForecast}: {event.forecast || '—'}</span>
                          <span>{t.colPrevious}: {event.previous || '—'}</span>
                          <span style={{ color: actualColor(event) }}>
                            {t.colActual}: {event.is_released ? (event.actual || '—') : (now !== null ? t.inTime(formatCountdown(new Date(event.datetime_utc).getTime() - now, lang)) : '')}
                          </span>
                        </div>
                        {expanded && (
                          <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                            {analysisData === null ? (
                              <div className="flex items-center justify-center py-6"><Spinner size="sm" /></div>
                            ) : eventAnalysis ? (
                              <AnalysisPanel event={event} content={eventAnalysis[lang]} lang={lang} />
                            ) : (
                              <p className="text-xs py-4 text-center" style={{ color: 'var(--color-text-disabled)' }}>{t.noAnalysis}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-screen-xl mx-auto px-6"><div style={{ height: 1, background: 'var(--color-border)' }} /></div>
        <section className="max-w-screen-xl mx-auto px-6 py-10 text-center">
          <p className="text-xs" style={{ color: 'var(--color-text-disabled)' }}>{t.footer}</p>
        </section>
      </div>
    </div>
  );
}
