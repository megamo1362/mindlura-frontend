'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL, AUTH_TOKEN_KEY, ROUTES } from '@/lib/constants';
import { LoadingScreen } from '@/components/shared';
import type { User } from '@/types';

// ── Context ───────────────────────────────────────────────
interface AuthContextValue {
  user: User;
  token: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useCurrentUser(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useCurrentUser must be used inside AuthGuard');
  return ctx;
}

// ── Guard component ───────────────────────────────────────
interface AuthGuardProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function AuthGuard({ children, adminOnly = false }: AuthGuardProps) {
  const router = useRouter();
  const [authCtx, setAuthCtx] = useState<AuthContextValue | null>(null);

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem(AUTH_TOKEN_KEY)
        : null;

    if (!token) {
      router.replace(ROUTES.login);
      return;
    }

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((user: User) => {
        if (adminOnly && user.role !== 'admin') {
          router.replace(ROUTES.dashboard);
          return;
        }
        setAuthCtx({ user, token });
      })
      .catch(() => {
        if (typeof window !== 'undefined') localStorage.removeItem(AUTH_TOKEN_KEY);
        router.replace(ROUTES.login);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!authCtx) return <LoadingScreen />;

  return (
    <AuthContext.Provider value={authCtx}>
      {children}
    </AuthContext.Provider>
  );
}
