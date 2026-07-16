import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'accent' | 'profit' | 'loss' | 'warning' | 'neutral';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  accent: 'bg-[var(--accent-soft)] text-[var(--accent)]',
  profit: 'bg-[var(--profit-soft)] text-[var(--profit)]',
  loss: 'bg-[var(--loss-soft)] text-[var(--loss)]',
  warning: 'bg-[var(--warning-soft)] text-[var(--warning)]',
  neutral: 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)]',
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: ReactNode;
  className?: string;
}

export function Badge({ children, variant = 'neutral', icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
