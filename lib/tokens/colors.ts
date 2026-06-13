export const colors = {
  bg: {
    void:     '#020510',
    deep:     '#060d1c',
    surface:  '#0a1428',
    elevated: '#0f1d35',
    glass:    'rgba(10, 20, 40, 0.6)',
    overlay:  'rgba(2, 5, 16, 0.85)',
  },

  cyan: {
    50:      '#e0f9ff',
    100:     '#b3f0ff',
    200:     '#80e7ff',
    300:     '#4dddff',
    400:     '#1ad4ff',
    DEFAULT: '#00d4ff',
    600:     '#00aace',
    700:     '#00809e',
    800:     '#00576e',
    900:     '#002d3e',
    dim:     'rgba(0, 212, 255, 0.12)',
    glow:    'rgba(0, 212, 255, 0.25)',
  },

  blue: {
    light:   '#60a5fa',
    DEFAULT: '#0066ff',
    dark:    '#0052cc',
    dim:     'rgba(0, 102, 255, 0.12)',
    glow:    'rgba(0, 102, 255, 0.25)',
  },

  purple: {
    light:   '#a78bfa',
    DEFAULT: '#7c3aed',
    dark:    '#6d28d9',
    dim:     'rgba(124, 58, 237, 0.15)',
    glow:    'rgba(124, 58, 237, 0.25)',
  },

  teal: {
    light:   '#2dd4bf',
    DEFAULT: '#14b8a6',
    dark:    '#0d9488',
    dim:     'rgba(20, 184, 166, 0.12)',
    glow:    'rgba(20, 184, 166, 0.25)',
  },

  emerald: {
    DEFAULT: '#00c896',
    dim:     'rgba(0, 200, 150, 0.12)',
  },

  text: {
    primary:  '#e2f4ff',
    secondary:'#8bacc0',
    muted:    '#4a6a80',
    disabled: '#2a3a48',
  },

  border: {
    DEFAULT: 'rgba(0, 212, 255, 0.1)',
    hover:   'rgba(0, 212, 255, 0.35)',
    active:  'rgba(0, 212, 255, 0.6)',
    subtle:  'rgba(0, 212, 255, 0.05)',
  },

  status: {
    success:    '#22c55e',
    successDim: 'rgba(34, 197, 94, 0.12)',
    warning:    '#f59e0b',
    warningDim: 'rgba(245, 158, 11, 0.12)',
    danger:     '#ef4444',
    dangerDim:  'rgba(239, 68, 68, 0.12)',
    info:       '#3b82f6',
    infoDim:    'rgba(59, 130, 246, 0.12)',
  },
} as const;

export type Colors = typeof colors;
