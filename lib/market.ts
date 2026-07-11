export type Trend = 'bullish' | 'bearish' | 'neutral';

export type Timeframe = 'M1' | 'M5' | 'M15' | 'H1' | 'H4' | 'D1';

export const TIMEFRAMES: Timeframe[] = ['M1', 'M5', 'M15', 'H1', 'H4', 'D1'];

/** Timeframe used for the header trend badge, strength bars, and default gauges. */
export const PRIMARY_TIMEFRAME: Timeframe = 'H1';

export interface TimeframeData {
  buyer_strength?: number | null;
  seller_strength?: number | null;
  trend?: string | null;
  RSI?: number | null;
  EMA?: number | null;
  EMA20?: number | null;
  EMA50?: number | null;
  MACD?: number | null;
}

export interface MarketDataResponse {
  symbol: string;
  timeframes: Partial<Record<Timeframe, TimeframeData>>;
  updated_at?: string;
}

export type SymbolCategory = 'forex' | 'metal' | 'crypto';

export interface SymbolConfig {
  symbol: string;
  category: SymbolCategory;
  decimals: number;
}

export const MARKET_SYMBOLS: SymbolConfig[] = [
  { symbol: 'EURUSD', category: 'forex', decimals: 5 },
  { symbol: 'GBPUSD', category: 'forex', decimals: 5 },
  { symbol: 'USDJPY', category: 'forex', decimals: 3 },
  { symbol: 'USDCAD', category: 'forex', decimals: 5 },
  { symbol: 'XAUUSD', category: 'metal', decimals: 2 },
  { symbol: 'BTCUSD', category: 'crypto', decimals: 2 },
  { symbol: 'ETHUSD', category: 'crypto', decimals: 2 },
];

export function getSymbolConfig(symbol: string): SymbolConfig | undefined {
  const upper = symbol.toUpperCase();
  return MARKET_SYMBOLS.find((s) => s.symbol === upper);
}

export function isValidSymbol(symbol: string): boolean {
  return getSymbolConfig(symbol) !== undefined;
}

export function normalizeTrend(trend?: string | null): Trend {
  if (trend === 'bullish' || trend === 'bearish') return trend;
  return 'neutral';
}

export function formatPrice(value: number | null | undefined, decimals: number): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return value.toFixed(decimals);
}

export function formatPct(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

/** Deviation of the fast EMA from the slow EMA — a trend-strength %, not a real price change. */
export function computeEmaDeviationPct(ema20?: number | null, ema50?: number | null): number | null {
  if (ema20 === null || ema20 === undefined || ema50 === null || ema50 === undefined || ema50 === 0) return null;
  return ((ema20 - ema50) / ema50) * 100;
}

/** Server-only: base URL for direct (non-proxied) fetches to the Python backend. */
export function getBackendBaseUrl(): string {
  return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
}

export async function fetchMarketData(symbol: string): Promise<MarketDataResponse | null> {
  try {
    const res = await fetch(`${getBackendBaseUrl()}/api/market-data/${symbol.toUpperCase()}/`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as MarketDataResponse;
  } catch {
    return null;
  }
}

interface SessionWindow {
  name: 'sydney' | 'tokyo' | 'london' | 'newyork';
  startHour: number;
  endHour: number;
}

/** Standard forex session hours in UTC. Sydney wraps midnight. */
const SESSION_WINDOWS: SessionWindow[] = [
  { name: 'sydney', startHour: 22, endHour: 7 },
  { name: 'tokyo', startHour: 0, endHour: 9 },
  { name: 'london', startHour: 8, endHour: 17 },
  { name: 'newyork', startHour: 13, endHour: 22 },
];

export function getActiveSessions(date: Date = new Date()): SessionWindow['name'][] {
  const hour = date.getUTCHours();
  return SESSION_WINDOWS.filter((s) =>
    s.startHour < s.endHour ? hour >= s.startHour && hour < s.endHour : hour >= s.startHour || hour < s.endHour
  ).map((s) => s.name);
}

/** Forex/metal trade Sun 22:00 UTC → Fri 22:00 UTC. Crypto trades 24/7. */
export function isForexMarketOpen(date: Date = new Date()): boolean {
  const day = date.getUTCDay();
  const hour = date.getUTCHours();
  if (day === 6) return false;
  if (day === 0 && hour < 22) return false;
  if (day === 5 && hour >= 22) return false;
  return true;
}
