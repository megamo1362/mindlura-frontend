import WaitlistClient from '@/app/register/WaitlistClient';
import { getWaitlistCount } from '@/app/register/actions';

const MAX_SPOTS = 100;

export default async function FaRegisterPage() {
  const count = await getWaitlistCount();
  const spotsRemaining = Math.max(0, MAX_SPOTS - count);

  return <WaitlistClient spotsRemaining={spotsRemaining} count={count} initialLang="fa" initialCountry="IR" />;
}
