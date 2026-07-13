import Link from 'next/link';
import { TrendingUp, Brain, Users, Quote, ArrowRight } from 'lucide-react';

const COPY = {
  en: {
    dir: 'ltr' as const,
    back: '← Mindlura',
    hero: {
      heading: "We've Seen What Happens When Psychology Is Ignored",
      sub: 'Mindlura was built by people who watched it happen from the inside.',
    },
    story: [
      'Our founder spent four years trading forex before joining the operations side of a brokerage — eventually becoming its technical director. That position offered a rare view: not just the charts, but the people behind them.',
      "What he saw was consistent. Traders with solid strategies losing accounts they had spent years building. Not because their analysis was wrong. Not because the market was against them. Because of what happened between one trade and the next.",
      "One moment stands out. A client turned $10,000 into $1,000,000 — genuine skill, real edge, years of discipline. Then lost it all. Not in a crash. Not in a single bad trade. In a cascade of decisions that had nothing to do with the market and everything to do with what was happening in his mind. That pattern repeated across different traders, different strategies, different account sizes.",
      "We also noticed something else: traders who journaled consistently performed dramatically differently from those who didn't. Yet most traders considered journaling optional. Mindlura is our answer to both problems.",
    ],
    built: {
      heading: 'What We Built',
      items: [
        {
          icon: 'trend',
          t: 'Behavioral Analytics',
          d: "MAE and MFE analysis to show the gap between your best possible exits and your real ones. Session analysis to identify when you trade well and when you don't.",
        },
        {
          icon: 'brain',
          t: 'Psychology Score',
          d: 'A single number that tracks your mental discipline over time — so improvement is measurable, not just felt.',
        },
        {
          icon: 'users',
          t: 'Coach Dashboard',
          d: "A dashboard that lets coaches see clients' behavioral data — not just P&L — so sessions are grounded in evidence, not memory.",
        },
      ],
    },
    team: {
      heading: 'Our Team',
      text: 'Our team has worked inside brokerages. We understand the mechanics of how trades are executed, how spreads work, and what brokers see that traders don\'t. We built Mindlura specifically because we believe traders deserve tools that were built with that knowledge.',
    },
    principle:
      "Psychology is not a soft skill. It is the difference between a trader who survives and one who doesn't. Everything we build at Mindlura starts from that belief.",
    cta: { button: 'Start your free trial' },
  },
  fa: {
    dir: 'rtl' as const,
    back: 'مایندلورا ←',
    hero: {
      heading: 'ما دیدیم که وقتی روان‌شناسی نادیده گرفته می‌شود چه اتفاقی می‌افتد',
      sub: 'مایندلورا توسط افرادی ساخته شد که این اتفاق را از درون مشاهده کردند.',
    },
    story: [
      'بنیان‌گذار مایندلورا چهار سال ترید فارکس کرد پیش از اینکه به بخش عملیاتی یک بروکر بپیوندد — و در نهایت مدیر فنی آن بروکر شود. این موقعیت دیدگاهی نادر به او داد: نه فقط چارت‌ها، بلکه آدم‌های پشت آن‌ها.',
      'آنچه دید ثابت بود. تریدرهایی با استراتژی‌های محکم که حساب‌هایی را که سال‌ها برای ساختنشان تلاش کرده بودند از دست می‌دادند. نه به این خاطر که تحلیل‌شان اشتباه بود. نه به این خاطر که بازار علیه‌شان بود. بلکه به خاطر آنچه بین یک معامله و معامله بعدی اتفاق می‌افتاد.',
      'یک لحظه در ذهنش ماند. کلاینتی که ۱۰,۰۰۰ دلار را به ۱,۰۰۰,۰۰۰ دلار رساند — مهارت واقعی، edge حقیقی، سال‌ها نظم. بعد همه را از دست داد. نه در یک سقوط. نه در یک معامله بد. در یک آبشار از تصمیماتی که هیچ ربطی به بازار نداشت و همه چیز به آنچه در ذهنش می‌گذشت مربوط بود. این الگو در تریدرهای مختلف، استراتژی‌های مختلف، اندازه‌های حساب مختلف تکرار شد.',
      'یک چیز دیگر هم متوجه شدیم: تریدرهایی که به طور مستمر ژورنال می‌نوشتند عملکرد به طور چشمگیری متفاوتی داشتند. با این حال اکثر تریدرها ژورنال‌نویسی را اختیاری می‌دانستند. مایندلورا پاسخ ما به هر دو مشکل است.',
    ],
    built: {
      heading: 'آنچه ساختیم',
      items: [
        {
          icon: 'trend',
          t: 'تحلیل رفتاری',
          d: 'تحلیل MAE و MFE برای نشان دادن فاصله بین بهترین خروج‌های ممکن و خروج‌های واقعی شما. تحلیل جلسه برای شناسایی اینکه چه وقتی خوب معامله می‌کنید.',
        },
        {
          icon: 'brain',
          t: 'امتیاز روان‌شناختی',
          d: 'یک عدد واحد که نظم ذهنی شما را در طول زمان رصد می‌کند — تا پیشرفت قابل اندازه‌گیری باشد، نه فقط احساس شود.',
        },
        {
          icon: 'users',
          t: 'داشبورد کوچ',
          d: 'داشبوردی که به کوچ‌ها امکان می‌دهد داده‌های رفتاری کلاینت‌ها را ببینند — نه فقط P&L — تا جلسات بر پایه شواهد باشند.',
        },
      ],
    },
    team: {
      heading: 'تیم ما',
      text: 'تیم ما در درون بروکرها کار کرده است. ما مکانیک اجرای معاملات، نحوه عملکرد اسپردها، و آنچه بروکرها می‌بینند که تریدرها نمی‌بینند را می‌فهمیم. مایندلورا را دقیقاً به این خاطر ساختیم که معتقدیم تریدرها لایق ابزارهایی هستند که با این دانش ساخته شده باشند.',
    },
    principle:
      'روان‌شناسی یک مهارت نرم نیست. تفاوت بین تریدری است که دوام می‌آورد و تریدری که نمی‌آورد. همه آنچه در مایندلورا می‌سازیم از این باور شروع می‌شود.',
    cta: { button: 'شروع دوره آزمایشی رایگان' },
  },
};

const ICONS = { trend: TrendingUp, brain: Brain, users: Users };

export function AboutPageContent({ lang }: { lang: 'en' | 'fa' }) {
  const t = COPY[lang];
  const isFa = lang === 'fa';

  const displayFont = isFa ? "'Vazirmatn', sans-serif" : "'Fraunces', serif";
  const bodyFont = isFa ? "'Vazirmatn', sans-serif" : "'Inter', sans-serif";

  return (
    <div
      dir={t.dir}
      style={{ backgroundColor: '#0A0E17', color: '#E9ECF3', fontFamily: bodyFont, minHeight: '100vh' }}
    >
      <div className="max-w-screen-md mx-auto px-6 py-16 md:py-24">
        {/* Back link */}
        <div className="mb-16">
          <Link href={isFa ? '/fa' : '/'} className="text-sm hover:text-[#C7CBE0] transition-colors" style={{ color: '#5A6178' }}>
            {t.back}
          </Link>
        </div>

        {/* ---------------- HERO ---------------- */}
        <section className="mb-20">
          <h1
            className="text-3xl md:text-5xl leading-[1.15] mb-6"
            style={{ fontFamily: displayFont, fontWeight: 500 }}
          >
            {t.hero.heading}
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-lg" style={{ color: '#7C8296' }}>
            {t.hero.sub}
          </p>
        </section>

        <div style={{ height: '1px', backgroundColor: '#232332' }} className="mb-20" />

        {/* ---------------- THE STORY ---------------- */}
        <section className="mb-20 flex flex-col gap-6">
          {t.story.map((p, i) => (
            <p key={i} className="text-sm md:text-base leading-relaxed" style={{ color: '#C7CBE0' }}>
              {p}
            </p>
          ))}
        </section>

        <div style={{ height: '1px', backgroundColor: '#232332' }} className="mb-20" />

        {/* ---------------- WHAT WE BUILT ---------------- */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl mb-12" style={{ fontFamily: displayFont, fontWeight: 500 }}>
            {t.built.heading}
          </h2>
          <div className="grid md:grid-cols-3 gap-x-8 gap-y-10">
            {t.built.items.map((item, i) => {
              const Icon = ICONS[item.icon as keyof typeof ICONS];
              return (
                <div key={i}>
                  <Icon size={20} strokeWidth={1.4} style={{ color: '#8B7CF6' }} className="mb-4" />
                  <h3 className="text-base mb-2" style={{ fontFamily: displayFont, fontWeight: 500 }}>
                    {item.t}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#7C8296' }}>
                    {item.d}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div style={{ height: '1px', backgroundColor: '#232332' }} className="mb-20" />

        {/* ---------------- TEAM ---------------- */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl mb-5" style={{ fontFamily: displayFont, fontWeight: 500 }}>
            {t.team.heading}
          </h2>
          <p className="text-sm md:text-base leading-relaxed max-w-lg" style={{ color: '#7C8296' }}>
            {t.team.text}
          </p>
        </section>

        {/* ---------------- ONE PRINCIPLE ---------------- */}
        <section className="mb-20 text-center max-w-xl mx-auto">
          <Quote size={24} strokeWidth={1.2} style={{ color: '#8B7CF6', margin: '0 auto 24px' }} />
          <p
            className="text-lg md:text-2xl leading-relaxed px-6 md:px-8"
            style={{
              fontFamily: displayFont,
              fontWeight: 500,
              borderLeft: isFa ? 'none' : '2px solid #8B7CF6',
              borderRight: isFa ? '2px solid #8B7CF6' : 'none',
            }}
          >
            {t.principle}
          </p>
        </section>

        <div style={{ height: '1px', backgroundColor: '#232332' }} className="mb-20" />

        {/* ---------------- CTA ---------------- */}
        <section className="text-center">
          <Link
            href={isFa ? '/fa/register' : '/register'}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4"
            style={{ backgroundColor: '#8B7CF6', color: '#0A0E17', boxShadow: '0 0 28px rgba(139,124,246,0.5)' }}
          >
            {t.cta.button}
            <ArrowRight size={16} className={isFa ? 'rotate-180' : ''} />
          </Link>
        </section>
      </div>
    </div>
  );
}
