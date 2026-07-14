export default function CoachNotificationsLoading() {
  return (
    <div className="card-surface rounded-2xl overflow-hidden animate-pulse">
      <div className="divide-y divide-[var(--color-border)]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-5 py-3 space-y-2">
            <div className="h-4 w-1/3 rounded-lg bg-[rgba(255,255,255,0.06)]" />
            <div className="h-3 w-2/3 rounded-lg bg-[rgba(255,255,255,0.06)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
