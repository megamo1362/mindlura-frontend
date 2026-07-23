import type { Metadata } from 'next';
import { RedesignBillingPage } from '@/components/redesign/billing/RedesignBillingPage';

export const metadata: Metadata = { title: 'Billing' };

export default function BillingRoute() {
  return <RedesignBillingPage />;
}
