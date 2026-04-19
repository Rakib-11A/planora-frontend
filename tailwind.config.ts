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
    },
  },
};

export default config;
