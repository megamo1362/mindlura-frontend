import type { Metadata } from 'next';
import { CoachNotificationsPage } from '@/components/coach';

export const metadata: Metadata = { title: 'Coach Notifications' };

export default function CoachNotificationsRoute() {
  return <CoachNotificationsPage />;
}
