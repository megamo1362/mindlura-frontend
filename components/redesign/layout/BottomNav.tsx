'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/app/i18n/LangContext';
import { useCurrentUser } from '@/components/layouts/auth-guard';
import { REDESIGN_BOTTOM_NAV, type ShellVariant } from './nav-config';

interface BottomNavProps {
  variant: ShellVariant;
}

export function BottomNav({ variant }: BottomNavProps) {
  const pathname = usePathname();
  const { t } = useLang();
  const { user } = useCurrentUser();
  // Admins preview by section (`variant`); everyone else is filtered by their real role.
  const effectiveRole = user.role === 'admin' ? variant : user.role;
  const items = REDESIGN_BOTTOM_NAV.filter((item) => !item.roles || item.roles.includes(effectiveRole));

  const matches = items.filter((item) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname?.startsWith(item.href + '/'),
  );
  const activeHref = matches.sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="absolute inset-0 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md" />
      <div className="relative flex h-16 items-center justify-around">
        {items.map((item) => {
          const active = activeHref === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors duration-150 ${
                active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] transition-colors duration-150 ${
                  active ? 'bg-[var(--accent-soft)]' : ''
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium leading-none">{t[item.labelKey] as string}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
