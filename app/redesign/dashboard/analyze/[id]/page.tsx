import { RedesignAnalysisPage } from '@/components/redesign/analysis/RedesignAnalysisPage';

export default async function RedesignAnalyzePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RedesignAnalysisPage id={id} />;
}
