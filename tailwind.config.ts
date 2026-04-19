import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        planora: {
          primary: '#4F46E5',
          'primary-foreground': '#F8FAFC',
          secondary: '#0EA5E9',
          'secondary-foreground': '#0F172A',
          accent: '#F59E0B',
          'accent-foreground': '#1C1917',
          muted: '#64748B',
          surface: '#F8FAFC',
          border: '#E2E8F0',
          danger: '#EF4444',
          'danger-foreground': '#FEF2F2',
        },
        /** Glass / blur overlay stops (use with backdrop-blur-*). */
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(0, 0, 0, 0.1)',
        },
        /** Soft glow tints aligned to planora palette. */
        glow: {
          primary: 'rgba(79, 70, 229, 0.3)',
          secondary: 'rgba(14, 165, 233, 0.3)',
          accent: 'rgba(245, 158, 11, 0.28)',
        },
        /** Brand gradient stops: indigo → sky → amber. */
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
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glow-primary': '0 0 20px rgba(79, 70, 229, 0.35)',
        'glow-secondary': '0 0 20px rgba(14, 165, 233, 0.28)',
        lifted: '0 20px 40px -12px rgba(0, 0, 0, 0.12)',
        pressed: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        xl: '24px',
      },
      borderRadius: {
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
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
    },
  },
};

export default config;
