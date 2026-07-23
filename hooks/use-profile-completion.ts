'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/constants';
import type { ProfileResponse } from '@/types';

const REQUIRED_PROFILE_FIELDS = ['first_name', 'last_name', 'date_of_birth', 'nationality', 'email'] as const;

export function isProfileComplete(profile: ProfileResponse | null | undefined): boolean {
  if (!profile) return false;
  if (!profile.is_email_verified) return false;
  return REQUIRED_PROFILE_FIELDS.every((field) => !!profile[field]);
}

export function useProfileCompletion() {
  const query = useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: () => apiFetch<ProfileResponse>('/profile/me'),
    staleTime: 60_000,
  });

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    isComplete: isProfileComplete(query.data),
  };
}
