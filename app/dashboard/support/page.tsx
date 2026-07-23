import type { Metadata } from 'next';
import { RedesignSupportPage } from '@/components/redesign/support/RedesignSupportPage';

export const metadata: Metadata = { title: 'Support' };

export default function SupportRoute() {
  return <RedesignSupportPage />;
}
