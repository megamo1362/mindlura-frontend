import { headers } from 'next/headers';
import { resolveCountry } from '@/lib/geo';
import HomeClient from './HomeClient';

export default async function Home() {
  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));

  return <HomeClient initialLang="en" initialCountry={country} />;
}
