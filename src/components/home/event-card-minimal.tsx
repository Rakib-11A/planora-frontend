import { ArrowUpRight, Calendar, MapPin, Star, User } from 'lucide-react';
import Link from 'next/link';

import { routes } from '@/constants/config';
import type { EventWithType } from '@/types/event';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

export type EventCardMinimalVariant = 'standard' | 'featured';

export interface EventCardMinimalProps {
  event: EventWithType;
  variant?: EventCardMinimalVariant;
  /** Small label above the title — e.g. "Featured" for the highlight slot. */
  eyebrow?: string;
  className?: string;
}

function getStart(event: EventWithType): string {
  return event.startDateTime ?? event.dateTime;
}

function getOrganizer(event: EventWithType): string {
  return event.organizer?.name ?? event.createdBy?.name ?? 'Organizer';
}

function getLocation(event: EventWithType): string {
  const raw = (event.location ?? event.venue ?? '').trim();
  return raw.length > 0 ? raw : 'Online';
}

function getFee(event: EventWithType): number {
  const n = typeof event.fee === 'number' ? event.fee : Number(event.fee);
  return Number.isFinite(n) ? n : 0;
}

function FeePill({ fee }: { fee: number }) {
  const free = fee === 0;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide',
        free
          ? 'text-success bg-success-subtle'
          : 'text-primary-subtle-foreground bg-primary-subtle'
      )}
    >
      {free ? 'Free' : formatCurrency(fee, 'BDT', 'en-BD')}
    </span>
  );
}

/**
 * Minimal event card for the homepage.
 *
 * Typography-driven, no gradient hero, no 3D tilt, no shimmer. Single
 * subtle hover lift (border darken + shadow) to signal interactivity.
 *
 * Two variants:
 *   - `standard`  compact card used in the upcoming grid
 *   - `featured`  wider layout with description + a prominent CTA arrow,
 *                 used once as the homepage highlight
 *
 * Not a replacement for the existing `EventCard` (which stays in use on the
 * /events listing page until Step 4 decides the listing direction).
 */
export function EventCardMinimal({
  event,
  variant = 'standard',
  eyebrow,
  className,
}: EventCardMinimalProps) {
  const start = getStart(event);
  const fee = getFee(event);
  const visibility = event.isPublic ? 'Public' : 'Private';

  const dateLine = formatDate(start, undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const shell = cn(
    'group bg-surface text-foreground border-border block rounded-lg border shadow-sm',
    'motion-safe:transition-[border-color,box-shadow,transform] motion-safe:duration-200',
    'hover:border-border-strong hover:shadow-md motion-safe:hover:-translate-y-0.5',
    'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
  );

  if (variant === 'featured') {
    return (
      <Link
        href={routes.event(event.id)}
        aria-label={`View ${event.title}`}
        className={cn(shell, 'p-6 sm:p-8 md:p-10', className)}
      >
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-primary text-xs font-semibold uppercase tracking-[0.14em]">
                {eyebrow}
              </p>
            ) : null}
            <h3 className="text-foreground group-hover:text-primary mt-3 text-2xl font-semibold tracking-tight transition-colors sm:text-3xl md:text-4xl">
              {event.title}
            </h3>
            {event.description ? (
              <p className="text-muted mt-4 max-w-2xl text-pretty text-sm leading-relaxed sm:text-base">
                {event.description}
              </p>
            ) : null}

            <dl className="text-muted mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 shrink-0" aria-hidden />
                <dt className="sr-only">When</dt>
                <dd>{dateLine}</dd>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" aria-hidden />
                <dt className="sr-only">Where</dt>
                <dd>{getLocation(event)}</dd>
              </div>
              <div className="flex items-center gap-2">
                <User className="size-4 shrink-0" aria-hidden />
                <dt className="sr-only">Organizer</dt>
                <dd>{getOrganizer(event)}</dd>
              </div>
            </dl>
          </div>

          <div className="flex items-start justify-between gap-3 md:flex-col md:items-end md:gap-4">
            <div className="flex gap-2">
              <FeePill fee={fee} />
              <span className="text-muted border-border inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide">
                {visibility}
              </span>
            </div>
            <span className="text-primary inline-flex items-center gap-1 text-sm font-medium">
              View details
              <ArrowUpRight
                className="size-4 motion-safe:transition-transform motion-safe:duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={routes.event(event.id)}
      aria-label={`View ${event.title}`}
      className={cn(shell, 'p-5', className)}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-muted text-xs font-medium uppercase tracking-wide">{dateLine}</p>
        <FeePill fee={fee} />
      </div>
      <h3 className="text-foreground group-hover:text-primary mt-4 line-clamp-2 text-lg font-semibold tracking-tight transition-colors">
        {event.title}
      </h3>
      {event.description ? (
        <p className="text-muted mt-2 line-clamp-2 text-sm leading-relaxed">
          {event.description}
        </p>
      ) : null}

      <div className="text-muted mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="max-w-[14ch] truncate sm:max-w-[22ch]">{getLocation(event)}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <User className="size-3.5 shrink-0" aria-hidden />
          <span className="max-w-[12ch] truncate sm:max-w-[18ch]">{getOrganizer(event)}</span>
        </span>
        {event.avgRating > 0 ? (
          <span className="text-foreground flex items-center gap-1">
            <Star className="size-3.5 shrink-0 fill-current" aria-hidden />
            {event.avgRating.toFixed(1)}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
