import type { Metadata } from 'next';
import { CoachAnalyticsPage } from '@/components/coach';

export const metadata: Metadata = { title: 'Roster Analytics' };

export default function CoachAnalyticsRoute() {
  return <CoachAnalyticsPage />;
}
