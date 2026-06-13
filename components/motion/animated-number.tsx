'use client';

import * as React from 'react';
import { animate, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.2,
  className,
  once = true,
}: AnimatedNumberProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once });
  const [display, setDisplay] = React.useState(0);
  const prevValue = React.useRef(0);
  const controlRef = React.useRef<ReturnType<typeof animate> | null>(null);

  React.useEffect(() => {
    if (!inView) return;
    if (controlRef.current) controlRef.current.stop();
    const from = prevValue.current;
    prevValue.current = value;

    controlRef.current = animate(from, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
      onComplete: () => setDisplay(value),
    });

    return () => controlRef.current?.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
