export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || '/api';

export const AUTH_TOKEN_KEY = 'token';

export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  analyze: (id: number | string) => `/dashboard/analyze/${id}`,
  connectCoach: '/dashboard/connect-coach',
  coachClients: '/dashboard/coach/clients',
  admin: {
    root: '/admin',
    users: '/admin/users',
    coaches: '/admin/coaches',
    plans: '/admin/plans',
    inviteCodes: '/admin/invite-codes',
  },
} as const;

export const PLAN_LABELS: Record<string, string> = {
  trial: 'Trial',
  basic: 'Basic',
  pro: 'Pro',
  elite: 'Elite',
};

export const PLAN_BADGE_CLASS: Record<string, string> = {
  trial: 'badge-yellow',
  basic: 'badge-blue',
  pro: 'badge-cyan',
  elite: 'badge-purple',
};

export const USER_ROLE_LABELS: Record<string, string> = {
  admin: 'ادمین',
  coach: 'کوچ',
  client: 'کلاینت',
};

export const DISPLAY_MODE_LABELS: Record<string, string> = {
  name: 'اسم',
  email: 'ایمیل',
  both: 'هر دو',
};

export const QUERY_KEYS = {
  accounts: ['accounts'] as const,
  analysis: (id: number | string) => ['analysis', id] as const,
  user: ['user'] as const,
  features: ['features'] as const,
  coaches: ['coaches'] as const,
  clients: ['clients'] as const,
  inviteCodes: ['invite-codes'] as const,
  adminStats: ['admin-stats'] as const,
  plans: ['plans'] as const,
} as const;

export const ANALYSIS_MODE_LABELS: Record<string, string> = {
  time_based: 'زمان‌بندی',
  trigger_based: 'تریگر معامله',
};
