'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useGeoLang, type Lang } from '@/lib/useGeoLang';
import { getCounterpartPath, setLocaleCookie } from '@/lib/localePath';
import { AmbientOrbs } from '@/components/effects';
import {
  MARKET_SYMBOLS,
  PRIMARY_TIMEFRAME,
  TIMEFRAMES,
  computeEmaDeviationPct,
  formatPct,
  formatPrice,
  getActiveSessions,
  isForexMarketOpen,
  normalizeTrend,
  type MarketDataResponse,
  type SymbolConfig,
  type Timeframe,
  type Trend,
} from '@/lib/market';
import { ArrowRight, TrendingUp, TrendingDown, Minus, Circle } from 'lucide-react';

const displayFont = "'Fraunces', serif";
const POLL_MS = 10_000;

const SYMBOL_NAMES: Record<string, { en: string; fa: string }> = {
  EURUSD: { en: 'Euro / US Dollar', fa: 'یورو / دلار آمریکا' },
  GBPUSD: { en: 'British Pound / US Dollar', fa: 'پوند بریتانیا / دلار آمریکا' },
  USDJPY: { en: 'US Dollar / Japanese Yen', fa: 'دلار آمریکا / ین ژاپن' },
  USDCAD: { en: 'US Dollar / Canadian Dollar', fa: 'دلار آمریکا / دلار کانادا' },
  XAUUSD: { en: 'Gold / US Dollar', fa: 'طلا / دلار آمریکا' },
  BTCUSD: { en: 'Bitcoin / US Dollar', fa: 'بیت‌کوین / دلار آمریکا' },
  ETHUSD: { en: 'Ethereum / US Dollar', fa: 'اتریوم / دلار آمریکا' },
};

const COPY = {
  en: {
    dir: 'ltr' as const,
    back: '← Mindlura',
    liveLabel: 'Market Sentiment',
    categories: { forex: 'Forex', metal: 'Metal', crypto: 'Crypto' },
    trend: { bullish: 'Bullish', bearish: 'Bearish', neutral: 'Neutral' },
    referencePrice: 'Reference Price',
    referenceSub: (tf: string) => `EMA20 · ${tf}`,
    referenceNote: 'Indicator reference only — not a live quote.',
    vsEma50: 'vs EMA50',
    sessions: { sydney: 'Sydney', tokyo: 'Tokyo', london: 'London', newyork: 'New York' },
    marketClosed: 'Market Closed — Weekend',
    marketOpen247: '24/7 Market',
    updatedAgo: (s: number) => (s < 2 ? 'Updated just now' : `Updated ${s}s ago`),
    noData: (sym: string) => `No live data available for ${sym} right now. Check back shortly.`,
    loading: 'Loading market data…',
    strengthTitle: 'Buyer vs Seller Strength',
    strengthSub: (tf: string) => `Current balance on the ${tf} timeframe`,
    buyer: 'Buyers',
    seller: 'Sellers',
    tableTitle: 'Multi-Timeframe Overview',
    tableSub: 'Select a row to inspect its momentum below.',
    th: { tf: 'Timeframe', trend: 'Trend', rsi: 'RSI', strength: 'Strength' },
    gaugesTitle: 'Momentum Gauges',
    gaugesSub: (tf: string) => `Showing indicators for ${tf}`,
    rsiLabel: 'RSI',
    rsiOversold: 'Oversold',
    rsiOverbought: 'Overbought',
    macdLabel: 'MACD',
    macdAbove: 'Above zero line — bullish momentum',
    macdBelow: 'Below zero line — bearish momentum',
    emaPositionLabel: 'EMA Position',
    emaBullish: 'EMA20 above EMA50 — bullish alignment',
    emaBearish: 'EMA20 below EMA50 — bearish alignment',
    otherSymbols: 'Other Markets',
    disclaimer: 'For educational purposes only. Not investment advice.',
    cta: 'Get Full Analysis',
  },
  fa: {
    dir: 'rtl' as const,
    back: '→ مایندلورا',
    liveLabel: 'سنتیمنت بازار',
    categories: { forex: 'فارکس', metal: 'فلز', crypto: 'ارز دیجیتال' },
    trend: { bullish: 'صعودی', bearish: 'نزولی', neutral: 'خنثی' },
    referencePrice: 'قیمت مرجع',
    referenceSub: (tf: string) => `EMA20 · ${tf}`,
    referenceNote: 'صرفاً مرجع اندیکاتور — قیمت لحظه‌ای نیست.',
    vsEma50: 'نسبت به EMA50',
    sessions: { sydney: 'سیدنی', tokyo: 'توکیو', london: 'لندن', newyork: 'نیویورک' },
    marketClosed: 'بازار تعطیل — آخر هفته',
    marketOpen247: 'بازار ۲۴ ساعته',
    updatedAgo: (s: number) => (s < 2 ? 'همین الان به‌روزرسانی شد' : `${s} ثانیه پیش به‌روزرسانی شد`),
    noData: (sym: string) => `در حال حاضر داده زنده‌ای برای ${sym} موجود نیست. کمی بعد دوباره سر بزنید.`,
    loading: 'در حال بارگذاری داده بازار…',
    strengthTitle: 'قدرت خریداران در برابر فروشندگان',
    strengthSub: (tf: string) => `تعادل فعلی در تایم‌فریم ${tf}`,
    buyer: 'خریداران',
    seller: 'فروشندگان',
    tableTitle: 'نمای چند تایم‌فریمی',
    tableSub: 'برای بررسی مومنتوم، روی هر ردیف بزنید.',
    th: { tf: 'تایم‌فریم', trend: 'روند', rsi: 'RSI', strength: 'قدرت' },
    gaugesTitle: 'گیج‌های مومنتوم',
    gaugesSub: (tf: string) => `نمایش اندیکاتورها برای ${tf}`,
    rsiLabel: 'RSI',
    rsiOversold: 'اشباع فروش',
    rsiOverbought: 'اشباع خرید',
    macdLabel: 'MACD',
    macdAbove: 'بالای خط صفر — مومنتوم صعودی',
    macdBelow: 'زیر خط صفر — مومنتوم نزولی',
    emaPositionLabel: 'موقعیت EMA',
    emaBullish: 'EMA20 بالای EMA50 — همراستایی صعودی',
    emaBearish: 'EMA20 زیر EMA50 — همراستایی نزولی',
    otherSymbols: 'سایر بازارها',
    disclaimer: 'صرفاً جهت آموزش. مشاوره سرمایه‌گذاری نیست.',
    cta: 'دریافت تحلیل کامل',
  },
};

const TREND_COLOR: Record<Trend, string> = {
  bullish: 'var(--color-cyan)',
  bearish: 'var(--color-danger)',
  neutral: 'var(--color-warning)',
};

const CARD_STYLE: React.CSSProperties = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '24px',
};

function TrendIcon({ trend, size = 14 }: { trend: Trend; size?: number }) {
  if (trend === 'bullish') return <TrendingUp size={size} strokeWidth={1.8} />;
  if (trend === 'bearish') return <TrendingDown size={size} strokeWidth={1.8} />;
  return <Minus size={size} strokeWidth={1.8} />;
}

function TrendBadge({ trend, label }: { trend: Trend; label: string }) {
  const color = TREND_COLOR[trend];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1"
      style={{ color, border: `1px solid ${color}`, backgroundColor: `${color}14` }}
    >
      <TrendIcon trend={trend} size={12} />
      {label}
    </span>
  );
}

export default function MarketClient({
  symbolConfig,
  initialData,
  initialLang,
  initialCountry,
}: {
  symbolConfig: SymbolConfig;
  initialData: MarketDataResponse | null;
  initialLang: Lang;
  initialCountry: string;
}) {
  const { lang, country } = useGeoLang(initialLang, initialCountry);
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<MarketDataResponse | null>(initialData);
  const [activeTf, setActiveTf] = useState<Timeframe>(PRIMARY_TIMEFRAME);
  const [now, setNow] = useState<Date>(new Date());

  const showLangToggle = country === 'IR';
  const t = COPY[lang];
  const isFa = lang === 'fa';
  const bodyFont = isFa ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";
  const symName = SYMBOL_NAMES[symbolConfig.symbol]?.[lang] ?? symbolConfig.symbol;
  const switchLang = () => {
    setLocaleCookie(isFa ? 'en' : 'fa');
    router.push(getCounterpartPath(pathname));
  };

  const poll = useCallback(async () => {
    try {
      const res = await fetch(`/api/market-data/${symbolConfig.symbol.toLowerCase()}`, { cache: 'no-store' });
      if (res.ok) setData(await res.json());
    } catch {
      /* keep last known data on transient network errors */
    }
  }, [symbolConfig.symbol]);

  useEffect(() => {
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [poll]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const primaryTf = data?.timeframes?.[PRIMARY_TIMEFRAME];
  const primaryTrend = normalizeTrend(primaryTf?.trend);
  const gaugeTf = data?.timeframes?.[activeTf];

  const referenceEma20 = primaryTf?.EMA20 ?? primaryTf?.EMA ?? null;
  const deviationPct = computeEmaDeviationPct(primaryTf?.EMA20 ?? primaryTf?.EMA, primaryTf?.EMA50);

  const isCrypto = symbolConfig.category === 'crypto';
  const marketOpen = isCrypto || isForexMarketOpen(now);
  const activeSessions = getActiveSessions(now);

  const secondsAgo = data?.updated_at
    ? Math.max(0, Math.round((now.getTime() - new Date(data.updated_at).getTime()) / 1000))
    : null;

  const buyerStrength = primaryTf?.buyer_strength ?? null;
  const sellerStrength = primaryTf?.seller_strength ?? (buyerStrength !== null ? 100 - buyerStrength : null);

  const accent = TREND_COLOR[primaryTrend];

  return (
    <div
      dir={t.dir}
      style={{ backgroundColor: 'var(--color-void)', color: 'var(--color-text-primary)', fontFamily: bodyFont, minHeight: '100vh', position: 'relative' }}
    >
      <div id="ml-ambientorbs">
        <AmbientOrbs />
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
        .mkt-focus:focus-visible { outline: 1px solid var(--color-cyan); outline-offset: 4px; }
        .mkt-hairline { height: 1px; background: var(--color-border); }
        .mkt-row { cursor: pointer; transition: background var(--duration-fast) var(--easing-out); }
        .mkt-row:hover td { background: var(--color-cyan-dim); }
        .mkt-pulse { animation: pulse 2.2s ease-in-out infinite; }
      `}</style>

      <div className="relative z-10">
        {/* ---------------- NAV + SYMBOL TABS (sticky as one unit) ---------------- */}
        <header className="sticky top-0 z-50" style={{ backgroundColor: 'rgba(10,14,23,0.92)', backdropFilter: 'blur(8px)' }}>
          <div className="mkt-hairline" />
          <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-sm mkt-focus" style={{ color: 'var(--color-text-muted)' }}>
              {t.back}
            </Link>
            <div className="flex items-center gap-6">
              {showLangToggle && (
                <button
                  onClick={switchLang}
                  className="text-xs italic mkt-focus"
                  style={{ fontFamily: displayFont, color: 'var(--color-text-muted)' }}
                >
                  {isFa ? 'English' : 'فارسی'}
                </button>
              )}
              <Link href="/register" className="text-sm px-4 py-1.5 mkt-focus" style={{ border: `1px solid ${accent}`, color: 'var(--color-text-primary)' }}>
                {t.cta}
              </Link>
            </div>
          </div>

          {/* symbol switcher */}
          <div className="max-w-screen-2xl mx-auto px-6 pb-4 flex gap-2 overflow-x-auto no-scrollbar">
            {MARKET_SYMBOLS.map((s) => {
              const active = s.symbol === symbolConfig.symbol;
              return (
                <Link
                  key={s.symbol}
                  href={`/sentiment/${s.symbol.toLowerCase()}`}
                  className="text-xs px-3 py-1.5 whitespace-nowrap mkt-focus"
                  style={{
                    border: `1px solid ${active ? accent : 'var(--color-border)'}`,
                    color: active ? accent : 'var(--color-text-muted)',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {s.symbol}
                </Link>
              );
            })}
          </div>
          <div className="mkt-hairline" />
        </header>

        <main className="max-w-screen-2xl mx-auto px-6 pt-8">
        {!data ? (
          <div className="py-24 text-center">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{t.noData(symbolConfig.symbol)}</p>
          </div>
        ) : (
          <>
            {/* ---------------- HERO CARD ---------------- */}
            <div style={CARD_STYLE}>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <p className="text-sm italic" style={{ color: accent, fontFamily: displayFont }}>{t.liveLabel}</p>
                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  {t.categories[symbolConfig.category]}
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-4 mb-2">
                <h1 className="text-4xl md:text-5xl" style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                  {symbolConfig.symbol}
                </h1>
                <TrendBadge trend={primaryTrend} label={t.trend[primaryTrend]} />
              </div>
              <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>{symName}</p>

              <div className="grid md:grid-cols-3 gap-8" dir="ltr">
                <div>
                  <div className="text-xs uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
                    {t.referencePrice} <span style={{ opacity: 0.7 }}>· {t.referenceSub(PRIMARY_TIMEFRAME)}</span>
                  </div>
                  <div className="text-2xl mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--color-text-primary)' }}>
                    {formatPrice(referenceEma20, symbolConfig.decimals)}
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--color-text-disabled)' }}>{t.referenceNote}</div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-text-muted)' }}>{t.vsEma50}</div>
                  <div
                    className="text-2xl mb-1"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: deviationPct !== null && deviationPct < 0 ? 'var(--color-danger)' : 'var(--color-cyan)' }}
                  >
                    {formatPct(deviationPct)}
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--color-text-disabled)' }}>Trend-deviation, not price change</div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Session</div>
                  {isCrypto ? (
                    <span className="badge-cyan">{t.marketOpen247}</span>
                  ) : !marketOpen ? (
                    <span className="badge-yellow">{t.marketClosed}</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(['sydney', 'tokyo', 'london', 'newyork'] as const).map((s) => {
                        const isActive = activeSessions.includes(s);
                        return (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1.5 text-xs px-2 py-1"
                            style={{
                              border: `1px solid ${isActive ? 'var(--color-cyan)' : 'var(--color-border)'}`,
                              color: isActive ? 'var(--color-cyan)' : 'var(--color-text-disabled)',
                            }}
                          >
                            <Circle size={6} fill="currentColor" className={isActive ? 'mkt-pulse' : ''} />
                            {t.sessions[s]}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  {secondsAgo !== null && (
                    <div className="text-[11px] mt-2" style={{ color: 'var(--color-text-disabled)' }}>{t.updatedAgo(secondsAgo)}</div>
                  )}
                </div>
              </div>
            </div>

            {/* ---------------- STRENGTH BARS CARD ---------------- */}
            <div style={CARD_STYLE}>
              <h2 className="text-2xl mb-1" style={{ fontFamily: displayFont, fontWeight: 500 }}>{t.strengthTitle}</h2>
              <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>{t.strengthSub(PRIMARY_TIMEFRAME)}</p>

              <div dir="ltr">
                <div className="flex items-center justify-between mb-2 text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <span style={{ color: 'var(--color-cyan)' }}>{t.buyer} {formatPrice(buyerStrength, 1)}%</span>
                  <span style={{ color: 'var(--color-danger)' }}>{t.seller} {formatPrice(sellerStrength, 1)}%</span>
                </div>
                <div className="w-full flex h-10 overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                  <div
                    style={{
                      width: `${buyerStrength ?? 50}%`,
                      backgroundColor: 'var(--color-cyan)',
                      boxShadow: 'var(--shadow-glow-cyan-sm)',
                      transition: 'width 400ms var(--easing-out)',
                    }}
                  />
                  <div
                    style={{
                      width: `${sellerStrength ?? 50}%`,
                      backgroundColor: 'var(--color-danger)',
                      transition: 'width 400ms var(--easing-out)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ---------------- MULTI-TIMEFRAME TABLE CARD ---------------- */}
            <div style={CARD_STYLE}>
              <h2 className="text-2xl mb-1" style={{ fontFamily: displayFont, fontWeight: 500 }}>{t.tableTitle}</h2>
              <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>{t.tableSub}</p>

              <div className="overflow-x-auto">
                <table className="irfx-table" style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }} dir="ltr">
                  <thead>
                    <tr>
                      <th style={{ width: '20%', textAlign: 'left' }}>{t.th.tf}</th>
                      <th style={{ width: '25%', textAlign: 'left' }}>{t.th.trend}</th>
                      <th style={{ width: '20%', textAlign: 'center' }}>{t.th.rsi}</th>
                      <th style={{ width: '35%', textAlign: 'right' }}>{t.th.strength}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TIMEFRAMES.map((tf) => {
                      const tfData = data.timeframes?.[tf];
                      const trend = normalizeTrend(tfData?.trend);
                      const strength = tfData?.buyer_strength ?? null;
                      const isActive = tf === activeTf;
                      return (
                        <tr
                          key={tf}
                          className="mkt-row"
                          onClick={() => setActiveTf(tf)}
                          style={{ background: isActive ? 'var(--color-cyan-dim)' : undefined }}
                        >
                          <td style={{ width: '20%', textAlign: 'left', fontFamily: "'JetBrains Mono', monospace", color: isActive ? 'var(--color-cyan)' : 'var(--color-text-primary)' }}>{tf}</td>
                          <td style={{ width: '25%', textAlign: 'left' }}><TrendBadge trend={trend} label={t.trend[trend]} /></td>
                          <td style={{ width: '20%', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>{formatPrice(tfData?.RSI, 1)}</td>
                          <td style={{ width: '35%', textAlign: 'right' }}>
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-20 h-1.5" style={{ backgroundColor: 'var(--color-border)' }}>
                                <div style={{ width: `${strength ?? 0}%`, height: '100%', backgroundColor: TREND_COLOR[trend] }} />
                              </div>
                              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>{formatPrice(strength, 1)}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ---------------- MOMENTUM GAUGES CARD ---------------- */}
            <div style={CARD_STYLE}>
              <h2 className="text-2xl mb-1" style={{ fontFamily: displayFont, fontWeight: 500 }}>{t.gaugesTitle}</h2>
              <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>{t.gaugesSub(activeTf)}</p>

              <div className="grid md:grid-cols-3 gap-6" dir="ltr">
                {/* RSI gauge */}
                <div className="p-6" style={{ border: '1px solid var(--color-border)' }}>
                  <div className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-muted)' }}>{t.rsiLabel}</div>
                  <div className="text-3xl mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--color-text-primary)' }}>
                    {formatPrice(gaugeTf?.RSI, 1)}
                  </div>
                  <div className="relative w-full h-2 mb-2" style={{ backgroundColor: 'var(--color-border)' }}>
                    <div className="absolute inset-y-0" style={{ left: '30%', width: '1px', backgroundColor: 'var(--color-text-disabled)' }} />
                    <div className="absolute inset-y-0" style={{ left: '70%', width: '1px', backgroundColor: 'var(--color-text-disabled)' }} />
                    <div
                      className="absolute top-1/2 w-2.5 h-2.5 rounded-full"
                      style={{
                        left: `${Math.min(100, Math.max(0, gaugeTf?.RSI ?? 50))}%`,
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: (gaugeTf?.RSI ?? 50) >= 50 ? 'var(--color-cyan)' : 'var(--color-danger)',
                        boxShadow: '0 0 8px rgba(0,212,255,0.5)',
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px]" style={{ color: 'var(--color-text-disabled)' }}>
                    <span>{t.rsiOversold} (30)</span>
                    <span>{t.rsiOverbought} (70)</span>
                  </div>
                </div>

                {/* MACD gauge */}
                <div className="p-6" style={{ border: '1px solid var(--color-border)' }}>
                  <div className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-muted)' }}>{t.macdLabel}</div>
                  <div
                    className="text-3xl mb-4"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: (gaugeTf?.MACD ?? 0) >= 0 ? 'var(--color-cyan)' : 'var(--color-danger)' }}
                  >
                    {formatPrice(gaugeTf?.MACD, 5)}
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    <TrendIcon trend={(gaugeTf?.MACD ?? 0) >= 0 ? 'bullish' : 'bearish'} size={13} />
                    {(gaugeTf?.MACD ?? 0) >= 0 ? t.macdAbove : t.macdBelow}
                  </div>
                </div>

                {/* EMA position gauge */}
                <div className="p-6" style={{ border: '1px solid var(--color-border)' }}>
                  <div className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-muted)' }}>{t.emaPositionLabel}</div>
                  {(() => {
                    const ema20 = gaugeTf?.EMA20 ?? gaugeTf?.EMA ?? null;
                    const ema50 = gaugeTf?.EMA50 ?? null;
                    const emaBullish = ema20 !== null && ema50 !== null && ema20 >= ema50;
                    return (
                      <>
                        <div className="text-3xl mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: emaBullish ? 'var(--color-cyan)' : 'var(--color-danger)' }}>
                          {ema20 !== null && ema50 !== null ? formatPrice(ema20, symbolConfig.decimals) : '—'}
                        </div>
                        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          <TrendIcon trend={emaBullish ? 'bullish' : 'bearish'} size={13} />
                          {emaBullish ? t.emaBullish : t.emaBearish}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* ---------------- DISCLAIMER + CTA CARD ---------------- */}
            <div style={{ ...CARD_STYLE, textAlign: 'center' }}>
              <p className="text-xs mb-8" style={{ color: 'var(--color-text-disabled)' }}>{t.disclaimer}</p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-sm mkt-focus"
                style={{ backgroundColor: accent, color: 'var(--color-void)', boxShadow: 'var(--shadow-glow-cyan)' }}
              >
                {t.cta}
                <ArrowRight size={16} className={isFa ? 'rotate-180' : ''} />
              </Link>
            </div>
          </>
        )}
        </main>
      </div>
    </div>
  );
}
