'use client';

import { cn } from '@/lib/utils';

/**
 * CardSkeleton — Pulsing skeleton loader that mimics the exact anatomy of ApexCard.
 *
 * Purpose:
 *   - Prevents Cumulative Layout Shift (CLS) by occupying the exact same space as the real card
 *   - Provides visual feedback during loading states
 *   - Uses Tailwind's animate-pulse for smooth, performant animation
 *
 * Design System Compliance:
 *   - Matches ApexCard structure pixel-perfectly
 *   - Uses neutral gray palette (bg-slate-200 light / bg-slate-700 dark)
 *   - animate-pulse utility for pulsing effect
 *
 * Usage:
 *   Render 8-12 skeleton cards in the same grid as the real cards while data loads.
 */

export interface CardSkeletonProps {
  className?: string;
}

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-md border border-border bg-surface',
        'shadow-low',
        className
      )}
      aria-hidden="true"
      role="status"
    >
      {/* Image Placeholder — Fixed 16:9 aspect ratio (h-48) */}
      <div className="relative h-48 w-full shrink-0 bg-slate-200 dark:bg-slate-700" />

      {/* Content Section */}
      <div className="flex min-h-0 flex-1 flex-col p-4">
        {/* Badges Row — Two pill placeholders */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>

        {/* Title Placeholder — 2 lines */}
        <div className="mb-3 space-y-2">
          <div className="h-5 w-full rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>

        {/* Description Placeholder — 3 lines */}
        <div className="mb-4 space-y-1.5">
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>

        {/* Meta Information Section — Border top + placeholders */}
        <div className="mt-auto flex flex-col gap-2 border-t border-border pt-3">
          {/* Date line */}
          <div className="flex items-center gap-2">
            <div className="size-4 shrink-0 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>

          {/* Location line */}
          <div className="flex items-center gap-2">
            <div className="size-4 shrink-0 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>

          {/* Organizer line */}
          <div className="flex items-center gap-2">
            <div className="size-4 shrink-0 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>

        {/* CTA Button Placeholder — Fixed height */}
        <div className="mt-4 flex shrink-0 items-center justify-center">
          <div className="h-11 w-full rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * CardSkeletonGrid — Renders a grid of skeleton cards.
 *
 * @param count - Number of skeleton cards to render (default: 8)
 * @param className - Additional classes for the grid container
 */
export interface CardSkeletonGridProps {
  count?: number;
  className?: string;
}

export function CardSkeletonGrid({ count = 8, className }: CardSkeletonGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4',
        className
      )}
      aria-busy="true"
      aria-label="Loading cards"
    >
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}
