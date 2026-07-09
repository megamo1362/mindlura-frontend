import WaitlistClient from './WaitlistClient';
import { getWaitlistCount } from './actions';

const MAX_SPOTS = 100;

export default async function RegisterPage() {
  const count = await getWaitlistCount();
  const spotsRemaining = Math.max(0, MAX_SPOTS - count);

  return <WaitlistClient spotsRemaining={spotsRemaining} count={count} />;
}
