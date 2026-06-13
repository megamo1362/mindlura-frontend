import * as React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'خطایی رخ داد',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'glass rounded-2xl p-12 text-center flex flex-col items-center gap-4',
        className,
      )}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: 'var(--color-danger-dim)',
          color: 'var(--color-danger)',
        }}
      >
        <AlertCircle className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-[var(--color-danger)] mb-1">{title}</h3>
        {message && (
          <p className="text-sm text-[var(--color-text-muted)]">{message}</p>
        )}
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw className="w-3.5 h-3.5" />
          تلاش دوباره
        </Button>
      )}
    </div>
  );
}
