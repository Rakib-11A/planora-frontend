import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

export type LogoSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<LogoSize, string> = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
};

export interface LogoProps extends Omit<
  ComponentPropsWithoutRef<typeof Link>,
  'href' | 'children'
> {
  size?: LogoSize;
  className?: string;
}

export function Logo({ size = 'md', className, ...rest }: LogoProps) {
  return (
    <Link
      href={routes.home}
      className={cn(
        'text-planora-primary focus-visible:ring-planora-primary font-bold transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      Planora
    </Link>
  );
}
