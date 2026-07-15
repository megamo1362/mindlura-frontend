'use client';

import { motion } from 'framer-motion';
import type { CandleSpawn } from './types';

// Same green/red used for score coloring in AIDemoSection's scoreColor() —
// reusing it here (instead of a new hue) keeps "up/down" meaning consistent
// with the rest of the redesign rather than introducing a third palette.
const BULLISH = '#4ade80';
const BEARISH = '#f87171';

// Kept in sync with MarketSignalMotion's CANDLE_LIFETIME_MS (1550ms).
const LIFETIME = 1.55;

// Phase 4 tuning: peak opacity dropped from 0.65 to 0.38, initial scale
// raised from 0.6 to 0.82, and rise distance cut from 16px to 9px. Opacity
// and size-change are what peripheral vision actually keys on — since these
// spawn wherever the cursor is (i.e. near wherever attention already is),
// this trio is the difference between "ambient texture" and "thing that
// pulls your eye off the headline." Values were chosen to still read
// clearly against the dark canvas while losing the "growing/rising"
// emphasis in favor of a quieter drift-and-settle.
const PEAK_OPACITY = 0.38;

// One miniature OHLC candle, rendered into the hero's shared overlay <svg>.
// Deliberately plain — a wick line and a body rect, thin strokes, modest
// peak opacity — so it reads as ambient market data drifting past, not a UI
// element competing with the real report card for attention.
//
// Position is applied as a plain (non-animated) SVG transform on the outer
// <g>; only the inner <motion.g> animates, so "where it spawned" and "how it
// moves" stay cleanly separate.
export function CandlestickParticle({ x, y, bullish, bodyHeight, wickUp, wickDown, scale }: CandleSpawn) {
  const color = bullish ? BULLISH : BEARISH;
  const bodyWidth = 3.2 * scale;
  const halfBody = bodyHeight / 2;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <motion.g
        initial={{ opacity: 0, scale: 0.82, y: 0 }}
        animate={{ opacity: [0, PEAK_OPACITY, PEAK_OPACITY, 0], scale: 1, y: -9 }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        transition={{ duration: LIFETIME, times: [0, 0.15, 0.7, 1], ease: 'easeOut' }}
      >
        <line
          x1={0} y1={-halfBody - wickUp}
          x2={0} y2={halfBody + wickDown}
          stroke={color}
          strokeWidth={1.1}
        />
        <rect
          x={-bodyWidth / 2} y={-halfBody}
          width={bodyWidth} height={bodyHeight}
          fill={color} fillOpacity={0.5}
          stroke={color} strokeWidth={0.75}
        />
      </motion.g>
    </g>
  );
}
