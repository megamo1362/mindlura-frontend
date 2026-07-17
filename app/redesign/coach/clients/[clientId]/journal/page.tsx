import { RedesignCoachClientJournal } from '@/components/redesign/coach/RedesignCoachClientJournal';

export default async function RedesignCoachClientJournalPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return <RedesignCoachClientJournal clientId={clientId} />;
}
