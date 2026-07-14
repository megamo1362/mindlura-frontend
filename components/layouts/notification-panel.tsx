'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, X, CheckCheck, ShieldAlert, BarChart2, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useNotifications, useMarkRead, useMarkAllRead, useDeleteNotification,
  useMyCoachNotifications, useMarkCoachNotificationRead,
} from '@/hooks/use-notifications';
import { useLang } from '@/app/i18n/LangContext';
import type { Notification, User } from '@/types';

const LEVEL_COLOR: Record<string, string> = {
  info:    'var(--color-cyan)',
  warning: '#f97316',
  danger:  '#ef4444',
};

const LEVEL_BG: Record<string, string> = {
  info:    'rgba(0,212,255,0.08)',
  warning: 'rgba(249,115,22,0.08)',
  danger:  'rgba(239,68,68,0.08)',
};

interface NotificationPanelProps {
  role: User['role'];
}

export function NotificationPanel({ role }: NotificationPanelProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'system' | 'analysis' | 'coach'>('system');
  const ref = useRef<HTMLDivElement>(null);
  const { t, lang } = useLang();
  const isClient = role === 'client';

  const { data } = useNotifications();
  const { mutate: markRead } = useMarkRead();
  const { mutate: markAll } = useMarkAllRead();
  const { mutate: deleteNotif } = useDeleteNotification();

  const { data: coachData } = useMyCoachNotifications(1, 20);
  const { mutate: markCoachRead } = useMarkCoachNotificationRead();

  const unread = (data?.unread_count ?? 0) + (isClient ? coachData?.unread_count ?? 0 : 0);
  const all = data?.notifications ?? [];
  const filtered = all.filter((n) => n.category === tab);
  const coachNotifs = coachData?.items ?? [];

  function timeAgo(dateStr: string): string {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return t.notif_just_now;
    if (diff < 3600) return t.notif_min_ago(Math.floor(diff / 60));
    if (diff < 86400) return t.notif_hours_ago(Math.floor(diff / 3600));
    return t.notif_days_ago(Math.floor(diff / 86400));
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-elevated)] transition-colors"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-[var(--color-cyan)] text-[9px] font-bold text-black flex items-center justify-center leading-none">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 w-80 card-surface rounded-2xl shadow-2xl overflow-hidden z-50 border border-[var(--color-border)]"
            style={{
              direction: lang === 'fa' ? 'rtl' : 'ltr',
              left: lang === 'fa' ? 0 : 'auto',
              right: lang === 'fa' ? 'auto' : 0,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
              <span className="font-bold text-sm text-[var(--color-text-primary)]">{t.notif_title}</span>
              <div className="flex items-center gap-2">
                {tab !== 'coach' && filtered.some((n) => !n.is_read) && (
                  <button
                    onClick={() => markAll(tab)}
                    className="text-[10px] text-[var(--color-cyan)] hover:opacity-70 flex items-center gap-1"
                  >
                    <CheckCheck className="h-3 w-3" />
                    {t.notif_mark_all_read}
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--color-border)]">
              {([
                { key: 'system',   label: t.notif_tab_system,   icon: ShieldAlert },
                { key: 'analysis', label: t.notif_tab_analysis,  icon: BarChart2  },
                ...(isClient ? [{ key: 'coach' as const, label: t.notification_from_coach, icon: UserCheck }] : []),
              ] as const).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors"
                  style={{
                    color: tab === key ? 'var(--color-cyan)' : 'var(--color-text-muted)',
                    borderBottom: tab === key ? '2px solid var(--color-cyan)' : '2px solid transparent',
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-80">
              {tab === 'coach' ? (
                coachNotifs.length === 0 ? (
                  <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">
                    {t.no_notifications}
                  </div>
                ) : (
                  coachNotifs.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => { if (!n.is_read) markCoachRead(n.id); }}
                      className="relative px-4 py-3 border-b border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-elevated)] transition-colors"
                      style={{ background: n.is_read ? undefined : LEVEL_BG.info }}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        {!n.is_read && (
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: LEVEL_COLOR.info }} />
                        )}
                        <p className="text-xs font-bold truncate" style={{ color: LEVEL_COLOR.info }}>
                          {n.coach_name ?? t.notification_from_coach}
                        </p>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                        {lang === 'fa' ? n.message_fa : n.message_en}
                      </p>
                      {n.sent_at && (
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1 opacity-60">
                          {timeAgo(n.sent_at)}
                        </p>
                      )}
                    </div>
                  ))
                )
              ) : filtered.length === 0 ? (
                <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">
                  {t.notif_empty}
                </div>
              ) : (
                filtered.map((n: Notification) => (
                  <div
                    key={n.id}
                    onClick={() => { if (!n.is_read) markRead(n.id); }}
                    className="relative px-4 py-3 border-b border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-elevated)] transition-colors"
                    style={{ background: n.is_read ? undefined : LEVEL_BG[n.level] }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          {!n.is_read && (
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: LEVEL_COLOR[n.level] }} />
                          )}
                          <p className="text-xs font-bold truncate" style={{ color: LEVEL_COLOR[n.level] }}>
                            {n.title[lang] ?? n.title.en}
                          </p>
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                          {n.message[lang] ?? n.message.en}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1 opacity-60">
                          {timeAgo(n.created_at)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNotif(n.id); }}
                        className="text-[var(--color-text-muted)] hover:text-red-400 flex-shrink-0 mt-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
