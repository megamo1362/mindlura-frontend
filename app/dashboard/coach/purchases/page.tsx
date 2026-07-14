import type { Metadata } from 'next';
import { CoachPurchasesPage } from '@/components/coach';

export const metadata: Metadata = { title: 'Client Purchases' };

export default function CoachPurchasesRoute() {
  return <CoachPurchasesPage />;
}
