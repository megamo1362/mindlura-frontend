'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { tokens } from '@/lib/design-tokens';

export interface IntroOverlayTiming {
  /** All delays in seconds, relative to mount. */
  skipButton: number;
  wordmark: number;
  tagline: number;
  cta: number;
}

interface IntroOverlayProps {
  timing: IntroOverlayTiming;
  skipped: boolean;
  onSkip: () => void;
}

// The only real text on this page — everything drawn inside the canvas
// (candles, neural core, the M mark) is decorative and aria-hidden. Shared
// across all three intro variants (full / fallback / reduced) so the final
// "transition-ready" moment — wordmark, tagline, CTA toward the homepage —
// always looks and behaves the same regardless of which visual layer ran.
export function IntroOverlay({ timing, skipped, onSkip }: IntroOverlayProps) {
  const delay = (base: number) => (skipped ? 0 : base);
  const duration = skipped ? 0.25 : 0.6;

  return (
    <div className="relative z-10 flex h-full w-full flex-col items-center justify-end pb-16 px-6 text-center">
      <button
        type="button"
        onClick={onSkip}
        className="absolute top-6 right-6 text-xs tracking-wide uppercase transition-opacity hover:opacity-100"
        style={{ color: tokens.color.mutedDim, opacity: 0.7 }}
      >
        Skip intro
      </button>

      {/* Reserves the mark's footprint so layout doesn't jump once the
          canvas/fallback logo fades in above this block. */}
      <div className="h-[38vh] shrink-0" aria-hidden="true" />

      {/* Keyed on `skipped`: framer-motion only replays a transition when
          the animate target itself changes, and opacity/y stay {1,0}
          before and after skip — without a fresh key, a skip mid-delay
          would leave the original (long) delay running unchanged. */}
      <motion.h1
        key={skipped ? 'skip' : 'normal'}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: delay(timing.wordmark) }}
        className="text-3xl md:text-4xl tracking-[0.2em] uppercase"
        style={{ fontFamily: tokens.font.display, color: tokens.color.text, fontWeight: 500 }}
      >
        Mindlura
      </motion.h1>

      <motion.p
        key={skipped ? 'skip' : 'normal'}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: delay(timing.tagline) }}
        className="mt-3 text-sm md:text-base"
        style={{ color: tokens.color.muted }}
      >
        Trading psychology, made visible.
      </motion.p>

      <motion.div
        key={skipped ? 'skip' : 'normal'}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: delay(timing.cta) }}
        className="mt-9"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3 text-sm"
          style={{
            backgroundColor: tokens.color.coach,
            color: tokens.color.canvas,
            boxShadow: `0 0 28px ${tokens.color.coach}55`,
          }}
        >
          Enter Mindlura
          <ArrowRight size={14} />
        </Link>
      </motion.div>
    </div>
  );
}
