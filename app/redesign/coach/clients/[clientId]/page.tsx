import { RedesignCoachClientDetail } from '@/components/redesign/coach/RedesignCoachClientDetail';

export default async function RedesignCoachClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return <RedesignCoachClientDetail clientId={clientId} />;
}
