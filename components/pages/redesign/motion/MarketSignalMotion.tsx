'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { CandlestickParticle } from './CandlestickParticle';
import { IntelligencePulse } from './IntelligencePulse';
import { useFinePointer } from './usePointerCapability';
import type { SignalSpawn } from './types';

// Phase 4 tuning: slower spawn + shorter lifetime keeps the steady-state
// particle count (~lifetime/interval ≈ 8) comfortably under MAX_PARTICLES,
// so the cap is a rare safety net rather than the thing actually regulating
// density — particles almost always complete their own graceful fade
// instead of being cut short by the cap's slice(). A denser, faster trail
// read as busy rather than calm; this is the main lever pulled this pass.
const SPAWN_INTERVAL_MS = 190; // throttle: ~5/sec max, independent of raw mousemove rate
const MAX_PARTICLES = 8; // hard ceiling, rarely hit at the tuned density above
const CANDLE_LIFETIME_MS = 1550;
const PULSE_LIFETIME_MS = 1100;
const PULSE_EVERY_N = 5; // every 5th spawn is an intelligence pulse — an occasional beat, not a routine tick
const EDGE_MARGIN = 20; // px, keeps particles off the hero's literal edge

interface MarketSignalMotionProps {
  heroRef: RefObject<HTMLElement | null>;
  accent: string;
  /** Explicit override — the automatic reduced-motion / fine-pointer checks
   *  already disable this; use this prop only if you need to force it off
   *  (e.g. temporarily, without touching those checks). Defaults to on. */
  enabled?: boolean;
}

// Mindlura's signature hero interaction: a cursor-reactive trail of
// miniature candlesticks with an occasional "intelligence pulse" that traces
// back to the last couple of candles — Market Data -> Analysis ->
// Intelligence — instead of a literal chart, a brain icon, or a particle
// system. See CandlestickParticle / IntelligencePulse for the two visual
// primitives this composes.
//
// Fully event-driven: no listeners or timers exist until the pointer moves
// inside the hero, and every spawned particle removes itself once its own
// animation finishes — there's no polling loop and nothing left running
// while the cursor sits still. Renders nothing at all (no listeners
// attached) under prefers-reduced-motion or on devices without a fine
// (mouse-like) pointer.
export function MarketSignalMotion({ heroRef, accent, enabled = true }: MarketSignalMotionProps) {
  const [particles, setParticles] = useState<SignalSpawn[]>([]);

  const idCounter = useRef(0);
  const spawnCounter = useRef(0);
  const lastSpawnAt = useRef(0);
  const priceWalk = useRef(50);
  const recentCandles = useRef<{ x: number; y: number }[]>([]);
  const pendingTimeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const prefersReducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const active = enabled && finePointer && !prefersReducedMotion;

  useEffect(() => {
    if (!active) return;
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const timeouts = pendingTimeouts.current;

    const schedule = (fn: () => void, ms: number) => {
      const timeoutId = setTimeout(() => {
        timeouts.delete(timeoutId);
        fn();
      }, ms);
      timeouts.add(timeoutId);
    };

    const removeParticle = (id: number) => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    };

    const addParticle = (particle: SignalSpawn) => {
      setParticles((prev) => {
        const next = [...prev, particle];
        return next.length > MAX_PARTICLES ? next.slice(next.length - MAX_PARTICLES) : next;
      });
    };

    const handleMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastSpawnAt.current < SPAWN_INTERVAL_MS) return;
      lastSpawnAt.current = now;

      const rect = heroEl.getBoundingClientRect();
      if (rect.width <= EDGE_MARGIN * 2 || rect.height <= EDGE_MARGIN * 2) return;
      const x = Math.min(Math.max(e.clientX - rect.left, EDGE_MARGIN), rect.width - EDGE_MARGIN);
      const y = Math.min(Math.max(e.clientY - rect.top, EDGE_MARGIN), rect.height - EDGE_MARGIN);

      spawnCounter.current += 1;
      const id = idCounter.current++;

      if (spawnCounter.current % PULSE_EVERY_N === 0 && recentCandles.current.length > 0) {
        const links = recentCandles.current.slice(-2);
        addParticle({ id, kind: 'pulse', x, y, links });
        schedule(() => removeParticle(id), PULSE_LIFETIME_MS);
        return;
      }

      // A gentle, slightly upward-biased random walk — consecutive candles
      // drift with loose continuity instead of flashing independently red/
      // green, which reads as more "market-like" and less noisy.
      const delta = (Math.random() - 0.47) * 16;
      priceWalk.current = Math.min(95, Math.max(5, priceWalk.current + delta));
      const bullish = delta >= 0;
      const magnitude = Math.min(1, Math.abs(delta) / 16);

      const candle: SignalSpawn = {
        id,
        kind: 'candle',
        x,
        y,
        bullish,
        bodyHeight: 5 + magnitude * 10 + Math.random() * 4,
        wickUp: 2 + Math.random() * 6,
        wickDown: 2 + Math.random() * 6,
        scale: 0.7 + magnitude * 0.6 + Math.random() * 0.25,
      };

      recentCandles.current = [...recentCandles.current, { x, y }].slice(-2);
      addParticle(candle);
      schedule(() => removeParticle(id), CANDLE_LIFETIME_MS);
    };

    heroEl.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      heroEl.removeEventListener('mousemove', handleMove);
      timeouts.forEach(clearTimeout);
      timeouts.clear();
    };
  }, [active, heroRef]);

  if (!active) return null;

  return (
    <svg
      className="absolute inset-0 -z-10 w-full h-full overflow-hidden"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      <AnimatePresence>
        {particles.map((p) =>
          p.kind === 'candle' ? (
            <CandlestickParticle key={p.id} {...p} />
          ) : (
            <IntelligencePulse key={p.id} {...p} accent={accent} />
          )
        )}
      </AnimatePresence>
    </svg>
  );
}
