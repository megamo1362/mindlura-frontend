'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import { Users, LayoutDashboard, UserCheck, KeyRound, CreditCard, BotMessageSquare, Bot, HelpCircle, LifeBuoy } from 'lucide-react';
import { NavItem } from './nav-item';
import { UserMenu } from './user-menu';
import { cn } from '@/lib/utils';
import { useLang } from '@/app/i18n/LangContext';
import type { User } from '@/types';

interface NavEntry {
  href: string;
  labelKey: keyof ReturnType<typeof useLang>['t'];
  icon: LucideIcon;
  exact?: boolean;
  roles?: Array<User['role']>;
}

const ADMIN_NAV: NavEntry[] = [
  { href: '/admin', labelKey: 'nav_admin_dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', labelKey: 'nav_admin_users', icon: Users },
  { href: '/admin/coaches', labelKey: 'nav_admin_coaches', icon: UserCheck },
  { href: '/admin/invite-codes', labelKey: 'nav_admin_invite_codes', icon: KeyRound },
  { href: '/admin/plans', labelKey: 'nav_admin_plans', icon: CreditCard },
  { href: '/admin/faq', labelKey: 'nav_admin_faq', icon: HelpCircle },
  { href: '/admin/support', labelKey: 'nav_admin_support', icon: LifeBuoy },
  { href: '/admin/ai-logs', labelKey: 'nav_admin_ai_logs', icon: BotMessageSquare },
  { href: '/admin/ea-tokens', labelKey: 'nav_admin_ea_tokens', icon: Bot },
];

interface SidebarProps {
  user: User;
  onNavClick?: () => void;
  className?: string;
}

export function Sidebar({ user, onNavClick, className }: SidebarProps) {
  const { t, isRTL } = useLang();
  const visibleItems = ADMIN_NAV.filter((item) =>
    !item.roles || item.roles.includes(user.role),
  );

  return (
    <aside
      className={cn(
        'flex flex-col h-full w-[280px] bg-[var(--color-deep)]',
        isRTL ? 'border-l border-[var(--color-border)]' : 'border-r border-[var(--color-border)]',
        className,
      )}
    >
      {/* Logo */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-[var(--color-border)]">
        <Link href="/admin" className="flex items-center gap-2 group">
          <Image src="/logo-dashboard-dark.png" alt="MINDLURA" width={140} height={42} className="h-14 w-auto object-contain dark:block hidden" priority />
          <Image src="/logo-dashboard-light.png" alt="MINDLURA" width={140} height={42} className="h-14 w-auto object-contain dark:hidden block" priority />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {visibleItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={t[item.labelKey] as string}
            icon={item.icon}
            exact={item.exact}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* User section */}
      <div className="flex-shrink-0 px-3 pb-4">
        <UserMenu user={user} />
      </div>
    </aside>
  );
}
