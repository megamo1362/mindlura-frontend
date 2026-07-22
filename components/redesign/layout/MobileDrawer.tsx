'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useUiStore } from '@/store/ui';
import { useLang } from '@/app/i18n/LangContext';
import { Sidebar } from './Sidebar';
import type { User } from '@/types';

interface MobileDrawerProps {
  user: User;
}

export function MobileDrawer({ user }: MobileDrawerProps) {
  const { mobileSidebarOpen, closeMobileSidebar } = useUiStore();
  const { isRTL } = useLang();
  const offscreenX = isRTL ? '100%' : '-100%';

  return (
    <AnimatePresence>
      {mobileSidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={closeMobileSidebar}
          />
          <motion.div
            initial={{ x: offscreenX }}
            animate={{ x: 0 }}
            exit={{ x: offscreenX }}
            transition={{ type: 'tween', duration: 0.2, ease: [0, 0, 0.2, 1] }}
            className="fixed inset-y-0 start-0 z-50 lg:hidden"
          >
            <Sidebar user={user} onNavClick={closeMobileSidebar} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
