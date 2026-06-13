'use client';

import { AnimatePresence } from 'framer-motion';
import * as React from 'react';

interface PresenceWrapperProps {
  children: React.ReactNode;
  mode?: 'sync' | 'wait' | 'popLayout';
  initial?: boolean;
}

export function PresenceWrapper({
  children,
  mode = 'wait',
  initial = false,
}: PresenceWrapperProps) {
  return (
    <AnimatePresence mode={mode} initial={initial}>
      {children}
    </AnimatePresence>
  );
}

// Utility: conditionally show/hide with animation
interface ConditionalPresenceProps {
  show: boolean;
  children: React.ReactNode;
}

export function ConditionalPresence({ show, children }: ConditionalPresenceProps) {
  return (
    <AnimatePresence mode="wait">
      {show && children}
    </AnimatePresence>
  );
}
