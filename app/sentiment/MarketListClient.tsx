'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import type { Lang } from '@/lib/useGeoLang';
import { getCounterpartPath, setLocaleCookie } from '@/lib/localePath';
import { AmbientOrbs } from '@/components/effects';
import {
  MARKET_SYMBOLS,
  PRIMARY_TIMEFRAME,
  formatPrice,
  normalizeTrend,
  type MarketDataResponse,
  type Trend,
} from '@/lib/market';
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const displayFont = "'Fraunces', serif";

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
    eyebrow: 'Market Sentiment',
    title: 'Buyer & seller strength, updated in real time.',
    sub: `Behavioral market strength across forex, gold, and crypto — derived from RSI, EMA positioning, and MACD on the ${PRIMARY_TIMEFRAME} timeframe.`,
    categories: { forex: 'Forex', metal: 'Metal', crypto: 'Crypto' },
    trend: { bullish: 'Bullish', bearish: 'Bearish', neutral: 'Neutral' },
    buyer: 'Buyers',
    seller: 'Sellers',
    view: 'View Analysis',
    noData: 'No live data yet',
    disclaimer: 'For educational purposes only. Not investment advice.',
  },
  fa: {
    dir: 'rtl' as const,
    back: '→ مایندلورا',
    eyebrow: 'سنتیمنت بازار',
    title: 'قدرت خریدار و فروشنده، به‌روز در لحظه.',
    sub: `قدرت رفتاری بازار در فارکس، طلا و ارز دیجیتال — برگرفته از RSI، موقعیت EMA و MACD در تایم‌فریم ${PRIMARY_TIMEFRAME}.`,
    categories: { forex: 'فارکس', metal: 'فلز', crypto: 'ارز دیجیتال' },
    trend: { bullish: 'صعودی', bearish: 'نزولی', neutral: 'خنثی' },
    buyer: 'خریداران',
    seller: 'فروشندگان',
    view: 'مشاهده تحلیل',
    noData: 'هنوز داده‌ای موجود نیست',
    disclaimer: 'صرفاً جهت آموزش. مشاوره سرمایه‌گذاری نیست.',
  },
};

const TREND_COLOR: Record<Trend, string> = {
  bullish: 'var(--color-cyan)',
  bearish: 'var(--color-danger)',
  neutral: 'var(--color-warning)',
};

function TrendIcon({ trend, size = 13 }: { trend: Trend; size?: number }) {
  if (trend === 'bullish') return <TrendingUp size={size} strokeWidth={1.8} />;
  if (trend === 'bearish') return <TrendingDown size={size} strokeWidth={1.8} />;
  return <Minus size={size} strokeWidth={1.8} />;
}

export default function MarketListClient({
  initialData,
  initialLang,
  initialCountry,
}: {
  initialData: Record<string, MarketDataResponse | null>;
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

  return (
    <div
      dir={t.dir}
      style={{ backgroundColor: 'var(--color-void)', color: 'var(--color-text-primary)', fontFamily: bodyFont, minHeight: '100vh', position: 'relative' }}
    >
      <div className="fixed inset-0 z-0">
        <AmbientOrbs />
      </div>

      <style>{`
        .mkt-focus:focus-visible { outline: 1px solid var(--color-cyan); outline-offset: 4px; }
        .mkt-hairline { height: 1px; background: var(--color-border); }
        .mkt-card { transition: border-color var(--duration-normal) var(--easing-out), transform var(--duration-normal) var(--easing-out); }
        .mkt-card:hover { border-color: var(--color-border-hover); transform: translateY(-2px); }
      `}</style>

      <div className="relative z-10">
        <header className="sticky top-0 z-50" style={{ backgroundColor: 'rgba(10,14,23,0.9)', backdropFilter: 'blur(8px)' }}>
          <div className="mkt-hairline" />
          <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-sm mkt-focus" style={{ color: 'var(--color-text-muted)' }}>
              {t.back}
            </Link>
            {showLangToggle && (
              <button
                onClick={switchLang}
                className="text-xs italic mkt-focus"
                style={{ fontFamily: displayFont, color: 'var(--color-text-muted)' }}
              >
                {isFa ? 'English' : 'فارسی'}
              </button>
            )}
          </div>
        </header>

        <section className="max-w-screen-2xl mx-auto px-6 pt-16 pb-12">
          <p className="text-sm italic mb-4" style={{ color: 'var(--color-cyan)', fontFamily: displayFont }}>{t.eyebrow}</p>
          <h1 className="text-3xl md:text-4xl mb-4 max-w-2xl" style={{ fontFamily: displayFont, fontWeight: 500 }}>{t.title}</h1>
          <p className="text-sm leading-relaxed max-w-xl" style={{ color: 'var(--color-text-muted)' }}>{t.sub}</p>
        </section>

        <section className="max-w-screen-2xl mx-auto px-6 pb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MARKET_SYMBOLS.map((s) => {
              const data = initialData[s.symbol];
              const tf = data?.timeframes?.[PRIMARY_TIMEFRAME];
              const trend = normalizeTrend(tf?.trend);
              const buyerStrength = tf?.buyer_strength ?? null;
              const sellerStrength = tf?.seller_strength ?? (buyerStrength !== null ? 100 - buyerStrength : null);
              const symName = SYMBOL_NAMES[s.symbol]?.[lang] ?? s.symbol;
              const accent = TREND_COLOR[trend];

              return (
                <Link
                  key={s.symbol}
                  href={`/sentiment/${s.symbol.toLowerCase()}`}
                  className="mkt-card block p-6 mkt-focus"
                  style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-wide px-2 py-0.5" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                      {t.categories[s.category]}
                    </span>
                    {tf && (
                      <span className="inline-flex items-center gap-1 text-xs" style={{ color: accent }}>
                        <TrendIcon trend={trend} />
                        {t.trend[trend]}
                      </span>
                    )}
                  </div>

                  <div className="text-2xl mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{s.symbol}</div>
                  <div className="text-xs mb-5" style={{ color: 'var(--color-text-muted)' }}>{symName}</div>

                  {tf && buyerStrength !== null ? (
                    <div dir="ltr">
                      <div className="flex items-center justify-between mb-1.5 text-[11px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        <span style={{ color: 'var(--color-cyan)' }}>{t.buyer} {formatPrice(buyerStrength, 0)}%</span>
                        <span style={{ color: 'var(--color-danger)' }}>{t.seller} {formatPrice(sellerStrength, 0)}%</span>
                      </div>
                      <div className="w-full flex h-2 overflow-hidden">
                        <div style={{ width: `${buyerStrength}%`, backgroundColor: 'var(--color-cyan)' }} />
                        <div style={{ width: `${sellerStrength}%`, backgroundColor: 'var(--color-danger)' }} />
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs" style={{ color: 'var(--color-text-disabled)' }}>{t.noData}</div>
                  )}

                  <div className="mt-5 flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-cyan)' }}>
                    {t.view}
                    <ArrowRight size={13} className={isFa ? 'rotate-180' : ''} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="max-w-screen-2xl mx-auto px-6"><div className="mkt-hairline" /></div>
        <section className="max-w-screen-2xl mx-auto px-6 py-10 text-center">
          <p className="text-xs" style={{ color: 'var(--color-text-disabled)' }}>{t.disclaimer}</p>
        </section>
      </div>
    </div>
  );
}
