export const shadows = {
  'glow-cyan':    '0 0 20px rgba(0,212,255,0.2), 0 0 40px rgba(0,212,255,0.08)',
  'glow-cyan-sm': '0 0 10px rgba(0,212,255,0.3)',
  'glow-cyan-lg': '0 0 40px rgba(0,212,255,0.3), 0 0 80px rgba(0,212,255,0.12)',
  'glow-blue':    '0 0 20px rgba(0,102,255,0.2), 0 0 40px rgba(0,102,255,0.08)',
  'glow-purple':  '0 0 20px rgba(124,58,237,0.2), 0 0 40px rgba(124,58,237,0.08)',
  'glow-teal':    '0 0 20px rgba(20,184,166,0.2)',
  'glow-emerald': '0 0 20px rgba(0,200,150,0.2)',
  'glow-red':     '0 0 20px rgba(239,68,68,0.2)',
  'glow-amber':   '0 0 20px rgba(245,158,11,0.2)',

  card:          '0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.2)',
  elevated:      '0 8px 40px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3)',
  focus:         '0 0 0 3px rgba(0,212,255,0.15)',

  'inner-top':   'inset 0 1px 0 rgba(0,212,255,0.08)',
  'inner-cyan':  'inset 0 0 24px rgba(0,212,255,0.05)',
  'inner-glow':  'inset 0 0 40px rgba(0,212,255,0.08)',
} as const;

export type Shadows = typeof shadows;
