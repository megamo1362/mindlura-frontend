'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: 'pills' | 'underline' | 'segment';
  }
>(({ className, variant = 'pills', ...props }, ref) => {
  const variantClass = {
    pills:
      'inline-flex items-center gap-1 p-1 rounded-xl bg-[rgba(0,0,0,0.3)] border border-[var(--color-border)]',
    underline:
      'inline-flex items-center gap-0 border-b border-[var(--color-border)]',
    segment:
      'inline-flex items-center gap-0 p-1 rounded-xl bg-[var(--color-deep)] border border-[var(--color-border)]',
  }[variant];

  return (
    <TabsPrimitive.List
      ref={ref}
      data-variant={variant}
      className={cn(variantClass, className)}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap',
      'text-sm font-medium select-none cursor-pointer',
      'transition-all duration-200 outline-none',
      'rounded-lg px-4 py-2',
      // pills / segment default
      'text-[var(--color-text-muted)]',
      'hover:text-[var(--color-text-secondary)]',
      // active state
      'data-[state=active]:text-[#020510]',
      'data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00d4ff] data-[state=active]:to-[#0066ff]',
      'data-[state=active]:shadow-[0_0_12px_rgba(0,212,255,0.3)]',
      'disabled:pointer-events-none disabled:opacity-40',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'focus-visible:outline-none',
      'data-[state=active]:animate-[fadeIn_200ms_ease-out]',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
