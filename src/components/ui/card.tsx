import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

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
              'rounded-3xl border border-white/35 bg-white/60 shadow-lifted shadow-depth-soft backdrop-blur-xl',
              'dark:border-white/15 dark:bg-slate-900/55',
              'motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary'
            )
          : cn('border-planora-border rounded-lg border bg-white shadow-sm'),
        paddingMap[padding],
        className
      )}
      {...rest}
    />
  );
}

export function CardTitle({ className, ...rest }: ComponentPropsWithoutRef<'h2'>) {
  return <h2 className={cn('text-lg font-semibold text-slate-900', className)} {...rest} />;
}

export function CardDescription({ className, ...rest }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('text-planora-muted mt-1 text-sm', className)} {...rest} />;
}
