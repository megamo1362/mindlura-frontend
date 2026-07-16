// Timeline for the intro experience, in milliseconds. Shared by the R3F
// canvas (converted to seconds for its internal clock) and the DOM overlay
// (converted to seconds for framer-motion `delay`s), so both layers stay in
// sync without needing a shared React state object that would re-render the
// whole tree every frame.
//
// Phases overlap slightly on purpose — real motion design rarely hard-cuts
// between beats — but stay within the 4-6s premium/calm brief.
export const TIMELINE = {
  marketStart: 0,
  marketDuration: 1600,

  convergeStart: 1350,
  convergeDuration: 1550,

  pulseStart: 2750,
  pulseDuration: 650,

  revealStart: 3300,
  revealDuration: 900,

  settleStart: 4100,

  wordmarkDelay: 4250,
  taglineDelay: 4500,
  ctaDelay: 4850,
  skipButtonDelay: 500,

  total: 5300,
} as const;

// Brand's existing 3-stop gradient (tailwind.config.ts `cyber-gradient`) —
// reused here so the neural core reads as the same system, not a new hue.
export const CORE_GRADIENT = ['#00d4ff', '#0066ff', '#7c3aed'] as const;

export const BULLISH = '#4ade80';
export const BEARISH = '#f87171';

export const VOID_COLOR = '#020510';

export const CANDLE_COUNT = 46;
export const CORE_RADIUS = 1.15;
export const DISPERSE_RADIUS = 2.3;
