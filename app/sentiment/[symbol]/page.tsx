import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveCountry } from '@/lib/geo';
import { fetchMarketData, getSymbolConfig } from '@/lib/market';
import MarketClient from './MarketClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}): Promise<Metadata> {
  const { symbol } = await params;
  const config = getSymbolConfig(symbol);
  if (!config) return {};

  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));
  const isFa = country === 'IR';
  const sym = config.symbol;

  const title = isFa
    ? `سنتیمنت ${sym} | قدرت خریدار فروشنده | مایندلورا`
    : `${sym} Sentiment | Live Buyer Seller Strength | Mindlura`;
  const description = isFa
    ? `تحلیل زنده ${sym} شامل قدرت خریدار و فروشنده، روند، RSI و MACD در چند تایم‌فریم.`
    : `Live ${sym} analysis with buyer/seller strength, trend, RSI and MACD across multiple timeframes.`;
  const keywords = ['forex sentiment', 'crypto sentiment', 'market sentiment', 'سنتیمنت فارکس', 'سنتیمنت بازار', 'تحلیل سنتیمنت'];
  const path = `/sentiment/${sym.toLowerCase()}`;

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: {
      canonical: path,
      languages: {
        en: path,
        fa: `${path}?lang=fa`,
        'x-default': path,
      },
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: 'Mindlura',
      type: 'website',
      locale: isFa ? 'fa_IR' : 'en_US',
    },
  };
}

export default async function MarketSymbolPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const config = getSymbolConfig(symbol);
  if (!config) notFound();

  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));
  const lang = country === 'IR' ? 'fa' : 'en';

  const initialData = await fetchMarketData(config.symbol);

  return (
    <MarketClient
      symbolConfig={config}
      initialData={initialData}
      initialLang={lang}
      initialCountry={country}
    />
  );
}
