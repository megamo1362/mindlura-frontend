'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useGeoLang, type Lang } from '@/lib/useGeoLang';
import { AmbientOrbs } from '@/components/effects';
import { Badge } from '@/components/ui/badge';
import type { CalendarEvent } from './types';

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
    footer: 'منبع: Forex Factory | صرفاً جهت آموزش',
    inTime: (label: string) => `${label} دیگر`,
  },
};

const IMPACT_LEVELS = ['High', 'Medium', 'Low'] as const;
const IMPACT_EMOJI: Record<string, string> = { High: '🔴', Medium: '🟡', Low: '⚪', Holiday: '🏳️' };
const IMPACT_VARIANT: Record<string, 'red' | 'yellow' | 'gray'> = { High: 'red', Medium: 'yellow', Low: 'gray', Holiday: 'gray' };

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const FA_WEEKDAYS = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
const FA_MONTHS = ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'می', 'ژوئن', 'جولای', 'آگوست', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'];

function toFaDigits(n: number): string {
  return String(n).split('').map((d) => FA_DIGITS[Number(d)] ?? d).join('');
}

/** Groups by calendar day in UTC — matches the "Time (UTC)" column so the grouping stays consistent with what's displayed. */
function dateKeyOf(datetimeUtc: string): string {
  return datetimeUtc.slice(0, 10);
}

function formatDateHeader(dateKey: string, lang: Lang, isToday: boolean): string {
  if (isToday) return lang === 'fa' ? 'امروز' : 'Today';
  const d = new Date(`${dateKey}T00:00:00Z`);
  if (lang === 'fa') {
    return `${FA_WEEKDAYS[d.getUTCDay()]} ${toFaDigits(d.getUTCDate())} ${FA_MONTHS[d.getUTCMonth()]}`;
  }
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

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

export default function NewsClient({
  initialEvents,
  initialLang,
  fetchedAt,
}: {
  initialEvents: CalendarEvent[];
  initialLang: Lang;
  fetchedAt: string | null;
}) {
  const { lang, setLang } = useGeoLang(initialLang);
  const t = COPY[lang];
  const isFa = lang === 'fa';
  const bodyFont = isFa ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";

  const [impactFilter, setImpactFilter] = useState<string | null>(null);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

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
            <button
              onClick={() => setLang(isFa ? 'en' : 'fa')}
              className="text-xs italic"
              style={{ fontFamily: displayFont, color: 'var(--color-text-muted)' }}
            >
              {isFa ? 'English' : 'فارسی'}
            </button>
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
                  {group.events.map((event) => (
                    <div
                      key={event.id}
                      className="grid items-center px-4 py-3 text-sm"
                      style={{ gridTemplateColumns: '110px 90px 1fr 110px 100px 100px 100px', borderBottom: '1px solid var(--color-border)' }}
                    >
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--color-text-muted)' }}>
                        {new Date(event.datetime_utc).toISOString().slice(11, 16)}
                      </span>
                      <span className="font-medium">{event.country}</span>
                      <span>{event.title}</span>
                      <ImpactBadge impact={event.impact} />
                      <span style={{ color: 'var(--color-text-muted)' }}>{event.forecast || '—'}</span>
                      <span style={{ color: 'var(--color-text-muted)' }}>{event.previous || '—'}</span>
                      <span style={{ color: actualColor(event) ?? 'var(--color-text-secondary)' }}>
                        {event.is_released ? (event.actual || '—') : (now !== null ? t.inTime(formatCountdown(new Date(event.datetime_utc).getTime() - now, lang)) : '')}
                      </span>
                    </div>
                  ))}
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
                  {group.events.map((event) => (
                    <div key={event.id} className="p-4" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <ImpactBadge impact={event.impact} />
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
                    </div>
                  ))}
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
