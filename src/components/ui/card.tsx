import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** Slightly tighter padding for dense tables (e.g. admin). */
  padding?: 'default' | 'none' | 'sm';
}

const paddingMap = {
  default: 'p-6',
  sm: 'p-4',
  none: 'p-0',
} as const;

export function Card({ className, padding = 'default', ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'border-planora-border rounded-lg border bg-white shadow-sm',
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
