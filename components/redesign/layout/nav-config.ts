import type { LucideIcon } from 'lucide-react';
import {
  BarChart2,
  BookOpen,
  TrendingUp,
  Shield,
  Settings,
  UserCircle,
  Users,
  Calendar,
  Bell,
  Sparkles,
  ShoppingBag,
  LifeBuoy,
} from 'lucide-react';
import type { useLang } from '@/app/i18n/LangContext';
import type { User } from '@/types';

export interface RedesignNavEntry {
  href: string;
  labelKey: keyof ReturnType<typeof useLang>['t'];
  icon: LucideIcon;
  exact?: boolean;
  roles?: Array<User['role']>;
}

export const DASHBOARD_NAV: RedesignNavEntry[] = [
  { href: '/dashboard', labelKey: 'nav_accounts', icon: BarChart2, exact: true },
  { href: '/dashboard/journal', labelKey: 'nav_journal', icon: BookOpen, roles: ['client'] },
  { href: '/dashboard/journal/analysis', labelKey: 'nav_journal_analysis', icon: TrendingUp, roles: ['client'] },
  { href: '/dashboard/settings/journal-permissions', labelKey: 'nav_coach_access', icon: Shield, roles: ['client'] },
  { href: '/dashboard/coach/clients', labelKey: 'nav_my_clients', icon: Users, roles: ['coach'] },
  { href: '/dashboard/coach/events', labelKey: 'nav_coach_events', icon: Calendar, roles: ['coach'] },
  { href: '/dashboard/coach/analytics', labelKey: 'nav_coach_analytics', icon: BarChart2, roles: ['coach'] },
  { href: '/dashboard/coach/notifications', labelKey: 'nav_coach_notifications', icon: Bell, roles: ['coach'] },
  { href: '/dashboard/coach/ai-report', labelKey: 'nav_coach_ai_report', icon: Sparkles, roles: ['coach'] },
  { href: '/dashboard/coach/purchases', labelKey: 'nav_coach_purchases', icon: ShoppingBag, roles: ['coach'] },
  { href: '/dashboard/settings', labelKey: 'nav_settings', icon: Settings, exact: true },
  { href: '/dashboard/support', labelKey: 'nav_support', icon: LifeBuoy },
  { href: '/dashboard/profile', labelKey: 'nav_profile', icon: UserCircle },
];

export const BOTTOM_NAV: RedesignNavEntry[] = [
  { href: '/dashboard', labelKey: 'nav_accounts', icon: BarChart2, exact: true, roles: ['client'] },
  { href: '/dashboard/journal/analysis', labelKey: 'nav_analysis', icon: TrendingUp, roles: ['client'] },
  { href: '/dashboard/journal', labelKey: 'nav_journal', icon: BookOpen, roles: ['client'] },
  { href: '/dashboard/coach/clients', labelKey: 'nav_my_clients', icon: Users, exact: true, roles: ['coach'] },
  { href: '/dashboard/coach/analytics', labelKey: 'nav_coach_analytics', icon: BarChart2, roles: ['coach'] },
  { href: '/dashboard/coach/notifications', labelKey: 'nav_coach_notifications', icon: Bell, roles: ['coach'] },
  { href: '/dashboard/settings', labelKey: 'nav_settings', icon: Settings },
  { href: '/dashboard/profile', labelKey: 'nav_profile', icon: UserCircle },
];

export function filterNavByRole(items: RedesignNavEntry[], role: User['role']): RedesignNavEntry[] {
  return items.filter((item) => !item.roles || item.roles.includes(role));
}
