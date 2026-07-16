import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: ReactNode;
  breadcrumb?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, breadcrumb, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-3', className)}>
      <div>
        {breadcrumb && <div className="mb-1 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">{breadcrumb}</div>}
        <h1 className="text-[22px] font-bold leading-tight text-[var(--text-primary)]">{title}</h1>
        {description && <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
