import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

export type LogoSize = 'sm' | 'md' | 'lg';

export type LogoVariant = 'default' | 'gradient';

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
  variant?: LogoVariant;
  className?: string;
}

export function Logo({ size = 'md', variant = 'default', className, ...rest }: LogoProps) {
  return (
    <Link
      href={routes.home}
      className={cn(
        'focus-visible:ring-planora-primary font-bold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        variant === 'gradient'
          ? cn(
              'gradient-text motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-105'
            )
          : cn('text-planora-primary transition-opacity hover:opacity-90'),
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      Planora
    </Link>
  );
}
