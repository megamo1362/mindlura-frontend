'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Spinner } from './spinner';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-semibold select-none cursor-pointer',
    'transition-all duration-[200ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cyan)]',
    'focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-void)]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'relative overflow-hidden border-0',
          'bg-gradient-to-r from-[#00d4ff] to-[#0066ff]',
          'text-[#020510] font-bold',
          'hover:shadow-[0_0_24px_rgba(0,212,255,0.4),0_4px_12px_rgba(0,102,255,0.3)]',
          'hover:-translate-y-px active:translate-y-0',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/[0.15]',
          'before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity',
        ].join(' '),

        secondary: [
          'bg-transparent border border-[var(--color-border)]',
          'text-[var(--color-text-primary)]',
          'hover:border-[var(--color-border-hover)] hover:bg-[var(--color-cyan-dim)] hover:text-[var(--color-cyan)]',
        ].join(' '),

        ghost: [
          'bg-transparent border-0',
          'text-[var(--color-text-muted)]',
          'hover:text-[var(--color-text-primary)] hover:bg-white/[0.04]',
        ].join(' '),

        danger: [
          'bg-[var(--color-danger-dim)] border border-[rgba(239,68,68,0.3)]',
          'text-[var(--color-danger)]',
          'hover:bg-[rgba(239,68,68,0.2)] hover:border-[rgba(239,68,68,0.5)]',
        ].join(' '),

        outline: [
          'bg-transparent border border-[rgba(0,212,255,0.25)]',
          'text-[var(--color-cyan)]',
          'hover:bg-[var(--color-cyan-dim)] hover:border-[var(--color-border-hover)]',
        ].join(' '),

        success: [
          'bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.3)]',
          'text-[var(--color-success)]',
          'hover:bg-[rgba(34,197,94,0.2)] hover:border-[rgba(34,197,94,0.5)]',
        ].join(' '),

        link: 'bg-transparent border-0 p-0 h-auto text-[var(--color-cyan)] underline-offset-4 hover:underline',
      },

      size: {
        sm:       'h-8 text-xs px-3 rounded-[var(--radius-sm)]',
        md:       'h-10 text-sm px-4 rounded-[var(--radius-md)]',
        lg:       'h-12 text-sm px-6 rounded-[var(--radius-lg)]',
        xl:       'h-14 text-base px-8 rounded-[var(--radius-xl)]',
        icon:     'h-9 w-9 rounded-[var(--radius-md)] p-0',
        'icon-sm':'h-7 w-7 rounded-lg p-0 text-xs',
        'icon-lg':'h-11 w-11 rounded-[var(--radius-lg)] p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, loadingText, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Spinner size="sm" />
            {loadingText ?? children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
