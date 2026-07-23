'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCurrentUser } from '@/components/layouts/auth-guard';
import { useLang } from '@/app/i18n/LangContext';
import { useUiStore } from '@/store/ui';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut';
import { useProfileCompletion } from '@/hooks/use-profile-completion';
import { Toaster } from '@/components/shared/toaster';
import { CommandPalette } from '@/components/shared/command-palette';
import { PageTransition } from '@/components/layouts/page-transition';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';
import { MobileDrawer } from './MobileDrawer';

interface ShellProps {
  children: React.ReactNode;
}

const UNLOCKED_WHEN_INCOMPLETE = ['/dashboard/profile', '/dashboard/settings'];

export function Shell({ children }: ShellProps) {
  const { user } = useCurrentUser();
  const { isRTL } = useLang();
  const openCommandPalette = useUiStore((s) => s.openCommandPalette);
  const { isComplete, isLoading } = useProfileCompletion();
  const pathname = usePathname();
  const router = useRouter();

  useKeyboardShortcut(['meta', 'k'], openCommandPalette, { ignoreInputs: false });
  useKeyboardShortcut(['ctrl', 'k'], openCommandPalette, { ignoreInputs: false });

  useEffect(() => {
    if (isLoading || isComplete) return;
    if (UNLOCKED_WHEN_INCOMPLETE.includes(pathname)) return;
    router.replace('/dashboard/profile');
  }, [isLoading, isComplete, pathname, router]);

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      <div className={`fixed inset-y-0 hidden w-[240px] lg:block ${isRTL ? 'right-0' : 'left-0'}`}>
        <Sidebar user={user} />
      </div>

      <MobileDrawer user={user} />

      <div className={`flex min-w-0 flex-1 flex-col ${isRTL ? 'lg:mr-[240px]' : 'lg:ml-[240px]'}`}>
        <Topbar user={user} />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-24 pt-5 md:px-6 lg:pb-6">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      <BottomNav user={user} />
      <CommandPalette />
      <Toaster />
    </div>
  );
}
