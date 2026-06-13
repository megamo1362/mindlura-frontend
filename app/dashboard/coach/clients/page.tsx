import type { Metadata } from 'next';
import { CoachClientsPage } from '@/components/coach';

export const metadata: Metadata = { title: 'پنل کوچ | IRFX' };

export default function CoachClientsRoute() {
  return <CoachClientsPage />;
}
