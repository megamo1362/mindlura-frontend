import { getAllPosts } from '@/lib/blog';
import { BlogIndexContent } from '@/components/pages/BlogIndexPage';

export const metadata = {
  title: 'Blog | Mindlura',
  description: 'Trading psychology articles, behavioral analysis, and coach resources from Mindlura.',
  openGraph: { locale: 'en_US' },
};

export default function BlogPage() {
  const posts = getAllPosts().filter((p) => p.lang === 'en');
  return <BlogIndexContent lang="en" posts={posts} />;
}
