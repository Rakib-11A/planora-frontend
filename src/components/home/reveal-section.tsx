'use client';

import type { ReactNode } from 'react';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

/**
 * Alternating section background tokens. Kept semantic so light/dark work
 * without per-variant overrides.
 */
export type RevealSectionVariant = 'surface' | 'subtle';

const variantClass: Record<RevealSectionVariant, string> = {
  surface: 'bg-background',
  subtle: 'bg-surface-subtle',
};

export interface RevealSectionProps {
  children: ReactNode;
  variant?: RevealSectionVariant;
  className?: string;
}

/**
 * Section wrapper for marketing-style routes. Provides:
 *  - consistent vertical rhythm (py-20 md:py-28)
 *  - one of two theme-reactive backgrounds (alternating strips)
 *  - a single subtle fade-up on first visibility (no ambient motion)
 */
export function RevealSection({
  children,
  variant = 'surface',
  className,
}: RevealSectionProps) {
  const { ref, isInView } = useInView({ threshold: 0.08, once: true });

  return (
    <section
      ref={ref}
      className={cn('px-4 py-20 md:py-28', variantClass[variant], className)}
    >
      <div
        className={cn(
          'motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out',
          isInView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
      >
        {children}
      </div>
    </section>
  );
}
