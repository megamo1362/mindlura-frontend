export type Lang = 'en' | 'fa';

const COUNTRY_HEADERS = ['cf-ipcountry', 'x-vercel-ip-country', 'x-country-code'];

export function resolveCountry(getHeader: (name: string) => string | null): string {
  for (const name of COUNTRY_HEADERS) {
    const value = getHeader(name);
    if (value) return value;
  }
  return 'XX';
}
