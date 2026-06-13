'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  label?: string;
  showPercent?: boolean;
  color?: 'cyan' | 'blue' | 'purple' | 'green' | 'red' | 'amber';
  size?: 'sm' | 'md' | 'lg';
}

const colorMap = {
  cyan:   'from-[#00d4ff] to-[#0066ff]',
  blue:   'from-[#0066ff] to-[#0052cc]',
  purple: 'from-[#7c3aed] to-[#6d28d9]',
  green:  'from-[#22c55e] to-[#16a34a]',
  red:    'from-[#ef4444] to-[#dc2626]',
  amber:  'from-[#f59e0b] to-[#d97706]',
};

const sizeMap = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, label, showPercent, color = 'cyan', size = 'md', ...props }, ref) => (
  <div className="w-full space-y-1.5">
    {(label || showPercent) && (
      <div className="flex items-center justify-between">
        {label && <span className="text-xs text-[var(--color-text-muted)]">{label}</span>}
        {showPercent && (
          <span className="text-xs font-mono font-semibold text-[var(--color-text-secondary)]">
            {Math.round(value)}%
          </span>
        )}
      </div>
    )}
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative w-full overflow-hidden rounded-full',
        'bg-[rgba(255,255,255,0.06)]',
        sizeMap[size],
        className,
      )}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full w-full flex-1 bg-gradient-to-r transition-transform duration-500 ease-out rounded-full',
          colorMap[color],
        )}
        style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
      />
    </ProgressPrimitive.Root>
  </div>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
