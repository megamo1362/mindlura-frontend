import { headers } from 'next/headers';
import { resolveCountry } from '@/lib/geo';
import RegisterClient from './RegisterClient';

export default async function RegisterPage() {
  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));
  const lang = country === 'IR' ? 'fa' : 'en';

  return <RegisterClient initialLang={lang} initialCountry={country} />;
}
