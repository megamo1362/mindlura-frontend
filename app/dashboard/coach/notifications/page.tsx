import type { Metadata } from 'next';
import { RedesignCoachNotificationsPage } from '@/components/redesign/coach/RedesignCoachNotificationsPage';

export const metadata: Metadata = { title: 'Coach Notifications' };

export default function CoachNotificationsRoute() {
  return <RedesignCoachNotificationsPage />;
}
