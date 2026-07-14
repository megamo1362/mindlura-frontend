import { StatCardSkeleton } from '@/components/shared/skeletons';

export default function CoachPurchasesLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}
