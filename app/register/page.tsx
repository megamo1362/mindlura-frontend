import { headers } from 'next/headers';
import { resolveCountry } from '@/lib/geo';
import WaitlistClient from './WaitlistClient';
import { getWaitlistCount } from './actions';

const MAX_SPOTS = 100;

export default async function RegisterPage() {
  const count = await getWaitlistCount();
  const spotsRemaining = Math.max(0, MAX_SPOTS - count);

  const headersList = await headers();
  const country = resolveCountry((name) => headersList.get(name));

  return <WaitlistClient spotsRemaining={spotsRemaining} count={count} initialLang="en" initialCountry={country} />;
}
