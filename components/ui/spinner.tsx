import * as React from 'react';
import { cn } from '@/lib/utils';

const sizes = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-7 h-7 border-[3px]',
  xl: 'w-10 h-10 border-4',
} as const;

type SpinnerSize = keyof typeof sizes;

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  'aria-label'?: string;
}

export function Spinner({ size = 'md', className, 'aria-label': ariaLabel = 'Loading' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      className={cn(
        'inline-block rounded-full animate-spin',
        'border-[var(--color-cyan-dim)] border-t-[var(--color-cyan)]',
        sizes[size],
        className,
      )}
    />
  );
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)} role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: 'var(--color-cyan)',
            animation: 'pulse 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </span>
  );
}
