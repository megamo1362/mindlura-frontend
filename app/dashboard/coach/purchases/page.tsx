import type { Metadata } from 'next';
import { RedesignCoachPurchasesPage } from '@/components/redesign/coach/RedesignCoachPurchasesPage';

export const metadata: Metadata = { title: 'Client Purchases' };

export default function CoachPurchasesRoute() {
  return <RedesignCoachPurchasesPage />;
}
