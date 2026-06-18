import type { Metadata } from 'next';
import { ConnectCoachPage } from '@/components/coach';

export const metadata: Metadata = { title: 'Connect Coach | Zenvora' };

export default function ConnectCoachRoute() {
  return <ConnectCoachPage />;
}
