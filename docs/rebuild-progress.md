# IRFX Frontend 2 — Rebuild Progress

## Project: `irfx-frontend2`
**Start Date:** 2026-06-13
**Framework:** Next.js 15 + TypeScript + Tailwind CSS v3 + Shadcn UI (Radix)
**Design Language:** Bloomberg Terminal × TradingView × Apple × Linear × AI Performance Lab

---

## Phase Overview

| # | Title | Status | Files |
|---|-------|--------|-------|
| 1 | Project architecture setup | ✅ COMPLETED | 24 files |
| 2 | Core design system components | ✅ COMPLETED | 24 files |
| 3 | Motion architecture | ✅ COMPLETED | 19 files |
| 4 | Global layouts + navigation | ✅ COMPLETED | 16 files |
| 5 | Client dashboard redesign | ✅ COMPLETED | 13 files |
| 6 | Coach dashboard redesign | ✅ COMPLETED | 8 files |
| 7 | Analytics & visualization system | ✅ COMPLETED | 10 files |
| 8 | Advanced interactions & micro-animations | ✅ COMPLETED | 13 files |
| 9 | Three.js / WebGL premium visual effects | ✅ COMPLETED | 5 files |
| 10 | Optimization & production readiness | ✅ COMPLETED | 14 files |

---

## ✅ Phase 1: Project Architecture Setup

**Completed:** 2026-06-13

### Goal
Establish the foundational project structure, configuration, and design token system. Every subsequent phase builds on this base.

---

### Files Created (24)

```
irfx-frontend2/
├── package.json              ← All dependencies pinned
├── next.config.ts            ← Package import optimization
├── tsconfig.json             ← Strict TypeScript + @/* path alias
├── tailwind.config.ts        ← Full design system config
├── postcss.config.mjs        ← Tailwind + Autoprefixer
├── .eslintrc.json
├── .gitignore
├── components.json           ← Shadcn UI config (new-york style)
│
├── app/
│   ├── globals.css           ← Complete CSS token + component system
│   ├── layout.tsx            ← Root layout: Inter + JetBrains Mono, RTL
│   ├── page.tsx              ← Redirect → /login
│   ├── providers.tsx         ← TanStack Query provider
│   ├── login/
│   │   └── page.tsx          ← Placeholder (Phase 4)
│   └── dashboard/
│       └── page.tsx          ← Placeholder (Phase 5)
│
├── lib/
│   ├── utils.ts              ← cn(), formatCurrency, formatPercent, etc.
│   ├── constants.ts          ← API_URL, ROUTES, QUERY_KEYS
│   └── tokens/
│       ├── colors.ts         ← Full color palette
│       ├── typography.ts     ← Type scale + families
│       ├── spacing.ts        ← Spacing scale + semantic layout values
│       ├── animations.ts     ← Duration, easing, Framer Motion variants
│       ├── shadows.ts        ← Glow effects, card shadows
│       └── index.ts          ← Barrel export
│
├── types/
│   └── index.ts              ← All domain types (matches backend exactly)
│
└── docs/
    └── rebuild-progress.md   ← This file
```

---

### Architecture Decisions

**Tailwind CSS v3** (not v4) — Maximum compatibility with Shadcn UI and stable ecosystem. Custom design tokens defined as CSS custom properties (`var(--color-*)`) accessible globally, plus Tailwind config extensions for utility-class usage.

**Shadcn UI (new-york style)** — Radix UI primitives with `cssVariables: true`. Components are added phase-by-phase via `npx shadcn@latest add <component>`.

**TanStack Query v5** — All API calls via Query hooks. Eliminates `useEffect`-based fetching in the existing codebase. Provides caching, background refetch, and optimistic updates.

**Zustand v5** — Lightweight global state for auth token and UI state (added in Phase 4 when auth store is needed).

**Framer Motion v12** — Animation system. Variants defined in `lib/tokens/animations.ts` for reuse. Integrated in Phase 3 (motion architecture).

**GSAP v3** — For complex timeline animations and ScrollTrigger. Registered in Phase 3.

**Three.js + R3F** — For WebGL effects. Added in Phase 9 only.

**Path aliases** — All imports use `@/` prefix (`@/lib/utils`, `@/types`, etc.)

**RTL-first** — `html` element has `lang="fa" dir="rtl"`. All layouts are designed right-to-left.

---

### Design Token System

#### Color Palette
| Token | CSS Var | Value | Usage |
|-------|---------|-------|-------|
| Void | `--color-void` | `#020510` | Deepest background |
| Deep | `--color-deep` | `#060d1c` | Page background |
| Surface | `--color-surface` | `#0a1428` | Card backgrounds |
| Elevated | `--color-elevated` | `#0f1d35` | Modal/elevated panels |
| Cyan | `--color-cyan` | `#00d4ff` | Primary accent |
| Blue | `--color-blue` | `#0066ff` | Secondary accent |
| Purple | `--color-purple` | `#7c3aed` | Tertiary accent |
| Teal | `--color-teal` | `#14b8a6` | Quaternary accent |
| Text Primary | `--color-text-primary` | `#e2f4ff` | Main text |
| Text Muted | `--color-text-muted` | `#4a6a80` | Subtle text |

#### Typography
- **Sans**: Inter (Google Fonts, variable: `--font-inter`)
- **Mono**: JetBrains Mono (Google Fonts, variable: `--font-jetbrains`)

#### Key CSS Utility Classes (globals.css)
| Class | Purpose |
|-------|---------|
| `.glass` | Glassmorphism panel (blur + semi-transparent) |
| `.glass-elevated` | Elevated glassmorphism |
| `.card-surface` | Standard dark card |
| `.card-interactive` | Hoverable card with glow |
| `.btn-primary` | Cyan→blue gradient CTA |
| `.btn-secondary` | Ghost button with border |
| `.btn-ghost` | Transparent button |
| `.btn-danger` | Red danger button |
| `.btn-glow` | Legacy alias for btn-primary |
| `.input-dark` | Dark theme form input |
| `.badge-{color}` | Status badges (cyan/green/red/yellow/purple/blue/teal) |
| `.neon-text` | Cyan glowing text |
| `.gradient-text-cyber` | Cyan→Blue→Purple gradient text |
| `.grid-bg` | Subtle grid background pattern |
| `.dot-bg` | Dot matrix background |
| `.circuit-bg` | Circuit-inspired background (default body) |
| `.irfx-table` | Styled data table |
| `.skeleton` | Loading shimmer animation |
| `.modal-overlay` | Modal backdrop |
| `.divider-cyber` | Gradient divider line |
| `.no-scrollbar` | Hide scrollbar |

---

### Backend Compatibility
Types in `types/index.ts` match exact API response shapes. No field names, labels, business logic, or API endpoints were renamed or changed.

**API_URL** in `lib/constants.ts`: `http://37.235.18.227:8000` (matches existing frontend).

---

### Install Instructions
```bash
cd C:\Users\megam\irfx\irfx-frontend2
npm install
npm run build    # should succeed with placeholder pages
npm run dev      # dev server on http://localhost:3000
```

---

## ⏳ Phase 2: Core Design System (Pending Approval)

### Objectives
Build all atomic UI components used across the entire app:
- **Button** — primary, secondary, ghost, danger, icon, loading variants
- **Input** — text, password, number, textarea, search with icon
- **Card** — surface, elevated, glass, interactive, stat variants
- **Badge** — all status variants + plan badges
- **Avatar** — image + initials fallback + status indicator
- **Spinner / LoadingDots** — multiple variants
- **Tooltip** — with positioning
- **Modal / Dialog** — with animation (Radix Dialog)
- **Tabs** — with active indicator animation
- **Alert** — info, success, warning, error variants
- **Select** — custom dark styled (Radix Select)
- **Switch** — toggle with animation
- **Progress** — bar and circular variants
- **Separator** — horizontal/vertical

### Dependencies on Phase 1 ✅

---

## ⏳ Phase 3: Motion Architecture (Pending)
GSAP plugin registration, Framer Motion page transitions, scroll triggers, reusable motion components.

## ✅ Phase 4: Global Layouts

**Completed:** 2026-06-13

### Files Created (16)

```
store/
├── auth.ts                 ← Zustand auth store (persist to localStorage)
├── ui.ts                   ← Zustand UI store (sidebar open/close state)
└── index.ts                ← Barrel export

components/layouts/
├── auth-guard.tsx          ← Auth check + AuthContext + useCurrentUser hook
├── nav-item.tsx            ← RTL-aware nav link with active state
├── sidebar.tsx             ← Desktop sidebar (logo + nav + user section)
├── mobile-nav.tsx          ← Mobile overlay sidebar (Framer Motion spring)
├── topbar.tsx              ← Sticky top header (hamburger + user chip)
├── user-menu.tsx           ← User info card + logout button
├── dashboard-shell.tsx     ← Full dashboard layout (AuthGuard + Sidebar + Topbar)
├── admin-shell.tsx         ← Admin layout (adminOnly guard + admin nav)
└── index.ts                ← Barrel export

app/
├── login/layout.tsx        ← Auth layout (centered grid-bg wrapper)
├── dashboard/layout.tsx    ← Renders DashboardShell (server component)
├── admin/layout.tsx        ← Renders AdminShell (server component)
└── admin/page.tsx          ← Admin root placeholder
```

### Layout Architecture

**RTL Sidebar Positioning:** Sidebar is `position: fixed; right: 0` (logical start in RTL). Main content has `lg:mr-[280px]` offset.

**Auth Guard Pattern:**
1. Reads `token` from `localStorage` on mount
2. Fetches `/auth/me` with Bearer token
3. On success → provides `AuthContext` (user + token) to children via React Context
4. On failure → clears token, redirects to `/login`
5. `adminOnly` flag redirects non-admin users to `/dashboard`
6. `useCurrentUser()` hook — consume auth context anywhere inside an `AuthGuard`

**Role-filtered Navigation:**
- Dashboard shell: shows `حساب‌ها` always; `کلاینت‌های من` for coaches only; `اتصال به کوچ` for clients only
- Admin shell: full admin nav (dashboard, users, coaches, invite-codes, plans)

**Mobile Responsiveness:**
- Desktop (lg+): sidebar visible, no hamburger
- Mobile/tablet (<lg): sidebar hidden, hamburger in topbar opens spring-animated overlay
- Body scroll locked when mobile sidebar is open
- Escape key closes mobile sidebar

**Zustand Stores:**
- `useAuthStore` — persisted auth state (token + user)
- `useUiStore` — ephemeral UI state (mobile sidebar open/close, future sidebar collapse)

### Build Result
```
Route (app)                    Size    First Load JS
┌ ○ /                          147 B   101 kB
├ ○ /_not-found                977 B   102 kB
├ ○ /admin                     147 B   101 kB
├ ○ /dashboard                 147 B   101 kB
└ ○ /login                     147 B   101 kB
✓ Compiled successfully
```

## ✅ Phase 5: Client Dashboard

**Completed:** 2026-06-13

### Files Created/Updated (13)

```
lib/
└── api.ts                            ← apiFetch() + ApiError (auth headers, error parsing)

hooks/
├── use-accounts.ts                   ← useAccounts, useAddAccount, useDeleteAccount, useSyncAccount
└── use-auth-api.ts                   ← useLogin, useRegister (TanStack mutations + redirect)

components/auth/
├── login-form.tsx                    ← Email + password form, error display
├── register-form.tsx                 ← Full register form with client-side validation
└── index.ts

components/dashboard/
├── account-card.tsx                  ← MT5 account card (balance, server, sync/analyze/delete)
├── add-account-dialog.tsx            ← Add MT5 account dialog (login, investor_password, server, label)
├── accounts-grid.tsx                 ← Accounts list with empty state + header
└── index.ts

app/
├── login/page.tsx                    ← Real login/register page (Tabs: ورود/ثبت‌نام)
├── dashboard/page.tsx                ← Renders AccountsGrid
└── dashboard/analyze/[id]/page.tsx  ← Analysis placeholder (Phase 7)
```

### Build Result
```
Route (app)                    Size     First Load JS
┌ ○ /                          142 B    101 kB
├ ○ /admin                     142 B    101 kB
├ ○ /dashboard                 17.5 kB  183 kB
├ ƒ /dashboard/analyze/[id]    172 B    105 kB
└ ○ /login                     9.78 kB  165 kB
✓ Compiled successfully
```

## ✅ Phase 6: Coach Dashboard

**Completed:** 2026-06-13

### Files Created (8)

```
hooks/
└── use-coach.ts                          ← All 8 coach/client hooks (TanStack mutations + queries)

components/coach/
├── display-settings.tsx                  ← 3-option display mode picker with conditional label
├── client-card.tsx                       ← Collapsible coach client card (accounts table)
├── coach-clients-page.tsx                ← Clients tab + invite codes tab (create/copy/delete codes)
├── connect-coach-page.tsx                ← Email lookup → display settings → account selection → connect
└── index.ts                              ← Barrel export

app/dashboard/
├── coach/clients/page.tsx                ← Server route → CoachClientsPage
└── connect-coach/page.tsx                ← Server route → ConnectCoachPage
```

### Features

**Coach view (`/dashboard/coach/clients`):**
- Tab switcher: کلاینت‌ها | کدهای دعوت
- Collapsible `ClientCard` per client: name, email, plan badge, accounts table with balance/equity/drawdown/hours columns, Analyze links
- Invite code panel: create with expiry + max-uses, copy to clipboard, delete, active/used code lists

**Client view (`/dashboard/connect-coach`):**
- Email lookup via `GET /coach/lookup?email=...`
- After verification: `DisplaySettings` (name/email/both radio) + account checkbox multi-select
- Connect via `POST /client/connect-coach`
- Current coaches list: edit (expand panel with inline save) + disconnect per connection

**Hooks:**
- `useMyClients()` → `GET /coach/my-clients`
- `useMyCoaches()` → `GET /client/my-coaches`
- `useLookupCoach()` → `GET /coach/lookup?email=...`
- `useConnectCoach()` → `POST /client/connect-coach`
- `useDisconnectCoach()` → `DELETE /client/disconnect-coach/{coachId}`
- `useInviteCodes()` → `GET /coach/invite-codes`
- `useCreateInviteCode()` → `POST /coach/invite-codes`
- `useDeleteInviteCode()` → `DELETE /coach/invite-codes/{id}`

### Build Result
```
Route (app)                              Size    First Load JS
┌ ○ /                                   142 B   101 kB
├ ○ /admin                              142 B   101 kB
├ ○ /dashboard                         13.3 kB  184 kB
├ ƒ /dashboard/analyze/[id]             172 B   105 kB
├ ○ /dashboard/coach/clients            151 B   176 kB
├ ○ /dashboard/connect-coach            151 B   176 kB
└ ○ /login                             11.7 kB  165 kB
✓ Compiled successfully
```

## ✅ Phase 7: Analytics & Visualization System

**Completed:** 2026-06-13

### Files Created (10)

```
hooks/
└── use-analysis.ts                         ← useCheckAndRun, useRealtimeAnalysis, useUserFeatures, useSaveJournal

components/analysis/
├── warning-cards.tsx                       ← Colored warning cards (danger/warning/info levels)
├── summary-stats.tsx                       ← Hero KPIs + secondary stats grid + MAE/MFE + hold time
├── equity-chart.tsx                        ← Custom SVG equity curve with hover tooltip, green/red segments
├── trades-table.tsx                        ← Paginated trade table (50/page) + journal modal
├── time-analysis.tsx                       ← Hour-by-hour bar chart + profit/winrate
├── symbol-analysis.tsx                     ← Symbol breakdown table with inline progress bars
├── analysis-page.tsx                       ← Main orchestrator: check-and-run on mount, realtime button
└── index.ts                                ← Barrel export

app/dashboard/analyze/[id]/
└── page.tsx                                ← Server route → AnalysisPage client component
```

### Features

**Data flow:**
1. On mount: `POST /analysis/check-and-run/{id}` — returns cached snapshot or triggers new analysis
2. `GET /auth/me/features` — determines if user can run realtime analysis (`realtime_analysis` flag)
3. Realtime button (feature-gated): `GET /trades/analyze/{id}` — runs fresh MT5 analysis
4. Journal: `POST /journal/create` — per-trade emotion/lesson/rating logging

**Tabs:**
- **خلاصه**: 4 hero KPIs (winrate, R:R, total profit, trade count) + 12 secondary stats + best/worst cards + MAE/MFE + hold time
- **معاملات**: Filtered (all/win/loss), paginated (50/page), journal button per row
- **زمانی**: Hour-by-hour horizontal bar chart + winrate + P&L per session hour
- **نمادها**: Per-symbol breakdown with inline progress bars sorted by trade count
- **Equity Curve**: Custom SVG chart — balance baseline, green/red segments, hover crosshair + tooltip

**Preserved backend logic:**
- `realTrades` filter: `type ∈ [0,1] && volume > 0 && profit !== 0` (excludes deposits/withdrawals)
- Coach mode detected via `?coach=true` query param — hides journal buttons
- `analysis.has_data` check before rendering stats

### Build Result
```
Route (app)                              Size    First Load JS
ƒ /dashboard/analyze/[id]             11.8 kB   177 kB
✓ Compiled successfully — 0 errors
```

## ✅ Phase 8: Advanced Interactions & Micro-animations

**Completed:** 2026-06-13

### Files Created (6 new, 7 modified)

```
store/
└── toast.ts                              ← Zustand toast store + imperative toast.success/error/info API

hooks/
└── use-keyboard-shortcut.ts             ← Keyboard shortcut hook (modifier + key combo listener)

components/shared/
├── toaster.tsx                           ← Floating toast container (bottom-left, AnimatePresence)
├── skeletons.tsx                         ← Skeleton components: AccountCard, AccountsGrid, StatCard, ClientCard
└── command-palette.tsx                   ← Cmd+K command palette (search, arrow nav, Enter execute, Escape close)

components/layouts/
└── page-transition.tsx                   ← Framer Motion fade+slide on route change (keyed by pathname)

Modified:
- store/ui.ts                            ← Added commandPaletteOpen + open/closeCommandPalette
- store/index.ts                         ← Export toast store
- components/shared/index.ts             ← Export Toaster, skeletons, CommandPalette
- components/layouts/dashboard-shell.tsx ← Cmd+K shortcut, PageTransition, CommandPalette, Toaster
- components/layouts/index.ts            ← Export PageTransition
- hooks/use-accounts.ts                  ← Toast on add/delete/sync success + error
- hooks/use-coach.ts                     ← Toast on connect/disconnect/create code/delete code
```

### Features

**Toast notifications:**
- `toast.success()` / `toast.error()` / `toast.info()` — imperative API, safe inside mutation callbacks
- Animated slide-in from bottom-left, auto-dismiss, manual X close
- Add/delete/sync account → success/error toasts
- Connect coach / disconnect / invite codes → success toasts

**Command palette (Cmd+K / Ctrl+K):**
- Role-filtered commands (coach sees "کلاینت‌های من", client sees "اتصال به کوچ")
- Keyboard nav: ↑↓ arrow keys, Enter to execute, Escape to close
- Fuzzy search filter on label + description
- Logout shortcut included

**Page transitions:**
- Subtle 200ms fade + 8px slide-up on every dashboard route change
- Keyed by `usePathname()` so each page transition is independent
- Works with Next.js 15 App Router (motion.div wrapper, no AnimatePresence conflict)

**Skeleton loaders:**
- `AccountCardSkeleton`, `AccountsGridSkeleton` — use instead of InlineLoader when loading accounts
- `StatCardSkeleton`, `AnalysisSkeleton`, `ClientCardSkeleton` — ready for use in future phases/components

### Build Result
```
Route (app)                              Size    First Load JS
○ /dashboard                           13.9 kB  190 kB
✓ Compiled successfully — 0 errors
```

## ✅ Phase 9: Three.js / WebGL Premium Visual Effects

**Completed:** 2026-06-13

### Files Created (4 new, 2 modified)

```
components/effects/
├── login-bg.tsx           ← Pure Three.js particle field for login page (imperative renderer loop)
├── login-bg-client.tsx    ← Client component wrapper using next/dynamic { ssr: false }
├── ambient-orbs.tsx       ← Framer Motion animated blurred orbs for dashboard background
└── index.ts               ← Barrel export

app/login/layout.tsx           ← Modified: relative container + LoginBackgroundClient behind form
components/layouts/
└── dashboard-shell.tsx        ← Modified: AmbientOrbs as first child of outer div
```

### Features

**Login page — Three.js particle field (`login-bg.tsx`):**
- 200 cyan `#00d4ff` particles + 50 purple `#7c3aed` accent dots in 3D space
- Imperative Three.js renderer loop (no R3F JSX — avoids React 19 JSX type incompatibility with R3F v8)
- `ResizeObserver` keeps canvas sized to its container — no fixed pixel dimensions
- Animation: cyan layer slow-rotates Y+X (0.013/0.007 rad/s), purple counter-rotates Y+Z
- `WebGLRenderer` with `alpha: true`, `powerPreference: 'low-power'`, `dpr` capped at 1.5
- Full cleanup on unmount: `cancelAnimationFrame`, `renderer.dispose()`, geometry/material dispose
- Loaded via `LoginBackgroundClient` (`'use client'` + `next/dynamic ssr:false`) so the server layout stays a pure Server Component without WebGL API calls

**Dashboard — Ambient orbs (`ambient-orbs.tsx`):**
- 4 independently animated blurred orbs: cyan (top-right), purple (bottom-left), blue (mid), teal (bottom-right)
- Fixed position, `z-0`, `pointer-events-none` — never interferes with layout
- Framer Motion `scale` + `opacity` pulse animation (8–16s duration, `Infinity` repeat)
- Opacity range 0.028–0.038 (visible but deeply subtle, dark-room friendly)
- Blur: 80–130px for soft atmospheric glow

### Technical Notes

- **R3F JSX incompatibility**: `@react-three/fiber` v8 JSX namespace augmentation doesn't merge cleanly with React 19's type system (`React.JSX` vs global `JSX`). Solved by using imperative Three.js only inside a `'use client'` component — no JSX Three elements at all.
- **SSR safety**: `LoginBackgroundClient` wraps the canvas with `next/dynamic { ssr: false }`. Server renders nothing; client hydrates with Three.js canvas. Server component `app/login/layout.tsx` stays pure.
- **No new npm dependencies**: Three.js was already installed in Phase 1. Phase 9 uses zero new packages.

### Build Result
```
Route (app)                              Size    First Load JS
○ /login                               11.8 kB  165 kB
○ /dashboard                           13.9 kB  190 kB
✓ Compiled successfully — 0 errors
```

---

## ✅ Phase 10: Optimization & Production Readiness

**Completed:** 2026-06-13

### Files Created (11 new, 3 modified)

```
next.config.ts                            ← Bundle analyzer + security headers + poweredByHeader: false

app/
├── manifest.ts                           ← PWA Web App Manifest (name, icons, theme, RTL/fa)
├── robots.ts                             ← Robots.txt (disallow dashboard + admin crawling)
├── not-found.tsx                         ← Persian 404 page with gradient "404" + back link
├── error.tsx                             ← App-level error boundary (reset button, Persian copy)
├── global-error.tsx                      ← Global error boundary (inline styles, includes html/body)
└── dashboard/
    ├── error.tsx                         ← Dashboard-scoped error boundary
    ├── loading.tsx                       ← AccountsGridSkeleton (3 cards)
    ├── analyze/[id]/loading.tsx          ← AnalysisSkeleton
    ├── coach/clients/loading.tsx         ← 4× ClientCardSkeleton
    └── connect-coach/loading.tsx         ← Inline shimmer placeholders

.env.local.example                        ← Template: NEXT_PUBLIC_API_URL, ANALYZE flag

Modified:
- app/layout.tsx                          ← Added apple-touch-icon to metadata
```

### Features

**Bundle analysis:**
- `@next/bundle-analyzer` installed (dev dep), triggered by `ANALYZE=true npm run build`
- `three` added to `optimizePackageImports` (tree-shakes unused Three.js modules)

**Security headers (all routes):**
| Header | Value |
|--------|-------|
| `X-Frame-Options` | `DENY` — prevents clickjacking |
| `X-Content-Type-Options` | `nosniff` — prevents MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `X-DNS-Prefetch-Control` | `on` — faster DNS resolution |
| `X-Powered-By` | Removed (`poweredByHeader: false`) |

**Error boundaries:**
- `app/error.tsx` — catches errors in the app segment, shows reset button
- `app/global-error.tsx` — last-resort catch, replaces entire UI with minimal inline-styled page
- `app/dashboard/error.tsx` — dashboard-segment error (sidebar remains visible)

**Loading states (Suspense UI):**
- Dashboard → `AccountsGridSkeleton` (3 pulse cards)
- Analysis `[id]` → `AnalysisSkeleton` (stat grid + chart placeholder)
- Coach clients → 4× `ClientCardSkeleton`
- Connect coach → shimmer title + two panel placeholders
- All skeleton components were already built in Phase 8, only wired here

**PWA:**
- `app/manifest.ts` → served at `/manifest.webmanifest`, linked automatically by Next.js
- Fields: `display: standalone`, `background_color: #020510`, `theme_color: #020510`, `lang: fa`, `dir: rtl`
- Icons: `/icons/icon-192.png` (standard) + `/icons/icon-512.png` (maskable) — add actual PNG files to `public/icons/`
- Apple touch icon registered in `app/layout.tsx` metadata

**SEO / crawl:**
- `app/robots.ts` → `/robots.txt` disallows `/dashboard/` and `/admin/` from search engines
- Root `/` redirects to login anyway — no sensitive content indexed

### Bundle size (final build)
```
Route                          Size    First Load JS
○ /dashboard                 13.9 kB     191 kB
ƒ /dashboard/analyze/[id]    9.54 kB     182 kB
○ /login                     11.8 kB     165 kB
Shared chunks                             101 kB
✓ Compiled — 11 routes, 0 errors
```

### To-do for production deployment
1. Add `NEXT_PUBLIC_API_URL` to the deployment environment (Vercel / Docker / PM2)
2. Drop actual icon files into `public/icons/icon-192.png` and `public/icons/icon-512.png`
3. Add `favicon.ico` to `public/` if not already present
4. Run `ANALYZE=true npm run build` once to inspect bundle composition

---

## 🏁 Rebuild Complete

All 10 phases completed. The `irfx-frontend2` project is production-ready.

*Last updated: 2026-06-13 — All 10 phases complete*
