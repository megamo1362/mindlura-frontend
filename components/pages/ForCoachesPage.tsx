'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Ticket,
  Bot,
  BarChart3,
  Send,
  Coins,
  ArrowRight,
} from 'lucide-react';

const accent = '#38BDF8';
const accent2 = '#8B7CF6';

const COPY = {
  en: {
    dir: 'ltr' as const,
    back: '← Mindlura',
    langToggleHref: '/fa/for-coaches',
    langToggleLabel: 'فارسی',
    hero: {
      heading: 'Grow Your Coaching Business with Mindlura',
      sub: 'The professional platform for forex trading coaches — manage clients, track behavioral performance, and deliver AI-powered insights.',
      cta: 'Apply to Become a Coach',
    },
    features: {
      heading: 'Everything You Need to Coach at Scale',
      items: [
        {
          icon: 'dashboard',
          title: 'Client Dashboard',
          desc: "See all your clients' MT5 accounts, trades, psychology scores, and journal entries in one place — sorted and filterable by performance.",
        },
        {
          icon: 'ticket',
          title: 'Event-Based Onboarding',
          desc: 'Create unique event codes for each course. Students register with your code and automatically appear in your dashboard.',
        },
        {
          icon: 'bot',
          title: 'AI Daily Reports',
          desc: 'Request a daily AI-generated coaching report analyzing your entire client roster — filterable by performance metrics, delivered in English and Persian.',
        },
        {
          icon: 'chart',
          title: 'Performance Analytics',
          desc: 'Sort and compare clients by profit, drawdown, win rate, RR ratio, and Psychology Score. Spot who needs help before they ask.',
        },
        {
          icon: 'send',
          title: 'Direct Notifications',
          desc: 'Send messages to individual clients or your entire roster via Telegram or in-app notifications.',
        },
        {
          icon: 'coins',
          title: 'Commission Tracking',
          desc: 'Automatically track which clients purchased plans through your referral link. Your earnings are calculated transparently.',
        },
      ],
    },
    revenue: {
      heading: 'Your Earnings Grow With Your Roster',
      sub: 'No upfront fees. No monthly costs. You earn a percentage of every subscription purchased through your referral — automatically, for as long as the client stays subscribed.',
      tiers: [
        { label: 'Starter', clients: '1–9 active clients', rate: '15%', desc: 'Perfect for coaches just getting started' },
        { label: 'Active', clients: '10–29 active clients', rate: '20%', desc: 'For established coaches with a consistent student base' },
        { label: 'Pro', clients: '30+ active clients', rate: '25%', desc: 'Maximum earnings for high-volume coaches' },
      ],
      note: 'Active client = a client who has purchased any paid plan through your referral',
    },
    how: {
      heading: 'How It Works',
      steps: [
        { t: 'Apply & Get Approved', d: 'Submit your application. Our team reviews it and activates your coach account within 48 hours.' },
        { t: 'Set Up Your Events', d: 'Create event codes for your courses and share your referral link with students.' },
        { t: 'Clients Join & Connect', d: 'Students register on Mindlura using your code and are automatically linked to your coach dashboard.' },
        { t: 'Coach & Earn', d: 'Use AI insights, behavioral data, and direct messaging to guide your clients — and earn commission on every plan they purchase.' },
      ],
    },
    faq: {
      heading: 'Frequently Asked Questions',
      items: [
        {
          q: 'Who can become a coach on Mindlura?',
          a: 'Experienced forex traders and educators who have an existing student base or run trading courses. We review each application individually — there is no automated approval.',
        },
        {
          q: 'How do my clients connect to my account?',
          a: 'Two ways: share your unique referral link, or create event codes for specific courses. Clients who register via your link or code are automatically linked to your dashboard.',
        },
        {
          q: "Can clients see that I'm viewing their data?",
          a: 'Clients are informed when they connect that their coach can view their trade history and journal. They can revoke access at any time from their settings.',
        },
        {
          q: 'How does the AI daily report work?',
          a: 'Once per day you can request an AI-generated report analyzing your entire client roster — behavioral patterns, psychology scores, and coaching priorities. Delivered in both English and Persian.',
        },
        {
          q: 'When and how is commission paid?',
          a: 'Commission details and payment schedule are confirmed during the approval process. Payments are made in USDT.',
        },
      ],
    },
    form: {
      heading: 'Apply to Become a Coach',
      sub: "Tell us about yourself. We review every application personally and respond within 48 hours.",
      fields: {
        fullName: 'Full Name',
        email: 'Email',
        telegram: 'Telegram Username',
        telegramPlaceholder: '@username',
        instagram: 'Instagram',
        instagramPlaceholder: '@username',
        youtube: 'YouTube',
        youtubePlaceholder: 'channel URL',
        other: 'Other social media or website',
        students: 'Approximate number of current students',
        experience: 'Coaching experience',
        experiencePlaceholder: 'Tell us about your coaching background, your teaching style, and what makes your approach unique.',
        resume: 'Resume / CV',
        resumeHint: 'PDF, DOC, or DOCX — max 5MB',
      },
      submit: 'Submit Application',
      submitting: '...',
      success: "Thank you for applying! We'll review your application and contact you within 48 hours.",
      error: 'Something went wrong. Please try again.',
      fileTooLarge: 'File must be under 5MB.',
    },
  },
  fa: {
    dir: 'rtl' as const,
    back: 'مایندلورا ←',
    langToggleHref: '/for-coaches',
    langToggleLabel: 'English',
    hero: {
      heading: 'کسب‌وکار کوچینگ خود را با مایندلورا رشد دهید',
      sub: 'پلتفرم حرفه‌ای برای کوچ‌های فارکس — مدیریت کلاینت‌ها، پیگیری عملکرد رفتاری و ارائه بینش‌های هوش مصنوعی.',
      cta: 'درخواست همکاری به عنوان کوچ',
    },
    features: {
      heading: 'همه چیزی که برای کوچینگ حرفه‌ای نیاز دارید',
      items: [
        {
          icon: 'dashboard',
          title: 'داشبورد کلاینت',
          desc: 'تمام حساب‌های MT5، معاملات، امتیاز روان‌شناختی و ژورنال کلاینت‌هایتان را در یک مکان ببینید — مرتب‌سازی و فیلتر بر اساس عملکرد.',
        },
        {
          icon: 'ticket',
          title: 'ورود مبتنی بر رویداد',
          desc: 'کدهای رویداد منحصربه‌فرد برای هر دوره بسازید. دانشجویان با کد شما ثبت‌نام می‌کنند و به‌صورت خودکار در داشبورد شما ظاهر می‌شوند.',
        },
        {
          icon: 'bot',
          title: 'گزارش‌های روزانه هوش مصنوعی',
          desc: 'یک گزارش کوچینگ روزانه تولیدشده توسط هوش مصنوعی درخواست کنید که تمام کلاینت‌هایتان را تحلیل می‌کند — قابل فیلتر، به انگلیسی و فارسی.',
        },
        {
          icon: 'chart',
          title: 'آنالیتیکس عملکرد',
          desc: 'کلاینت‌ها را بر اساس سود، دراداون، نرخ برد، نسبت RR و امتیاز روان‌شناختی مرتب و مقایسه کنید. قبل از اینکه بپرسند بدانید چه کسی به کمک نیاز دارد.',
        },
        {
          icon: 'send',
          title: 'اعلان‌های مستقیم',
          desc: 'پیام‌ها را از طریق تلگرام یا اعلان‌های درون برنامه به کلاینت‌های خاص یا تمام لیستتان ارسال کنید.',
        },
        {
          icon: 'coins',
          title: 'پیگیری کمیسیون',
          desc: 'به‌صورت خودکار پیگیری کنید کدام کلاینت‌ها از طریق لینک معرفی شما پلن خریداری کرده‌اند. درآمد شما به‌صورت شفاف محاسبه می‌شود.',
        },
      ],
    },
    revenue: {
      heading: 'درآمد شما با رشد کلاینت‌هایتان رشد می‌کند',
      sub: 'بدون هزینه اولیه. بدون هزینه ماهانه. شما درصدی از هر اشتراکی که از طریق معرفی شما خریداری می‌شود دریافت می‌کنید — به‌صورت خودکار، تا زمانی که کلاینت مشترک بماند.',
      tiers: [
        { label: 'استارتر', clients: '۱ تا ۹ کلاینت فعال', rate: '۱۵٪', desc: 'مناسب برای کوچ‌هایی که تازه شروع می‌کنند' },
        { label: 'فعال', clients: '۱۰ تا ۲۹ کلاینت فعال', rate: '۲۰٪', desc: 'برای کوچ‌های باتجربه با پایگاه دانشجویی ثابت' },
        { label: 'پرو', clients: '۳۰+ کلاینت فعال', rate: '۲۵٪', desc: 'حداکثر درآمد برای کوچ‌های با حجم بالا' },
      ],
      note: 'کلاینت فعال = کلاینتی که از طریق معرفی شما هر پلن پولی خریداری کرده باشد',
    },
    how: {
      heading: 'چگونه کار می‌کند',
      steps: [
        { t: 'درخواست دهید و تأیید شوید', d: 'درخواست خود را ارسال کنید. تیم ما آن را بررسی کرده و حساب کوچ شما را ظرف ۴۸ ساعت فعال می‌کند.' },
        { t: 'رویدادهای خود را تنظیم کنید', d: 'کدهای رویداد برای دوره‌هایتان بسازید و لینک معرفی خود را با دانشجویان به اشتراک بگذارید.' },
        { t: 'کلاینت‌ها ملحق می‌شوند', d: 'دانشجویان با کد شما در مایندلورا ثبت‌نام می‌کنند و به‌صورت خودکار به داشبورد کوچ شما متصل می‌شوند.' },
        { t: 'کوچ کنید و درآمد کسب کنید', d: 'از بینش‌های هوش مصنوعی، داده‌های رفتاری و پیام‌رسانی مستقیم برای راهنمایی کلاینت‌هایتان استفاده کنید — و از هر پلنی که خریداری می‌کنند کمیسیون دریافت کنید.' },
      ],
    },
    faq: {
      heading: 'سوالات متداول',
      items: [
        {
          q: 'چه کسی می‌تواند کوچ در مایندلورا شود؟',
          a: 'معامله‌گران و مربیان باتجربه فارکس که پایگاه دانشجویی دارند یا دوره‌های معاملاتی برگزار می‌کنند. هر درخواست را به‌صورت جداگانه بررسی می‌کنیم — تأیید خودکار وجود ندارد.',
        },
        {
          q: 'کلاینت‌های من چگونه به حساب من متصل می‌شوند؟',
          a: 'دو روش: لینک معرفی منحصربه‌فرد خود را به اشتراک بگذارید، یا کدهای رویداد برای دوره‌های خاص بسازید. کلاینت‌هایی که از طریق لینک یا کد شما ثبت‌نام می‌کنند به‌صورت خودکار به داشبورد شما متصل می‌شوند.',
        },
        {
          q: 'آیا کلاینت‌ها می‌توانند ببینند که من داده‌هایشان را می‌بینم؟',
          a: 'هنگام اتصال به کلاینت‌ها اطلاع داده می‌شود که کوچ می‌تواند تاریخچه معاملات و ژورنالشان را ببیند. آن‌ها می‌توانند در هر زمان از تنظیمات خود دسترسی را لغو کنند.',
        },
        {
          q: 'گزارش روزانه هوش مصنوعی چگونه کار می‌کند؟',
          a: 'یک بار در روز می‌توانید یک گزارش تولیدشده توسط هوش مصنوعی درخواست کنید که الگوهای رفتاری، امتیازات روان‌شناختی و اولویت‌های کوچینگ تمام کلاینت‌هایتان را تحلیل می‌کند. به انگلیسی و فارسی.',
        },
        {
          q: 'کمیسیون چه زمانی و چگونه پرداخت می‌شود؟',
          a: 'جزئیات کمیسیون و زمان‌بندی پرداخت در طول فرآیند تأیید مشخص می‌شود. پرداخت‌ها به صورت USDT انجام می‌شود.',
        },
      ],
    },
    form: {
      heading: 'درخواست همکاری به عنوان کوچ',
      sub: 'درباره خودتان بگویید. هر درخواست را شخصاً بررسی می‌کنیم و ظرف ۴۸ ساعت پاسخ می‌دهیم.',
      fields: {
        fullName: 'نام کامل',
        email: 'ایمیل',
        telegram: 'نام کاربری تلگرام',
        telegramPlaceholder: '@username',
        instagram: 'اینستاگرام',
        instagramPlaceholder: '@username',
        youtube: 'یوتیوب',
        youtubePlaceholder: 'channel URL',
        other: 'سایر شبکه‌های اجتماعی یا وب‌سایت',
        students: 'تعداد تقریبی دانشجویان فعلی',
        experience: 'تجربه کوچینگ',
        experiencePlaceholder: 'درباره سابقه کوچینگ، سبک تدریس و آنچه رویکرد شما را منحصربه‌فرد می‌کند بگویید.',
        resume: 'رزومه',
        resumeHint: 'PDF، DOC یا DOCX — حداکثر ۵ مگابایت',
      },
      submit: 'ارسال درخواست',
      submitting: '...',
      success: 'ممنون از درخواست شما! درخواست شما را بررسی می‌کنیم و ظرف ۴۸ ساعت با شما تماس می‌گیریم.',
      error: 'خطا رخ داد. دوباره امتحان کنید.',
      fileTooLarge: 'حجم فایل باید کمتر از ۵ مگابایت باشد.',
    },
  },
};

const ICONS = { dashboard: LayoutDashboard, ticket: Ticket, bot: Bot, chart: BarChart3, send: Send, coins: Coins };

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ForCoachesPageContent({ lang }: { lang: 'en' | 'fa' }) {
  const t = COPY[lang];
  const isFa = lang === 'fa';
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [fileError, setFileError] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const displayFont = isFa ? "'Vazirmatn', sans-serif" : "'Fraunces', serif";
  const bodyFont = isFa ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";
  const inputStyle: React.CSSProperties = {
    background: '#12121C',
    border: '1px solid #232332',
    borderRadius: '6px',
    padding: '12px 16px',
    color: '#E9ECF3',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: bodyFont,
  };
  const labelStyle: React.CSSProperties = { fontSize: '13px', color: '#C7CBE0', marginBottom: '6px', display: 'block' };

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_RESUME_BYTES) {
      setFileError(t.form.fileTooLarge);
      setResumeFile(null);
      e.target.value = '';
      return;
    }
    setFileError('');
    setResumeFile(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      let resume: { fileName: string; fileType: string; base64: string } | null = null;
      if (resumeFile) {
        const base64 = await readFileAsBase64(resumeFile);
        resume = { fileName: resumeFile.name, fileType: resumeFile.type, base64 };
      }

      const payload = {
        lang,
        fullName: data.get('fullName'),
        email: data.get('email'),
        telegram: data.get('telegram'),
        instagram: data.get('instagram'),
        youtube: data.get('youtube'),
        otherSocial: data.get('otherSocial'),
        studentsCount: data.get('studentsCount'),
        experience: data.get('experience'),
        resume,
      };

      const res = await fetch('/api/coach-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      setStatus(result.success ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div dir={t.dir} style={{ backgroundColor: '#0A0E17', color: '#E9ECF3', fontFamily: bodyFont, minHeight: '100vh' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        input::placeholder, textarea::placeholder { color: #5A6178; }
        input:focus, textarea:focus { border-color: ${accent} !important; }
        .fc-focus:focus-visible { outline: 1px solid ${accent}; outline-offset: 4px; }
      `}</style>

      <div className="max-w-screen-lg mx-auto px-6 py-10">
        {/* ---------------- TOP BAR ---------------- */}
        <div className="flex items-center justify-between mb-16">
          <Link href={isFa ? '/fa' : '/'} className="text-sm hover:text-[#C7CBE0] transition-colors fc-focus" style={{ color: '#5A6178' }}>
            {t.back}
          </Link>
          <Link href={t.langToggleHref} className="text-xs italic fc-focus" style={{ fontFamily: displayFont, color: '#7C8296' }}>
            {t.langToggleLabel}
          </Link>
        </div>

        {/* ---------------- HERO ---------------- */}
        <section className="mb-24 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl leading-[1.15] mb-6" style={{ fontFamily: displayFont, fontWeight: 500 }}>
            {t.hero.heading}
          </h1>
          <p className="text-base md:text-lg leading-relaxed mb-9" style={{ color: '#7C8296' }}>
            {t.hero.sub}
          </p>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm fc-focus"
            style={{ backgroundColor: accent, color: '#0A0E17', boxShadow: '0 0 28px rgba(56,189,248,0.5)' }}
          >
            {t.hero.cta}
            <ArrowRight size={16} className={isFa ? 'rotate-180' : ''} />
          </a>
        </section>

        <div style={{ height: '1px', backgroundColor: '#232332' }} className="mb-20" />

        {/* ---------------- WHY MINDLURA ---------------- */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl mb-14 max-w-lg" style={{ fontFamily: displayFont, fontWeight: 500 }}>
            {t.features.heading}
          </h2>
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-10">
            {t.features.items.map((item, i) => {
              const Icon = ICONS[item.icon as keyof typeof ICONS];
              return (
                <div key={i}>
                  <Icon size={20} strokeWidth={1.4} style={{ color: accent }} className="mb-4" />
                  <h3 className="text-base mb-2" style={{ fontFamily: displayFont, fontWeight: 500 }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#7C8296' }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div style={{ height: '1px', backgroundColor: '#232332' }} className="mb-20" />

        {/* ---------------- REVENUE SHARE ---------------- */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl mb-5 max-w-lg" style={{ fontFamily: displayFont, fontWeight: 500 }}>
            {t.revenue.heading}
          </h2>
          <p className="text-sm md:text-base leading-relaxed mb-14 max-w-xl" style={{ color: '#7C8296' }}>
            {t.revenue.sub}
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {t.revenue.tiers.map((tier, i) => {
              const highlighted = i === 1;
              return (
                <div
                  key={i}
                  className="p-6"
                  style={{
                    border: highlighted ? `1px solid ${accent}` : '1px solid #232332',
                    boxShadow: highlighted ? '0 0 24px rgba(56,189,248,0.15)' : 'none',
                  }}
                >
                  <h3 className="text-base mb-1" style={{ fontFamily: displayFont, fontWeight: 500, color: highlighted ? accent : '#E9ECF3' }}>
                    {tier.label}
                  </h3>
                  <p className="text-xs mb-5" style={{ color: '#5A6178' }}>{tier.clients}</p>
                  <div className="text-3xl mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", color: highlighted ? accent : '#E9ECF3' }}>
                    {tier.rate}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#7C8296' }}>{tier.desc}</p>
                </div>
              );
            })}
          </div>
          <p className="text-xs italic" style={{ color: '#5A6178', fontFamily: displayFont }}>{t.revenue.note}</p>
        </section>

        <div style={{ height: '1px', backgroundColor: '#232332' }} className="mb-20" />

        {/* ---------------- HOW IT WORKS ---------------- */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl mb-14 max-w-lg" style={{ fontFamily: displayFont, fontWeight: 500 }}>
            {t.how.heading}
          </h2>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
            {t.how.steps.map((step, i) => (
              <div key={i}>
                <div className="text-xs mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-lg mb-2" style={{ fontFamily: displayFont, fontWeight: 500 }}>{step.t}</h3>
                <p className="text-sm leading-relaxed max-w-sm" style={{ color: '#7C8296' }}>{step.d}</p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: '1px', backgroundColor: '#232332' }} className="mb-20" />

        {/* ---------------- FAQ ---------------- */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl mb-12" style={{ fontFamily: displayFont, fontWeight: 500 }}>
            {t.faq.heading}
          </h2>
          <div>
            {t.faq.items.map((item, i) => (
              <div key={i} style={{ borderBottom: '1px solid #1C1C28' }}>
                <button
                  type="button"
                  className="w-full flex items-center justify-between py-5 text-left fc-focus"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-medium pr-8" style={{ fontFamily: displayFont, color: '#E9ECF3' }}>{item.q}</span>
                  <span className="text-lg flex-shrink-0" style={{ color: accent, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
                    <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: openFaq === i ? '&#x2212;' : '&#x002B;' }} />
                  </span>
                </button>
                {openFaq === i && (
                  <p className="pb-5 text-sm leading-relaxed max-w-2xl" style={{ color: '#7C8296' }}>{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: '1px', backgroundColor: '#232332' }} className="mb-20" />

        {/* ---------------- APPLICATION FORM ---------------- */}
        <section id="apply" className="mb-10 scroll-mt-10">
          <h2 className="text-2xl md:text-3xl mb-4" style={{ fontFamily: displayFont, fontWeight: 500 }}>
            {t.form.heading}
          </h2>
          <p className="text-sm md:text-base leading-relaxed mb-10 max-w-xl" style={{ color: '#7C8296' }}>
            {t.form.sub}
          </p>

          {status === 'success' ? (
            <p style={{ color: accent2, fontSize: '16px', fontStyle: 'italic' }}>{t.form.success}</p>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-5">
              <div>
                <label style={labelStyle}>{t.form.fields.fullName}</label>
                <input name="fullName" type="text" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t.form.fields.email}</label>
                <input name="email" type="email" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t.form.fields.telegram}</label>
                <input name="telegram" type="text" required placeholder={t.form.fields.telegramPlaceholder} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t.form.fields.instagram}</label>
                <input name="instagram" type="text" placeholder={t.form.fields.instagramPlaceholder} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t.form.fields.youtube}</label>
                <input name="youtube" type="text" placeholder={t.form.fields.youtubePlaceholder} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t.form.fields.other}</label>
                <input name="otherSocial" type="text" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t.form.fields.students}</label>
                <input name="studentsCount" type="number" min="0" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t.form.fields.experience}</label>
                <textarea name="experience" required rows={5} placeholder={t.form.fields.experiencePlaceholder} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label style={labelStyle}>{t.form.fields.resume}</label>
                <input
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={{ ...inputStyle, padding: '10px 16px' }}
                />
                <p className="text-xs mt-1.5" style={{ color: '#5A6178' }}>{t.form.fields.resumeHint}</p>
                {fileError && <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>{fileError}</p>}
              </div>

              {status === 'error' && (
                <p style={{ color: '#f87171', fontSize: '13px', margin: 0 }}>{t.form.error}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="fc-focus"
                style={{
                  background: accent,
                  color: '#0A0E17',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                  opacity: status === 'submitting' ? 0.7 : 1,
                  boxShadow: '0 0 24px rgba(56,189,248,0.4)',
                  alignSelf: 'flex-start',
                }}
              >
                {status === 'submitting' ? t.form.submitting : t.form.submit}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
