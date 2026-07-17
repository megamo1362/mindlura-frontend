// Redesign homepage copy — bilingual dictionaries, one per section.
// Follows the same { en, fa } pairing convention as HomeClient.tsx / ForCoachesPage.tsx.

export type Lang = 'en' | 'fa';

export const chromeCopy = {
  en: {
    dir: 'ltr' as const,
    nav: {
      demo: 'AI Demo',
      how: 'How It Works',
      pricing: 'Pricing',
      coaches: 'For Coaches',
      blog: 'Blog',
      sentiment: 'Sentiment',
      news: 'News',
      faq: 'FAQ',
      about: 'About',
      security: 'Security',
      login: 'Log in',
      start: 'Get Started',
    },
    toggle: { trader: 'Trader', coach: 'Coach', hint: 'Adjusts the opening message below — the rest of the page stays the same for everyone.' },
    footer: {
      tagline: 'Trading psychology, made visible.',
      cols: [
        { h: 'Product', items: ['AI Demo', 'How It Works', 'Pricing', 'For Coaches', 'Security'] },
        { h: 'Company', items: ['About', 'Blog', 'FAQ'] },
        { h: 'Legal', items: ['Privacy', 'Terms'] },
      ],
      rights: 'All rights reserved.',
      preview: 'Redesign preview — not the live site',
    },
  },
  fa: {
    dir: 'rtl' as const,
    nav: {
      demo: 'دموی هوش مصنوعی',
      how: 'روند کار',
      pricing: 'قیمت‌ها',
      coaches: 'برای کوچ‌ها',
      blog: 'بلاگ',
      sentiment: 'سنتیمنت',
      news: 'اخبار',
      faq: 'سوالات متداول',
      about: 'درباره ما',
      security: 'امنیت',
      login: 'ورود',
      start: 'شروع کنید',
    },
    toggle: { trader: 'تریدر', coach: 'کوچ', hint: 'فقط پیام ابتدایی زیر را تغییر می‌دهد — بقیه صفحه برای همه یکسان است.' },
    footer: {
      tagline: 'روان‌شناسی معاملاتی، قابل مشاهده.',
      cols: [
        { h: 'محصول', items: ['دموی هوش مصنوعی', 'روند کار', 'قیمت‌ها', 'برای کوچ‌ها', 'امنیت'] },
        { h: 'شرکت', items: ['درباره ما', 'بلاگ', 'سوالات متداول'] },
        { h: 'قوانین', items: ['حریم خصوصی', 'شرایط استفاده'] },
      ],
      rights: 'تمامی حقوق محفوظ است.',
      preview: 'پیش‌نمایش بازطراحی — نسخه نهایی سایت نیست',
    },
  },
};

export const heroCopy = {
  en: {
    trader: {
      eyebrow: 'AI-Powered Trading Psychology',
      title: 'Your Trading Data Reveals Hidden Patterns',
      sub: 'Mindlura reads your MT5 history and shows you the behavioral patterns costing you money — before they repeat.',
      cta1: 'Start Free Trial',
      cta2: 'See a Live Report',
    },
    coach: {
      eyebrow: 'AI-Powered Coaching Intelligence',
      title: 'See What Your Clients Can’t See',
      sub: 'A behavioral profile built from real trades, not memory of them — for coaches who take the work seriously.',
      cta1: 'Start Coaching for Free',
      cta2: 'See a Live Report',
    },
  },
  fa: {
    trader: {
      eyebrow: 'روان‌شناسی معاملاتی مبتنی بر هوش مصنوعی',
      title: 'داده‌های معاملاتی شما الگوهای پنهان را آشکار می‌کنند',
      sub: 'مایندلورا تاریخچه MT5 شما را می‌خواند و الگوهای رفتاری‌ای که برایتان هزینه دارند را پیش از تکرار نشان می‌دهد.',
      cta1: 'شروع دوره آزمایشی رایگان',
      cta2: 'مشاهده یک گزارش واقعی',
    },
    coach: {
      eyebrow: 'هوش مصنوعی برای کوچینگ',
      title: 'چیزی را ببینید که کلاینت‌هایتان نمی‌بینند',
      sub: 'پروفایل رفتاری‌ای بر اساس معاملات واقعی، نه حافظه‌اش از آن‌ها؛ برای کوچ‌هایی که این کار را جدی می‌گیرند.',
      cta1: 'شروع رایگان کوچینگ',
      cta2: 'مشاهده یک گزارش واقعی',
    },
  },
};

export const aiDemoCopy = {
  en: {
    eyebrow: 'See It in Action',
    title: 'This is what Mindlura sees in your trades.',
    sub: 'A real Mindlura report, built from sample trade history — the same analysis your account gets after connecting.',
    sampleBadge: 'Sample Data',
    sampleNote: 'Demo report — connect your MT5 account for your own analysis.',
    scoreTitle: 'Trading Psychology Score',
    grade: 'Needs Attention',
    subScores: [
      { key: 'risk_management', label: 'Risk Management', score: 64 },
      { key: 'revenge_control', label: 'Revenge Control', score: 58 },
      { key: 'discipline', label: 'Discipline', score: 81 },
      { key: 'emotional_stability', label: 'Emotional Stability', score: 72 },
    ],
    patternLabel: 'Detected Behavior',
    patternText: 'Risk increases after consecutive losses',
    patternDetail: 'Position size grows by an average of 38% in the 3 trades following a loss streak.',
    recommendationLabel: 'AI Recommendation',
    recommendationText: 'Reduce position size during emotional trading periods.',
    recommendationDetail: 'Consider a fixed cool-down rule after two consecutive losses.',
  },
  fa: {
    eyebrow: 'ببینید چگونه کار می‌کند',
    title: 'این چیزی است که مایندلورا در معاملات شما می‌بیند.',
    sub: 'یک گزارش واقعی مایندلورا، ساخته‌شده از داده نمونه — همان تحلیلی که پس از اتصال، حساب شما دریافت می‌کند.',
    sampleBadge: 'داده نمونه',
    sampleNote: 'گزارش نمونه — برای تحلیل واقعی، حساب MT5 خود را متصل کنید.',
    scoreTitle: 'امتیاز روان‌شناسی معاملاتی',
    grade: 'نیازمند توجه',
    subScores: [
      { key: 'risk_management', label: 'مدیریت ریسک', score: 64 },
      { key: 'revenge_control', label: 'کنترل انتقام', score: 58 },
      { key: 'discipline', label: 'نظم معاملاتی', score: 81 },
      { key: 'emotional_stability', label: 'ثبات احساسی', score: 72 },
    ],
    patternLabel: 'رفتار شناسایی‌شده',
    patternText: 'افزایش ریسک پس از ضررهای پیاپی',
    patternDetail: 'حجم پوزیشن در سه معامله پس از یک سری ضرر، به‌طور میانگین ۳۸٪ افزایش می‌یابد.',
    recommendationLabel: 'توصیه هوش مصنوعی',
    recommendationText: 'در دوره‌های معاملات احساسی، حجم پوزیشن را کاهش دهید.',
    recommendationDetail: 'یک قانون توقف ثابت پس از دو ضرر پیاپی را در نظر بگیرید.',
  },
};

export const painCopy = {
  en: {
    title: 'The patterns you can feel but can’t prove',
    items: [
      { t: 'Revenge Trading', d: 'One bad trade shouldn’t become five. We catch the pattern in your history before it repeats.' },
      { t: 'Overtrading', d: 'One more trade to make it back. We flag sessions where your trade count spikes against your own baseline.' },
      { t: 'Fear-Based Decisions', d: 'Hesitation at entry, early exits at the first sign of a pullback — visible in your data, not just your gut.' },
      { t: 'Early Exits', d: 'Fear closes good trades early. We measure your MFE against your actual exit to show what you’re leaving behind.' },
      { t: 'Poor Risk Discipline', d: 'Position sizing that drifts with emotion, not plan. We track it trade by trade.' },
    ],
  },
  fa: {
    title: 'الگوهایی که حسش می‌کنید، اما نمی‌توانید اثباتش کنید',
    items: [
      { t: 'معامله انتقامی', d: 'یک معامله بد نباید به پنج معامله تبدیل شود. این الگو را در تاریخچه شما قبل از تکرار شناسایی می‌کنیم.' },
      { t: 'بیش‌معامله‌گری', d: 'یک معامله دیگر برای جبران. جلساتی که تعداد معاملات‌تان نسبت به میانگین خودتان جهش می‌کند را علامت‌گذاری می‌کنیم.' },
      { t: 'تصمیم‌های ترس‌محور', d: 'تردید در ورود، خروج زودهنگام در اولین نشانه بازگشت قیمت — در داده‌های شما قابل مشاهده است، نه فقط در حس‌تان.' },
      { t: 'خروج زودهنگام', d: 'ترس، معاملات خوب را زود می‌بندد. حداکثر سود ممکن را با خروج واقعی شما مقایسه می‌کنیم.' },
      { t: 'نظم ریسک ضعیف', d: 'حجم پوزیشنی که با احساس تغییر می‌کند، نه با برنامه. آن را معامله به معامله رصد می‌کنیم.' },
    ],
  },
};

export const howCopy = {
  en: {
    title: 'From MT5 history to clear insight',
    steps: [
      { t: 'Connect MT5 Account', d: 'Link your account with a read-only Investor Password. No trade access, no risk.' },
      { t: 'AI Analyzes Your Behavior', d: 'Mindlura processes your full trade history and builds your behavioral profile automatically.' },
      { t: 'Receive Personalized Insights', d: 'Specific, dated insight — not generic advice — about what’s actually costing you.' },
    ],
  },
  fa: {
    title: 'از تاریخچه MT5 تا بینش روشن',
    steps: [
      { t: 'اتصال حساب MT5', d: 'حساب خود را با Investor Password فقط‌خواندنی متصل کنید؛ بدون دسترسی به معامله، بدون ریسک.' },
      { t: 'تحلیل رفتار توسط هوش مصنوعی', d: 'مایندلورا تاریخچه کامل معاملات شما را پردازش کرده و پروفایل رفتاری‌تان را خودکار می‌سازد.' },
      { t: 'دریافت بینش شخصی‌سازی‌شده', d: 'بینش دقیق و مشخص؛ نه توصیه کلی؛ درباره آنچه واقعاً برای شما هزینه دارد.' },
    ],
  },
};

export const psychologyInsightsCopy = {
  en: {
    eyebrow: 'Deeper Intelligence',
    title: 'Every angle of your trading behavior, tracked over time',
    sub: 'Not a single score — a full behavioral picture that updates with every trade.',
    items: [
      { t: 'Trading Habits', d: 'The sessions, symbols, and setups where your discipline holds — and where it slips.' },
      { t: 'Behavioral Patterns', d: 'Recurring sequences like revenge entries, fatigue, or hesitation, surfaced automatically.' },
      { t: 'Performance Evolution', d: 'How your Psychology Score and trading outcomes move together, week over week.' },
      { t: 'Improvement Timeline', d: 'A dated record of what changed, so progress is something you can point to.' },
    ],
  },
  fa: {
    eyebrow: 'بینش عمیق‌تر',
    title: 'هر زاویه از رفتار معاملاتی شما، در طول زمان رصد می‌شود',
    sub: 'نه یک عدد ساده؛ بلکه یک تصویر رفتاری کامل که با هر معامله به‌روزرسانی می‌شود.',
    items: [
      { t: 'عادات معاملاتی', d: 'جلسات، نمادها و ستاپ‌هایی که نظم شما در آن‌ها پابرجاست — و جایی که کم می‌آورد.' },
      { t: 'الگوهای رفتاری', d: 'توالی‌های تکرارشونده مثل ورود انتقامی، خستگی یا تردید، به‌صورت خودکار آشکار می‌شود.' },
      { t: 'تحول عملکرد', d: 'چگونه امتیاز روان‌شناختی و نتایج معاملاتی شما هفته به هفته با هم حرکت می‌کنند.' },
      { t: 'خط زمانی بهبود', d: 'یک ثبت تاریخ‌دار از آنچه تغییر کرده، تا پیشرفت چیزی باشد که بتوانید نشان دهید.' },
    ],
  },
};

export const aiCoachCopy = {
  en: {
    eyebrow: 'Mindlura AI Coach',
    badge: 'In Development',
    title: 'Insight that reads your trades, not just your numbers.',
    sub: 'Personalized recommendations and continuous feedback, grounded in your own trade data.',
    items: [
      { t: 'Personalized Recommendations', d: 'Ask why last Tuesday went wrong and get an answer grounded in your real trade data — not a generic tip.' },
      { t: 'Continuous Feedback', d: 'Automated, plain-language breakdowns of what’s driving your Psychology Score — updated with every new trade.' },
      { t: 'Your Improvement Journey', d: 'A running record of what’s changed and what to work on next, built as you trade.' },
    ],
  },
  fa: {
    eyebrow: 'کوچ هوش مصنوعی مایندلورا',
    badge: 'در دست ساخت',
    title: 'بینشی که معاملات شما را می‌خواند، نه فقط اعدادتان را',
    sub: 'توصیه‌های شخصی‌سازی‌شده و بازخورد پیوسته، بر پایه داده واقعی معاملات خودتان.',
    items: [
      { t: 'توصیه‌های شخصی‌سازی‌شده', d: 'بپرسید چرا سه‌شنبه گذشته اشتباه پیش رفت و پاسخی مبتنی بر داده واقعی معاملات‌تان بگیرید؛ نه یک نکته کلی.' },
      { t: 'بازخورد پیوسته', d: 'تحلیل خودکار و قابل‌فهم از آنچه امتیاز روان‌شناختی شما را شکل می‌دهد؛ با هر معامله جدید به‌روزرسانی می‌شود.' },
      { t: 'مسیر بهبود شما', d: 'ثبتی پیوسته از آنچه تغییر کرده و قدم بعدی؛ همراه با معاملات‌تان ساخته می‌شود.' },
    ],
  },
};

export const coachPlatformCopy = {
  en: {
    eyebrow: 'Built for Trading Coaches',
    title: 'One dashboard, every client’s behavior',
    sub: 'Coaches manage every client’s behavioral profile in one place — client reports, behavioral analytics, and coaching insights, without digging through raw trade logs.',
    items: [
      { t: 'Client Reports', d: 'A ready-made behavioral summary for every client, generated automatically before each session.' },
      { t: 'Behavioral Analytics', d: 'See which clients are showing overtrading, revenge trading, or fatigue this week — before they tell you.' },
      { t: 'Coaching Insights', d: 'Specific, dated talking points for each client, grounded in their real trade history.' },
    ],
    cta: 'Explore Coach Tools',
    note: 'Optional for clients — joining a coach is always their choice.',
  },
  fa: {
    eyebrow: 'ساخته‌شده برای کوچ‌های معاملاتی',
    title: 'یک داشبورد، رفتار همه کلاینت‌ها',
    sub: 'کوچ‌ها پروفایل رفتاری هر کلاینت را در یک‌جا مدیریت می‌کنند — گزارش کلاینت، آنالیتیکس رفتاری و بینش‌های کوچینگ، بدون جست‌وجو در لاگ خام معاملات.',
    items: [
      { t: 'گزارش کلاینت', d: 'یک خلاصه رفتاری آماده برای هر کلاینت، پیش از هر جلسه به‌صورت خودکار تولید می‌شود.' },
      { t: 'آنالیتیکس رفتاری', d: 'ببینید کدام کلاینت‌ها این هفته بیش‌معامله‌گری، معامله انتقامی یا خستگی نشان می‌دهند؛ پیش از اینکه خودشان بگویند.' },
      { t: 'بینش‌های کوچینگ', d: 'نکات مشخص و تاریخ‌دار برای هر کلاینت، بر پایه تاریخچه واقعی معاملاتش.' },
    ],
    cta: 'ابزارهای کوچ را ببینید',
    note: 'برای کلاینت‌ها اختیاری است — پیوستن به یک کوچ همیشه انتخاب خودشان است.',
  },
};

export const trustCopy = {
  en: {
    eyebrow: 'Trust & Security',
    title: 'Built to be trusted with your trade history',
    items: [
      { t: 'Read-Only Analysis', d: 'Mindlura connects using a read-only Investor Password. We can see your trade history — nothing else. We cannot place, modify, or close trades.' },
      { t: 'Data Privacy', d: 'Your trade data is used to build your own behavioral profile — never sold, never shared with brokers or third parties.' },
      { t: 'Secure Connection', d: 'Encrypted in transit and at rest, with native MT5 integration built by someone who has managed brokerage infrastructure from the inside.' },
    ],
  },
  fa: {
    eyebrow: 'اعتماد و امنیت',
    title: 'ساخته‌شده برای اعتماد به تاریخچه معاملات شما',
    items: [
      { t: 'تحلیل فقط‌خواندنی', d: 'مایندلورا با Investor Password فقط‌خواندنی متصل می‌شود. ما فقط تاریخچه معاملات شما را می‌بینیم — نه چیز دیگری. هیچ‌گونه دسترسی برای ثبت، تغییر یا بستن معامله نداریم.' },
      { t: 'حریم خصوصی داده', d: 'داده‌های معاملاتی شما فقط برای ساخت پروفایل رفتاری خودتان استفاده می‌شود؛ هرگز فروخته یا با بروکر و اشخاص ثالث به اشتراک گذاشته نمی‌شود.' },
      { t: 'اتصال امن', d: 'رمزنگاری‌شده در انتقال و ذخیره‌سازی، با اتصال بومی MT5 ساخته‌شده توسط کسی که زیرساخت بروکری را از درون مدیریت کرده است.' },
    ],
  },
};

export const testimonialsCopy = {
  en: {
    eyebrow: 'Early Access',
    title: 'Real accounts are just getting started here — no invented reviews, ever.',
    sub: 'Mindlura is in early access with traders and coaches who joined before there was a page built to convince them. Their results will replace this section as they come in — not stock quotes.',
    chips: [
      { t: 'Read-only by design', d: 'We can’t place, modify, or close a single trade on your account.' },
      { t: 'Built from the inside', d: 'By someone who managed brokerage infrastructure, not just a landing page.' },
      { t: 'No manufactured proof', d: 'No stock photos, no paid reviews — what you see here is what exists today.' },
    ],
    cta: 'Join Early Access',
  },
  fa: {
    eyebrow: 'دسترسی زودهنگام',
    title: 'حساب‌های واقعی همین حالا اینجا شروع شده‌اند — بدون نظر ساختگی، هرگز.',
    sub: 'مایندلورا با تریدرها و کوچ‌هایی در دسترسی زودهنگام است که پیش از ساخته‌شدن این صفحه برای متقاعدکردن‌شان، پیوسته‌اند. نتایج واقعی آن‌ها این بخش را جایگزین خواهد کرد — نه نقل‌قول‌های ساختگی.',
    chips: [
      { t: 'فقط‌خواندنی، از پایه', d: 'ما نمی‌توانیم هیچ معامله‌ای در حساب شما ثبت، تغییر یا بسته کنیم.' },
      { t: 'ساخته‌شده از درون صنعت', d: 'توسط کسی که زیرساخت بروکری را مدیریت کرده، نه فقط یک صفحه فرود ساخته.' },
      { t: 'بدون اثبات ساختگی', d: 'بدون عکس استوک، بدون نظر خریداری‌شده — آنچه اینجا می‌بینید همان چیزی است که امروز وجود دارد.' },
    ],
    cta: 'پیوستن به دسترسی زودهنگام',
  },
};

export const finalCtaCopy = {
  en: {
    title: 'Your trade history already knows your patterns.',
    sub: 'It’s time you did too.',
    button: 'Start Free Trial',
  },
  fa: {
    title: 'تاریخچه معاملات شما الگوهایتان را از قبل می‌داند.',
    sub: 'وقتشه شما هم بدانید.',
    button: 'شروع دوره آزمایشی رایگان',
  },
};

export const statsCopy = {
  en: [
    { n: '6', l: 'Behavioral Signals' },
    { n: '3', l: 'Coach Hierarchy Tiers' },
    { n: '0', l: 'Trade Access Required' },
    { n: 'MT5', l: 'Native Integration' },
  ],
  fa: [
    { n: '۶', l: 'سیگنال رفتاری' },
    { n: '۳', l: 'سطح سلسله‌مراتب کوچ' },
    { n: '۰', l: 'دسترسی به معامله' },
    { n: 'MT5', l: 'اتصال بومی' },
  ],
};

export const pricingTeaserCopy = {
  en: {
    title: 'Plans that grow with you',
    cards: [
      { name: 'Trial', tag: 'Try it free' },
      { name: 'Basic', tag: 'For independent traders' },
      { name: 'Pro', tag: 'For serious traders & small teams' },
      { name: 'Elite', tag: 'White-glove, for coaches & prop teams' },
    ],
    cta: 'See full pricing',
  },
  fa: {
    title: 'پلن‌هایی که با شما رشد می‌کنند',
    cards: [
      { name: 'Trial', tag: 'رایگان امتحان کنید' },
      { name: 'Basic', tag: 'برای تریدرهای مستقل' },
      { name: 'Pro', tag: 'برای تریدرهای حرفه‌ای و تیم‌های کوچک' },
      { name: 'Elite', tag: 'خدمات ویژه، برای کوچ‌ها و تیم‌های پراپ' },
    ],
    cta: 'مشاهده کامل قیمت‌گذاری',
  },
};

// Cards mirror the 3 most recent posts in content/blog for each lang
// (same slugs getPostsByLang('en'|'fa') would surface first).
export const blogPreviewCopy = {
  en: {
    title: 'From the Mindlura Journal',
    cta: 'Read all articles',
    cards: [
      {
        slug: 'why-more-trades-en',
        category: 'Trading Psychology',
        title: 'Why Mindlura Gets More Accurate Over Time',
        desc: 'One month and 10 trades isn’t enough. Why the more you use Mindlura, the better it understands you.',
      },
      {
        slug: 'revenge-trading-mt5-history',
        category: 'Behavioral Analysis',
        title: 'Revenge Trading: What Your MT5 History Shows That You Don’t Remember',
        desc: 'The pattern is always in the data. Here’s how to find it and stop it.',
      },
      {
        slug: 'complete-guide-forex-trading-psychology',
        category: 'Psychology',
        title: 'The Complete Guide to Forex Trading Psychology',
        desc: 'From identifying destructive behavioral patterns to measuring mental discipline with real data.',
      },
    ],
  },
  fa: {
    title: 'از ژورنال مایندلورا',
    cta: 'مشاهده همه مقالات',
    cards: [
      {
        slug: 'why-more-trades-fa',
        category: 'روان‌شناسی معامله‌گری',
        title: 'چرا Mindlura با گذشت زمان دقیق‌تر می‌شود؟',
        desc: 'یک ماه داده و ۱۰ معامله کافی نیست. بفهمید چرا Mindlura هرچه بیشتر استفاده شود، بهتر شما را می‌شناسد.',
      },
      {
        slug: 'revenge-trading-tarikhe-mt5',
        category: 'تحلیل رفتاری',
        title: 'معامله انتقامی: آنچه تاریخچه MT5 نشان می‌دهد که خودتان یادتان نیست',
        desc: 'الگو همیشه در داده‌ها هست. اینجا نشان می‌دهیم کجا باید در تاریخچه MT5 به دنبال آن بگردید.',
      },
      {
        slug: 'raghnama-ravanshenasi-trade-forex',
        category: 'روان‌شناسی',
        title: 'راهنمای روان‌شناسی معامله‌گری در فارکس',
        desc: 'چرا بین استراتژی معاملاتی شما و نتایج واقعی‌تان فاصله وجود دارد؟ پاسخ تقریباً همیشه در رفتار است.',
      },
    ],
  },
};
