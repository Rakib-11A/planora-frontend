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
      <div className="pointer-events-none absolute inset-0 bg-background" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,var(--primary-subtle)_0,transparent_34%),radial-gradient(circle_at_82%_80%,var(--surface-subtle)_0,transparent_38%)] opacity-80 dark:opacity-45"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 top-1/4 size-72 rounded-full bg-primary/20 blur-3xl motion-safe:animate-blob-float dark:bg-primary/12"
        style={{ animationDelay: '0s' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 size-80 rounded-full bg-primary-subtle blur-3xl motion-safe:animate-blob-float dark:bg-primary/10"
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
