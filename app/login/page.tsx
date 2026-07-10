import { headers } from 'next/headers';
import { resolveCountry } from '@/lib/geo';
import LoginClient from './LoginClient';

export default async function LoginPage() {
  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));
  const lang = country === 'IR' ? 'fa' : 'en';

  return <LoginClient initialLang={lang} initialCountry={country} />;
}
