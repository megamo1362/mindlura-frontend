'use client';

import { useState, useEffect, useRef } from 'react';

export function useAnimatedNumber(target: number, duration = 1200): number {
  const [value, setValue] = useState(0);
  const rafId = useRef(0);
  const startTime = useRef<number | null>(null);
  const startValue = useRef(0);

  useEffect(() => {
    startTime.current = null;
    const from = startValue.current;

    const tick = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (target - from) * eased);
      if (progress < 1) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        startValue.current = target;
      }
    };

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [target, duration]);

  return value;
}
