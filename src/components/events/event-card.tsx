'use client';

import { ArrowRight, Calendar, Clock, MapPin, Star, User } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState, type CSSProperties, type MouseEvent } from 'react';

import { routes } from '@/constants/config';
import type { EventTypeLabel, EventWithType } from '@/types/event';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

export type EventCardVariant = 'default' | 'featured' | 'compact';

export interface EventCardProps {
  event: EventWithType;
  variant?: EventCardVariant;
  showActions?: boolean;
}

const cornerTriangleClass: Record<EventTypeLabel, string> = {
  PUBLIC_FREE: 'border-t-emerald-500',
  PUBLIC_PAID: 'border-t-sky-500',
  PRIVATE_FREE: 'border-t-violet-500',
  PRIVATE_PAID: 'border-t-fuchsia-600',
};

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

function feeBadgeMeta(event: EventWithType): { label: string; pillClass: string } {
  const fee = getRegistrationFee(event);
  if (fee === 0) {
    return {
      label: 'FREE',
      pillClass: cn(
        'glass-effect rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide',
        'border border-emerald-400/45 text-emerald-950 shadow-[0_0_14px_rgba(16,185,129,0.22)] backdrop-blur-md',
        'dark:text-emerald-50'
      ),
    };
  }
  return {
    label: formatCurrency(fee, 'BDT', 'en-BD'),
    pillClass: cn(
      'glass-effect rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide',
      'border border-sky-400/50 text-sky-950 shadow-[0_0_14px_rgba(14,165,233,0.25)] backdrop-blur-md',
      'dark:text-sky-50'
    ),
  };
}

function typeBadgeMeta(event: EventWithType): { label: string; pillClass: string } {
  if (event.isPublic) {
    return {
      label: 'PUBLIC',
      pillClass: cn(
        'glass-effect rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide',
        'border border-gray-400/40 text-gray-800 backdrop-blur-md dark:text-gray-100'
      ),
    };
  }
  return {
    label: 'PRIVATE',
    pillClass: cn(
      'glass-effect rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide',
      'border border-violet-400/55 text-violet-950 shadow-[0_0_14px_rgba(139,92,246,0.28)] backdrop-blur-md',
      'dark:text-violet-50'
    ),
  };
}

function heroGradientClass(event: EventWithType): string {
  return event.isPublic
    ? 'bg-gradient-to-br from-planora-primary via-indigo-600 to-planora-secondary'
    : 'bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-500';
}

const shellBaseClass = cn(
  'group/card relative w-full overflow-hidden rounded-3xl border border-gray-200/50',
  'bg-gradient-to-br from-white via-white to-gray-50/90 shadow-md',
  'motion-safe:transition-all motion-safe:duration-[400ms] motion-safe:ease-[cubic-bezier(0.4,0,0.2,1)]',
  'motion-safe:hover:shadow-lifted',
  'before:pointer-events-none before:absolute before:inset-0 before:z-[3] before:skew-x-[-18deg]',
  'before:translate-x-[-140%] before:bg-gradient-to-r before:from-transparent before:via-white/18 before:to-transparent',
  'before:opacity-0',
  'motion-safe:before:transition-transform motion-safe:before:duration-700 motion-safe:before:ease-out',
  'motion-safe:hover:before:translate-x-[140%] motion-safe:hover:before:opacity-80',
  'focus-within:shadow-lifted'
);

const tiltLayerClass = cn(
  'relative z-[1] flex h-full min-h-0 flex-col will-change-transform',
  'motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out'
);

export function EventCard({ event, variant = 'default', showActions = false }: EventCardProps) {
  const start = getStartDateTime(event);
  const feeMeta = feeBadgeMeta(event);
  const visibilityMeta = typeBadgeMeta(event);
  const organizerName = getOrganizerName(event);
  const locationLabel = getLocationLabel(event);
  const accentCorner = cornerTriangleClass[event.eventType];

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tiltOk, setTiltOk] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const sync = () => setTiltOk(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!tiltOk) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      setMousePosition({ x, y });
    },
    [tiltOk]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const rotX = tiltOk ? -mousePosition.y * 0.55 : 0;
  const rotY = tiltOk ? mousePosition.x * 0.55 : 0;
  const liftPx = isHovered ? -8 : 0;

  const tiltStyle: CSSProperties = {
    transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(${liftPx}px)`,
  };

  const cardAriaLabel = `View event: ${event.title}, ${formatDate(start)}`;

  const heroHeight =
    variant === 'featured' ? 'h-56 min-h-56 md:h-full md:min-h-[17.5rem]' : variant === 'compact' ? 'h-40' : 'h-56';

  const dateOptions: Intl.DateTimeFormatOptions =
    variant === 'featured'
      ? {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }
      : variant === 'compact'
        ? {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          }
        : {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          };

  const badgePillFee = cn(feeMeta.pillClass, variant === 'compact' && 'px-2 py-0.5 text-[10px]');
  const badgePillType = cn(visibilityMeta.pillClass, variant === 'compact' && 'px-2 py-0.5 text-[10px]');

  const badgesRow = (
    <div
      className={cn(
        'absolute inset-x-0 bottom-0 z-[2] flex flex-wrap gap-2 p-2',
        variant === 'compact' && 'gap-1.5 p-1.5'
      )}
    >
      <span className={badgePillFee}>{feeMeta.label}</span>
      <span className={badgePillType}>{visibilityMeta.label}</span>
    </div>
  );

  const hero = (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden',
        heroHeight,
        variant === 'featured' && 'md:rounded-none',
        variant !== 'featured' && 'rounded-none'
      )}
    >
      <div
        role="img"
        aria-label="Event image placeholder"
        className={cn(
          'relative flex size-full items-center justify-center overflow-hidden',
          heroGradientClass(event)
        )}
      >
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          aria-hidden
        />
        <div
          className={cn(
            'relative flex size-full items-center justify-center',
            'motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out',
            'group-hover/card:scale-110'
          )}
        >
          <Calendar className="size-12 text-white/90 drop-shadow-md motion-safe:transition-transform motion-safe:duration-300 group-hover/card:rotate-12 md:size-14" aria-hidden />
        </div>
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute right-0 top-0 h-0 w-0 border-l-[2.75rem] border-l-transparent border-t-[2.75rem]',
            accentCorner
          )}
        />
        {badgesRow}
      </div>
    </div>
  );

  const metaBlock = (
    <div
      className={cn(
        'flex flex-col gap-2 text-gray-600',
        variant === 'compact' && 'gap-1.5',
        variant === 'featured' && 'gap-2.5'
      )}
    >
      <p
        className={cn(
          'flex items-center gap-2 text-sm text-gray-600',
          variant === 'compact' && 'text-xs',
          variant === 'featured' && 'text-base'
        )}
      >
        <Clock className="size-4 shrink-0 text-planora-primary/70 motion-safe:transition-transform motion-safe:duration-300 group-hover/card:rotate-12" aria-hidden />
        <span className="font-medium text-gray-800">{formatDate(start, undefined, dateOptions)}</span>
      </p>
      {variant !== 'compact' ? (
        <p className={cn('flex items-start gap-2 text-sm text-gray-600', variant === 'featured' && 'text-base')}>
          <MapPin className="mt-0.5 size-4 shrink-0 text-planora-primary/70 motion-safe:transition-transform motion-safe:duration-300 group-hover/card:rotate-12" aria-hidden />
          <span className={cn('line-clamp-2', variant === 'featured' && 'line-clamp-none')}>{locationLabel}</span>
        </p>
      ) : null}
      {variant !== 'compact' ? (
        <p className={cn('flex items-center gap-2 text-sm text-gray-600', variant === 'featured' && 'text-base')}>
          <User className="size-4 shrink-0 text-planora-primary/70 motion-safe:transition-transform motion-safe:duration-300 group-hover/card:rotate-12" aria-hidden />
          <span className="truncate">{organizerName}</span>
        </p>
      ) : null}
    </div>
  );

  const titleClass = cn(
    'line-clamp-2 font-bold text-gray-900 motion-safe:transition-colors motion-safe:duration-300',
    'group-hover/card:text-planora-primary',
    variant === 'featured' && 'text-2xl font-black leading-tight md:text-3xl',
    variant === 'default' && 'text-xl',
    variant === 'compact' && 'text-lg'
  );

  const ratingRow =
    variant !== 'compact' && event.avgRating > 0 ? (
      <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-amber-600">
        <Star className="size-4 fill-amber-400 text-amber-500 motion-safe:transition-transform motion-safe:duration-300 group-hover/card:rotate-12" aria-hidden />
        <span>{event.avgRating.toFixed(1)}</span>
        <span className="text-gray-400">({event.totalReviews})</span>
      </p>
    ) : null;

  const body = (
    <div
      className={cn(
        'flex min-w-0 flex-1 flex-col',
        variant === 'compact' ? 'p-3' : variant === 'featured' ? 'p-5 md:p-8' : 'p-5'
      )}
    >
      <h2 id={`event-card-title-${event.id}`} className={titleClass}>
        {event.title}
      </h2>
      {ratingRow}
      <div className={cn('mt-3', variant === 'featured' && 'mt-4')}>{metaBlock}</div>
      {variant === 'featured' ? (
        <p className="mt-4 text-base leading-relaxed text-gray-600">{event.description}</p>
      ) : variant === 'default' && event.description ? (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600">{event.description}</p>
      ) : null}
    </div>
  );

  const footer = showActions ? (
    <footer className={cn('border-t border-gray-200/60', variant === 'compact' ? 'px-3 pb-3 pt-2' : 'px-5 pb-5 pt-3')}>
      <Link
        href={routes.event(event.id)}
        aria-label={`View details for ${event.title}`}
        className={cn(
          'group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-planora-primary/30',
          'bg-white/80 px-4 py-2.5 text-base font-semibold text-planora-primary shadow-sm backdrop-blur-md',
          'motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-105',
          'hover:border-planora-primary/50 hover:bg-white/50 hover:shadow-md',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary'
        )}
      >
        View Details
        <ArrowRight
          className="size-4 shrink-0 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover/btn:translate-x-1"
          aria-hidden
        />
      </Link>
    </footer>
  ) : null;

  const cardContent =
    variant === 'featured' ? (
      <div className="grid min-h-0 grid-cols-1 md:grid-cols-2 md:gap-0">
        <div className="min-w-0">{hero}</div>
        <div className="flex min-w-0 flex-col border-gray-200/60 md:border-l">{body}</div>
      </div>
    ) : (
      <div className="flex min-h-0 flex-col">
        {hero}
        {body}
      </div>
    );

  const shellClass = cn(
    shellBaseClass,
    variant === 'default' && 'max-w-sm',
    variant === 'compact' && 'max-w-xs',
    !showActions && 'cursor-pointer'
  );

  const interactionShellProps = {
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  if (showActions) {
    return (
      <article
        className={shellClass}
        aria-labelledby={`event-card-title-${event.id}`}
        {...interactionShellProps}
      >
        <div className={tiltLayerClass} style={tiltStyle}>
          {cardContent}
          {footer}
        </div>
      </article>
    );
  }

  return (
    <Link
      href={routes.event(event.id)}
      aria-label={cardAriaLabel}
      className={cn(
        shellClass,
        'block text-left no-underline',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary'
      )}
      {...interactionShellProps}
    >
      <div className={tiltLayerClass} style={tiltStyle}>
        {cardContent}
      </div>
    </Link>
  );
}
