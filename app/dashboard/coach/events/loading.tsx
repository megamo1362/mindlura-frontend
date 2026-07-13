function EventCardSkeleton() {
  return (
    <div className="card-surface rounded-2xl p-5 space-y-4 animate-pulse">
      <div className="h-5 w-2/3 rounded-lg bg-[rgba(255,255,255,0.06)]" />
      <div className="h-6 w-24 rounded-full bg-[rgba(255,255,255,0.06)]" />
      <div className="h-8 w-full rounded-lg bg-[rgba(255,255,255,0.06)]" />
    </div>
  );
}

export default function CoachEventsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}
