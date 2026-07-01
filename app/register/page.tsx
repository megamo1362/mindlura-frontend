import { headers } from 'next/headers';
import WaitlistClient from './WaitlistClient';

export default async function RegisterPage() {
  const headersList = await headers();
  const acceptLang = headersList.get('accept-language') ?? '';
  // Show Persian first if fa is the highest-priority language
  const faFirst = /^fa\b/i.test(acceptLang);

  return <WaitlistClient faFirst={faFirst} />;
}
