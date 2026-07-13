'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { submitWaitlist } from './actions';
import { useGeoLang, type Lang } from '@/lib/useGeoLang';
import { getCounterpartPath, setLocaleCookie } from '@/lib/localePath';

const displayFont = "'Fraunces', serif";
const accent = '#8B7CF6';
const accentBlue = '#38BDF8';

type FormState = 'idle' | 'loading' | 'success' | 'error';

function toPersianDigits(n: number): string {
  return n.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);
}

const FA = {
  badge: 'به زودی',
  heading: 'مایندلورا در حال توسعه نهایی است',
  sub: 'اولین نفری باش که دسترسی می‌گیری — Early Access کاملاً رایگانه',
  bullets: [
    '✦ تحلیل کامل رفتاری تاریخچه معاملات MT5 شما',
    '✦ امتیاز روان‌شناختی — نظم معاملاتی‌تان را در طول زمان رصد کنید',
    '✦ ۱۰۰ نفر اول ۳ ماه نسخه Pro کاملاً رایگان دریافت می‌کنند',
  ],
  banner: (spots: number) =>
    spots > 0
      ? `۱۰۰ نفر اول ۳ ماه نسخه Pro رایگان دریافت می‌کنند · ${toPersianDigits(spots)} جای خالی باقی مانده`
      : 'ظرفیت Early Access تکمیل شد — در لیست انتظار عادی ثبت‌نام کن',
  socialProof: (n: number) => `به ${toPersianDigits(n)} تریدری که قبلاً ثبت‌نام کرده‌اند بپیوند`,
  privacy: 'اسپم نمی‌فرستیم. ایمیل شما را به کسی نمی‌دهیم.',
  placeholder: 'آدرس ایمیل شما',
  button: 'ثبت در لیست انتظار',
  success: 'ثبت شدی. به عنوان یکی از ۱۰۰ عضو اول، ۳ ماه نسخه Pro رایگان دریافت می‌کنی.',
  back: '→ بازگشت به خانه',
};

const EN = {
  badge: 'Coming Soon',
  heading: 'Mindlura is in final development.',
  sub: 'Be the first to get access — Early Access is completely free.',
  bullets: [
    '✦ Full behavioral analysis of your MT5 trade history',
    '✦ Psychology Score — track your mental discipline over time',
    '✦ First 100 members get 3 months of Pro completely free',
  ],
  banner: (spots: number) =>
    spots > 0
      ? `First 100 members get 3 months of Pro — free · ${spots} spot${spots === 1 ? '' : 's'} remaining`
      : 'Early Access spots are full — join the regular waitlist below',
  socialProof: (n: number) => `Join ${n} trader${n === 1 ? '' : 's'} already on the waitlist`,
  privacy: "No spam. No sharing. Just early access when we're ready.",
  placeholder: 'Your email address',
  button: 'Join the Waitlist',
  success: "You're in. As one of our first 100 members, you'll get 3 months of Pro free.",
  back: '← Back to Home',
};

export default function WaitlistClient({
  spotsRemaining,
  count,
  initialLang,
  initialCountry,
}: {
  spotsRemaining: number;
  count: number;
  initialLang: Lang;
  initialCountry: string;
}) {
  const { lang, country } = useGeoLang(initialLang, initialCountry);
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');

  const isFa = lang === 'fa';
  const c = isFa ? FA : EN;
  const showLangToggle = country === 'IR';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) return;
    setState('loading');
    try {
      const result = await submitWaitlist(email, lang);
      setState(result.success ? 'success' : 'error');
    } catch {
      setState('error');
    }
  }

  function switchLang() {
    setLocaleCookie(isFa ? 'en' : 'fa');
    router.push(getCounterpartPath(pathname));
  }

  return (
    <div
      dir={isFa ? 'rtl' : 'ltr'}
      style={{
        backgroundColor: '#0A0E17',
        color: '#E9ECF3',
        minHeight: '100vh',
        fontFamily: isFa ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif",
      }}
    >
      <style>{`
        input::placeholder { color: #5A6178; }
        input:focus { border-color: ${accent} !important; }
      `}</style>

      {/* Urgency banner — full width, above everything */}
      <div
        style={{
          width: '100%',
          background: `linear-gradient(90deg, ${accent}, #6366f1)`,
          color: '#ffffff',
          textAlign: 'center',
          fontSize: '14px',
          padding: '12px 24px',
        }}
      >
        {c.banner(spotsRemaining)}
      </div>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Top bar: back link + lang toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '56px' }}>
          <Link href="/" style={{ fontSize: '13px', color: '#5A6178', textDecoration: 'none' }}>
            {c.back}
          </Link>
          {showLangToggle && (
            <button
              onClick={switchLang}
              style={{
                background: 'none',
                border: '1px solid #232332',
                borderRadius: '100px',
                padding: '4px 14px',
                fontSize: '12px',
                color: '#7C8296',
                cursor: 'pointer',
                fontFamily: isFa ? "'Inter', sans-serif" : "'Vazirmatn', sans-serif",
              }}
            >
              {isFa ? 'English' : 'فارسی'}
            </button>
          )}
        </div>

        {/* Badge */}
        <span
          style={{
            display: 'inline-block',
            fontSize: '11px',
            padding: '4px 14px',
            borderRadius: '100px',
            border: `1px solid ${accent}`,
            color: accent,
            marginBottom: '24px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {c.badge}
        </span>

        <h1
          style={{
            fontFamily: displayFont,
            fontSize: 'clamp(1.6rem, 4vw, 2.25rem)',
            fontWeight: 500,
            color: '#E9ECF3',
            lineHeight: 1.2,
            marginBottom: '14px',
          }}
        >
          {c.heading}
        </h1>

        <p style={{ color: '#7C8296', fontSize: '15px', lineHeight: 1.7, marginBottom: '16px', maxWidth: '440px' }}>
          {c.sub}
        </p>

        {/* What you get */}
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {c.bullets.map((b, i) => (
            <li key={i} style={{ color: '#7C8296', fontSize: '14px', lineHeight: 1.6 }}>
              <span style={{ color: accent }}>{b.slice(0, 1)}</span>
              {b.slice(1)}
            </li>
          ))}
        </ul>

        {/* Social proof */}
        {count > 0 && (
          <p style={{ color: '#7C8296', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>
            {c.socialProof(count)}
          </p>
        )}

        {state === 'success' ? (
          <p style={{ color: accentBlue, fontSize: '16px', fontStyle: 'italic' }}>{c.success}</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '380px' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={c.placeholder}
              required
              style={{
                background: '#12121C',
                border: '1px solid #232332',
                borderRadius: '6px',
                padding: '12px 16px',
                color: '#E9ECF3',
                fontSize: '14px',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
                direction: isFa ? 'rtl' : 'ltr',
              }}
            />
            {state === 'error' && (
              <p style={{ color: '#f87171', fontSize: '13px', margin: 0 }}>
                {isFa ? 'خطا رخ داد. دوباره امتحان کن.' : 'Something went wrong. Please try again.'}
              </p>
            )}
            <button
              type="submit"
              disabled={state === 'loading'}
              style={{
                background: accent,
                color: '#0A0E17',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: state === 'loading' ? 'not-allowed' : 'pointer',
                opacity: state === 'loading' ? 0.7 : 1,
                boxShadow: '0 0 24px rgba(139,124,246,0.45)',
                transition: 'opacity 0.2s',
              }}
            >
              {state === 'loading' ? '...' : c.button}
            </button>
            <p style={{ color: '#5A6178', fontSize: '11px', textAlign: 'center', margin: 0 }}>
              {c.privacy}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
