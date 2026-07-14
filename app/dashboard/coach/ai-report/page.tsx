import type { Metadata } from 'next';
import { CoachAIReportPage } from '@/components/coach';

export const metadata: Metadata = { title: 'AI Daily Report' };

export default function CoachAIReportRoute() {
  return <CoachAIReportPage />;
}
