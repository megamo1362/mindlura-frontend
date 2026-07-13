import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import { BlogIndexContent } from '@/components/pages/BlogIndexPage';

export const metadata: Metadata = {
  title: 'بلاگ | مایندلورا',
  description: 'مقالات روان‌شناسی معاملاتی، تحلیل رفتاری و منابع کوچ از مایندلورا.',
  openGraph: { locale: 'fa_IR' },
};

export default function FaBlogPage() {
  const posts = getAllPosts().filter((p) => p.lang === 'fa');
  return <BlogIndexContent lang="fa" posts={posts} />;
}
