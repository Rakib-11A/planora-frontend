'use client';

import { Calendar, Clock, MapPin, User } from 'lucide-react';
import Link from 'next/link';

import { routes } from '@/constants/config';
import type { EventWithType } from '@/types/event';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

export type EventCardVariant = 'default' | 'featured' | 'compact';

export interface EventCardProps {
  event: EventWithType;
  variant?: EventCardVariant;
  showActions?: boolean;
}

/** Matches `Button` primary + md size for footer CTA (Button is not polymorphic). */
const linkButtonPrimaryClass =
  'inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary bg-planora-primary text-white hover:bg-planora-primary/90';

function getStartDateTime(event: EventWithType): string {
  return event.startDateTime ?? event.dateTime;
}

function getOrganizerName(event: EventWithType): string {
  return event.organizer?.name ?? event.createdBy?.name ?? 'Unknown';
}

function getLocationLabel(event: EventWithType): string {
  const raw = (event.location ?? event.venue ?? '').trim();
  return raw.length > 0 ? raw : 'Online';
}

function getRegistrationFee(event: EventWithType): number {
  const n = typeof event.fee === 'number' ? event.fee : Number(event.fee);
  return Number.isFinite(n) ? n : 0;
}

function feeBadgeContent(event: EventWithType): { label: string; className: string } {
  const fee = getRegistrationFee(event);
  if (fee === 0) {
    return { label: 'FREE', className: 'bg-green-100 text-green-800' };
  }
  return {
    label: formatCurrency(fee),
    className: 'bg-blue-100 text-blue-800',
  };
}

function typeBadge(event: EventWithType): { label: string; className: string } {
  if (event.isPublic) {
    return { label: 'PUBLIC', className: 'bg-gray-100 text-gray-800' };
  }
  return { label: 'PRIVATE', className: 'bg-purple-100 text-purple-800' };
}

export function EventCard({ event, variant = 'default', showActions = false }: EventCardProps) {
  const start = getStartDateTime(event);
  const feeBadge = feeBadgeContent(event);
  const visibilityBadge = typeBadge(event);
  const organizerName = getOrganizerName(event);
  const locationLabel = getLocationLabel(event);

  const cardAriaLabel = `View event: ${event.title}, ${formatDate(start)}`;

  const heroHeight = variant === 'featured' ? 'h-64' : variant === 'compact' ? 'h-32' : 'h-48';

  const heroGradient = event.isPublic
    ? 'bg-gradient-to-br from-planora-primary to-planora-secondary'
    : 'bg-gradient-to-br from-purple-500 to-pink-500';

  const shellClass = cn(
    'group w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg',
    variant === 'default' && 'max-w-sm',
    variant === 'compact' && 'max-w-xs',
    !showActions && 'cursor-pointer'
  );

  const hero = (
    <div
      role="img"
      aria-label="Event image placeholder"
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none',
        heroHeight,
        heroGradient,
        variant === 'featured' && 'md:rounded-l-lg md:rounded-r-none',
        variant !== 'featured' && 'rounded-t-lg',
        variant === 'compact' && 'rounded-t-lg'
      )}
    >
      <Calendar className="size-12 text-white/90 drop-shadow-sm" aria-hidden />
    </div>
  );

  const badges = (
    <div className="flex flex-wrap gap-2">
      <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', feeBadge.className)}>
        {feeBadge.label}
      </span>
      <span
        className={cn(
          'rounded-full px-2.5 py-0.5 text-xs font-semibold',
          visibilityBadge.className
        )}
      >
        {visibilityBadge.label}
      </span>
    </div>
  );

  const metaBlock = (
    <div
      className={cn(
        'flex flex-col gap-2 text-gray-600',
        variant === 'compact' && 'gap-1 text-xs',
        variant === 'featured' && 'text-sm'
      )}
    >
      <p
        className={cn(
          'text-foreground flex items-center gap-2 font-medium',
          variant === 'compact' && 'text-sm'
        )}
      >
        <Clock className="text-planora-primary size-4 shrink-0" aria-hidden />
        <span>
          {formatDate(start, undefined, {
            weekday: variant === 'compact' ? undefined : 'short',
            year: 'numeric',
            month: variant === 'compact' ? 'numeric' : 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </span>
      </p>
      {variant !== 'compact' ? (
        <p className="flex items-start gap-2 text-sm">
          <MapPin className="text-planora-primary mt-0.5 size-4 shrink-0" aria-hidden />
          <span className="line-clamp-2">{locationLabel}</span>
        </p>
      ) : null}
      {variant !== 'compact' ? (
        <p className="flex items-center gap-2 text-sm">
          <User className="text-planora-primary size-4 shrink-0" aria-hidden />
          <span className="truncate">{organizerName}</span>
        </p>
      ) : null}
    </div>
  );

  const titleClass = cn(
    'line-clamp-2 font-semibold text-foreground',
    variant === 'featured' && 'text-xl md:text-2xl',
    variant === 'default' && 'text-lg',
    variant === 'compact' && 'text-base'
  );

  const body = (
    <div
      className={cn(
        'flex flex-1 flex-col p-4',
        variant === 'compact' && 'p-3',
        variant === 'featured' && 'md:py-6 md:pr-6'
      )}
    >
      <h2 className={titleClass}>{event.title}</h2>
      <div className="mt-3">{metaBlock}</div>
      <div className="mt-3">{badges}</div>
      {variant === 'featured' ? (
        <p className="mt-3 text-sm leading-relaxed break-words text-gray-600">
          {event.description}
        </p>
      ) : null}
    </div>
  );

  const inner =
    variant === 'featured' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-0">
        <div className="min-w-0">{hero}</div>
        <div className="min-w-0 border-gray-200 md:border-l">{body}</div>
      </div>
    ) : (
      <div className="flex min-w-0 flex-col">
        {hero}
        {body}
      </div>
    );

  const footer = showActions ? (
    <footer className="border-t border-gray-200 px-4 pb-4">
      <Link
        href={routes.event(event.id)}
        className={linkButtonPrimaryClass}
        aria-label={`View details for ${event.title}`}
      >
        View Details
      </Link>
    </footer>
  ) : null;

  if (showActions) {
    return (
      <article className={shellClass}>
        {inner}
        {footer}
      </article>
    );
  }

  return (
    <Link
      href={routes.event(event.id)}
      aria-label={cardAriaLabel}
      className={cn(shellClass, 'block')}
    >
      {inner}
    </Link>
  );
}
