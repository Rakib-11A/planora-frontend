'use client';

import { ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { EventCard } from '@/components/events/event-card';
import { routes } from '@/constants/config';
import type { EventWithType } from '@/types/event';
import { cn, formatDate } from '@/lib/utils';

export interface HeroSectionProps {
  featuredEvent: EventWithType | null;
}

const MAX_DESCRIPTION_LENGTH = 200;

/** Mirrors `Button` focus ring + layout; pair with variant + size classes for valid `Link` CTAs. */
const linkCtaBase =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary';

const linkCtaPrimaryLg = cn(
  linkCtaBase,
  'bg-planora-primary text-white hover:bg-planora-primary/90',
  'px-6 py-3 text-lg'
);

const linkCtaOutlineLg = cn(
  linkCtaBase,
  'border-2 border-planora-primary bg-transparent text-planora-primary hover:bg-planora-primary/10',
  'px-6 py-3 text-lg'
);

function getEventStart(event: EventWithType): string {
  return event.startDateTime ?? event.dateTime;
}

function truncateDescription(text: string, max = MAX_DESCRIPTION_LENGTH): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}...`;
}

export function HeroSection({ featuredEvent }: HeroSectionProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      if (!cancelled) setEntered(true);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, []);

  const fadeClass = cn(
    'motion-safe:transition-opacity motion-safe:duration-500 motion-safe:ease-out',
    entered ? 'opacity-100' : 'opacity-0'
  );

  return (
    <section
      className={cn(
        'from-planora-primary/5 via-planora-secondary/5 to-planora-accent/5 w-full bg-gradient-to-r',
        'px-4 py-16 md:py-24',
        'motion-safe:transition-colors motion-safe:duration-300'
      )}
    >
      <div
        className={cn(
          'mx-auto flex min-h-[500px] max-w-7xl flex-col justify-center',
          fadeClass,
          featuredEvent ? '' : 'items-center text-center'
        )}
      >
        {featuredEvent ? (
          <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
            <div className="min-w-0">
              <span className="bg-planora-accent/20 text-planora-accent inline-flex rounded-full px-3 py-1 text-xs font-semibold">
                ✨ Featured Event
              </span>
              <h1 className="mt-4 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
                {featuredEvent.title}
              </h1>
              <p className="mt-4 flex items-center gap-2 text-lg text-gray-600">
                <Calendar className="text-planora-primary size-5 shrink-0" aria-hidden />
                {formatDate(getEventStart(featuredEvent), undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-700">
                {truncateDescription(featuredEvent.description)}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={routes.event(featuredEvent.id)} className={linkCtaPrimaryLg}>
                  Join Event
                  <ArrowRight className="size-[1.1em] shrink-0" aria-hidden />
                </Link>
                <Link href={routes.event(featuredEvent.id)} className={linkCtaOutlineLg}>
                  View Details
                  <ArrowRight className="size-[1.1em] shrink-0" aria-hidden />
                </Link>
              </div>
            </div>
            <div className="min-w-0 justify-self-center md:justify-self-end">
              <EventCard event={featuredEvent} variant="featured" />
            </div>
          </div>
        ) : (
          <div className="flex max-w-2xl flex-col items-center px-2">
            <h1 className="text-5xl font-bold text-gray-900">Discover Amazing Events</h1>
            <p className="mt-4 text-lg text-gray-700">
              Create, manage, and participate in events that matter to you
            </p>
            <div className="mt-8">
              <Link href={routes.events} className={linkCtaPrimaryLg}>
                Explore Events
                <ArrowRight className="size-[1.1em] shrink-0" aria-hidden />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
