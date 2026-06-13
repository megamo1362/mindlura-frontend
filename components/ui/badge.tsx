import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 whitespace-nowrap px-2.5 py-0.5 rounded-full text-xs font-semibold border select-none',
  {
    variants: {
      variant: {
        cyan:    'bg-[rgba(0,212,255,0.12)]    text-[var(--color-cyan)]         border-[rgba(0,212,255,0.25)]',
        blue:    'bg-[rgba(59,130,246,0.12)]   text-[#60a5fa]                   border-[rgba(59,130,246,0.25)]',
        purple:  'bg-[rgba(124,58,237,0.15)]   text-[#a78bfa]                   border-[rgba(124,58,237,0.3)]',
        teal:    'bg-[rgba(20,184,166,0.12)]   text-[#2dd4bf]                   border-[rgba(20,184,166,0.25)]',
        green:   'bg-[rgba(34,197,94,0.12)]    text-[var(--color-success)]      border-[rgba(34,197,94,0.25)]',
        yellow:  'bg-[rgba(245,158,11,0.12)]   text-[var(--color-warning)]      border-[rgba(245,158,11,0.25)]',
        red:     'bg-[rgba(239,68,68,0.12)]    text-[var(--color-danger)]       border-[rgba(239,68,68,0.25)]',
        gray:    'bg-[rgba(255,255,255,0.06)]  text-[var(--color-text-muted)]   border-[var(--color-border)]',
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
