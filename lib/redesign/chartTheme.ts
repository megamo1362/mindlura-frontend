import type { RedesignTheme } from '@/components/redesign/theme/RedesignThemeProvider';

export interface ChartTheme {
  profit: string;
  loss: string;
  accent: string;
  warning: string;
  gridLine: string;
  axisText: string;
  textMuted: string;
  textSecondary: string;
  surface: string;
  surface2: string;
}

/** Static fallback mirroring app/theme.css — used for SSR / before the DOM is available. */
const FALLBACK: Record<RedesignTheme, ChartTheme> = {
  dark: {
    profit: '#22c58b',
    loss: '#f4536e',
    accent: '#4f7cff',
    warning: '#f5a623',
    gridLine: '#232d3f',
    axisText: '#5a6478',
    textMuted: '#5a6478',
    textSecondary: '#8b96a8',
    surface: '#111827',
    surface2: '#1a2332',
  },
  light: {
    profit: '#0fa372',
    loss: '#e23a57',
    accent: '#3b63e0',
    warning: '#b8770a',
    gridLine: '#e2e8f0',
    axisText: '#8b96a8',
    textMuted: '#8b96a8',
    textSecondary: '#5a6478',
    surface: '#ffffff',
    surface2: '#eef2f7',
  },
};

const VAR_MAP: Record<keyof ChartTheme, string> = {
  profit: '--profit',
  loss: '--loss',
  accent: '--accent',
  warning: '--warning',
  gridLine: '--border-subtle',
  axisText: '--text-muted',
  textMuted: '--text-muted',
  textSecondary: '--text-secondary',
  surface: '--bg-surface',
  surface2: '--bg-surface-2',
};

/**
 * Reads live CSS custom property values from a themed DOM node (the
 * `.rd-shell` wrapper with `data-theme` set), falling back to the static
 * palette mirror when called before mount / outside the browser.
 */
export function getChartTheme(theme: RedesignTheme, scopeEl?: HTMLElement | null): ChartTheme {
  if (typeof window === 'undefined' || !scopeEl) return FALLBACK[theme];

  const computed = getComputedStyle(scopeEl);
  const result = {} as ChartTheme;
  for (const key of Object.keys(VAR_MAP) as (keyof ChartTheme)[]) {
    const value = computed.getPropertyValue(VAR_MAP[key]).trim();
    result[key] = value || FALLBACK[theme][key];
  }
  return result;
}

export function getStaticChartTheme(theme: RedesignTheme): ChartTheme {
  return FALLBACK[theme];
}
