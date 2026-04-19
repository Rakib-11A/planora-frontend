'use client';

import { Calendar, MapPin, User } from 'lucide-react';
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

function numericFee(fee: string | number): number {
  const n = typeof fee === 'number' ? fee : Number(fee);
  return Number.isFinite(n) ? n : 0;
}

function isFreeEvent(event: EventWithType): boolean {
  if (!event.isPaid) return true;
  return numericFee(event.fee) <= 0;
}

function feeBadgeContent(event: EventWithType): { label: string; className: string } {
  if (isFreeEvent(event)) {
    return { label: 'FREE', className: 'bg-green-100 text-green-800' };
  }
  return {
    label: formatCurrency(numericFee(event.fee)),
    className: 'bg-blue-100 text-blue-800',
  };
}

function typeBadge(event: EventWithType): { label: string; className: string } {
  if (event.isPublic) {
    return { label: 'PUBLIC', className: 'bg-gray-100 text-gray-800' };
  }
  return { label: 'PRIVATE', className: 'bg-purple-100 text-purple-800' };
}

const viewDetailsClass =
  'mt-4 inline-flex items-center justify-center rounded-md border-2 border-planora-primary px-4 py-2 text-sm font-medium text-planora-primary transition-colors group-hover:bg-planora-primary/10';

export function EventCard({ event, variant = 'default', showActions = false }: EventCardProps) {
  const feeBadge = feeBadgeContent(event);
  const visibilityBadge = typeBadge(event);
  const organizerName = event.createdBy?.name ?? 'Unknown';
  const ariaLabel = `View event: ${event.title}, ${formatDate(event.dateTime)}`;

  const heroHeight = variant === 'featured' ? 'h-64' : variant === 'compact' ? 'h-32' : 'h-48';

  const heroGradient = event.isPublic
    ? 'bg-gradient-to-br from-planora-primary to-planora-secondary'
    : 'bg-gradient-to-br from-purple-500 to-pink-500';

  const hero = (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none',
        heroHeight,
        heroGradient,
        variant === 'featured' && 'md:rounded-l-lg md:rounded-r-none',
        variant !== 'featured' && 'rounded-t-lg',
        variant === 'compact' && 'rounded-t-lg'
      )}
      aria-hidden
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
      <p className={cn('text-foreground font-medium', variant === 'compact' && 'text-sm')}>
        {formatDate(event.dateTime, undefined, {
          weekday: variant === 'compact' ? undefined : 'short',
          year: 'numeric',
          month: variant === 'compact' ? 'numeric' : 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })}
      </p>
      {variant !== 'compact' ? (
        <p className="flex items-start gap-2 text-sm">
          <MapPin className="text-planora-primary mt-0.5 size-4 shrink-0" aria-hidden />
          <span className="line-clamp-2">{event.venue}</span>
        </p>
      ) : null}
      <p className="flex items-center gap-2 text-sm">
        <User className="text-planora-primary size-4 shrink-0" aria-hidden />
        <span className="truncate">{organizerName}</span>
      </p>
    </div>
  );

  const titleClass = cn(
    'font-semibold text-foreground',
    variant === 'featured' && 'text-xl md:text-2xl',
    variant === 'default' && 'text-lg',
    variant === 'compact' && 'text-base line-clamp-2'
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
        <p className="mt-3 line-clamp-3 text-sm text-gray-600">{event.description}</p>
      ) : null}
      <span className={cn(viewDetailsClass, variant === 'compact' && 'mt-2 py-1.5 text-xs')}>
        View Details
      </span>
      {showActions ? (
        <div
          className="border-planora-border bg-planora-surface/50 mt-3 min-h-[2.5rem] rounded-md border border-dashed"
          aria-label="Event actions"
        />
      ) : null}
    </div>
  );

  const inner =
    variant === 'featured' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-0">
        <div className="min-w-0">{hero}</div>
        <div className="border-planora-border min-w-0 md:border-l">{body}</div>
      </div>
    ) : (
      <div className="flex min-w-0 flex-col">
        {hero}
        {body}
      </div>
    );

  return (
    <Link
      href={routes.event(event.id)}
      aria-label={ariaLabel}
      className={cn(
        'group border-planora-border block w-full overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-lg',
        variant === 'default' && 'max-w-sm',
        variant === 'compact' && 'max-w-xs'
      )}
    >
      {inner}
    </Link>
  );
}
