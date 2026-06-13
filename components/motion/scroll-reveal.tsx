'use client';

import * as React from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

type RevealVariant = 'fadeUp' | 'fadeIn' | 'slideRight' | 'slideLeft' | 'scaleIn' | 'fadeDown';

const presets: Record<RevealVariant, Variants> = {
  fadeUp: {
    hidden:  { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden:  { opacity: 0, y: -28 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideRight: {
    hidden:  { opacity: 0, x: -36 },
    visible: { opacity: 1, x: 0 },
  },
  slideLeft: {
    hidden:  { opacity: 0, x: 36 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden:  { opacity: 0, scale: 0.88 },
    visible: { opacity: 1, scale: 1 },
  },
};

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.1,
  className,
}: ScrollRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={presets[variant]}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
