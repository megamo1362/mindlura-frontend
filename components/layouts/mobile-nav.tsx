'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Sidebar } from './sidebar';
import { useUiStore } from '@/store/ui';
import type { User } from '@/types';

interface MobileNavProps {
  user: User;
  variant?: 'dashboard' | 'admin';
}

export function MobileNav({ user, variant = 'dashboard' }: MobileNavProps) {
  const { mobileSidebarOpen, closeMobileSidebar } = useUiStore();

  // Close on escape key
  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileSidebar();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mobileSidebarOpen, closeMobileSidebar]);

  // Lock body scroll when open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileSidebarOpen]);

  return (
    <AnimatePresence>
      {mobileSidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobileSidebar}
          />

          {/* Sidebar panel */}
          <motion.div
            key="panel"
            className="fixed top-0 right-0 bottom-0 z-50 lg:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="relative h-full">
              {/* Close button */}
              <button
                onClick={closeMobileSidebar}
                className="absolute top-4 left-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--color-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <Sidebar
                user={user}
                variant={variant}
                onNavClick={closeMobileSidebar}
                className="h-full shadow-2xl"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
