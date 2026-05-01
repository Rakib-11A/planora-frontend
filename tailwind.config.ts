import type { Config } from 'tailwindcss';

/**
 * Tailwind v4 config bridge (referenced from globals.css via `@config`).
 *
 * Color tokens are split in two layers:
 *   1. Semantic tokens (`bg-background`, `text-foreground`, `bg-surface`, `bg-primary`,
 *      `text-muted`, `border-border`, `ring-ring`, ...) are declared in globals.css
 *      under `@theme inline` so they read CSS variables and switch with the `.dark`
 *      class applied by next-themes.
 *   2. Legacy `planora.*` aliases (below) are rewired to the same CSS variables so
 *      every existing `bg-planora-primary` / `text-planora-muted` call site stays
 *      dark-mode reactive without a component edit. Phase 3 retires these aliases
 *      component-by-component.
 *
 * Phase 2 (Apex spec migration):
 *   - decorative palettes (`glass.*` / `glow.*` / `gradient.*`) deleted
 *   - boxShadow scale replaced with Apex three-tier (low / medium / high)
 *     — legacy names remapped to spec equivalents to keep ~30 callsites compiling
 *     while rendering Apex-clean. Phase 3 removes the aliases.
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
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        /** Apex display face — used by .text-h1…h4 utilities and raw <h1>–<h4>. */
        display: [
          'var(--font-display)',
          'var(--font-inter)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      /**
       * Apex shadow scale (spec §5B) — exactly three tiers.
       *   low    → cards, inputs
       *   medium → dropdowns, tooltips
       *   high   → modals, overlays
       *
       * Legacy aliases (`glass`, `glow-primary`, `glow-secondary`, `lifted`,
       * `lifted-lg`, `depth-soft`, `pressed`) are kept and remapped to the
       * spec scale so existing callsites compile and render Apex-clean.
       * Phase 3 removes both the aliases and their usages.
       */
      boxShadow: {
        /* Apex three-tier scale */
        low: '0 1px 3px 0 rgb(0 0 0 / 0.10), 0 1px 2px -1px rgb(0 0 0 / 0.10)',
        medium: '0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)',
        high: '0 20px 25px -5px rgb(0 0 0 / 0.10), 0 8px 10px -6px rgb(0 0 0 / 0.10)',

        /* Tailwind-conventional aliases — point at the Apex tiers so `shadow-sm`,
         * `shadow-md`, `shadow-lg`, etc. behave identically. */
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.10), 0 1px 2px -1px rgb(0 0 0 / 0.10)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)',
        lg: '0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.10), 0 8px 10px -6px rgb(0 0 0 / 0.10)',

        /* Legacy aliases — Phase 3 deletes. Remapped to closest Apex tier. */
        glass: '0 1px 3px 0 rgb(0 0 0 / 0.10), 0 1px 2px -1px rgb(0 0 0 / 0.10)',
        'glow-primary': '0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)',
        'glow-secondary': '0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)',
        lifted: '0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)',
        'lifted-lg': '0 20px 25px -5px rgb(0 0 0 / 0.10), 0 8px 10px -6px rgb(0 0 0 / 0.10)',
        'depth-soft': '0 1px 3px 0 rgb(0 0 0 / 0.10), 0 1px 2px -1px rgb(0 0 0 / 0.10)',
        pressed: 'inset 0 1px 2px 0 rgb(0 0 0 / 0.06)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
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
        /* Retained — auth-glass-scene blobs. Phase 3 deletes the scene + this keyframe. */
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
        'blob-float': 'blobFloat 18s ease-in-out infinite',
        'menu-down': 'menuDown 0.22s ease-out both',
      },
    },
  },
};

export default config;
