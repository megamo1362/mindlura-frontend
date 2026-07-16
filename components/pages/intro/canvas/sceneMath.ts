import { BEARISH, BULLISH, CANDLE_COUNT, CORE_RADIUS, DISPERSE_RADIUS } from '../constants';
import type { CandleDatum } from '../types';

export function easeInOutCubic(t: number): number {
  const c = clamp01(t);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

export function easeOutCubic(t: number): number {
  const c = clamp01(t);
  return 1 - Math.pow(1 - c, 3);
}

export function easeOutBack(t: number): number {
  const c = clamp01(t);
  const k = 1.70158;
  return 1 + (k + 1) * Math.pow(c - 1, 3) + k * Math.pow(c - 1, 2);
}

export function clamp01(t: number): number {
  return Math.min(1, Math.max(0, t));
}

/** Maps elapsed ms to a 0..1 progress within [start, start+duration]. */
export function phaseProgress(elapsed: number, start: number, duration: number): number {
  return clamp01((elapsed - start) / duration);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerp3(
  out: [number, number, number],
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number
): void {
  out[0] = lerp(a[0], b[0], t);
  out[1] = lerp(a[1], b[1], t);
  out[2] = lerp(a[2], b[2], t);
}

// Even coverage over a sphere — reads as a deliberate, structured "data
// network," not a random blob. Golden-angle spacing avoids the pole
// clustering a naive lat/long grid would produce.
function fibonacciSpherePoint(i: number, total: number, radius: number): [number, number, number] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (i / (total - 1)) * 2;
  const radiusAtY = Math.sqrt(1 - y * y);
  const theta = goldenAngle * i;
  return [Math.cos(theta) * radiusAtY * radius, y * radius, Math.sin(theta) * radiusAtY * radius];
}

// Deterministic pseudo-random generator (mulberry32) — a fixed seed keeps
// the "random" data field identical on every mount rather than reshuffling
// on each replay, which reads as more intentional and avoids layout jumps
// if the component remounts (e.g. React StrictMode double-invoke in dev).
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

export function buildCandleData(): CandleDatum[] {
  const rand = mulberry32(20260716);
  const data: CandleDatum[] = [];

  for (let i = 0; i < CANDLE_COUNT; i++) {
    const start: [number, number, number] = [
      (rand() - 0.5) * 7.2,
      (rand() - 0.5) * 4.4,
      (rand() - 0.5) * 3.2,
    ];
    const core = fibonacciSpherePoint(i, CANDLE_COUNT, CORE_RADIUS);
    const disperseDir = Math.hypot(core[0], core[1], core[2]) || 1;
    const disperse: [number, number, number] = [
      (core[0] / disperseDir) * DISPERSE_RADIUS,
      (core[1] / disperseDir) * DISPERSE_RADIUS,
      (core[2] / disperseDir) * DISPERSE_RADIUS,
    ];

    data.push({
      start,
      core,
      disperse,
      bullish: rand() > 0.45,
      scale: 0.65 + rand() * 0.7,
    });
  }

  return data;
}

export function candleColor(bullish: boolean): string {
  return bullish ? BULLISH : BEARISH;
}

// Neighbor pairs on the target sphere (not the scattered start) so the
// "neural web" reads as a coherent structure once formed, and a sparser
// random subset for Phase 1's "thin connections" between loose data points.
export function buildCoreEdges(data: CandleDatum[], neighborsPerNode: number): [number, number][] {
  const edges: [number, number][] = [];
  const seen = new Set<string>();

  for (let i = 0; i < data.length; i++) {
    const distances: { j: number; d: number }[] = [];
    for (let j = 0; j < data.length; j++) {
      if (i === j) continue;
      const [ax, ay, az] = data[i].core;
      const [bx, by, bz] = data[j].core;
      distances.push({ j, d: Math.hypot(ax - bx, ay - by, az - bz) });
    }
    distances.sort((a, b) => a.d - b.d);
    for (const { j } of distances.slice(0, neighborsPerNode)) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
    }
  }

  return edges;
}

export function buildLooseEdges(count: number, dataLength: number): [number, number][] {
  const rand = mulberry32(7);
  const edges: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const a = Math.floor(rand() * dataLength);
    let b = Math.floor(rand() * dataLength);
    if (b === a) b = (b + 1) % dataLength;
    edges.push([a, b]);
  }
  return edges;
}
