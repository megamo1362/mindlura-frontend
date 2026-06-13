'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from './use-local-storage';
import { AUTH_TOKEN_KEY, ROUTES } from '@/lib/constants';

export function useAuth() {
  const [token, setToken, removeToken] = useLocalStorage<string | null>(
    AUTH_TOKEN_KEY,
    null,
  );
  const router = useRouter();

  const login = useCallback(
    (newToken: string, role?: string) => {
      setToken(newToken);
      if (role === 'admin') {
        router.push(ROUTES.admin.root);
      } else {
        router.push(ROUTES.dashboard);
      }
    },
    [setToken, router],
  );

  const logout = useCallback(() => {
    removeToken();
    router.push(ROUTES.login);
  }, [removeToken, router]);

  return {
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };
}
