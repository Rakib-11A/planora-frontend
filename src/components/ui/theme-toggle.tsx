'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

/**
 * Three-state theme cycle: light → dark → system → light.
 *
 * Renders an accessible icon button that shows the *currently applied* icon and
 * announces the *next* state via aria-label — Stripe/Linear-style minimalism:
 * no dropdown, no labels, one tap.
 *
 * The button is visually context-neutral (transparent background, foreground-
 * tinted hover) so it sits cleanly in the glass navbar, on solid surfaces, or
 * anywhere else without a specific backdrop.
 *
 * Guards against hydration mismatch: next-themes cannot know the resolved theme
 * on the server, so we render a neutral placeholder until mounted.
 */
export interface ThemeToggleProps {
  /** Extra classes (e.g. to tweak spacing in the navbar). */
  className?: string;
}

type Theme = 'light' | 'dark' | 'system';

const ORDER: readonly Theme[] = ['light', 'dark', 'system'] as const;

function nextTheme(current: Theme): Theme {
  const i = ORDER.indexOf(current);
  return ORDER[(i + 1) % ORDER.length] ?? 'system';
}

function iconFor(theme: Theme) {
  if (theme === 'light') return Sun;
  if (theme === 'dark') return Moon;
  return Monitor;
}

function labelForNext(next: Theme): string {
  if (next === 'light') return 'Switch to light theme';
  if (next === 'dark') return 'Switch to dark theme';
  return 'Use system theme';
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const current: Theme = (theme as Theme | undefined) ?? 'system';
  const Icon = iconFor(current);
  const upcoming = nextTheme(current);

  const base = cn(
    'inline-flex size-9 items-center justify-center rounded-full',
    'text-foreground/80 hover:text-foreground',
    // Transparent background + hover tint → sits on glass or solid surfaces.
    'bg-transparent hover:bg-foreground/10',
    'motion-safe:transition-colors motion-safe:duration-150',
    'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    className
  );

  if (!mounted) {
    // Matching size avoids layout shift on hydration.
    return <span className={base} aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(upcoming)}
      className={base}
      aria-label={labelForNext(upcoming)}
      title={labelForNext(upcoming)}
    >
      <Icon className="size-[18px]" aria-hidden />
    </button>
  );
}
