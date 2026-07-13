import type { Metadata } from 'next';
import { MARKET_SYMBOLS, fetchMarketData } from '@/lib/market';
import MarketListClient from '@/app/sentiment/MarketListClient';

export const metadata: Metadata = {
  title: { absolute: 'سنتیمنت فارکس و کریپتو | قدرت خریدار فروشنده | مایندلورا' },
  description: 'قدرت خریدار و فروشنده، روند و RSI زنده برای فارکس، طلا و ارز دیجیتال.',
  keywords: ['سنتیمنت فارکس', 'سنتیمنت بازار', 'تحلیل سنتیمنت', 'forex sentiment', 'crypto sentiment'],
  alternates: {
    canonical: '/fa/sentiment',
    languages: { en: '/sentiment', fa: '/fa/sentiment', 'x-default': '/sentiment' },
  },
  openGraph: {
    title: 'سنتیمنت فارکس و کریپتو | قدرت خریدار فروشنده | مایندلورا',
    description: 'قدرت خریدار و فروشنده، روند و RSI زنده برای فارکس، طلا و ارز دیجیتال.',
    url: '/fa/sentiment',
    siteName: 'Mindlura',
    type: 'website',
    locale: 'fa_IR',
  },
};

export default async function FaMarketPage() {
  const results = await Promise.all(MARKET_SYMBOLS.map((s) => fetchMarketData(s.symbol)));
  const initialData = Object.fromEntries(MARKET_SYMBOLS.map((s, i) => [s.symbol, results[i]]));

  return <MarketListClient initialData={initialData} initialLang="fa" initialCountry="IR" />;
}
