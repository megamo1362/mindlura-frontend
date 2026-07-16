import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  title?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  padded?: boolean;
}

export function Card({ children, title, action, footer, className, bodyClassName, padded = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] bg-[var(--bg-surface)]',
        'border border-[var(--border-subtle)]',
        'shadow-[var(--card-shadow)]',
        className,
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-5 py-4">
          {title && <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">{title}</h3>}
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={cn(padded && 'p-4 md:p-5', bodyClassName)}>{children}</div>
      {footer && (
        <div className="border-t border-[var(--border-subtle)] px-5 py-3">{footer}</div>
      )}
    </div>
  );
}
