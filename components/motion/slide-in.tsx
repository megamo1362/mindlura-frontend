'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right';

interface SlideInProps extends HTMLMotionProps<'div'> {
  direction?: Direction;
  distance?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
  mode?: 'mount' | 'inView';
}

function getInitial(direction: Direction, distance: number) {
  const offsets: Record<Direction, { x: number; y: number }> = {
    up:    { x: 0, y: distance },
    down:  { x: 0, y: -distance },
    left:  { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
  };
  return { opacity: 0, ...offsets[direction] };
}

export function SlideIn({
  children,
  direction = 'up',
  distance = 20,
  delay = 0,
  duration = 0.4,
  once = true,
  mode = 'inView',
  className,
  ...props
}: SlideInProps) {
  const initial = getInitial(direction, distance);
  const animate = { opacity: 1, x: 0, y: 0 };
  const transition = {
    duration,
    delay,
    ease: [0.4, 0, 0.2, 1] as const,
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
