import type { Metadata } from 'next';
import { RedesignCoachAnalyticsPage } from '@/components/redesign/coach/RedesignCoachAnalyticsPage';

export const metadata: Metadata = { title: 'Roster Analytics' };

export default function CoachAnalyticsRoute() {
  return <RedesignCoachAnalyticsPage />;
}
