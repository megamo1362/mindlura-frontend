'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useUiStore } from '@/store/ui';
import { getInitials, cn } from '@/lib/utils';
import { useLang } from '@/app/i18n/LangContext';
import { NotificationPanel } from '@/components/layouts/notification-panel';
import { ThemeToggle } from '../theme/ThemeToggle';
import type { User } from '@/types';

interface TopbarProps {
  user: User;
  title?: string;
  className?: string;
}

export function Topbar({ user, title, className }: TopbarProps) {
  const { openMobileSidebar } = useUiStore();
  const { t } = useLang();
  const displayName = user.full_name || user.email;

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between gap-3 px-4 md:px-6',
        'border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/85 backdrop-blur-md',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={openMobileSidebar}
          aria-label={t.nav_settings}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title && <h2 className="truncate text-sm font-semibold text-[var(--text-primary)]">{title}</h2>}
      </div>

      <div className="flex flex-shrink-0 items-center gap-1.5">
        <ThemeToggle />
        <NotificationPanel role={user.role} />
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2.5 ps-2.5 ms-1 border-s border-[var(--border-subtle)] transition-opacity hover:opacity-80"
        >
          <div className="hidden text-end sm:block">
            <p className="text-sm font-medium leading-none text-[var(--text-primary)]">{displayName}</p>
          </div>
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
            {getInitials(displayName)}
          </div>
        </Link>
      </div>
    </header>
  );
}
