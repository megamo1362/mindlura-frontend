// ── Auth & User ────────────────────────────────────────────
export type UserRole = 'admin' | 'coach' | 'client';

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  is_super_admin: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  email: string;
  full_name: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
  invite_code: string;
}

// ── MT5 Accounts ───────────────────────────────────────────
export interface MT5Account {
  id: number;
  login: string;
  server: string;
  label: string | null;
  is_active: boolean;
  last_sync_at: string | null;
  balance: number | null;
}

export interface OpenPosition {
  ticket: number;
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  open_price: number;
  current_price: number;
  profit: number;
  swap: number;
  open_time: string;
  sl?: number;
  tp?: number;
  spread_pips_open?: number | null;
  spread_cost?: number | null;
  mae?: number | null;
  mfe?: number | null;
}

export interface Trade {
  ticket: number;
  symbol: string;
  type: number;
  volume: number;
  open_price?: number | null;
  price: number;
  profit: number;
  commission?: number;
  swap?: number;
  spread_cost?: number;
  spread_pips_open?: number | null;
  spread_pips_close?: number | null;
  spread_pips_total?: number | null;
  time: string;
  open_time?: string | null;
  close_time?: string | null;
  comment: string;
  close_reason?: number | null;
  sl?: number;
  tp?: number;
  sl_modified?: boolean;
  tp_modified?: boolean;
  sl_history?: number[];
  tp_history?: number[];
  mae?: number | null;
  mfe?: number | null;
}

// ── Analysis ───────────────────────────────────────────────
export interface AnalysisSummary {
  total_trades: number;
  wins: number;
  losses: number;
  winrate: number;
  avg_win: number;
  avg_loss: number;
  risk_reward: number;
  total_profit: number;
  max_drawdown: number;
  max_drawdown_pct: number;
  max_drawdown_equity: number;
  max_drawdown_equity_pct: number;
  max_consecutive_losses: number;
  max_consecutive_wins: number;
  max_daily_trades: number;
  best_trade:  { symbol: string; profit: number };
  worst_trade: { symbol: string; profit: number };
  best_day:    { date: string; profit: number } | null;
  worst_day:   { date: string; profit: number } | null;
}

export interface AnalysisWarning {
  type: string;
  level: 'danger' | 'warning' | 'info';
  message: string;
}

export interface EquityCurvePoint {
  time: string;
  equity: number;
  floating_pnl: number;
  realized_pnl: number;
}

export interface TimeAnalysisPoint {
  hour: number;
  trades: number;
  wins: number;
  losses: number;
  winrate: number;
  profit: number;
}

export interface SymbolAnalysisPoint {
  symbol: string;
  trades: number;
  wins: number;
  losses: number;
  winrate: number;
  profit: number;
}

export interface Analysis {
  has_data: boolean;
  message?: string;
  summary?: AnalysisSummary;
  equity_curve: Array<{ time: string; equity: number; symbol: string; profit: number }>;
  equity_curve_realtime: EquityCurvePoint[];
  time_analysis: TimeAnalysisPoint[];
  symbol_analysis: SymbolAnalysisPoint[];
  mae_analysis: {
    avg_mae: number;
    avg_mfe: number;
    risky_trades_count: number;
    early_close_count: number;
  } | null;
  hold_time_analysis: {
    avg_win_minutes: number | null;
    avg_loss_minutes: number | null;
  } | null;
  open_positions_count: number;
  floating_pnl: number;
  warnings: AnalysisWarning[];
  psychology_score?: {
    overall: number;
    grade: { en: string; fa: string };
    scores: Record<string, number>;
    deductions?: Array<{
      signal: string;
      points: number;
      count: number;
      label: { en: string; fa: string };
    }>;
    insights: Array<{
      type: string;
      severity: 'high' | 'medium' | 'low';
      message: { en: string; fa: string };
    }>;
    weights?: Record<string, number>;
  };
  session_analysis?: {
    sessions: Array<{
      session: string;
      label: { en: string; fa: string };
      trades: number;
      wins: number;
      losses: number;
      winrate: number;
      profit: number;
      avg_profit: number;
    }>;
    best_session: { session: string; label: { en: string; fa: string }; profit: number; winrate: number } | null;
    worst_session: { session: string; label: { en: string; fa: string }; profit: number; winrate: number } | null;
  };
  pareto_analysis?: {
    profit_pareto: {
      top_trades_count: number;
      top_trades_pct_of_total: number;
      top_trades_profit: number;
      total_profit: number;
    };
    loss_pareto: {
      top_trades_count: number;
      top_trades_pct_of_total: number;
      top_trades_loss: number;
      total_loss: number;
    };
    symbol_profit_share: Array<{ symbol: string; profit: number; share_pct: number }>;
    symbol_loss_share: Array<{ symbol: string; loss: number; share_pct: number }>;
  };
  entry_exit_quality?: {
    avg_entry_quality: number | null;
    avg_exit_quality: number | null;
    early_exit_count: number;
    late_exit_loss_count: number;
    sample_size: number;
    insight: { en: string; fa: string };
  } | null;
  cost_analysis?: {
    total_commission: number;
    total_swap: number;
    total_spread: number;
    total_costs: number;
    gross_profit: number;
    cost_impact_pct: number;
    symbol_costs: Array<{ symbol: string; total_cost: number }>;
    most_expensive_symbol: { symbol: string; total_cost: number } | null;
  };
  sl_tp_analysis?: {
    no_sl_count: number;
    no_tp_count: number;
    sl_modified_count: number;
    tp_modified_count: number;
    sl_widened_loss_count: number;
    no_sl_pct: number;
    no_tp_pct: number;
  };
  trading_style?: {
    style: string;
    style_label: { en: string; fa: string };
    avg_hold_minutes: number;
    avg_hold_time_display?: string;
    total_positions?: number;
    post_loss_streak_behavior: { sample_count: number; winrate: number; avg_profit: number } | null;
    post_win_streak_behavior: { sample_count: number; winrate: number; avg_profit: number } | null;
    insight: { en: string; fa: string };
  };
}

export interface SnapshotResponse {
  analysis_triggered?: boolean;
  has_snapshot: boolean;
  status?: string;
  message?: string;
  snapshot_time?: string;
  next_update_time?: string;
  hours_since_update?: number;
  hours_until_next?: number;
  balance?: number | null;
  equity?: number | null;
  analysis?: Analysis | null;
  open_positions?: OpenPosition[];
  trades?: Trade[];
}

// ── Plans & Subscriptions ──────────────────────────────────
export type PlanSlug = 'trial' | 'basic' | 'pro' | 'elite';

export interface Plan {
  id: number;
  name: string;
  slug: PlanSlug;
  price_usd: number;
  price_usd_ir?: number | null;
  coach_price_usd?: number | null;
  coach_price_usd_ir?: number | null;
  duration_days: number;
  max_mt5_accounts: number;
  is_active: boolean;
  analysis_mode?: string;
  analysis_interval_hours?: number | null;
  ai_monthly_limit?: number | null;
}

// ── Public pricing (GET /plans/pricing) ─────────────────────
export interface PricingFeature {
  key: string;
  label_en: string;
  label_fa: string;
}

export interface PricingPlan {
  id: number;
  name: string;
  slug: PlanSlug;
  description: string | null;
  price_usd: number;
  price_usd_ir: number;
  coach_price_usd: number;
  coach_price_usd_ir: number | null;
  duration_days: number;
  features: PricingFeature[];
  discounts: Record<string, number>;
}

// ── Coaching ───────────────────────────────────────────────
export type DisplayMode = 'name' | 'email' | 'both';

export interface AccountPermissions {
  account_id: number;
  allow_balance: boolean;
  allow_trades: boolean;
  allow_analysis: boolean;
  allow_journal: boolean;
}

export interface CoachClientAccount {
  id: number;
  login: string;
  server: string;
  is_demo: boolean;
  has_snapshot: boolean;
  balance: number | null;
  equity: number | null;
  profit: number | null;
  max_drawdown: number | null;
  hours_since_update: number | null;
  hours_until_next: number | null;
  allow_balance: boolean;
  allow_trades: boolean;
  allow_analysis: boolean;
  allow_journal: boolean;
}

export type JoinedVia = 'referral_link' | 'event_code' | 'invite_code' | 'manual';

export interface CoachClient {
  client_coach_id: number;
  client_id: number;
  client_email: string;
  client_full_name: string | null;
  display_mode: DisplayMode;
  display_label: string | null;
  plan_name: string | null;
  plan_slug: string | null;
  connected_since: string | null;
  accounts: CoachClientAccount[];
  joined_via: JoinedVia | null;
  event_id: number | null;
  event_name: string | null;
  profit: number | null;
  drawdown: number | null;
  win_rate: number | null;
  rr_ratio: number | null;
  trade_count: number | null;
}

// ── Coach Roster Analytics ──────────────────────────────────
export interface RosterPerformer {
  client_id: number;
  full_name: string;
  profit: number | null;
  win_rate: number | null;
  drawdown: number | null;
}

export interface RosterEventBreakdown {
  event_id: number;
  event_name: string;
  client_count: number;
  avg_profit: number | null;
  avg_win_rate: number | null;
}

export interface RosterAnalytics {
  total_clients: number;
  active_clients: number;
  total_accounts: number;
  avg_profit: number | null;
  avg_drawdown: number | null;
  avg_win_rate: number | null;
  avg_rr_ratio: number | null;
  avg_trade_count: number | null;
  top_performers: RosterPerformer[];
  needs_attention: RosterPerformer[];
  by_event: RosterEventBreakdown[];
}

// ── Coach Events ───────────────────────────────────────────
export interface CoachEvent {
  id: number;
  name: string;
  description: string | null;
  event_code: string;
  is_active: boolean;
  client_count: number;
  created_at: string;
}

// ── Coach AI Report ──────────────────────────────────────────
export interface CoachAIReportFilters {
  max_drawdown?: number | null;
  min_rr_ratio?: number | null;
  min_win_rate?: number | null;
  event_id?: number | null;
  include_inactive?: boolean;
}

export interface CoachAIReportResponse {
  report_en: string;
  report_fa: string;
  generated_at: string;
  client_count: number;
  can_request_again_at: string;
}

export interface CoachAIReportLatest {
  report_en: string;
  report_fa: string;
  generated_at: string | null;
  filters: CoachAIReportFilters | null;
}

export interface CoachAIReportStatus {
  can_request: boolean;
  last_requested_at: string | null;
  can_request_again_at: string | null;
}

// ── Coach Purchases ───────────────────────────────────────────
export interface CoachPurchase {
  id: number;
  client_id: number;
  client_name: string;
  plan_name: string;
  plan_slug: string;
  amount: number;
  currency: string;
  purchased_at: string;
  event_id: number | null;
  event_name: string | null;
}

export interface CoachPurchasesSummary {
  total_revenue: number;
  commission_rate: number;
  coach_commission: number;
  total_purchases: number;
}

export interface CoachPurchasesResponse {
  items: CoachPurchase[];
  total: number;
  page: number;
  pages: number;
  summary: CoachPurchasesSummary;
}

// ── Invite Codes ───────────────────────────────────────────
export type InviteCodeType = 'coach' | 'client';

export interface InviteCode {
  id: number;
  code: string;
  code_type: InviteCodeType;
  is_used: boolean;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  created_at: string | null;
  used_at: string | null;
  used_by_name?: string | null;
}

// ── FAQ ──────────────────────────────────────────────────
export type FAQCategory = 'general' | 'coaches' | 'payments' | 'technical';

export interface FAQItem {
  id: number;
  question_en: string;
  question_fa: string;
  answer_en: string;
  answer_fa: string;
  category: FAQCategory;
  sort_order: number;
  is_active: boolean;
}

// ── Admin ──────────────────────────────────────────────────
export interface AdminStats {
  total_users: number;
  total_coaches: number;
  total_clients: number;
  total_mt5_accounts: number;
  active_subscriptions: number;
  unused_invite_codes: number;
}

export interface AdminUser extends User {
  plan_name: string | null;
  plan_slug: string | null;
  plan_id: number | null;
}

// ── EA Tokens admin ────────────────────────────────────────
export type EAAccessStatus = 'active' | 'plan_expired' | 'feature_not_in_plan' | 'revoked';

export interface EATokenRow {
  id: number;
  user_id: number;
  email: string;
  full_name: string | null;
  prefix: string;
  is_revoked: boolean;
  created_at: string;
  last_used_at: string | null;
  ea_version: string | null;
  bound_account_login: number | null;
  bound_broker: string | null;
  bound_at: string | null;
  access_status: EAAccessStatus;
}

export interface AdminCoach extends User {
  client_count: number;
  active_invite_codes_count: number;
  plan_name: string | null;
  plan_slug: string | null;
  referral_slug: string | null;
}

export interface AdminCoachClientAccount {
  id: number;
  login: string;
  server: string;
  is_demo: boolean;
}

export type CoachClientPermissionStatus = 'active' | 'revoked';

export interface AdminCoachClientRow {
  client_id: number;
  client_coach_id: number;
  email: string;
  full_name: string | null;
  display_label: string | null;
  display_mode: DisplayMode;
  plan_name: string | null;
  plan_slug: string | null;
  connected_since: string | null;
  permission_status: CoachClientPermissionStatus;
  mt5_accounts: AdminCoachClientAccount[];
}

export interface AdminUnassignedClient {
  id: number;
  email: string;
  full_name: string | null;
}

// ── Journal ────────────────────────────────────────────────
export interface Journal {
  pre_emotion?: string;
  pre_reason?: string;
  pre_strategy?: string;
  pre_risk?: number;
  post_emotion?: string;
  post_lesson?: string;
  post_rating?: number;
  post_followed_plan?: boolean;
  tags?: string;
}

// UserFeatures — defined below near ProfileResponse

// ── Journal ────────────────────────────────────────────────
export interface JournalEntry {
  id: number;
  account_id: number;
  ticket?: number;
  symbol?: string;
  trade_type?: string;
  pre_emotion?: string;
  pre_reason?: string;
  pre_strategy?: string;
  pre_risk?: number;
  post_emotion?: string;
  post_lesson?: string;
  post_rating?: number;
  post_followed_plan?: boolean;
  tags?: string;
  profit?: number;
  created_at: string;
  updated_at?: string;
}

export interface EmotionPnL {
  emotion: string;
  avg_profit: number;
  count: number;
}

export interface JournalAnalysisData {
  total_journals: number;
  avg_post_rating: number | null;
  plan_followed_pct: number | null;
  emotion_distribution: Record<string, number>;
  post_emotion_distribution: Record<string, number>;
  emotion_pnl: EmotionPnL[];
  rating_pnl_correlation: { rating: number; avg_profit: number; count: number }[];
  plan_followed_pnl: {
    followed: { avg_profit: number; count: number };
    not_followed: { avg_profit: number; count: number };
  };
  top_tags: { tag: string; count: number }[];
  monthly_journal_count: { month: string; count: number }[];
}

export interface JournalPermission {
  coach_id: number;
  coach_name: string;
  allow_journal_view: boolean;
}

// ── AI Psychology Analysis ─────────────────────────────────
export interface AIPattern {
  pattern: { en: string; fa: string };
  severity: 'low' | 'medium' | 'high';
  explanation: { en: string; fa: string };
}

export interface AIAnalysisResult {
  summary: { en: string; fa: string };
  key_patterns: AIPattern[];
  recommendations: { en: string; fa: string }[];
  risk_level: 'low' | 'medium' | 'high';
  cached: boolean;
  created_at: string | null;
  tokens_used?: number | null;
  quota?: { used: number; limit: number | null };
}

export interface AIQuotaStatus {
  used: number;
  limit: number | null;
  reset_date: string;
}

// ── Feature flags ──────────────────────────────────────────
export interface UserFeatures {
  // Analysis modules
  psychology_score: boolean;
  mae_mfe: boolean;
  session_analysis: boolean;
  cost_analysis: boolean;
  entry_exit_quality: boolean;
  trading_style: boolean;
  pattern_detection: boolean;
  pdf_export: boolean;
  realtime_analysis: boolean;
  // AI
  ai_psychology_analysis: boolean;
  ai_unlimited: boolean;
  ai_coach: boolean;
  // Journaling
  journal: boolean;
  emotion_tags: boolean;
  journal_analysis: boolean;
  // Telegram
  telegram_connect: boolean;
  telegram_alerts: boolean;
  telegram_journal_view: boolean;
  // Notifications
  email_notifications: boolean;
  // Integer limits
  mt5_accounts_limit: number | null;
}

export interface ProfileResponse {
  id: number;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  email: string;
  phone: string | null;
  role: string;
  plan: string | null;
  plan_slug: string | null;
  created_at: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  is_telegram_verified: boolean;
  telegram_id: string | null;
  telegram_username: string | null;
  features: UserFeatures;
}

// ── Charts ─────────────────────────────────────────────────
export interface ChartPt { time: string; value: number; }

export interface ChartsData {
  account_id: number;
  initial_balance: number | null;
  series: {
    growth:   { balance_growth: ChartPt[]; equity_growth: ChartPt[]; mfe_growth: ChartPt[]; mae_growth: ChartPt[]; };
    balance:  { balance: ChartPt[];        equity: ChartPt[]; };
    profit:   { profit: ChartPt[]; per_trade: ChartPt[]; };
    drawdown: { drawdown: ChartPt[]; };
    margin:   { margin: ChartPt[]; };
  };
}

// ── Notifications ──────────────────────────────────────────
export interface Notification {
  id: number;
  category: 'system' | 'analysis';
  level: 'info' | 'warning' | 'danger';
  title: { fa: string; en: string };
  message: { fa: string; en: string };
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unread_count: number;
}

// ── Coach notifications ─────────────────────────────────────
export type NotifyChannel = 'telegram' | 'inapp' | 'both';
export type SentChannel = 'telegram' | 'inapp' | 'both' | 'inapp_only';

export interface CoachNotification {
  id: number;
  coach_id: number;
  coach_name: string | null;
  client_id: number;
  client_name: string | null;
  message_en: string;
  message_fa: string;
  channel: SentChannel;
  is_read: boolean;
  sent_at: string | null;
}

export interface CoachNotificationsResponse {
  items: CoachNotification[];
  total: number;
  page: number;
  pages: number;
}

export interface MyCoachNotificationsResponse extends CoachNotificationsResponse {
  unread_count: number;
}

export interface NotifyClientsInput {
  client_ids: number[];
  message_en: string;
  message_fa: string;
  channel: NotifyChannel;
}

export interface NotifyClientDetail {
  client_id: number;
  status: 'sent' | 'failed';
  channel?: SentChannel;
  reason?: string;
}

export interface NotifyClientsResponse {
  sent: number;
  failed: number;
  details: NotifyClientDetail[];
}

// ── API ────────────────────────────────────────────────────
export interface ApiError {
  detail: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}
