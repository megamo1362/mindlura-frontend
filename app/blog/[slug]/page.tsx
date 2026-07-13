import { notFound } from 'next/navigation';
import { getPostBySlug, getPostsByLang } from '@/lib/blog';
import { BlogPostContent } from '@/components/pages/BlogPostPage';
import type { Metadata } from 'next';

const siteUrl = 'https://mindlura.com';
const ogImage = `${siteUrl}/og-image.png`;

export async function generateStaticParams() {
  return getPostsByLang('en').map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (post.lang !== 'en') return {};

  const url = `${siteUrl}/blog/${slug}`;
  const title = `${post.title} | Mindlura Blog`;

  return {
    title: { absolute: title },
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: post.description,
      url,
      siteName: 'Mindlura',
      type: 'article',
      locale: 'en_US',
      publishedTime: post.date,
      authors: ['Mindlura'],
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (post.lang !== 'en') notFound();

  const url = `${siteUrl}/blog/${slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'en-US',
    keywords: post.keywords.join(', '),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: ogImage,
    author: { '@type': 'Organization', name: 'Mindlura', url: siteUrl },
    publisher: {
      '@type': 'Organization',
      name: 'Mindlura',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BlogPostContent post={post} />
    </>
  );
}
