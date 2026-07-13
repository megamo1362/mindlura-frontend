import type { Metadata } from 'next';
import { CoachEventsPage } from '@/components/coach';

export const metadata: Metadata = { title: 'Coach Events' };

export default function CoachEventsRoute() {
  return <CoachEventsPage />;
}
