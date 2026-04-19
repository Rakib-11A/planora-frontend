'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useRef } from 'react';

import { EventCard } from '@/components/events/event-card';
import { SectionHeading } from '@/components/home/section-heading';
import { Button } from '@/components/ui/button';
import type { EventWithType } from '@/types/event';
import { cn } from '@/lib/utils';

export interface UpcomingEventsSectionProps {
  events: EventWithType[];
}

export function UpcomingEventsSection({ events }: UpcomingEventsSectionProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-upcoming-card]');
    const delta = (card?.offsetWidth ?? 280) + 16;
    el.scrollBy({ left: dir * delta, behavior: 'smooth' });
  }, []);

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-0">
      <SectionHeading
        title="Upcoming Events"
        subtitle="Don't miss out on these experiences happening soon."
        align="center"
      />
      <div className="relative mt-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-10 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 md:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-10 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 md:block" />
        <div className="mb-2 hidden items-center justify-end gap-2 md:flex">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="size-9 rounded-full p-0"
            aria-label="Scroll upcoming events left"
            onClick={() => scrollBy(-1)}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="size-9 rounded-full p-0"
            aria-label="Scroll upcoming events right"
            onClick={() => scrollBy(1)}
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
        <div
          ref={scrollerRef}
          className={cn(
            '-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2',
            'scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            'md:mx-0 md:px-0'
          )}
        >
          {events.map((event) => (
            <div
              key={event.id}
              data-upcoming-card
              className="flex w-[min(100%,22rem)] shrink-0 snap-start justify-center md:w-[min(100%,20rem)]"
            >
              <EventCard event={event} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
