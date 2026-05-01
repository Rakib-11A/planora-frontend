import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

export type DataTableShellVariant = 'default' | 'glass';

export interface DataTableShellProps extends ComponentPropsWithoutRef<'div'> {
  variant?: DataTableShellVariant;
}

/**
 * DataTableShell — horizontal-scroll wrapper for wide tables on small screens.
 *
 * The `'glass'` variant is retired in Phase 2 — the prop still type-checks
 * but renders identical to `'default'` (Apex semantic surface). Phase 3
 * removes the variant and the call-site overrides.
 */
export function DataTableShell({ className, variant: _variant, ...rest }: DataTableShellProps) {
  return (
    <div
      className={cn(
        'bg-surface border-border overflow-x-auto rounded-lg border shadow-low',
        className
      )}
      {...rest}
    />
  );
}
