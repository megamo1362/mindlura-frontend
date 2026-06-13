'use client';

import { useRef, useEffect, type RefObject } from 'react';
import { gsap } from '@/lib/gsap';

type GsapCallback = (
  el: HTMLElement,
  g: typeof gsap,
) => gsap.core.Tween | gsap.core.Timeline | void;

export function useGsap<T extends HTMLElement = HTMLDivElement>(
  callback: GsapCallback,
  deps: unknown[] = [],
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      callback(el, gsap);
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

export function useGsapTimeline(
  build: (tl: gsap.core.Timeline) => void,
  deps: unknown[] = [],
) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      build(tl);
    }, ref.current);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
