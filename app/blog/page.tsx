import { getAllPosts } from '@/lib/blog';
import { getServerGeoLang } from '@/lib/geo';
import { BlogIndexContent } from '@/components/pages/BlogIndexPage';

export const metadata = {
  title: 'Blog | Mindlura',
  description: 'Trading psychology articles, behavioral analysis, and coach resources from Mindlura.',
  openGraph: { locale: 'en_US' },
};

export default async function BlogPage() {
  const detectedLang = await getServerGeoLang();
  const allPosts = getAllPosts();

  let lang = detectedLang;
  let posts = allPosts.filter((p) => p.lang === lang);

  if (posts.length === 0 && lang !== 'en') {
    lang = 'en';
    posts = allPosts.filter((p) => p.lang === lang);
  }

  return <BlogIndexContent lang={lang} posts={posts} />;
}
