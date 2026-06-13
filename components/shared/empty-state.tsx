import * as React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'glass rounded-2xl p-16 text-center flex flex-col items-center gap-4',
        className,
      )}
    >
      {icon && (
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: 'var(--color-cyan-dim)',
            color: 'var(--color-cyan)',
          }}
        >
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function MiniEmptyState({ label }: { label: string }) {
  return (
    <div className="py-8 text-center">
      <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
    </div>
  );
}
