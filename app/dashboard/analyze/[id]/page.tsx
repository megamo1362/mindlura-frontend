import type { Metadata } from 'next';
import { RedesignAnalysisPage } from '@/components/redesign/analysis/RedesignAnalysisPage';

export const metadata: Metadata = { title: 'Account Analysis' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AnalyzeRoute({ params }: Props) {
  const { id } = await params;
  return <RedesignAnalysisPage id={id} />;
}
