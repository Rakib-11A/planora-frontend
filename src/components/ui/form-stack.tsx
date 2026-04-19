import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

export type FormStackProps = ComponentPropsWithoutRef<'div'>;

export function FormStack({ className, ...rest }: FormStackProps) {
  return <div className={cn('flex flex-col gap-4', className)} {...rest} />;
}
