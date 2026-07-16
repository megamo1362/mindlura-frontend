'use client';

import { useCurrentUser } from '@/components/layouts/auth-guard';
import { useLang } from '@/app/i18n/LangContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';
import { MobileDrawer } from './MobileDrawer';
import type { ShellVariant } from './nav-config';

interface ShellProps {
  variant: ShellVariant;
  children: React.ReactNode;
}

export function Shell({ variant, children }: ShellProps) {
  const { user } = useCurrentUser();
  const { isRTL } = useLang();

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      <div className={`fixed inset-y-0 hidden w-[240px] lg:block ${isRTL ? 'end-0' : 'start-0'}`}>
        <Sidebar user={user} variant={variant} />
      </div>

      <MobileDrawer user={user} variant={variant} />

      <div className={`flex min-w-0 flex-1 flex-col ${isRTL ? 'lg:me-[240px]' : 'lg:ms-[240px]'}`}>
        <Topbar user={user} variant={variant} />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-24 pt-5 md:px-6 lg:pb-6">{children}</main>
      </div>

      <BottomNav variant={variant} />
    </div>
  );
}
