'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MotionCardProps extends HTMLMotionProps<'div'> {
  glowColor?: string;
  hover?: boolean;
  clickable?: boolean;
}

export function MotionCard({
  children,
  className,
  glowColor = 'rgba(0,212,255,0.15)',
  hover = true,
  clickable = false,
  onClick,
  ...props
}: MotionCardProps) {
  return (
    <motion.div
      className={cn(
        'bg-[var(--color-surface)] border border-[var(--color-border)]',
        'rounded-[var(--radius-lg)] shadow-[var(--shadow-card)]',
        clickable && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
      whileHover={
        hover
          ? {
              y: -2,
              borderColor: 'rgba(0,212,255,0.35)',
              boxShadow: `0 0 28px ${glowColor}, 0 4px 24px rgba(0,0,0,0.4)`,
            }
          : undefined
      }
      whileTap={clickable ? { scale: 0.99, y: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Variants for data-driven entry animation
export const cardEntryVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};
