'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@/lib/utils';

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
    variant?: 'default' | 'cyber';
  }
>(({ className, orientation = 'horizontal', decorative = true, variant = 'default', ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'shrink-0',
      orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      variant === 'cyber'
        ? orientation === 'horizontal'
          ? 'bg-gradient-to-r from-transparent via-[var(--color-border-hover)] to-transparent'
          : 'bg-gradient-to-b from-transparent via-[var(--color-border-hover)] to-transparent'
        : 'bg-[var(--color-border)]',
      className,
    )}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
