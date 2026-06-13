'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full',
      'border-2 border-transparent outline-none',
      'transition-colors duration-200',
      'bg-[var(--color-border-hover)]',
      'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#00d4ff] data-[state=checked]:to-[#0066ff]',
      'data-[state=checked]:shadow-[var(--shadow-glow-cyan-sm)]',
      'focus-visible:ring-2 focus-visible:ring-[var(--color-cyan)] focus-visible:ring-offset-2',
      'focus-visible:ring-offset-[var(--color-void)]',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full',
        'bg-white shadow-lg',
        'transition-transform duration-200',
        'translate-x-0 data-[state=checked]:translate-x-5',
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
