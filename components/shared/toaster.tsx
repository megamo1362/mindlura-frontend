'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useToastStore, type ToastItem } from '@/store/toast';

const ICON = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
} as const;

const STYLE = {
  success: 'border-emerald-500/30 bg-[rgba(6,214,160,0.08)] text-emerald-300',
  error: 'border-red-500/30 bg-[rgba(239,68,68,0.08)] text-red-300',
  info: 'border-[rgba(0,212,255,0.25)] bg-[var(--color-cyan-dim)] text-[var(--color-text-secondary)]',
} as const;

const ICON_STYLE = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  info: 'text-[var(--color-cyan)]',
} as const;

function Toast({ item }: { item: ToastItem }) {
  const remove = useToastStore((s) => s.remove);

  useEffect(() => {
    const t = setTimeout(() => remove(item.id), item.duration);
    return () => clearTimeout(t);
  }, [item.id, item.duration, remove]);

  const Icon = ICON[item.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -24, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -16, scale: 0.96 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`flex items-start gap-3 rounded-xl px-4 py-3 border shadow-xl backdrop-blur-sm max-w-sm ${STYLE[item.type]}`}
    >
      <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${ICON_STYLE[item.type]}`} />
      <p className="text-sm flex-1 leading-snug">{item.message}</p>
      <button
        type="button"
        onClick={() => remove(item.id)}
        className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Close"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed bottom-5 left-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      <div className="pointer-events-auto flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <Toast key={t.id} item={t} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
