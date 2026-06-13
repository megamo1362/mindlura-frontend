import * as React from 'react';
import { cn } from '@/lib/utils';

type Trend = 'up' | 'down' | 'neutral';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  subValue?: React.ReactNode;
  icon?: React.ReactNode;
  trend?: Trend;
  trendValue?: string;
  accentColor?: string;
  className?: string;
  loading?: boolean;
}

const trendConfig: Record<Trend, { color: string; arrow: string }> = {
  up:      { color: 'var(--color-success)', arrow: '↑' },
  down:    { color: 'var(--color-danger)',  arrow: '↓' },
  neutral: { color: 'var(--color-text-muted)', arrow: '→' },
};

export function StatCard({
  label,
  value,
  subValue,
  icon,
  trend,
  trendValue,
  accentColor = 'var(--color-cyan)',
  className,
  loading,
}: StatCardProps) {
  if (loading) {
    return (
      <div className={cn('stat-card p-5', className)}>
        <div className="skeleton h-3 w-20 mb-4 rounded" />
        <div className="skeleton h-8 w-32 mb-2 rounded" />
        <div className="skeleton h-3 w-16 rounded" />
      </div>
    );
  }

  return (
    <div
      className={cn('stat-card p-5 group', className)}
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
          {label}
        </p>
        {icon && (
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: `${accentColor}1a`,
              color: accentColor,
            }}
          >
            {icon}
          </span>
        )}
      </div>

      <div
        className="text-2xl font-black tabular-nums leading-none mb-1"
        style={{ color: accentColor }}
      >
        {value}
      </div>

      {(subValue || (trend && trendValue)) && (
        <div className="flex items-center gap-2 mt-2">
          {subValue && (
            <span className="text-xs text-[var(--color-text-muted)]">{subValue}</span>
          )}
          {trend && trendValue && (
            <span
              className="inline-flex items-center gap-0.5 text-xs font-semibold"
              style={{ color: trendConfig[trend].color }}
            >
              {trendConfig[trend].arrow} {trendValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
