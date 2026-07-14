import type { Metadata } from 'next';
import { RedesignHomePage } from '@/components/pages/redesign/RedesignHomePage';

// Internal preview only — must never be indexed or compete with the live
// homepage (app/page.tsx) in search.
export const metadata: Metadata = {
  title: 'Mindlura — Redesign Preview',
  description: 'Internal preview of the Mindlura homepage redesign. Not the live site.',
  robots: { index: false, follow: false, nocache: true },
};

export default function RedesignPage() {
  return <RedesignHomePage lang="en" />;
}
