import type { Metadata } from 'next';
import { RedesignCoachClientsPage } from '@/components/redesign/coach/RedesignCoachClientsPage';

export const metadata: Metadata = { title: 'Coach Panel' };

export default function CoachClientsRoute() {
  return <RedesignCoachClientsPage />;
}
