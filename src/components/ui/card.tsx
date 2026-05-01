'use client';

import { ArrowRight, Calendar, Clock, MapPin, Star, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type ComponentPropsWithoutRef } from 'react';

import { routes } from '@/constants/config';
import type { EventWithType } from '@/types/event';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

/**
 * Apex Card System — A robust, responsive card component with guaranteed uniform height.
 *
 * Design System Compliance:
 *   - Apex §5A: rounded-md (8px), surface bg, shadow-low
 *   - Apex §2: Color tokens (--color-surface, --color-border, etc.)
 *   - Apex §3: Typography scale (.text-h4, .text-body-r, .text-caption)
 *   - 8pt Grid: Consistent spacing using Tailwind's gap/padding scale
 *
 * Key Features:
 *   - Uniform height regardless of content length (flex-col + h-full)
 *   - Line clamping for title (2 lines) and description (3 lines)
 *   - Fixed aspect ratio image (16:9)
 *   - CTA button always aligned at bottom
 *   - Skeleton loader companion component
 */

// ============================================================================
// Card Container (Base)
// ============================================================================

export type CardVariant = 'default' | 'glass';

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  padding?: 'default' | 'none' | 'sm';
  variant?: CardVariant;
}

const paddingMap = {
  default: 'p-6',
  sm: 'p-4',
  none: 'p-0',
} as const;

export function Card({ className, padding = 'default', variant: _variant, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface text-foreground border-border rounded-md border shadow-low',
        paddingMap[padding],
        className
      )}
      {...rest}
    />
  );
}

export function CardTitle({ className, ...rest }: ComponentPropsWithoutRef<'h2'>) {
  return <h2 className={cn('text-foreground text-lg font-semibold', className)} {...rest} />;
}

export function CardDescription({ className, ...rest }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('text-muted mt-1 text-sm', className)} {...rest} />;
}

// ============================================================================
// Apex Event Card (Uniform Height System)
// ============================================================================

export interface ApexCardProps {
  event: EventWithType;
  className?: string;
  priority?: boolean; // For next/image priority on first cards
}

/**
 * Returns the event start date — prefers startDateTime, falls back to dateTime.
 */
function getStartDateTime(event: EventWithType): string {
  return event.startDateTime ?? event.dateTime;
}

/**
 * Returns the organizer name — prefers organizer, falls back to createdBy.
 */
function getOrganizerName(event: EventWithType): string {
  return event.organizer?.name ?? event.createdBy?.name ?? 'Unknown';
}

/**
 * Returns the location label — prefers location, falls back to venue, defaults to 'Online'.
 */
function getLocationLabel(event: EventWithType): string {
  const raw = (event.location ?? event.venue ?? '').trim();
  return raw.length > 0 ? raw : 'Online';
}

/**
 * Returns the registration fee as a number.
 */
function getRegistrationFee(event: EventWithType): number {
  const n = typeof event.fee === 'number' ? event.fee : Number(event.fee);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Badge metadata for fee display.
 */
function getFeeBadge(fee: number): { label: string; className: string } {
  if (fee === 0) {
    return {
      label: 'FREE',
      className: cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide',
        'bg-success-subtle text-success'
      ),
    };
  }
  return {
    label: formatCurrency(fee, 'BDT', 'en-BD'),
    className: cn(
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide',
      'bg-primary-subtle text-primary-subtle-foreground'
    ),
  };
}

/**
 * Badge metadata for visibility (Public/Private).
 */
function getVisibilityBadge(isPublic: boolean): { label: string; className: string } {
  if (isPublic) {
    return {
      label: 'PUBLIC',
      className: cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide',
        'bg-surface-subtle text-muted-strong border border-border'
      ),
    };
  }
  return {
    label: 'PRIVATE',
    className: cn(
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide',
      'bg-primary-subtle text-primary'
    ),
  };
}

/**
 * Apex Event Card — Uniform height card with line clamping and flex-col layout.
 *
 * Height Consistency Strategy:
 *   1. Parent grid cell provides fixed height via grid-rows
 *   2. Card uses flex-col + h-full to fill the cell
 *   3. Content sections use flex-shrink-0 where height must be fixed
 *   4. Title/description use line-clamp to prevent overflow
 *   5. CTA button uses mt-auto to stay at bottom
 */
export function ApexCard({ event, className, priority = false }: ApexCardProps) {
  const startDateTime = getStartDateTime(event);
  const fee = getRegistrationFee(event);
  const feeBadge = getFeeBadge(fee);
  const visibilityBadge = getVisibilityBadge(event.isPublic);
  const organizerName = getOrganizerName(event);
  const locationLabel = getLocationLabel(event);

  const formattedDate = formatDate(startDateTime, undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Link
      href={routes.event(event.id)}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-md border border-border bg-surface',
        'shadow-low transition-all duration-200',
        'hover:-translate-y-0.5 hover:border-border-strong hover:shadow-medium',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        className
      )}
      aria-label={`View event: ${event.title}`}
    >
      {/* Image Section — Fixed 16:9 aspect ratio */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-surface-subtle">
        <Image
          src={`/images/events/${event.id}.jpg`}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // Fallback: hide broken image, show gradient background
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.classList.add('bg-gradient-to-br', 'from-primary/20', 'via-primary/10', 'to-surface-subtle');
            }
          }}
        />
        {/* Gradient overlay for text readability (when needed) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/0 to-black/0" />
      </div>

      {/* Content Section — Flex-col with h-full ensures uniform card height */}
      <div className="flex min-h-0 flex-1 flex-col p-4">
        {/* Badges Row — Fixed height */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={feeBadge.className}>{feeBadge.label}</span>
          <span className={visibilityBadge.className}>{visibilityBadge.label}</span>
        </div>

        {/* Title — Line clamp (max 2 lines) */}
        <h3 className="text-h4 text-foreground mb-3 line-clamp-2 font-semibold transition-colors group-hover:text-primary">
          {event.title}
        </h3>

        {/* Description — Line clamp (max 3 lines) */}
        {event.description ? (
          <p className="text-body-r text-muted mb-4 line-clamp-3 leading-relaxed">
            {event.description}
          </p>
        ) : null}

        {/* Meta Information — Fixed height rows */}
        <div className="mt-auto flex flex-col gap-2 border-t border-border pt-3">
          {/* Date & Time */}
          <p className="text-caption text-muted flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-primary/70" aria-hidden />
            <span className="truncate">{formattedDate}</span>
          </p>

          {/* Location */}
          <p className="text-caption text-muted flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-primary/70" aria-hidden />
            <span className="truncate" title={locationLabel}>
              {locationLabel}
            </span>
          </p>

          {/* Organizer */}
          <p className="text-caption text-muted flex items-center gap-2">
            <User className="size-4 shrink-0 text-primary/70" aria-hidden />
            <span className="truncate" title={organizerName}>
              {organizerName}
            </span>
          </p>

          {/* Rating (if available) */}
          {event.avgRating > 0 ? (
            <p className="text-caption flex items-center gap-1.5 font-medium text-amber-600">
              <Star className="size-3.5 shrink-0 fill-amber-400" aria-hidden />
              <span>{event.avgRating.toFixed(1)}</span>
              <span className="text-muted">({event.totalReviews})</span>
            </p>
          ) : null}
        </div>

        {/* CTA Button — mt-auto ensures it stays at bottom */}
        <div className="mt-4 flex shrink-0 items-center justify-center">
          <button
            type="button"
            className={cn(
              'inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary/30',
              'bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary shadow-sm',
              'transition-all duration-200',
              'hover:border-primary/50 hover:bg-primary/10 hover:shadow-md',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              'group-hover/btn:translate-x-0.5'
            )}
            aria-label={`View details for ${event.title}`}
          >
            View Details
            <ArrowRight
              className="size-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-1"
              aria-hidden
            />
          </button>
        </div>
      </div>
    </Link>
  );
}
