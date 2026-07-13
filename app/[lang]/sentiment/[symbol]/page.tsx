import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchMarketData, getSymbolConfig } from '@/lib/market';
import MarketClient from '@/app/sentiment/[symbol]/MarketClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}): Promise<Metadata> {
  const { symbol } = await params;
  const config = getSymbolConfig(symbol);
  if (!config) return {};

  const sym = config.symbol;
  const title = `سنتیمنت ${sym} | قدرت خریدار فروشنده | مایندلورا`;
  const description = `تحلیل زنده ${sym} شامل قدرت خریدار و فروشنده، روند، RSI و MACD در چند تایم‌فریم.`;
  const path = `/fa/sentiment/${sym.toLowerCase()}`;
  const enPath = `/sentiment/${sym.toLowerCase()}`;

  return {
    title: { absolute: title },
    description,
    keywords: ['سنتیمنت فارکس', 'سنتیمنت بازار', 'تحلیل سنتیمنت', 'forex sentiment', 'crypto sentiment'],
    alternates: {
      canonical: path,
      languages: { en: enPath, fa: path, 'x-default': enPath },
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: 'Mindlura',
      type: 'website',
      locale: 'fa_IR',
    },
  };
}

export default async function FaMarketSymbolPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const config = getSymbolConfig(symbol);
  if (!config) notFound();

  const initialData = await fetchMarketData(config.symbol);

  return (
    <MarketClient
      symbolConfig={config}
      initialData={initialData}
      initialLang="fa"
      initialCountry="IR"
    />
  );
}
