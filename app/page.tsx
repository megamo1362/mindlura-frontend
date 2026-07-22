import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { resolveCountry } from '@/lib/geo';
import { RedesignHomePage } from '@/components/pages/redesign/RedesignHomePage';

export const metadata: Metadata = {
  title: 'MindLura — Insight Beyond Data',
  robots: { index: true },
};

export default async function Home() {
  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));
  const lang = country === 'IR' ? 'fa' : 'en';

  return <RedesignHomePage lang={lang} />;
}
