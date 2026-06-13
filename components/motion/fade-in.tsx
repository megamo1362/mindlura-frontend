'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface FadeInProps extends HTMLMotionProps<'div'> {
  delay?: number;
  duration?: number;
  once?: boolean;
  mode?: 'mount' | 'inView';
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.3,
  once = true,
  mode = 'inView',
  className,
  ...props
}: FadeInProps) {
  const initial = { opacity: 0 };
  const animate = { opacity: 1 };
  const transition = { duration, delay, ease: [0.4, 0, 0.2, 1] as const };

  if (mode === 'mount') {
    return (
      <motion.div
        initial={initial}
        animate={animate}
        transition={transition}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once }}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
