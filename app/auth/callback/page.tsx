'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AUTH_TOKEN_KEY, ROUTES } from '@/lib/constants';
import { LoadingScreen } from '@/components/shared';

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');

    if (!token) {
      router.replace(`${ROUTES.login}?auth_error=google_failed`);
      return;
    }

    // Google sign-in has no "remember me" step — store the same way
    // useRegister() does (localStorage), then follow the same role-based
    // redirect used by useLogin()/useRegister().
    localStorage.setItem(AUTH_TOKEN_KEY, token);

    if (role === 'admin') {
      router.replace(ROUTES.admin.root);
    } else if (role === 'coach') {
      router.replace(ROUTES.coachClients);
    } else {
      router.replace(ROUTES.dashboard);
    }
  }, [router, searchParams]);

  return <LoadingScreen />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthCallbackHandler />
    </Suspense>
  );
}
