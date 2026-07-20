import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 whitespace-nowrap px-2.5 py-0.5 rounded-full text-xs font-semibold border select-none',
  {
    variants: {
      variant: {
        cyan:    'bg-[var(--color-cyan-dim)]    text-[var(--color-cyan)]         border-[var(--color-cyan-glow)]',
        blue:    'bg-[var(--color-blue-dim)]    text-[var(--color-blue-light)]   border-[var(--color-blue-light)]',
        purple:  'bg-[var(--color-purple-dim)]  text-[var(--color-purple-light)] border-[var(--color-purple-light)]',
        teal:    'bg-[var(--color-teal-dim)]    text-[var(--color-teal-light)]   border-[var(--color-teal-light)]',
        green:   'bg-[var(--color-success-dim)] text-[var(--color-success)]      border-[var(--color-success-glow)]',
        yellow:  'bg-[var(--color-warning-dim)] text-[var(--color-warning)]      border-[var(--color-warning-glow)]',
        red:     'bg-[var(--color-danger-dim)]  text-[var(--color-danger)]       border-[var(--color-danger-glow)]',
        gray:    'bg-[var(--color-elevated)]    text-[var(--color-text-muted)]   border-[var(--color-border)]',
        outline: 'bg-transparent              text-[var(--color-text-secondary)] border-[var(--color-border)]',
      },
    },
    defaultVariants: {
      variant: 'cyan',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: 'currentColor' }}
        />
      )}
      {children}
    </span>
  );
}

export function PlanBadge({ slug }: { slug: string | null | undefined }) {
  const map: Record<string, { label: string; variant: VariantProps<typeof badgeVariants>['variant'] }> = {
    trial:   { label: 'Trial',  variant: 'yellow'  },
    basic:   { label: 'Basic',  variant: 'blue'    },
    pro:     { label: 'Pro',    variant: 'cyan'    },
    elite:   { label: 'Elite',  variant: 'purple'  },
  };
  const entry = slug ? map[slug] : null;
  if (!entry) return null;
  return <Badge variant={entry.variant}>{entry.label}</Badge>;
}
