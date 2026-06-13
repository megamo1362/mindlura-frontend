import type { Metadata } from 'next';
import { LoginBackgroundClient } from '@/components/effects/login-bg-client';

export const metadata: Metadata = {
  title: 'ورود | IRFX',
  description: 'ورود به پلتفرم معاملاتی IRFX',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden min-h-screen grid-bg flex items-center justify-center p-4">
      <LoginBackgroundClient />
      {children}
    </div>
  );
}
