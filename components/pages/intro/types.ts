export type IntroMode = 'checking' | 'full' | 'fallback' | 'reduced';

/** Mutable elapsed-ms clock, read inside useFrame without triggering re-renders. */
export interface ElapsedRef {
  current: number;
}

export interface CandleDatum {
  /** Scattered starting position (Phase 1, "raw market data"). */
  start: [number, number, number];
  /** Position on the neural core sphere (Phase 2-3). */
  core: [number, number, number];
  /** Position once the core "opens" and disperses (Phase 3 tail). */
  disperse: [number, number, number];
  bullish: boolean;
  /** Relative body height, mirrors CandlestickParticle's per-particle variance. */
  scale: number;
}
