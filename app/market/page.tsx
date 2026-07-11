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
    ? 'تحلیل زنده بازار | قدرت خریدار فروشنده | مایندلورا'
    : 'Live Market Analysis | Buyer Seller Strength | Mindlura';
  const description = isFa
    ? 'قدرت خریدار و فروشنده، روند و RSI زنده برای فارکس، طلا و ارز دیجیتال.'
    : 'Live buyer/seller strength, trend, and RSI for forex, gold, and crypto pairs.';

  return {
    title,
    description,
    alternates: {
      canonical: '/market',
      languages: { en: '/market', fa: '/market?lang=fa', 'x-default': '/market' },
    },
    openGraph: { title, description, url: '/market', siteName: 'Mindlura', type: 'website' },
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
