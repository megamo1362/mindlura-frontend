'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/app/i18n/LangContext';
import { BOTTOM_NAV, filterNavByRole } from './nav-config';
import type { User } from '@/types';

interface BottomNavProps {
  user: User;
}

export function BottomNav({ user }: BottomNavProps) {
  const pathname = usePathname();
  const { t } = useLang();
  const items = filterNavByRole(BOTTOM_NAV, user.role);

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
