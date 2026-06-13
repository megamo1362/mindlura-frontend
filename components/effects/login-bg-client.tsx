'use client';

import dynamic from 'next/dynamic';

const LoginBackground = dynamic(
  () => import('./login-bg').then((m) => m.LoginBackground),
  { ssr: false },
);

export function LoginBackgroundClient() {
  return <LoginBackground />;
}
