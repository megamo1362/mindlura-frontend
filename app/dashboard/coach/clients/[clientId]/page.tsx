import { RedesignCoachClientDetail } from '@/components/redesign/coach/RedesignCoachClientDetail';

export default async function CoachClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return <RedesignCoachClientDetail clientId={clientId} />;
}
