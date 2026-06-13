'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

const sizes = {
  xs: 'w-6 h-6 text-[0.5rem]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
} as const;

type AvatarSize = keyof typeof sizes;

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  status?: 'online' | 'offline' | 'away';
}

function Avatar({ className, src, alt, fallback, size = 'md', status, ...props }: AvatarProps) {
  const statusColors = {
    online:  'bg-[var(--color-success)]',
    offline: 'bg-[var(--color-text-disabled)]',
    away:    'bg-[var(--color-warning)]',
  };

  return (
    <div className="relative inline-flex">
      <AvatarPrimitive.Root
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full',
          'ring-1 ring-[var(--color-border)]',
          sizes[size],
          className,
        )}
        {...props}
      >
        <AvatarPrimitive.Image
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
        />
        <AvatarPrimitive.Fallback
          className={cn(
            'flex h-full w-full items-center justify-center rounded-full font-bold',
            'bg-gradient-to-br from-[var(--color-cyan-dim)] to-[var(--color-purple-dim)]',
            'text-[var(--color-cyan)] border border-[var(--color-border)]',
          )}
          delayMs={100}
        >
          {fallback ?? '?'}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-[var(--color-void)]',
            statusColors[status],
            size === 'xs' ? 'w-1.5 h-1.5' : size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5',
          )}
        />
      )}
    </div>
  );
}

export { Avatar };
