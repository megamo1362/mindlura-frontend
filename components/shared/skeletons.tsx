'use client';

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-[rgba(255,255,255,0.06)] animate-pulse ${className ?? ''}`}
    />
  );
}

export function AccountCardSkeleton() {
  return (
    <div className="card-surface rounded-2xl p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Shimmer className="h-3 w-16" />
          <Shimmer className="h-3 w-24" />
        </div>
        <Shimmer className="h-5 w-16 rounded-full" />
      </div>
      {/* Balance */}
      <div className="flex items-center justify-between">
        <Shimmer className="h-6 w-28" />
        <div className="flex gap-2">
          <Shimmer className="h-8 w-14 rounded-xl" />
          <Shimmer className="h-8 w-14 rounded-xl" />
          <Shimmer className="h-8 w-14 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function AccountsGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <AccountCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card-surface rounded-2xl p-4 text-center space-y-2">
      <Shimmer className="h-3 w-16 mx-auto" />
      <Shimmer className="h-6 w-20 mx-auto" />
    </div>
  );
}

export function AnalysisSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="card-surface rounded-2xl p-5 h-40 animate-pulse" />
    </div>
  );
}

export function ClientCardSkeleton() {
  return (
    <div className="card-surface rounded-2xl p-5 flex items-center gap-3">
      <Shimmer className="h-9 w-9 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-3 w-32" />
        <Shimmer className="h-2.5 w-24" />
      </div>
      <Shimmer className="h-6 w-16 rounded-lg" />
    </div>
  );
}
