'use client';

import { cn } from '@/lib/utils';

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ title, subtitle, className, align = 'center' }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-10 md:mb-12',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className
      )}
    >
      <div className={cn('inline-block max-w-3xl', align === 'center' && 'mx-auto')}>
        <h2 className="gradient-text text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
        <div
          className={cn(
            'mt-2 h-1 w-24 rounded-full bg-gradient-to-r from-planora-primary to-planora-secondary',
            align === 'center' && 'mx-auto'
          )}
          aria-hidden
        />
        {subtitle ? <p className="mt-4 text-base text-gray-600 md:text-lg">{subtitle}</p> : null}
      </div>
    </div>
  );
}
