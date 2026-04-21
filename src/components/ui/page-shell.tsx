import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

export interface PageShellProps extends ComponentPropsWithoutRef<'div'> {
  /** Max width token: `default` (3xl), `wide` (4xl), `full` (7xl). */
  size?: 'default' | 'wide' | 'full';
}

const sizeClass: Record<NonNullable<PageShellProps['size']>, string> = {
  default: 'max-w-3xl',
  wide: 'max-w-4xl',
  full: 'max-w-7xl',
};

export function PageShell({ className, size = 'default', ...rest }: PageShellProps) {
  return (
    <div
      className={cn('mx-auto w-full px-4 py-10', sizeClass[size], className)}
      {...rest}
    />
  );
}
