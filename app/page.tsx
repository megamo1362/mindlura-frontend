import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { resolveCountry } from '@/lib/geo';
import { RedesignHomePage } from '@/components/pages/redesign/RedesignHomePage';

export const metadata: Metadata = {
  title: 'MindLura — Insight Beyond Data',
  robots: { index: true },
};

// Content language is strictly URL-based (middleware already redirects
// Iranian visitors with no lang preference to /fa on this path) — see
// app/[lang]/page.tsx for the /fa twin. Do not recompute lang from geo here;
// country is only used to decide whether to show the fa toggle at all.
export default async function Home() {
  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));

  return <RedesignHomePage lang="en" country={country} />;
}
