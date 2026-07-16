'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { IntroMode } from '../types';

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

// Chooses between the three intro variants:
//  - 'reduced': prefers-reduced-motion — a near-instant static fade, no
//    WebGL, no continuous motion.
//  - 'fallback': touch/coarse-pointer or narrow-viewport devices (phones,
//    tablets), or no WebGL support — a lighter CSS/SVG sequence reusing the
//    hero's existing candlestick + pulse visual language.
//  - 'full': desktop with a fine pointer and WebGL — the R3F scene.
//
// Starts at 'checking' (renders nothing but the void background) so SSR and
// first client paint match exactly; the real mode is only known after this
// effect runs, avoiding any capability-guessing on the server.
export function useDeviceCapability(): IntroMode {
  const prefersReducedMotion = useReducedMotion();
  const [mode, setMode] = useState<IntroMode>('checking');

  useEffect(() => {
    if (prefersReducedMotion) {
      setMode('reduced');
      return;
    }

    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const narrowViewport = window.innerWidth < 768;
    const isMobileLike = coarsePointer || narrowViewport;

    if (isMobileLike || !detectWebGL()) {
      setMode('fallback');
      return;
    }

    setMode('full');
  }, [prefersReducedMotion]);

  return mode;
}
