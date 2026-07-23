export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || '/api';

export const AUTH_TOKEN_KEY = 'token';

export const REMEMBER_ME_DAYS = 30;
export const DEFAULT_SESSION_DAYS = 1;

export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  analyze: (id: number | string) => `/dashboard/analyze/${id}`,
  connectCoach: '/dashboard/connect-coach',
  coachClients: '/dashboard/coach/clients',
  coachClientJournal: (clientId: number | string) => `/dashboard/coach/clients/${clientId}/journal`,
  coachEvents: '/dashboard/coach/events',
  coachAnalytics: '/dashboard/coach/analytics',
  coachNotifications: '/dashboard/coach/notifications',
  coachAIReport: '/dashboard/coach/ai-report',
  coachPurchases: '/dashboard/coach/purchases',
  billing: '/dashboard/billing',
  support: '/dashboard/support',
  supportTicket: (id: number | string) => `/dashboard/support/${id}`,
  admin: {
    root: '/admin',
    users: '/admin/users',
    coaches: '/admin/coaches',
    plans: '/admin/plans',
    inviteCodes: '/admin/invite-codes',
    support: '/admin/support',
    supportTicket: (id: number | string) => `/admin/support/${id}`,
    transactions: '/admin/transactions',
    finance: '/admin/finance',
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
  admin: 'Admin',
  coach: 'Coach',
  client: 'Client',
};

export const DISPLAY_MODE_LABELS: Record<string, string> = {
  name: 'Name',
  email: 'Email',
  both: 'Both',
};

export const QUERY_KEYS = {
  accounts: ['accounts'] as const,
  profile: ['profile'] as const,
  analysis: (id: number | string) => ['analysis', id] as const,
  user: ['user'] as const,
  features: ['features'] as const,
  coaches: ['coaches'] as const,
  clients: ['clients'] as const,
  inviteCodes: ['invite-codes'] as const,
  coachEvents: ['coach-events'] as const,
  coachRosterAnalytics: ['coach-roster-analytics'] as const,
  coachNotifications: ['coach-notifications'] as const,
  myCoachNotifications: ['my-coach-notifications'] as const,
  coachAIReportStatus: ['coach-ai-report-status'] as const,
  coachAIReportLatest: ['coach-ai-report-latest'] as const,
  coachPurchases: ['coach-purchases'] as const,
  coachClientAccounts: (clientId: number | string) => ['coach-client-accounts', clientId] as const,
  coachClientJournalAnalysis: (clientId: number | string, accountId: number | string) =>
    ['coach-client-journal-analysis', clientId, accountId] as const,
  adminStats: ['admin-stats'] as const,
  plans: ['plans'] as const,
  supportTickets: ['support-tickets'] as const,
  supportTicket: (id: number | string) => ['support-ticket', id] as const,
  paymentPlans: ['payment-plans'] as const,
  walletAddresses: ['admin-wallet-addresses'] as const,
  adminTransactions: ['admin-transactions'] as const,
  financeSummary: ['finance-summary'] as const,
  financePayments: ['finance-payments'] as const,
  coachPayouts: ['coach-payouts'] as const,
  coachPayoutBreakdown: (coachId: number) => ['coach-payout-breakdown', coachId] as const,
} as const;

export const ANALYSIS_MODE_LABELS: Record<string, string> = {
  time_based: 'Time-based',
  trigger_based: 'Trade Trigger',
};
