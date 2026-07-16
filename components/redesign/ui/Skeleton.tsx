import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('rounded-[var(--radius-sm)] bg-[var(--bg-surface-2)] bg-[length:200%_100%]', className)}
      style={{
        backgroundImage:
          'linear-gradient(90deg, var(--bg-surface-2) 25%, var(--border-subtle) 50%, var(--bg-surface-2) 75%)',
        animation: 'rd-shimmer 1.5s infinite',
      }}
    />
  );
}

export function StatCardSkeletonRow({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 md:p-5">
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeletonRows({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: cols }).map((__, c) => (
            <td key={c} className="px-4 py-3">
              <Skeleton className="h-4 w-full max-w-[120px]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
