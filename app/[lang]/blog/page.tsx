import type { Metadata } from 'next';
import { getPostsByLang } from '@/lib/blog';
import { BlogIndexContent } from '@/components/pages/BlogIndexPage';

const siteUrl = 'https://mindlura.com';

export const metadata: Metadata = {
  title: { absolute: 'بلاگ | مایندلورا' },
  description: 'مقالات روان‌شناسی معاملاتی، تحلیل رفتاری و منابع کوچ از مایندلورا.',
  keywords: ['بلاگ روانشناسی معاملاتی', 'تحلیل رفتاری فارکس', 'ژورنال معاملاتی'],
  alternates: {
    canonical: `${siteUrl}/fa/blog`,
    languages: { en: `${siteUrl}/blog`, fa: `${siteUrl}/fa/blog`, 'x-default': `${siteUrl}/blog` },
  },
  openGraph: {
    title: 'بلاگ | مایندلورا',
    description: 'مقالات روان‌شناسی معاملاتی، تحلیل رفتاری و منابع کوچ از مایندلورا.',
    url: `${siteUrl}/fa/blog`,
    siteName: 'Mindlura',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: { card: 'summary', title: 'بلاگ | مایندلورا' },
};

export default function FaBlogPage() {
  const posts = getPostsByLang('fa');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'بلاگ مایندلورا',
    url: `${siteUrl}/fa/blog`,
    inLanguage: 'fa-IR',
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${siteUrl}/fa/blog/${post.slug}`,
      datePublished: post.date,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BlogIndexContent lang="fa" posts={posts} />
    </>
  );
}
