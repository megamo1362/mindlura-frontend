import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

const sentimentSymbols = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCAD',
  'XAUUSD', 'BTCUSD', 'ETHUSD',
];

const sentimentUrls = sentimentSymbols.flatMap((symbol) => {
  const slug = symbol.toLowerCase();
  return [
    {
      url: `https://mindlura.com/sentiment/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `https://mindlura.com/sentiment/${slug}`,
          fa: `https://mindlura.com/fa/sentiment/${slug}`,
        },
      },
    },
    {
      url: `https://mindlura.com/fa/sentiment/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `https://mindlura.com/sentiment/${slug}`,
          fa: `https://mindlura.com/fa/sentiment/${slug}`,
        },
      },
    },
  ];
});

export default function sitemap(): MetadataRoute.Sitemap {
  // Static public pages that exist in both languages.
  // pricing/faq are sections of the homepage (#pricing, #faq), not standalone
  // routes, so they aren't listed separately here — the homepage entry below
  // already covers that content. for-coaches is a standalone route.
  const bilingualPages: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
    { path: '',            changeFrequency: 'weekly',  priority: 1.0 },
    { path: '/sentiment',  changeFrequency: 'hourly', priority: 0.9 },
    { path: '/news',       changeFrequency: 'hourly', priority: 0.8 },
    { path: '/blog',       changeFrequency: 'weekly',  priority: 0.8 },
    { path: '/for-coaches',changeFrequency: 'monthly', priority: 0.7 },
    { path: '/about',      changeFrequency: 'monthly', priority: 0.6 },
    { path: '/register',   changeFrequency: 'monthly', priority: 0.6 },
  ];

  const staticUrls = bilingualPages.flatMap(({ path, changeFrequency, priority }) => {
    const enUrl = `https://mindlura.com${path}`;
    const faUrl = path === '' ? 'https://mindlura.com/fa' : `https://mindlura.com/fa${path}`;
    const alternates = { languages: { en: enUrl, fa: faUrl } };
    return [
      { url: enUrl, lastModified: new Date(), changeFrequency, priority, alternates },
      { url: faUrl, lastModified: new Date(), changeFrequency, priority, alternates },
    ];
  });

  const posts = getAllPosts();
  const blogUrls = posts.map((post) => ({
    url:
      post.lang === 'fa'
        ? `https://mindlura.com/fa/blog/${post.slug}`
        : `https://mindlura.com/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...sentimentUrls, ...blogUrls];
}
