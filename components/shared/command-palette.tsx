'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BarChart2, Users, UserPlus, LogOut, Home } from 'lucide-react';
import { useUiStore } from '@/store/ui';
import { useCurrentUser } from '@/components/layouts/auth-guard';
import { AUTH_TOKEN_KEY, ROUTES } from '@/lib/constants';
import { useAuthStore } from '@/store/auth';
import type { LucideIcon } from 'lucide-react';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  action: () => void;
  roles?: string[];
}

export function CommandPalette() {
  const { commandPaletteOpen, closeCommandPalette } = useUiStore();
  const router = useRouter();
  const { user } = useCurrentUser();
  const logout = useAuthStore((s) => s.logout);

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem(AUTH_TOKEN_KEY);
    logout();
    router.push(ROUTES.login);
    closeCommandPalette();
  };

  const ALL_COMMANDS: Command[] = [
    {
      id: 'dashboard',
      label: 'داشبورد',
      description: 'مدیریت حساب‌های MT5',
      icon: Home,
      action: () => { router.push(ROUTES.dashboard); closeCommandPalette(); },
    },
    {
      id: 'accounts',
      label: 'حساب‌ها',
      description: 'لیست حساب‌های متصل',
      icon: BarChart2,
      action: () => { router.push(ROUTES.dashboard); closeCommandPalette(); },
    },
    {
      id: 'coach-clients',
      label: 'کلاینت‌های من',
      description: 'پنل کوچ — مدیریت کلاینت‌ها',
      icon: Users,
      action: () => { router.push(ROUTES.coachClients); closeCommandPalette(); },
      roles: ['coach'],
    },
    {
      id: 'connect-coach',
      label: 'اتصال به کوچ',
      description: 'متصل شدن به کوچ جدید',
      icon: UserPlus,
      action: () => { router.push(ROUTES.connectCoach); closeCommandPalette(); },
      roles: ['client'],
    },
    {
      id: 'logout',
      label: 'خروج از حساب',
      description: 'پایان جلسه',
      icon: LogOut,
      action: handleLogout,
    },
  ];

  const commands = ALL_COMMANDS.filter(
    (c) => (!c.roles || c.roles.includes(user.role)) &&
      (!query.trim() || c.label.includes(query) || (c.description ?? '').includes(query)),
  );

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, commands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      commands[selected]?.action();
    } else if (e.key === 'Escape') {
      closeCommandPalette();
    }
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCommandPalette}
          />

          {/* Palette */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div
              className="w-full max-w-lg pointer-events-auto"
              initial={{ opacity: 0, scale: 0.95, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <div className="bg-[var(--color-elevated)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden">
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]">
                  <Search className="h-4 w-4 text-[var(--color-text-muted)] flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="جستجو در دستورات..."
                    className="flex-1 bg-transparent text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] outline-none"
                    dir="rtl"
                  />
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[rgba(255,255,255,0.05)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                    ESC
                  </kbd>
                </div>

                {/* Commands */}
                <div className="py-1.5 max-h-[320px] overflow-y-auto">
                  {commands.length === 0 ? (
                    <p className="px-4 py-6 text-sm text-center text-[var(--color-text-muted)]">
                      نتیجه‌ای یافت نشد
                    </p>
                  ) : (
                    commands.map((cmd, i) => {
                      const Icon = cmd.icon;
                      return (
                        <button
                          key={cmd.id}
                          type="button"
                          onClick={cmd.action}
                          onMouseEnter={() => setSelected(i)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-right transition-colors ${
                            selected === i
                              ? 'bg-[var(--color-cyan-dim)] text-[var(--color-text-primary)]'
                              : 'text-[var(--color-text-secondary)] hover:bg-[rgba(255,255,255,0.03)]'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              selected === i ? 'bg-[rgba(0,212,255,0.15)]' : 'bg-[rgba(255,255,255,0.05)]'
                            }`}
                          >
                            <Icon
                              className={`h-3.5 w-3.5 ${selected === i ? 'text-[var(--color-cyan)]' : 'text-[var(--color-text-muted)]'}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{cmd.label}</p>
                            {cmd.description && (
                              <p className="text-[11px] text-[var(--color-text-muted)] truncate">{cmd.description}</p>
                            )}
                          </div>
                          {selected === i && (
                            <kbd className="flex-shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[rgba(0,212,255,0.1)] text-[var(--color-cyan)] border border-[rgba(0,212,255,0.2)]">
                              ↵
                            </kbd>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Footer hint */}
                <div className="px-4 py-2 border-t border-[var(--color-border)] flex items-center gap-3">
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    <kbd className="font-mono">↑↓</kbd> انتخاب
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    <kbd className="font-mono">↵</kbd> اجرا
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    <kbd className="font-mono">ESC</kbd> بستن
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
