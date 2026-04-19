import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface AuthGlassSceneProps {
  children: ReactNode;
  /** Outer wrapper classes (e.g. vertical padding). */
  className?: string;
  /** Min-height utility; align with root `main` padding and page chrome. */
  minHeightClass?: string;
  /** Inner column max width (default matches auth forms). */
  contentMaxWidthClass?: string;
  /** Extra classes on the inner content column. */
  contentClassName?: string;
}

/**
 * Shared atmospheric background (gradient mesh + blurred blobs) used by
 * `(auth)` routes and dashboard change-password for visual consistency.
 */
export function AuthGlassScene({
  children,
  className,
  minHeightClass = 'min-h-[calc(100dvh-6rem)]',
  contentMaxWidthClass = 'max-w-md',
  contentClassName,
}: AuthGlassSceneProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden px-4 py-10 md:py-14',
        minHeightClass,
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-100 via-indigo-50/40 to-sky-50/60 dark:from-slate-950 dark:via-indigo-950/40 dark:to-slate-900"
        aria-hidden
      />
      <div
        className="gradient-animated pointer-events-none absolute inset-0 opacity-[0.12] dark:opacity-[0.08]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 top-1/4 size-72 rounded-full bg-planora-primary/25 blur-3xl motion-safe:animate-blob-float dark:bg-planora-primary/15"
        style={{ animationDelay: '0s' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 size-80 rounded-full bg-planora-secondary/20 blur-3xl motion-safe:animate-blob-float dark:bg-planora-secondary/12"
        style={{ animationDelay: '-6s' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-10 right-1/4 size-56 rounded-full bg-amber-400/15 blur-3xl motion-safe:animate-blob-float dark:bg-amber-500/10"
        style={{ animationDelay: '-12s' }}
        aria-hidden
      />

      <div className={cn('relative z-[1] w-full', contentMaxWidthClass, contentClassName)}>
        {children}
      </div>
    </div>
  );
}
