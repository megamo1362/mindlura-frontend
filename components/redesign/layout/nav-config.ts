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
} from 'lucide-react';
import type { useLang } from '@/app/i18n/LangContext';

export type ShellVariant = 'client' | 'coach';

export interface RedesignNavEntry {
  href: string;
  labelKey: keyof ReturnType<typeof useLang>['t'];
  icon: LucideIcon;
  exact?: boolean;
}

/*
 * Preview-only note: unlike the live Sidebar/BottomNav (components/layouts/),
 * which filter nav items by the logged-in user's real `role`, these lists are
 * keyed by `variant` because every /redesign visitor is an admin (see the
 * admin-only AuthGuard in app/redesign/*\/layout.tsx) previewing either the
 * client or coach experience. At go-live, when these pages move to their
 * live routes, swap back to role-based filtering like the current
 * components/layouts/sidebar.tsx does.
 */
export const CLIENT_NAV: RedesignNavEntry[] = [
  { href: '/redesign/dashboard', labelKey: 'nav_accounts', icon: BarChart2, exact: true },
  { href: '/redesign/dashboard/journal', labelKey: 'nav_journal', icon: BookOpen },
  { href: '/redesign/dashboard/journal/analysis', labelKey: 'nav_journal_analysis', icon: TrendingUp },
  { href: '/redesign/dashboard/settings/journal-permissions', labelKey: 'nav_coach_access', icon: Shield },
  { href: '/redesign/dashboard/settings', labelKey: 'nav_settings', icon: Settings, exact: true },
  { href: '/redesign/dashboard/profile', labelKey: 'nav_profile', icon: UserCircle },
];

export const COACH_NAV: RedesignNavEntry[] = [
  { href: '/redesign/coach/clients', labelKey: 'nav_my_clients', icon: Users, exact: true },
  { href: '/redesign/coach/events', labelKey: 'nav_coach_events', icon: Calendar },
  { href: '/redesign/coach/analytics', labelKey: 'nav_coach_analytics', icon: BarChart2 },
  { href: '/redesign/coach/notifications', labelKey: 'nav_coach_notifications', icon: Bell },
  { href: '/redesign/coach/ai-report', labelKey: 'nav_coach_ai_report', icon: Sparkles },
  { href: '/redesign/coach/purchases', labelKey: 'nav_coach_purchases', icon: ShoppingBag },
  { href: '/redesign/dashboard/settings', labelKey: 'nav_settings', icon: Settings, exact: true },
  { href: '/redesign/dashboard/profile', labelKey: 'nav_profile', icon: UserCircle },
];

export const BOTTOM_NAV: Record<ShellVariant, RedesignNavEntry[]> = {
  client: [
    { href: '/redesign/dashboard', labelKey: 'nav_accounts', icon: BarChart2, exact: true },
    { href: '/redesign/dashboard/journal/analysis', labelKey: 'nav_analysis', icon: TrendingUp },
    { href: '/redesign/dashboard/journal', labelKey: 'nav_journal', icon: BookOpen },
    { href: '/redesign/dashboard/settings', labelKey: 'nav_settings', icon: Settings },
    { href: '/redesign/dashboard/profile', labelKey: 'nav_profile', icon: UserCircle },
  ],
  coach: [
    { href: '/redesign/coach/clients', labelKey: 'nav_my_clients', icon: Users, exact: true },
    { href: '/redesign/coach/analytics', labelKey: 'nav_coach_analytics', icon: BarChart2 },
    { href: '/redesign/coach/notifications', labelKey: 'nav_coach_notifications', icon: Bell },
    { href: '/redesign/dashboard/settings', labelKey: 'nav_settings', icon: Settings },
    { href: '/redesign/dashboard/profile', labelKey: 'nav_profile', icon: UserCircle },
  ],
};
