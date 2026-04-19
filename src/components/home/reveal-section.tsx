'use client';

import type { ReactNode } from 'react';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

export type RevealSectionVariant = 'white' | 'muted' | 'gradient';

const variantClass: Record<RevealSectionVariant, string> = {
  white: 'bg-white',
  muted: 'bg-slate-50',
  gradient: 'bg-gradient-to-b from-indigo-50/50 via-white to-slate-50/80',
};

export interface RevealSectionProps {
  children: ReactNode;
  variant?: RevealSectionVariant;
  className?: string;
}

export function RevealSection({ children, variant = 'white', className }: RevealSectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.08, once: true });

  return (
    <section
      ref={ref}
      className={cn('px-4 py-20 md:py-32', variantClass[variant], className)}
    >
      <div
        className={cn(
          'motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out',
          isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        )}
      >
        {children}
      </div>
    </section>
  );
}
