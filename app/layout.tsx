import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Providers } from '@/app/providers';
import { LangProvider } from '@/app/i18n/LangContext';
import { ThemeProvider } from '@/app/i18n/ThemeContext';
import { ClientWrapper } from '@/app/i18n/ClientWrapper';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const siteTitle = 'Mindlura — Trading Psychology, Quantified | Forex Behavioral Analytics';
const siteDescription =
  'Connect your trading account and discover the behavioral patterns costing you money. MAE/MFE analysis, Psychology Score, emotion-aware journaling, and coach tools — currently supporting MT5, with cTrader coming soon.';
const siteUrl = 'https://mindlura.com';
const ogImage = 'https://mindlura.com/og-image.png';

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: '%s | Mindlura',
  },
  description: siteDescription,
  keywords: ['trading psychology', 'MT5 analytics', 'behavioral trading', 'forex journal', 'MAE MFE analysis', 'psychology score', 'trading coach', 'emotion-aware journal'],
  authors: [{ name: 'Mindlura' }],
  creator: 'Mindlura',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: 'Mindlura',
    type: 'website',
    locale: 'en_US',
    images: [{ url: ogImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#020510',
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Mindlura",
  "url": "https://mindlura.com",
  "logo": "https://mindlura.com/logo.png",
  "description": "Mindlura is a forex trading psychology platform that connects to MT5 accounts and provides behavioral analytics, psychology scoring, and coach tools.",
  "sameAs": [],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@mindlura.com"
  }
};

const schemaSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Mindlura",
  "url": "https://mindlura.com",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "description": "A trading psychology platform for forex traders and coaches. Connects to MT5 via read-only Investor Password and provides MAE/MFE analysis, Psychology Score, emotion-aware journaling, pattern detection, session analytics, and cost analysis.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free trial available"
  },
  "featureList": [
    "MAE/MFE Analysis",
    "Psychology Score",
    "Emotion-Aware Journal",
    "Session & Time Analysis",
    "Pattern Detection",
    "Cost Analysis",
    "Coach-Client Dashboard",
    "MT5 Integration"
  ]
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Set only for requests middleware.ts matches (public pages) — absent for
  // /login, /dashboard, /admin, /api, so those keep the en/ltr default below
  // and never get (possibly wrong) hreflang tags for a private path.
  const headersList = await headers();
  const pathname = headersList.get('x-pathname');
  const isFa = pathname === '/fa' || (pathname?.startsWith('/fa/') ?? false);
  const lang = isFa ? 'fa' : 'en';
  const dir = isFa ? 'rtl' : 'ltr';

  const enPath = pathname === null ? null : isFa ? (pathname.replace(/^\/fa/, '') || '/') : pathname;
  const faPath = pathname === null ? null : isFa ? pathname : pathname === '/' ? '/fa' : `/fa${pathname}`;

  return (
    <html
      lang={lang}
      dir={dir}
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {enPath !== null && faPath !== null && (
          <>
            <link rel="alternate" hrefLang="en" href={`${siteUrl}${enPath}`} />
            <link rel="alternate" hrefLang="fa" href={`${siteUrl}${faPath}`} />
            <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${enPath}`} />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaSoftware) }}
        />
      </head>
      <body className="circuit-bg antialiased">
        <GoogleAnalytics gaId="G-8G71SG54YG" />
        <ThemeProvider>
          <LangProvider>
            <ClientWrapper>
              <Providers>{children}</Providers>
            </ClientWrapper>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
