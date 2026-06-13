'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ScaleInProps extends HTMLMotionProps<'div'> {
  delay?: number;
  duration?: number;
  once?: boolean;
  from?: number;
  mode?: 'mount' | 'inView';
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.3,
  once = true,
  from = 0.9,
  mode = 'mount',
  className,
  ...props
}: ScaleInProps) {
  const initial = { opacity: 0, scale: from };
  const animate = { opacity: 1, scale: 1 };
  const transition = {
    duration,
    delay,
    ease: [0.34, 1.56, 0.64, 1] as const,
  };

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
