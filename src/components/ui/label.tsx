import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

export type LabelProps = ComponentPropsWithoutRef<'label'>;

export function Label({ className, ...rest }: LabelProps) {
  return (
    <label
      className={cn('text-foreground block text-sm font-medium', className)}
      {...rest}
    />
  );
}
