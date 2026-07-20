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
import type { User } from '@/types';

export type ShellVariant = 'client' | 'coach';

export interface RedesignNavEntry {
  href: string;
  labelKey: keyof ReturnType<typeof useLang>['t'];
  icon: LucideIcon;
  exact?: boolean;
  roles?: Array<User['role']>;
}

/*
 * Role-aware nav, mirroring components/layouts/sidebar.tsx: entries are
 * tagged with `roles` and filtered against the logged-in user's real role.
 * An admin previewing either experience sees every entry for the section
 * they're currently in — Sidebar/BottomNav substitute `variant` for role
 * when user.role === 'admin', so the preview still works.
 */
export const REDESIGN_NAV: RedesignNavEntry[] = [
  { href: '/redesign/dashboard', labelKey: 'nav_accounts', icon: BarChart2, exact: true, roles: ['client'] },
  { href: '/redesign/dashboard/journal', labelKey: 'nav_journal', icon: BookOpen, roles: ['client'] },
  { href: '/redesign/dashboard/journal/analysis', labelKey: 'nav_journal_analysis', icon: TrendingUp, roles: ['client'] },
  { href: '/redesign/dashboard/settings/journal-permissions', labelKey: 'nav_coach_access', icon: Shield, roles: ['client'] },
  { href: '/redesign/coach/clients', labelKey: 'nav_my_clients', icon: Users, exact: true, roles: ['coach'] },
  { href: '/redesign/coach/events', labelKey: 'nav_coach_events', icon: Calendar, roles: ['coach'] },
  { href: '/redesign/coach/analytics', labelKey: 'nav_coach_analytics', icon: BarChart2, roles: ['coach'] },
  { href: '/redesign/coach/notifications', labelKey: 'nav_coach_notifications', icon: Bell, roles: ['coach'] },
  { href: '/redesign/coach/ai-report', labelKey: 'nav_coach_ai_report', icon: Sparkles, roles: ['coach'] },
  { href: '/redesign/coach/purchases', labelKey: 'nav_coach_purchases', icon: ShoppingBag, roles: ['coach'] },
  { href: '/redesign/dashboard/settings', labelKey: 'nav_settings', icon: Settings, exact: true },
  { href: '/redesign/dashboard/profile', labelKey: 'nav_profile', icon: UserCircle },
];

export const REDESIGN_BOTTOM_NAV: RedesignNavEntry[] = [
  { href: '/redesign/dashboard', labelKey: 'nav_accounts', icon: BarChart2, exact: true, roles: ['client'] },
  { href: '/redesign/dashboard/journal/analysis', labelKey: 'nav_analysis', icon: TrendingUp, roles: ['client'] },
  { href: '/redesign/dashboard/journal', labelKey: 'nav_journal', icon: BookOpen, roles: ['client'] },
  { href: '/redesign/coach/clients', labelKey: 'nav_my_clients', icon: Users, exact: true, roles: ['coach'] },
  { href: '/redesign/coach/analytics', labelKey: 'nav_coach_analytics', icon: BarChart2, roles: ['coach'] },
  { href: '/redesign/coach/notifications', labelKey: 'nav_coach_notifications', icon: Bell, roles: ['coach'] },
  { href: '/redesign/dashboard/settings', labelKey: 'nav_settings', icon: Settings },
  { href: '/redesign/dashboard/profile', labelKey: 'nav_profile', icon: UserCircle },
];
