import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number | null | undefined,
  currency = 'USD',
): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatHours(hours: number | null | undefined): string {
  if (hours === null || hours === undefined) return '—';
  if (hours < 0.1) return 'Just now';
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  return `${Math.floor(hours)} h`;
}

export function formatDate(
  date: string | Date | null | undefined,
  locale = 'en-US',
): string {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleDateString(locale);
  } catch {
    return '—';
  }
}

export function formatDateTime(
  date: string | Date | null | undefined,
  locale = 'en-US',
): string {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleString(locale);
  } catch {
    return '—';
  }
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n) + '…' : str;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function isDemo(server: string): boolean {
  return server.toLowerCase().includes('demo');
}
