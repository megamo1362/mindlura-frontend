'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/components/layouts/auth-guard';
import { ROUTES } from '@/lib/constants';

export default function RedesignCoachRoot() {
  const { user } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    router.replace(user.role === 'client' ? ROUTES.redesignDashboard : ROUTES.redesignCoachClients);
  }, [user.role, router]);

  return null;
}
