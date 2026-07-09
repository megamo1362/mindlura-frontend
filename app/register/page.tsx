import { headers } from 'next/headers';
import WaitlistClient from './WaitlistClient';
import { getWaitlistCount } from './actions';

const MAX_SPOTS = 100;

export default async function RegisterPage() {
  const headersList = await headers();
  const acceptLang = headersList.get('accept-language') ?? '';
  const faFirst = /^fa\b/i.test(acceptLang);
  const count = await getWaitlistCount();
  const spotsRemaining = Math.max(0, MAX_SPOTS - count);

  return <WaitlistClient faFirst={faFirst} spotsRemaining={spotsRemaining} count={count} />;
}
