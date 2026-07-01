import type { Metadata } from 'next';
import { LoginBackgroundClient } from '@/components/effects/login-bg-client';

export const metadata: Metadata = {
  title: 'Register | MINDLURA',
  description: 'Create your MINDLURA account',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden min-h-screen grid-bg flex items-center justify-center p-4">
      <LoginBackgroundClient />
      {children}
    </div>
  );
}
