'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { AUTH_TOKEN_KEY, ROUTES } from '@/lib/constants';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types';

export function useLogin() {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: LoginRequest) =>
      apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: data }),
    onSuccess: (data, variables) => {
      const storage = variables.remember_me ? localStorage : sessionStorage;
      storage.setItem(AUTH_TOKEN_KEY, data.access_token);
      if (data.role === 'admin') {
        router.push(ROUTES.admin.root);
      } else {
        router.push(ROUTES.dashboard);
      }
    },
  });
}

export function useRegister() {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: data }),
    onSuccess: (data) => {
      localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
      router.push(ROUTES.dashboard);
    },
  });
}
