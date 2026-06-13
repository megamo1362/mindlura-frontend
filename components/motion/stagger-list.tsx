'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';

interface StaggerListProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  stagger?: number;
  delay?: number;
  once?: boolean;
  as?: React.ElementType;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: [0.4, 0, 0.2, 1], duration: 0.35 },
  },
};

export function StaggerList({
  children,
  stagger = 0.08,
  delay = 0,
  once = true,
  className,
  ...props
}: StaggerListProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={containerVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
}

// Convenience: ul/li semantic variant
export function StaggerUl({
  children,
  stagger = 0.08,
  delay = 0,
  once = true,
  className,
}: Omit<StaggerListProps, 'as'>) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.ul>
  );
}

export function StaggerLi({
  children,
  className,
  ...props
}: HTMLMotionProps<'li'>) {
  return (
    <motion.li variants={itemVariants} className={className} {...props}>
      {children}
    </motion.li>
  );
}
