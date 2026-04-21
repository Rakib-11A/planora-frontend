import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

export type DataTableShellVariant = 'default' | 'glass';

export interface DataTableShellProps extends ComponentPropsWithoutRef<'div'> {
  variant?: DataTableShellVariant;
}

/**
 * DataTableShell — horizontal-scroll wrapper for wide tables on small screens.
 * Default variant is theme-reactive (semantic tokens). Glass variant is
 * retained for legacy marketing surfaces.
 */
export function DataTableShell({ className, variant = 'default', ...rest }: DataTableShellProps) {
  return (
    <div
      className={cn(
        'overflow-x-auto',
        variant === 'glass'
          ? 'rounded-xl border border-white/35 bg-white/50 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-slate-900/50'
          : 'bg-surface border-border rounded-lg border shadow-sm',
        className
      )}
      {...rest}
    />
  );
}
