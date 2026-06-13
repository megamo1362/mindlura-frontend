'use client';

import { useEffect } from 'react';

type Modifier = 'meta' | 'ctrl' | 'shift' | 'alt';

interface Options {
  /** Prevent default browser action */
  preventDefault?: boolean;
  /** Only fire when no input/textarea/select is focused */
  ignoreInputs?: boolean;
}

/**
 * Listens for a key combination and calls the callback.
 * Keys: modifiers ('meta','ctrl','shift','alt') + key name (e.g. 'k', 'Escape').
 */
export function useKeyboardShortcut(
  keys: (Modifier | string)[],
  callback: (e: KeyboardEvent) => void,
  { preventDefault = true, ignoreInputs = true }: Options = {},
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (ignoreInputs) {
        const tag = (e.target as HTMLElement)?.tagName ?? '';
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      }

      const activeModifiers: Set<string> = new Set();
      if (e.metaKey) activeModifiers.add('meta');
      if (e.ctrlKey) activeModifiers.add('ctrl');
      if (e.shiftKey) activeModifiers.add('shift');
      if (e.altKey) activeModifiers.add('alt');
      activeModifiers.add(e.key.toLowerCase());

      const matches = keys.every((k) => activeModifiers.has(k.toLowerCase()));
      if (matches) {
        if (preventDefault) e.preventDefault();
        callback(e);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
