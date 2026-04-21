import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Card — content container primitive.
 *
 * `default` is a clean surface card on semantic tokens — reacts to light/dark.
 * `glass` is retained for legacy marketing chrome (hero, CTA). New screens
 * should prefer `default`.
 */
export type CardVariant = 'default' | 'glass';

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** Slightly tighter padding for dense tables (e.g. admin). */
  padding?: 'default' | 'none' | 'sm';
  variant?: CardVariant;
}

const paddingMap = {
  default: 'p-6',
  sm: 'p-4',
  none: 'p-0',
} as const;

export function Card({ className, padding = 'default', variant = 'default', ...rest }: CardProps) {
  return (
    <div
      className={cn(
        variant === 'glass'
          ? cn(
              // Legacy glass — intentionally hardcoded white/slate for marketing aesthetics.
              'rounded-xl border border-white/35 bg-white/60 shadow-lg backdrop-blur-xl',
              'dark:border-white/15 dark:bg-slate-900/55'
            )
          : cn(
              // Semantic default — theme-reactive.
              'bg-surface text-foreground border-border rounded-lg border shadow-sm'
            ),
        paddingMap[padding],
        className
      )}
      {...rest}
    />
  );
}

export function CardTitle({ className, ...rest }: ComponentPropsWithoutRef<'h2'>) {
  return <h2 className={cn('text-foreground text-lg font-semibold', className)} {...rest} />;
}

export function CardDescription({ className, ...rest }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('text-muted mt-1 text-sm', className)} {...rest} />;
}
