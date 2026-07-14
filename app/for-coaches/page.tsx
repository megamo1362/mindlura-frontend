import type { Metadata } from 'next';
import { ForCoachesPageContent } from '@/components/pages/ForCoachesPage';

export const metadata: Metadata = {
  title: { absolute: 'For Coaches — Mindlura' },
  description:
    'The professional platform for forex trading coaches. Manage clients, track behavioral performance, and deliver AI-powered insights.',
  alternates: {
    canonical: 'https://mindlura.com/for-coaches',
    languages: { en: 'https://mindlura.com/for-coaches', fa: 'https://mindlura.com/fa/for-coaches' },
  },
  openGraph: { locale: 'en_US' },
};

export default function ForCoachesPage() {
  return <ForCoachesPageContent lang="en" />;
}
