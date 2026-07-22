import type { Metadata } from 'next';
import { RedesignCoachAIReportPage } from '@/components/redesign/coach/RedesignCoachAIReportPage';

export const metadata: Metadata = { title: 'AI Daily Report' };

export default function CoachAIReportRoute() {
  return <RedesignCoachAIReportPage />;
}
