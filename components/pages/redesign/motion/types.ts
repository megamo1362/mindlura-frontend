// Shared spawn-data shapes for the hero's signature motion. Kept separate
// from MarketSignalMotion.tsx so CandlestickParticle/IntelligencePulse can
// import them without depending on the orchestrator module.

export interface CandleSpawn {
  id: number;
  kind: 'candle';
  x: number;
  y: number;
  bullish: boolean;
  bodyHeight: number;
  wickUp: number;
  wickDown: number;
  scale: number;
}

export interface PulseSpawn {
  id: number;
  kind: 'pulse';
  x: number;
  y: number;
  /** Positions (in the same coordinate space) of the 1-2 most recent
   *  candles — drawn as thin traces from the pulse, the "analysis" visual
   *  link back to the "data" that preceded it. */
  links: { x: number; y: number }[];
}

export type SignalSpawn = CandleSpawn | PulseSpawn;
