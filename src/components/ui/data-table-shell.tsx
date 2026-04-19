import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

export type DataTableShellVariant = 'default' | 'glass';

export interface DataTableShellProps extends ComponentPropsWithoutRef<'div'> {
  variant?: DataTableShellVariant;
}

/** Horizontal scroll wrapper for wide tables on small screens. */
export function DataTableShell({ className, variant = 'default', ...rest }: DataTableShellProps) {
  return (
    <div
      className={cn(
        'overflow-x-auto',
        variant === 'glass'
          ? 'rounded-2xl border border-white/35 bg-white/50 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/50'
          : 'border-planora-border rounded-lg border bg-white shadow-sm',
        className
      )}
      {...rest}
    />
  );
}
