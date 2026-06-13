import * as React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

const severityConfig: Record<AlertSeverity, {
  icon: React.ElementType;
  bg: string;
  border: string;
  text: string;
  iconColor: string;
}> = {
  info: {
    icon: Info,
    bg: 'bg-[rgba(59,130,246,0.08)]',
    border: 'border-[rgba(59,130,246,0.25)]',
    text: 'text-[#60a5fa]',
    iconColor: '#60a5fa',
  },
  success: {
    icon: CheckCircle2,
    bg: 'bg-[rgba(34,197,94,0.08)]',
    border: 'border-[rgba(34,197,94,0.25)]',
    text: 'text-[var(--color-success)]',
    iconColor: 'var(--color-success)',
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-[rgba(245,158,11,0.08)]',
    border: 'border-[rgba(245,158,11,0.25)]',
    text: 'text-[var(--color-warning)]',
    iconColor: 'var(--color-warning)',
  },
  error: {
    icon: XCircle,
    bg: 'bg-[rgba(239,68,68,0.08)]',
    border: 'border-[rgba(239,68,68,0.25)]',
    text: 'text-[var(--color-danger)]',
    iconColor: 'var(--color-danger)',
  },
};

interface AlertProps {
  severity?: AlertSeverity;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function Alert({
  severity = 'info',
  title,
  children,
  dismissible,
  onDismiss,
  className,
}: AlertProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={cn(
        'relative flex gap-3 rounded-[var(--radius-md)] p-4 border text-sm',
        config.bg,
        config.border,
        className,
      )}
    >
      <Icon
        className="w-4 h-4 mt-0.5 flex-shrink-0"
        style={{ color: config.iconColor }}
      />
      <div className="flex-1 min-w-0">
        {title && (
          <p className={cn('font-semibold mb-0.5 text-sm', config.text)}>{title}</p>
        )}
        <div className="text-[var(--color-text-secondary)]">{children}</div>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
