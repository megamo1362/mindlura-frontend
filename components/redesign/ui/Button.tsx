import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Render as the single child element (e.g. a Link) instead of a <button>. */
  asChild?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--accent)] text-white hover:brightness-110 disabled:hover:brightness-100',
  secondary:
    'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-2)]',
  ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)]',
  danger: 'bg-[var(--loss-soft)] text-[var(--loss)] border border-[var(--loss)]/30 hover:bg-[var(--loss)]/20',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', loading, disabled, className, children, asChild, ...props }, ref) => {
    const classes = cn(
      'inline-flex items-center justify-center rounded-[var(--radius-sm)] font-semibold',
      'transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50',
      VARIANT_CLASSES[variant],
      SIZE_CLASSES[size],
      className,
    );

    if (asChild) {
      // Radix Slot requires exactly one React element child. Adding the
      // loading spinner as a sibling here (`{loading && <Loader2/>}{children}`)
      // used to pass Slot a 2-item children array even when `loading` was
      // false — the `false` from the `&&` still counts as a child — which
      // threw "Slot failed to slot onto its children" on every asChild
      // Button (e.g. <Button asChild><Link>...</Link></Button>). asChild
      // callers don't use the loading state, so just forward the single
      // child untouched.
      return (
        <Slot ref={ref} className={classes} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button ref={ref} disabled={disabled || loading} className={classes} {...props}>
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
