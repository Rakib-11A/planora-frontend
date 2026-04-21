import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { EventCardMinimal } from '@/components/home/event-card-minimal';
import { SectionHeading } from '@/components/home/section-heading';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { routes } from '@/constants/config';
import type { EventWithType } from '@/types/event';

export interface UpcomingEventsSectionProps {
  events: EventWithType[];
}

/**
 * Upcoming events — responsive grid.
 *
 * No horizontal scroller, no prev/next buttons, no compact-variant EventCard
 * (which had 3D tilt + shimmer). Uses the minimal homepage card and lets the
 * browser do the scrolling. Footer link routes to the full /events page.
 */
export function UpcomingEventsSection({ events }: UpcomingEventsSectionProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeading
        eyebrow="What's next"
        title="Upcoming events"
        subtitle="A calm slice of the public calendar. See them all on the events page."
        align="left"
      />

      {events.length === 0 ? (
        <EmptyState
          title="No upcoming public events yet"
          description="Check back soon — or create your own."
          action={
            <Link
              href={routes.createEvent}
              className={buttonVariants({ variant: 'primary', size: 'md' })}
            >
              Create an event
            </Link>
          }
        />
      ) : (
        <>
          <ul
            role="list"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          >
            {events.map((event) => (
              <li key={event.id} className="flex">
                <EventCardMinimal event={event} />
              </li>
            ))}
          </ul>

          <div className="mt-12 flex justify-center">
            <Link
              href={routes.events}
              className={buttonVariants({ variant: 'outline', size: 'md' })}
            >
              Browse all events
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
