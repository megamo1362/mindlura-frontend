import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from './Skeleton';

interface StatCardProps {
  label: string;
  value: ReactNode;
  subValue?: ReactNode;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  /** true = profit-colored trend, false = loss-colored, undefined = neutral accent */
  trendPositive?: boolean;
  sparkline?: ReactNode;
  loading?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  subValue,
  icon,
  trend,
  trendValue,
  trendPositive,
  sparkline,
  loading,
  className,
}: StatCardProps) {
  if (loading) {
    return (
      <div className={cn('rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 md:p-5', className)}>
        <Skeleton className="h-3 w-20 mb-3" />
        <Skeleton className="h-8 w-28" />
      </div>
    );
  }

  const trendColorClass =
    trendPositive === undefined
      ? 'text-[var(--text-muted)]'
      : trendPositive
        ? 'text-[var(--profit)]'
        : 'text-[var(--loss)]';

  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 md:p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)] ltr:tracking-wide rtl:tracking-normal rtl:normal-case">
          {label}
        </p>
        {icon && <span className="text-[var(--text-muted)]">{icon}</span>}
      </div>

      <p className="mt-2 rd-tabular text-[28px] font-bold leading-tight text-[var(--text-primary)]">{value}</p>

      <div className="mt-1.5 flex items-center gap-2">
        {subValue && <span className="text-xs text-[var(--text-muted)]">{subValue}</span>}
        {trend && trend !== 'neutral' && trendValue && (
          <span className={cn('inline-flex items-center gap-0.5 text-xs font-semibold rd-tabular', trendColorClass)}>
            {trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {trendValue}
          </span>
        )}
      </div>

      {sparkline && <div className="mt-3">{sparkline}</div>}
    </div>
  );
}
