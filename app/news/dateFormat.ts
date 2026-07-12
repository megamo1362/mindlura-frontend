import type { Lang } from '@/lib/useGeoLang';

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const FA_WEEKDAYS = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
const FA_MONTHS = ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'می', 'ژوئن', 'جولای', 'آگوست', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'];

/** Accepts a number or a zero-padded string (e.g. "06") and preserves the padding. */
export function toFaDigits(value: number | string): string {
  return String(value).split('').map((ch) => (ch >= '0' && ch <= '9' ? FA_DIGITS[Number(ch)] : ch)).join('');
}

/** Groups by calendar day in UTC — matches the "Time (UTC)" column so grouping stays consistent with what's displayed. */
export function dateKeyOf(datetimeUtc: string): string {
  return datetimeUtc.slice(0, 10);
}

export function formatDateHeader(dateKey: string, lang: Lang, isToday: boolean): string {
  if (isToday) return lang === 'fa' ? 'امروز' : 'Today';
  const d = new Date(`${dateKey}T00:00:00Z`);
  if (lang === 'fa') {
    return `${FA_WEEKDAYS[d.getUTCDay()]} ${toFaDigits(d.getUTCDate())} ${FA_MONTHS[d.getUTCMonth()]}`;
  }
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

/** Compact single-line datetime for card headers, e.g. "Fri July 18, 16:30 UTC". */
export function formatEventDateTime(datetimeUtc: string, lang: Lang): string {
  const d = new Date(datetimeUtc);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  if (lang === 'fa') {
    const weekday = FA_WEEKDAYS[d.getUTCDay()];
    const day = toFaDigits(d.getUTCDate());
    const month = FA_MONTHS[d.getUTCMonth()];
    return `${weekday} ${day} ${month}، ${toFaDigits(hh)}:${toFaDigits(mm)}`;
  }
  const weekdayShort = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
  const monthLong = d.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
  return `${weekdayShort} ${monthLong} ${d.getUTCDate()}, ${hh}:${mm} UTC`;
}
