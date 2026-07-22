import type { Metadata } from 'next';
import { RedesignCoachEventsPage } from '@/components/redesign/coach/RedesignCoachEventsPage';

export const metadata: Metadata = { title: 'Coach Events' };

export default function CoachEventsRoute() {
  return <RedesignCoachEventsPage />;
}
