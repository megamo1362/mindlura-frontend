'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BEARISH, BULLISH, CORE_GRADIENT, TIMELINE } from './constants';
import { IntroOverlay } from './IntroOverlay';

interface FallbackCandle {
  id: number;
  startX: number;
  startY: number;
  coreX: number;
  coreY: number;
  bullish: boolean;
  bodyHeight: number;
}

const CANDLE_COUNT = 16;
const CONNECTION_COUNT = 5;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildFallbackCandles(): FallbackCandle[] {
  const rand = mulberry32(160716);
  return Array.from({ length: CANDLE_COUNT }, (_, id) => ({
    id,
    startX: 8 + rand() * 84,
    startY: 6 + rand() * 62,
    coreX: 50 + (rand() - 0.5) * 20,
    coreY: 38 + (rand() - 0.5) * 20,
    bullish: rand() > 0.45,
    bodyHeight: 2.6 + rand() * 3.6,
  }));
}

const frac = (ms: number) => ms / TIMELINE.total;
const TOTAL_S = TIMELINE.total / 1000;

// Lighter-weight variant for touch/coarse-pointer devices and browsers
// without WebGL: the same four-phase story (scattered data -> convergence ->
// core -> logo reveal) rendered as plain SVG + CSS instead of a WebGL scene,
// reusing the hero's existing candlestick color language.
export function IntroFallback() {
  const candles = useMemo(() => buildFallbackCandles(), []);
  const [skipped, setSkipped] = useState(false);

  const connections = useMemo(() => {
    const rand = mulberry32(11);
    return Array.from({ length: CONNECTION_COUNT }, () => {
      const a = candles[Math.floor(rand() * candles.length)];
      const b = candles[Math.floor(rand() * candles.length)];
      return { a, b };
    });
  }, [candles]);

  const duration = skipped ? 0.3 : TOTAL_S;
  const convergeStartF = skipped ? 0 : frac(TIMELINE.convergeStart);
  const convergeEndF = skipped ? 0.05 : frac(TIMELINE.convergeStart + TIMELINE.convergeDuration);
  const revealStartF = skipped ? 0.06 : frac(TIMELINE.revealStart);
  const revealEndF = skipped ? 0.1 : frac(TIMELINE.revealStart + TIMELINE.revealDuration + 300);
  const marketFadeF = skipped ? 0.02 : frac(TIMELINE.marketDuration * 0.35);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 76" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {connections.map(({ a, b }, i) => (
          <motion.line
            key={i}
            x1={a.startX}
            y1={a.startY}
            x2={b.startX}
            y2={b.startY}
            stroke={CORE_GRADIENT[0]}
            strokeWidth={0.15}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.22, 0.22, 0] }}
            transition={{ duration, times: [0, marketFadeF, convergeStartF, convergeEndF], ease: 'easeInOut' }}
          />
        ))}

        {candles.map((c) => {
          const color = c.bullish ? BULLISH : BEARISH;
          return (
            <motion.g
              key={c.id}
              initial={{ x: c.startX, y: c.startY, opacity: 0 }}
              animate={{
                x: [c.startX, c.startX, c.coreX, c.coreX],
                y: [c.startY, c.startY, c.coreY, c.coreY],
                opacity: [0, 0.55, 0.55, 0],
              }}
              transition={{
                duration,
                times: [0, marketFadeF, convergeEndF, revealEndF],
                ease: 'easeInOut',
              }}
            >
              <rect x={-0.5} y={-c.bodyHeight / 2} width={1} height={c.bodyHeight} fill={color} />
            </motion.g>
          );
        })}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center pb-[20vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: [0, 0, 1], scale: [0.85, 0.85, 1] }}
          transition={{ duration, times: [0, revealStartF, revealEndF], ease: 'easeOut' }}
          className="relative h-36 w-36"
          style={{
            maskImage: 'radial-gradient(circle, black 52%, transparent 76%)',
            WebkitMaskImage: 'radial-gradient(circle, black 52%, transparent 76%)',
          }}
          aria-hidden="true"
        >
          <Image src="/logo-dashboard-dark.png" alt="" fill sizes="144px" priority className="object-contain" />
        </motion.div>
      </div>

      <IntroOverlay
        timing={{
          skipButton: TIMELINE.skipButtonDelay / 1000,
          wordmark: skipped ? 0 : TIMELINE.wordmarkDelay / 1000,
          tagline: skipped ? 0.15 : TIMELINE.taglineDelay / 1000,
          cta: skipped ? 0.3 : TIMELINE.ctaDelay / 1000,
        }}
        skipped={skipped}
        onSkip={() => setSkipped(true)}
      />
    </div>
  );
}
