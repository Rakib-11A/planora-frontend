'use client';

import { CalendarX } from 'lucide-react';
import Link from 'next/link';
import { type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { CardSkeletonGrid } from '@/components/ui/card-skeleton';
import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

/**
 * ListingGrid — A robust, responsive grid wrapper for displaying card collections.
 *
 * Grid System (CSS Grid):
 *   - Desktop (lg+): 4 cards per row (grid-cols-4)
 *   - Tablet (sm-lg): 2 cards per row (grid-cols-2)
 *   - Mobile (<sm): 1 card per row (grid-cols-1)
 *
 * Spacing:
 *   - Uses Apex 8pt grid system via Tailwind gap scale
 *   - gap-4 (16px) on mobile/tablet, gap-6 (24px) on desktop
 *
 * Loading State:
 *   - Renders CardSkeletonGrid while data loads
 *   - Prevents Cumulative Layout Shift (CLS)
 *
 * Empty State:
 *   - Shows a polished empty state with icon and CTA
 *
 * @template T - The type of item being rendered
 */

export interface ListingGridProps<T> {
  /** Array of items to render */
  items: T[];
  /** Loading state — when true, shows skeleton grid */
  isLoading?: boolean;
  /** Render function for each item — receives item and index */
  renderItem: (item: T, index: number) => ReactNode;
  /** Optional key extractor — defaults to using index */
  getKey?: (item: T, index: number) => string;
  /** Custom empty state message */
  emptyMessage?: string;
  /** Custom empty state CTA label (set to null to hide CTA) */
  emptyCTALabel?: string | null;
  /** Custom empty state CTA href */
  emptyCTAHref?: string;
  /** Additional classes for the grid container */
  className?: string;
  /** Number of skeleton cards to show while loading (default: 8) */
  skeletonCount?: number;
}

/**
 * Default empty state renderer.
 */
function DefaultEmptyState({
  message,
  ctaLabel,
  ctaHref,
}: {
  message: string;
  ctaLabel: string | null;
  ctaHref?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-border',
        'bg-surface px-6 py-16 text-center',
        'dark:border-border-strong'
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          'flex size-14 items-center justify-center rounded-xl',
          'bg-primary-subtle dark:bg-primary/20'
        )}
      >
        <CalendarX className="size-8 text-primary" aria-hidden />
      </div>
      <p className="max-w-md text-sm leading-relaxed text-muted">{message}</p>
      {ctaLabel && ctaHref ? (
        <Link
          href={ctaHref}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold',
            'bg-primary text-primary-foreground hover:bg-primary-hover',
            'transition-all duration-200 motion-safe:hover:scale-105',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
          )}
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}

/**
 * ListingGrid — Main grid wrapper component.
 *
 * Usage Example:
 * ```tsx
 * <ListingGrid
 *   items={events}
 *   isLoading={isLoading}
 *   renderItem={(event) => <ApexCard event={event} />}
 *   getKey={(event) => event.id}
 *   emptyMessage="No events found"
 *   emptyCTALabel="Browse all events"
 *   emptyCTAHref={routes.events}
 * />
 * ```
 */
export function ListingGrid<T>({
  items,
  isLoading = false,
  renderItem,
  getKey,
  emptyMessage = 'No items to show.',
  emptyCTALabel = 'Browse all',
  emptyCTAHref = routes.events,
  className,
  skeletonCount = 8,
}: ListingGridProps<T>) {
  // Loading state — show skeleton grid
  if (isLoading) {
    return <CardSkeletonGrid count={skeletonCount} className={className} />;
  }

  // Empty state — no items
  if (items.length === 0) {
    return (
      <DefaultEmptyState
        message={emptyMessage}
        ctaLabel={emptyCTALabel}
        ctaHref={emptyCTAHref}
      />
    );
  }

  // Render the grid with items
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6',
        className
      )}
      aria-label="Items grid"
    >
      {items.map((item, index) => {
        const key = getKey ? getKey(item, index) : `${index}`;
        return (
          <div key={key} className="flex h-full">
            {renderItem(item, index)}
          </div>
        );
      })}
    </div>
  );
}

/**
 * ListingGridHeader — Optional header component for the grid section.
 */
export interface ListingGridHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function ListingGridHeader({
  title,
  subtitle,
  action,
  className,
}: ListingGridHeaderProps) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div>
        <h2 className="text-h3 text-foreground">{title}</h2>
        {subtitle ? (
          <p className="text-body-r text-muted mt-1">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="mt-2 sm:mt-0">{action}</div> : null}
    </div>
  );
}
