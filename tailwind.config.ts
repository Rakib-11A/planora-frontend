import type { Config } from 'tailwindcss';

/**
 * Tailwind v4 config bridge (referenced from globals.css via `@config`).
 *
 * Color tokens are split in two layers:
 *   1. Semantic tokens (`bg-background`, `text-foreground`, `bg-surface`, `bg-primary`,
 *      `text-muted`, `border-border`, `ring-ring`, ...) are declared in globals.css
 *      under `@theme inline` so they read CSS variables and switch with the `.dark`
 *      class applied by next-themes.
 *   2. Legacy `planora.*` aliases (below) are now rewired to the same CSS variables so
 *      every existing `bg-planora-primary` / `text-planora-muted` call site becomes
 *      dark-mode reactive without a component edit. Step 2 of the redesign migrates
 *      primitives away from these aliases.
 *
 * Dark mode toggling is handled via CSS:
 *   @custom-variant dark (&:where(.dark, .dark *));
 * in globals.css — no `darkMode` key needed here.
 */
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        /** Legacy brand aliases — wired to semantic CSS vars so they follow light/dark. */
        planora: {
          primary: 'var(--primary)',
          'primary-foreground': 'var(--primary-foreground)',
          /** Retained as static for legacy gradients/illustrations; new work should avoid. */
          secondary: '#0EA5E9',
          'secondary-foreground': '#0F172A',
          accent: '#F59E0B',
          'accent-foreground': '#1C1917',
          muted: 'var(--muted)',
          surface: 'var(--surface-subtle)',
          border: 'var(--border)',
          danger: 'var(--destructive)',
          'danger-foreground': 'var(--destructive-foreground)',
        },
        /** Glass / blur overlay stops (use with backdrop-blur-*). Legacy only. */
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(0, 0, 0, 0.1)',
        },
        /** Soft glow tints aligned to planora palette. Legacy only. */
        glow: {
          primary: 'rgba(79, 70, 229, 0.3)',
          secondary: 'rgba(14, 165, 233, 0.3)',
          accent: 'rgba(245, 158, 11, 0.28)',
          rose: 'rgba(236, 72, 153, 0.22)',
        },
        /** Brand gradient stops: indigo → sky → amber. Legacy only. */
        gradient: {
          from: '#4F46E5',
          via: '#0EA5E9',
          to: '#F59E0B',
        },
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      /**
       * Shadow scale — used by primitives (buttons, cards, menus).
       * Step 2 (primitive audit) trims/consolidates; for now both
       * legacy and semantic names coexist so nothing breaks.
       */
      boxShadow: {
        /* Semantic scale (preferred for new work) */
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
        md: '0 4px 6px -1px rgb(15 23 42 / 0.06), 0 2px 4px -2px rgb(15 23 42 / 0.06)',
        lg: '0 10px 15px -3px rgb(15 23 42 / 0.08), 0 4px 6px -4px rgb(15 23 42 / 0.06)',
        xl: '0 20px 25px -5px rgb(15 23 42 / 0.08), 0 8px 10px -6px rgb(15 23 42 / 0.06)',

        /* Legacy names — still referenced by hero / cta / navbar glass surfaces */
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glow-primary': '0 0 20px rgba(79, 70, 229, 0.35)',
        'glow-secondary': '0 0 20px rgba(14, 165, 233, 0.28)',
        lifted: '0 20px 40px -12px rgba(0, 0, 0, 0.12)',
        'lifted-lg': '0 24px 48px -10px rgba(0, 0, 0, 0.18)',
        'depth-soft':
          '0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06)',
        pressed: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        xl: '24px',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(79, 70, 229, 0.35)' },
          '50%': { boxShadow: '0 0 36px rgba(79, 70, 229, 0.55)' },
        },
        blobFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(12px, -18px) scale(1.03)' },
          '66%': { transform: 'translate(-10px, 10px) scale(0.97)' },
        },
        menuDown: {
          '0%': { opacity: '0', transform: 'translateY(-6px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'blob-float': 'blobFloat 18s ease-in-out infinite',
        'menu-down': 'menuDown 0.22s ease-out both',
      },
    },
  },
};

export default config;
