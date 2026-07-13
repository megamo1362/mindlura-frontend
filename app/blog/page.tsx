import type { Metadata } from 'next';
import { getPostsByLang } from '@/lib/blog';
import { BlogIndexContent } from '@/components/pages/BlogIndexPage';

const siteUrl = 'https://mindlura.com';

export const metadata: Metadata = {
  title: { absolute: 'Blog | Mindlura' },
  description: 'Trading psychology articles, behavioral analysis, and coach resources from Mindlura.',
  keywords: ['trading psychology blog', 'forex behavioral analysis', 'trading journal articles'],
  alternates: {
    canonical: `${siteUrl}/blog`,
    languages: { en: `${siteUrl}/blog`, fa: `${siteUrl}/fa/blog`, 'x-default': `${siteUrl}/blog` },
  },
  openGraph: {
    title: 'Blog | Mindlura',
    description: 'Trading psychology articles, behavioral analysis, and coach resources from Mindlura.',
    url: `${siteUrl}/blog`,
    siteName: 'Mindlura',
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary', title: 'Blog | Mindlura' },
};

export default function BlogPage() {
  const posts = getPostsByLang('en');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Mindlura Blog',
    url: `${siteUrl}/blog`,
    inLanguage: 'en-US',
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.date,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BlogIndexContent lang="en" posts={posts} />
    </>
  );
}
