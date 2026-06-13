import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva('rounded-[var(--radius-lg)] overflow-hidden', {
  variants: {
    variant: {
      surface: [
        'bg-[var(--color-surface)] border border-[var(--color-border)]',
        'shadow-[var(--shadow-card)]',
      ].join(' '),

      elevated: [
        'bg-[var(--color-elevated)] border border-[var(--color-border)]',
        'shadow-[var(--shadow-elevated)]',
      ].join(' '),

      glass: [
        'bg-[var(--color-glass)] border border-[var(--color-border)]',
        'backdrop-blur-[20px]',
      ].join(' '),

      interactive: [
        'bg-[var(--color-surface)] border border-[var(--color-border)]',
        'shadow-[var(--shadow-card)] cursor-pointer',
        'transition-all duration-200',
        'hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-glow-cyan)] hover:-translate-y-px',
      ].join(' '),

      stat: [
        'bg-[var(--color-surface)] border border-[var(--color-border)]',
        'shadow-[var(--shadow-card)] relative overflow-hidden',
        'before:absolute before:top-0 before:left-0 before:right-0 before:h-px',
        'before:bg-gradient-to-r before:from-transparent before:via-[var(--color-border-hover)] before:to-transparent',
      ].join(' '),

      ghost: 'bg-transparent border-0',
    },
  },
  defaultVariants: {
    variant: 'surface',
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
  ),
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-1 p-6 pb-0', className)}
      {...props}
    />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-base font-bold leading-tight text-[var(--color-text-primary)]', className)}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-xs text-[var(--color-text-muted)]', className)}
      {...props}
    />
  ),
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center px-6 pb-6 pt-0 border-t border-[var(--color-border)] mt-0',
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
