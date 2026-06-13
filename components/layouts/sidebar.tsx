'use client';

'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { BarChart2, Users, UserPlus, LayoutDashboard, UserCheck, KeyRound, CreditCard } from 'lucide-react';
import { NavItem } from './nav-item';
import { UserMenu } from './user-menu';
import { cn } from '@/lib/utils';
import type { User } from '@/types';

// ── Nav configs ───────────────────────────────────────────────────────

interface NavEntry {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  roles?: Array<User['role']>;
}

const DASHBOARD_NAV: NavEntry[] = [
  { href: '/dashboard', label: 'حساب‌ها', icon: BarChart2, exact: true },
  { href: '/dashboard/coach/clients', label: 'کلاینت‌های من', icon: Users, roles: ['coach'] },
  { href: '/dashboard/connect-coach', label: 'اتصال به کوچ', icon: UserPlus, roles: ['client'] },
];

const ADMIN_NAV: NavEntry[] = [
  { href: '/admin', label: 'داشبورد', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'کاربران', icon: Users },
  { href: '/admin/coaches', label: 'کوچ‌ها', icon: UserCheck },
  { href: '/admin/invite-codes', label: 'کدهای دعوت', icon: KeyRound },
  { href: '/admin/plans', label: 'پلن‌ها', icon: CreditCard },
];

// ── Sidebar ───────────────────────────────────────────────────────────

interface SidebarProps {
  user: User;
  variant?: 'dashboard' | 'admin';
  onNavClick?: () => void;
  className?: string;
}

export function Sidebar({ user, variant = 'dashboard', onNavClick, className }: SidebarProps) {
  const navItems = variant === 'admin' ? ADMIN_NAV : DASHBOARD_NAV;
  const visibleItems = navItems.filter((item) =>
    !item.roles || item.roles.includes(user.role),
  );

  return (
    <aside
      className={cn(
        'flex flex-col h-full w-[280px] bg-[var(--color-deep)] border-l border-[var(--color-border)]',
        className,
      )}
    >
      {/* Logo */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-[var(--color-border)]">
        <Link href={variant === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-3 group">
          <div className="relative flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-cyan)] to-[var(--color-blue)] flex items-center justify-center shadow-[var(--shadow-glow-cyan)]">
            <span className="text-sm font-black text-[var(--color-void)]">IR</span>
          </div>
          <div>
            <p className="text-base font-black neon-text tracking-widest leading-none">IRFX</p>
            <p className="text-[10px] text-[var(--color-text-muted)] tracking-wider mt-0.5">
              Trading Psychology
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {visibleItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
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
