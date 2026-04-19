import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

export interface DataTableShellProps extends ComponentPropsWithoutRef<'div'> {}

/** Horizontal scroll wrapper for wide tables on small screens. */
export function DataTableShell({ className, ...rest }: DataTableShellProps) {
  return (
    <div
      className={cn(
        'border-planora-border overflow-x-auto rounded-lg border bg-white shadow-sm',
        className
      )}
      {...rest}
    />
  );
}
