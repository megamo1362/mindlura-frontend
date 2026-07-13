import type { MetadataRoute } from 'next';

const sentimentSymbols = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCAD',
  'XAUUSD', 'BTCUSD', 'ETHUSD',
];

const sentimentUrls = sentimentSymbols.map(symbol => ({
  url: `https://mindlura.com/sentiment/${symbol.toLowerCase()}`,
  lastModified: new Date(),
  changeFrequency: 'hourly' as const,
  priority: 0.8,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  const existingUrls = [
    { url: 'https://mindlura.com',             lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: 'https://mindlura.com/sentiment',   lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.9 },
    { url: 'https://mindlura.com/news',        lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.8 },
    { url: 'https://mindlura.com/pricing',     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://mindlura.com/for-coaches', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://mindlura.com/blog',        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: 'https://mindlura.com/faq',         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://mindlura.com/about',       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://mindlura.com/register',    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  return [...existingUrls, ...sentimentUrls];
}
