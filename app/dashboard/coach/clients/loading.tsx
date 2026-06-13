import { ClientCardSkeleton } from '@/components/shared/skeletons';

export default function CoachClientsLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <ClientCardSkeleton key={i} />
      ))}
    </div>
  );
}
