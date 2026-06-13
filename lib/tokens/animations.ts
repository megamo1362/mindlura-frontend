export const animations = {
  duration: {
    instant: 0,
    fast:    120,
    normal:  200,
    slow:    350,
    slower:  600,
    slowest: 1000,
  },

  easing: {
    smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
    spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    out:    [0, 0, 0.2, 1] as [number, number, number, number],
    in:     [0.4, 0, 1, 1] as [number, number, number, number],
    linear: [0, 0, 1, 1] as [number, number, number, number],
  },

  // Framer Motion variants (use with motion components)
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit:    { opacity: 0 },
    },

    fadeUp: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      exit:    { opacity: 0, y: 8 },
    },

    fadeDown: {
      initial: { opacity: 0, y: -16 },
      animate: { opacity: 1, y: 0 },
      exit:    { opacity: 0, y: -8 },
    },

    scaleIn: {
      initial: { opacity: 0, scale: 0.92 },
      animate: { opacity: 1, scale: 1 },
      exit:    { opacity: 0, scale: 0.96 },
    },

    slideInRight: {
      initial: { opacity: 0, x: 24 },
      animate: { opacity: 1, x: 0 },
      exit:    { opacity: 0, x: 12 },
    },

    slideInLeft: {
      initial: { opacity: 0, x: -24 },
      animate: { opacity: 1, x: 0 },
      exit:    { opacity: 0, x: -12 },
    },

    staggerContainer: {
      animate: { transition: { staggerChildren: 0.07 } },
    },

    staggerItem: {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
    },

    modal: {
      initial: { opacity: 0, scale: 0.94, y: 8 },
      animate: { opacity: 1, scale: 1,    y: 0 },
      exit:    { opacity: 0, scale: 0.96, y: 4 },
    },

    page: {
      initial: { opacity: 0, x: -8 },
      animate: { opacity: 1, x: 0 },
      exit:    { opacity: 0, x: 8 },
    },
  },

  transition: {
    fast:          { duration: 0.12,  ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
    normal:        { duration: 0.2,   ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
    slow:          { duration: 0.35,  ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
    spring:        { type: 'spring' as const, stiffness: 300, damping: 30 },
    springBouncy:  { type: 'spring' as const, stiffness: 400, damping: 25 },
    springGentle:  { type: 'spring' as const, stiffness: 200, damping: 35 },
  },
} as const;

export type Animations = typeof animations;
