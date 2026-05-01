'use client';

import { Calendar, Clock, MapPin, User, Users } from 'lucide-react';
import { type ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * SpecsTable — A professional, minimal table for displaying key specifications.
 *
 * Design System Compliance:
 *   - Apex §2: Color tokens (--color-border, --color-muted, etc.)
 *   - Apex §5A: rounded-md borders, clean dividers
 *   - Apex §3: .text-caption for labels, .text-body for values
 *
 * Features:
 *   - Icon + label for each spec
 *   - Responsive grid layout (stacks on mobile)
 *   - Clean border dividers
 *   - Dark mode support
 */

export interface SpecItem {
  /** Unique identifier for the spec */
  id: string;
  /** Display label (e.g., "Date", "Location") */
  label: string;
  /** Display value (e.g., "Jan 15, 2025", "New York") */
  value: string;
  /** Optional icon component */
  icon?: ReactNode;
  /** Optional tooltip or additional info */
  tooltip?: string;
}

export interface SpecsTableProps {
  /** Array of specification items to display */
  specs: SpecItem[];
  /** Layout variant */
  variant?: 'grid' | 'list';
  /** Additional classes for the container */
  className?: string;
  /** Title for the specs section */
  title?: string;
}

/**
 * Default icon mapper for common spec types
 */
function getDefaultIcon(label: string): ReactNode {
  const lower = label.toLowerCase();
  if (lower.includes('date') || lower.includes('time')) {
    return <Calendar className="size-4 shrink-0 text-primary/70" aria-hidden />;
  }
  if (lower.includes('location') || lower.includes('venue') || lower.includes('place')) {
    return <MapPin className="size-4 shrink-0 text-primary/70" aria-hidden />;
  }
  if (lower.includes('organizer') || lower.includes('host')) {
    return <User className="size-4 shrink-0 text-primary/70" aria-hidden />;
  }
  if (lower.includes('capacity') || lower.includes('attendee') || lower.includes('participant')) {
    return <Users className="size-4 shrink-0 text-primary/70" aria-hidden />;
  }
  if (lower.includes('duration') || lower.includes('length')) {
    return <Clock className="size-4 shrink-0 text-primary/70" aria-hidden />;
  }
  return null;
}

/**
 * Single Spec Row Component
 */
function SpecRow({ spec }: { spec: SpecItem }) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 py-3',
        'border-b border-border last:border-b-0'
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-lg',
          'bg-primary-subtle dark:bg-primary/20'
        )}
      >
        {spec.icon || getDefaultIcon(spec.label)}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <dt className="text-caption text-muted font-medium uppercase tracking-wide">
          {spec.label}
        </dt>
        <dd className="text-body text-foreground mt-0.5 font-medium">{spec.value}</dd>
        {spec.tooltip ? (
          <p className="text-caption text-muted mt-1">{spec.tooltip}</p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * SpecsTable — Main component
 */
export function SpecsTable({
  specs,
  variant = 'list',
  title,
  className,
}: SpecsTableProps) {
  if (specs.length === 0) return null;

  return (
    <section className={cn('w-full', className)}>
      {title ? (
        <h2 className="text-h4 text-foreground mb-4 font-semibold">{title}</h2>
      ) : null}

      {variant === 'grid' ? (
        /* Grid Layout — 2 columns on desktop */
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {specs.map((spec) => (
            <div
              key={spec.id}
              className={cn(
                'rounded-md border border-border bg-surface p-4 shadow-sm',
                'transition-colors duration-200 hover:border-border-strong'
              )}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg',
                    'bg-primary-subtle dark:bg-primary/20'
                  )}
                >
                  {spec.icon || getDefaultIcon(spec.label)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <dt className="text-caption text-muted font-medium uppercase tracking-wide">
                    {spec.label}
                  </dt>
                  <dd className="text-body text-foreground mt-0.5 font-medium truncate">
                    {spec.value}
                  </dd>
                  {spec.tooltip ? (
                    <p className="text-caption text-muted mt-1 line-clamp-2">
                      {spec.tooltip}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </dl>
      ) : (
        /* List Layout — Vertical stack */
        <dl className="divide-y divide-border rounded-md border border-border bg-surface shadow-sm">
          {specs.map((spec) => (
            <SpecRow key={spec.id} spec={spec} />
          ))}
        </dl>
      )}
    </section>
  );
}

/**
 * SpecsTableSkeleton — Skeleton loader for the specs table
 */
export function SpecsTableSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="divide-y divide-border rounded-md border border-border bg-surface p-4 shadow-sm">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 py-3">
          <div className="size-9 shrink-0 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Preset spec builders for common use cases
 */
export const createSpecs = {
  /**
   * Create specs for an event
   */
  forEvent: (event: {
    startDateTime?: string;
    venue?: string;
    organizer?: { name: string } | null;
    participationCount?: number;
    formattedDate?: string;
  }): SpecItem[] => {
    const specs: SpecItem[] = [];

    if (event.formattedDate) {
      specs.push({
        id: 'date',
        label: 'Date & Time',
        value: event.formattedDate,
      });
    }

    if (event.venue) {
      specs.push({
        id: 'location',
        label: 'Location',
        value: event.venue,
      });
    }

    if (event.organizer?.name) {
      specs.push({
        id: 'organizer',
        label: 'Organizer',
        value: event.organizer.name,
      });
    }

    if (event.participationCount !== undefined) {
      specs.push({
        id: 'capacity',
        label: 'Participants',
        value: event.participationCount.toString(),
      });
    }

    return specs;
  },
};
