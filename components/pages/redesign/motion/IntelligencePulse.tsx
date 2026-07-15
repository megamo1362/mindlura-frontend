'use client';

import { motion } from 'framer-motion';
import type { PulseSpawn } from './types';

// Kept in sync with MarketSignalMotion's PULSE_LIFETIME_MS (1100ms).
const LIFETIME = 1.1;

// The "analysis" moment in the Market Data -> Analysis -> Intelligence
// sequence: a brief, quiet signal rather than a spinner or a brain icon. A
// soft flash at the point the system is "reading", with thin dashed traces
// back to the 1-2 candles it's reacting to — that connection is what carries
// the metaphor, not the flash itself.
//
// Phase 4 tuning: the center flash previously peaked at 0.9 opacity, which
// read as a bright notification "ping" rather than a considered signal —
// dropped to 0.5. The expanding ring's scale swing (0.3 -> 6 -> 8, a ~27x
// size change) was similarly loud; tightened to 0.3 -> 3.5 -> 4.5 so it's
// still legible as "a ring expanding" without becoming the most eye-catching
// thing in the hero. Trace-line opacity left largely alone — that's the one
// element actually carrying the "connects to recent data" storytelling, so
// it needed to stay legible rather than be tuned down with everything else.
export function IntelligencePulse({ x, y, links, accent }: PulseSpawn & { accent: string }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {links.map((link, i) => (
        <motion.line
          key={i}
          x1={0} y1={0}
          x2={link.x - x} y2={link.y - y}
          stroke={accent}
          strokeWidth={0.75}
          strokeDasharray="2 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.26, 0] }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: LIFETIME, ease: 'easeOut' }}
        />
      ))}

      {/* center flash — the "detected" instant */}
      <motion.circle
        r={2}
        fill={accent}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: [0, 0.5, 0], scale: [0.4, 1.1, 1] }}
        exit={{ opacity: 0, transition: { duration: 0.25 } }}
        transition={{ duration: LIFETIME, ease: 'easeOut' }}
      />

      {/* single expanding ring — restrained, not a radar sweep */}
      <motion.circle
        r={2}
        fill="none"
        stroke={accent}
        strokeWidth={1}
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: [0, 0.32, 0], scale: [0.3, 3.5, 4.5] }}
        exit={{ opacity: 0, transition: { duration: 0.25 } }}
        transition={{ duration: LIFETIME, ease: 'easeOut' }}
      />
    </g>
  );
}
