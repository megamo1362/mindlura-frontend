'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { useLang } from '@/app/i18n/LangContext';
import { useTheme } from '../theme/RedesignThemeProvider';
import { AUTH_TOKEN_KEY, ROUTES } from '@/lib/constants';
import { CLIENT_NAV, COACH_NAV, type ShellVariant } from './nav-config';
import type { User } from '@/types';

interface SidebarProps {
  user: User;
  variant: ShellVariant;
  onNavClick?: () => void;
  className?: string;
}

export function Sidebar({ user, variant, onNavClick, className }: SidebarProps) {
  const { t } = useLang();
  const { theme } = useTheme();
  const pathname = usePathname();
  const items = variant === 'coach' ? COACH_NAV : CLIENT_NAV;
  const displayName = user.full_name || user.email;

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    window.location.href = ROUTES.login;
  };

  return (
    <aside
      className={cn(
        'flex h-full w-[240px] flex-col bg-[var(--bg-surface)]',
        'border-e border-[var(--border-subtle)]',
        className,
      )}
    >
      <div className="flex-shrink-0 border-b border-[var(--border-subtle)] px-5 py-4">
        <Link href={variant === 'coach' ? '/redesign/coach/clients' : '/redesign/dashboard'} className="flex items-center">
          <Image
            src={theme === 'dark' ? '/logo-dashboard-dark.png' : '/logo-dashboard-light.png'}
            alt="MINDLURA"
            width={130}
            height={38}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                'group relative flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                active
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)]',
              )}
            >
              {active && <span className="absolute inset-y-2 start-0 w-0.5 rounded-full bg-[var(--accent)]" />}
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{t[item.labelKey] as string}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex-shrink-0 space-y-3 border-t border-[var(--border-subtle)] p-3">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
            {getInitials(displayName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[var(--text-primary)]">{displayName}</p>
            <p className="truncate text-xs text-[var(--text-muted)]">{t.role_admin}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--text-muted)] transition-colors duration-150 hover:bg-[var(--loss-soft)] hover:text-[var(--loss)]"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span>{t.user_logout}</span>
        </button>
      </div>
    </aside>
  );
}
