import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { resolveCountry } from '@/lib/geo';
import { MARKET_SYMBOLS, fetchMarketData } from '@/lib/market';
import MarketListClient from './MarketListClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));
  const isFa = country === 'IR';

  const title = isFa
    ? 'سنتیمنت فارکس و کریپتو | قدرت خریدار فروشنده | مایندلورا'
    : 'Forex & Crypto Sentiment | Live Buyer Seller Strength | Mindlura';
  const description = isFa
    ? 'قدرت خریدار و فروشنده، روند و RSI زنده برای فارکس، طلا و ارز دیجیتال.'
    : 'Live buyer/seller strength, trend, and RSI for forex, gold, and crypto pairs.';
  const keywords = ['forex sentiment', 'crypto sentiment', 'market sentiment', 'سنتیمنت فارکس', 'سنتیمنت بازار', 'تحلیل سنتیمنت'];

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: {
      canonical: '/sentiment',
      languages: { en: '/sentiment', fa: '/sentiment?lang=fa', 'x-default': '/sentiment' },
    },
    openGraph: { title, description, url: '/sentiment', siteName: 'Mindlura', type: 'website', locale: isFa ? 'fa_IR' : 'en_US' },
  };
}

export default async function MarketPage() {
  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));
  const lang = country === 'IR' ? 'fa' : 'en';

  const results = await Promise.all(MARKET_SYMBOLS.map((s) => fetchMarketData(s.symbol)));
  const initialData = Object.fromEntries(MARKET_SYMBOLS.map((s, i) => [s.symbol, results[i]]));

  return <MarketListClient initialData={initialData} initialLang={lang} initialCountry={country} />;
}
