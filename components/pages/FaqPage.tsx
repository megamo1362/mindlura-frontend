'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import type { FAQItem, FAQCategory } from '@/types';

const accent = '#38BDF8';

const CATEGORIES: FAQCategory[] = ['general', 'coaches', 'payments', 'technical'];

// Fallback content — mirrors the landing page FAQ (app/HomeClient.tsx) so this
// page is never blank if the database has no FAQ rows yet.
const FALLBACK_EN: { q: string; a: string }[] = [
  { q: 'Is my trading account safe?', a: 'Mindlura connects using a read-only Investor Password. We can see your trade history — nothing else. We cannot place, modify, or close trades.' },
  { q: 'Which brokers and platforms are supported?', a: 'Mindlura currently supports MetaTrader 5 (MT5). Support for cTrader is in development.' },
  { q: 'Do I need a coach to use Mindlura?', a: 'No. Mindlura works fully as a standalone tool. Joining a coach is always optional and always your choice.' },
  { q: 'What does the Psychology Score measure?', a: 'It tracks behavioral discipline over time — flagging patterns like overtrading, revenge entries, and cutting winners short — and compresses them into a single number you can watch improve.' },
  { q: 'How long does the analysis take after I connect?', a: 'Your full behavioral profile is built automatically within minutes of connecting your MT5 account.' },
];

const FALLBACK_FA: { q: string; a: string }[] = [
  { q: 'آیا حساب معاملاتی‌ام امن است؟', a: 'مایندلورا با Investor Password فقط‌خواندنی متصل می‌شود. ما فقط تاریخچه معاملات شما را می‌بینیم — نه چیز دیگری. هیچ‌گونه دسترسی برای ثبت، تغییر یا بستن معامله نداریم.' },
  { q: 'کدام بروکرها و پلتفرم‌ها پشتیبانی می‌شوند؟', a: 'مایندلورا در حال حاضر از MetaTrader 5 پشتیبانی می‌کند. پشتیبانی از cTrader در دست توسعه است.' },
  { q: 'آیا برای استفاده از مایندلورا به کوچ نیاز دارم؟', a: 'نه. مایندلورا به‌تنهایی و بدون کوچ هم کامل کار می‌کند. پیوستن به یک کوچ کاملاً اختیاری است.' },
  { q: 'امتیاز روان‌شناختی چه چیزی را اندازه می‌گیرد؟', a: 'نظم رفتاری شما را در طول زمان رصد می‌کند؛ الگوهایی مثل بیش‌معامله‌گری، ورود انتقامی و بستن زودهنگام معاملات سودده را شناسایی کرده و همه را در یک عدد واحد خلاصه می‌کند.' },
  { q: 'تحلیل چقدر طول می‌کشد؟', a: 'پروفایل رفتاری کامل شما چند دقیقه پس از اتصال حساب MT5 به‌صورت خودکار ساخته می‌شود.' },
];

const COPY = {
  en: {
    dir: 'ltr' as const,
    back: '← Mindlura',
    langToggleHref: '/fa/faq',
    langToggleLabel: 'فارسی',
    heading: 'Frequently Asked Questions',
    empty: 'No questions in this category yet.',
    categories: {
      general: 'General', coaches: 'For Coaches', payments: 'Payments', technical: 'Technical',
    } as Record<FAQCategory, string>,
  },
  fa: {
    dir: 'rtl' as const,
    back: 'مایندلورا ←',
    langToggleHref: '/faq',
    langToggleLabel: 'English',
    heading: 'سوالات متداول',
    empty: 'هنوز سوالی در این دسته وجود ندارد.',
    categories: {
      general: 'عمومی', coaches: 'برای کوچ‌ها', payments: 'پرداخت‌ها', technical: 'فنی',
    } as Record<FAQCategory, string>,
  },
};

export function FaqPageContent({ lang, country }: { lang: 'en' | 'fa'; country: string }) {
  const t = COPY[lang];
  const isFa = lang === 'fa';
  const showLangToggle = country === 'IR';
  const [faqs, setFaqs] = useState<FAQItem[] | null>(null); // null = loading
  const [usingFallback, setUsingFallback] = useState(false);
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('general');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    apiFetch<FAQItem[]>('/faqs')
      .then(data => {
        if (!data || data.length === 0) {
          setUsingFallback(true);
          setFaqs([]);
        } else {
          setFaqs(data);
        }
      })
      .catch(() => {
        setUsingFallback(true);
        setFaqs([]);
      });
  }, []);

  const categoriesWithItems = useMemo(
    () => CATEGORIES.filter(c => (faqs ?? []).some(f => f.category === c)),
    [faqs],
  );

  useEffect(() => {
    if (categoriesWithItems.length > 0 && !categoriesWithItems.includes(activeCategory)) {
      setActiveCategory(categoriesWithItems[0]);
    }
  }, [categoriesWithItems, activeCategory]);

  useEffect(() => { setOpenIndex(null); }, [activeCategory]);

  const displayFont = isFa ? "'Vazirmatn', sans-serif" : "'Fraunces', serif";
  const bodyFont = isFa ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";

  const items = usingFallback
    ? (isFa ? FALLBACK_FA : FALLBACK_EN)
    : (faqs ?? [])
        .filter(f => f.category === activeCategory)
        .map(f => ({ q: isFa ? f.question_fa : f.question_en, a: isFa ? f.answer_fa : f.answer_en }));

  return (
    <div dir={t.dir} style={{ backgroundColor: '#0A0E17', color: '#E9ECF3', fontFamily: bodyFont, minHeight: '100vh' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .faq-focus:focus-visible { outline: 1px solid ${accent}; outline-offset: 4px; }
      `}</style>

      <div className="max-w-screen-md mx-auto px-6 py-10">
        {/* ---------------- TOP BAR ---------------- */}
        <div className="flex items-center justify-between mb-16">
          <Link href={isFa ? '/fa' : '/'} className="text-sm hover:text-[#C7CBE0] transition-colors faq-focus" style={{ color: '#5A6178' }}>
            {t.back}
          </Link>
          {showLangToggle && (
            <Link href={t.langToggleHref} className="text-xs italic faq-focus" style={{ fontFamily: displayFont, color: '#7C8296' }}>
              {t.langToggleLabel}
            </Link>
          )}
        </div>

        {/* ---------------- HEADING ---------------- */}
        <section className="mb-14 text-center">
          <h1 className="text-3xl md:text-5xl leading-[1.15]" style={{ fontFamily: displayFont, fontWeight: 500 }}>
            {t.heading}
          </h1>
        </section>

        {faqs === null ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: 56, background: '#12121C', borderRadius: 8 }} />
            ))}
          </div>
        ) : (
          <>
            {!usingFallback && categoriesWithItems.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-10 justify-center">
                {categoriesWithItems.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setActiveCategory(c)}
                    className="px-4 py-2 text-xs faq-focus transition-colors"
                    style={{
                      border: `1px solid ${activeCategory === c ? accent : '#232332'}`,
                      color: activeCategory === c ? accent : '#7C8296',
                      fontFamily: displayFont,
                    }}
                  >
                    {t.categories[c]}
                  </button>
                ))}
              </div>
            )}

            <div>
              {items.length === 0 ? (
                <p className="text-sm text-center py-10" style={{ color: '#5A6178' }}>{t.empty}</p>
              ) : (
                items.map((item, i) => (
                  <div key={i} style={{ borderBottom: '1px solid #1C1C28' }}>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between py-5 text-left faq-focus"
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    >
                      <span className="text-sm font-medium pr-8" style={{ fontFamily: displayFont, color: '#E9ECF3' }}>{item.q}</span>
                      <span className="text-lg flex-shrink-0" style={{ color: accent, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
                        <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: openIndex === i ? '&#x2212;' : '&#x002B;' }} />
                      </span>
                    </button>
                    {openIndex === i && (
                      <p className="pb-5 text-sm leading-relaxed max-w-2xl" style={{ color: '#7C8296' }}>{item.a}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
