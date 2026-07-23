import { RedesignSupportDetail } from '@/components/redesign/support/RedesignSupportDetail';

export default async function SupportTicketRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RedesignSupportDetail ticketId={id} />;
}
