import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { resolveCountry } from '@/lib/geo';
import { MARKET_SYMBOLS, fetchMarketData } from '@/lib/market';
import MarketListClient from './MarketListClient';

export const metadata: Metadata = {
  title: { absolute: 'Forex & Crypto Sentiment | Live Buyer Seller Strength | Mindlura' },
  description: 'Live buyer/seller strength, trend, and RSI for forex, gold, and crypto pairs.',
  keywords: ['forex sentiment', 'crypto sentiment', 'market sentiment'],
  alternates: {
    canonical: '/sentiment',
    languages: { en: '/sentiment', fa: '/fa/sentiment', 'x-default': '/sentiment' },
  },
  openGraph: {
    title: 'Forex & Crypto Sentiment | Live Buyer Seller Strength | Mindlura',
    description: 'Live buyer/seller strength, trend, and RSI for forex, gold, and crypto pairs.',
    url: '/sentiment',
    siteName: 'Mindlura',
    type: 'website',
    locale: 'en_US',
  },
};

export default async function MarketPage() {
  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));

  const results = await Promise.all(MARKET_SYMBOLS.map((s) => fetchMarketData(s.symbol)));
  const initialData = Object.fromEntries(MARKET_SYMBOLS.map((s, i) => [s.symbol, results[i]]));

  return <MarketListClient initialData={initialData} initialLang="en" initialCountry={country} />;
}
