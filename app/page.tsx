import type { Metadata } from 'next';
import { RedesignHomePage } from '@/components/pages/redesign/RedesignHomePage';

export const metadata: Metadata = {
  title: 'MindLura — Insight Beyond Data',
  robots: { index: true },
};

// Content language is strictly URL-based (middleware already redirects
// Iranian visitors with no lang preference to /fa on this path) — see
// app/[lang]/page.tsx for the /fa twin. Do not recompute lang from geo here.
export default function Home() {
  return <RedesignHomePage lang="en" />;
}
