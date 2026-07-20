'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/components/layouts/auth-guard';
import { ROUTES } from '@/lib/constants';
import { RedesignAccountsOverview } from '@/components/redesign/dashboard/RedesignAccountsOverview';

export default function RedesignDashboardPage() {
  const { user } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (user.role === 'coach') {
      router.replace(ROUTES.redesignCoachClients);
    }
  }, [user.role, router]);

  if (user.role === 'coach') return null;

  return <RedesignAccountsOverview />;
}
