'use client';

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastState {
  toasts: ToastItem[];
  add: (t: Omit<ToastItem, 'id'>) => string;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  add: (t) => {
    const id = Math.random().toString(36).slice(2, 9);
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
    return id;
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

// Imperative API — safe to call from mutation callbacks (outside React render)
export const toast = {
  success: (message: string, duration = 3500) =>
    useToastStore.getState().add({ type: 'success', message, duration }),
  error: (message: string, duration = 5000) =>
    useToastStore.getState().add({ type: 'error', message, duration }),
  info: (message: string, duration = 3000) =>
    useToastStore.getState().add({ type: 'info', message, duration }),
};
