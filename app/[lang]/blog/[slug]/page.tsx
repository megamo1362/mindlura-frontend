import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostBySlug, getPostsByLang } from '@/lib/blog';
import { BlogPostContent } from '@/components/pages/BlogPostPage';

export function generateStaticParams() {
  return getPostsByLang('fa').map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (post.lang !== 'fa') return {};
  return {
    title: `${post.title} | بلاگ مایندلورا`,
    description: post.description,
    openGraph: { locale: 'fa_IR' },
  };
}

export default async function FaPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (post.lang !== 'fa') notFound();

  return <BlogPostContent post={post} localePrefix="/fa" />;
}
