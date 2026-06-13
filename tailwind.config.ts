import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './store/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        void: '#020510',
        deep: '#060d1c',
        surface: '#0a1428',
        elevated: '#0f1d35',

        brand: {
          cyan: {
            DEFAULT: '#00d4ff',
            50: '#e0f9ff',
            100: '#b3f0ff',
            200: '#80e7ff',
            300: '#4dddff',
            400: '#1ad4ff',
            600: '#00aace',
            700: '#00809e',
            800: '#00576e',
            900: '#002d3e',
          },
          blue: { DEFAULT: '#0066ff', light: '#60a5fa', dark: '#0052cc' },
          purple: { DEFAULT: '#7c3aed', light: '#a78bfa', dark: '#6d28d9' },
          teal: { DEFAULT: '#14b8a6', light: '#2dd4bf', dark: '#0d9488' },
          emerald: '#00c896',
        },

        // Shadcn-compatible semantic tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-jetbrains)', '"Fira Code"', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
        '3xl': '24px',
      },

      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0,212,255,0.2), 0 0 40px rgba(0,212,255,0.08)',
        'glow-cyan-sm': '0 0 10px rgba(0,212,255,0.3)',
        'glow-cyan-lg': '0 0 40px rgba(0,212,255,0.3), 0 0 80px rgba(0,212,255,0.12)',
        'glow-blue': '0 0 20px rgba(0,102,255,0.2), 0 0 40px rgba(0,102,255,0.08)',
        'glow-purple': '0 0 20px rgba(124,58,237,0.2), 0 0 40px rgba(124,58,237,0.08)',
        'glow-emerald': '0 0 20px rgba(0,200,150,0.2)',
        'glow-red': '0 0 20px rgba(239,68,68,0.2)',
        card: '0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.2)',
        elevated: '0 8px 40px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3)',
        focus: '0 0 0 3px rgba(0,212,255,0.15)',
        'inner-top': 'inset 0 1px 0 rgba(0,212,255,0.08)',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-gradient': 'linear-gradient(135deg, #00d4ff 0%, #0066ff 50%, #7c3aed 100%)',
        'teal-gradient': 'linear-gradient(135deg, #14b8a6 0%, #00d4ff 100%)',
        'void-gradient': 'linear-gradient(135deg, #020510 0%, #060d1c 50%, #020510 100%)',
        'btn-primary': 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)',
      },

      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'fade-up': 'fadeUp 0.35s ease-out forwards',
        'fade-down': 'fadeDown 0.35s ease-out forwards',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'slide-in-right': 'slideInRight 0.35s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.35s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'border-flow': 'borderFlow 3s ease infinite',
        'spin-slow': 'spin 3s linear infinite',
        'data-stream': 'dataStream 2s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,212,255,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(0,212,255,0.4), 0 0 80px rgba(0,212,255,0.1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        borderFlow: {
          '0%, 100%': { borderColor: 'rgba(0,212,255,0.1)' },
          '50%': { borderColor: 'rgba(0,212,255,0.4)' },
        },
        dataStream: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },

      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
      },

      backdropBlur: {
        xs: '2px',
      },

      zIndex: {
        base: '0',
        elevated: '10',
        sticky: '20',
        overlay: '30',
        modal: '40',
        toast: '50',
        tooltip: '60',
      },
    },
  },
  plugins: [],
};

export default config;
