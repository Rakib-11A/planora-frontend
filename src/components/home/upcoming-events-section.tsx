import { EventCard } from '@/components/events/event-card';
import type { EventWithType } from '@/types/event';

export interface UpcomingEventsSectionProps {
  events: EventWithType[];
}

/**
 * Lists upcoming public events. Server Component — each `EventCard` supplies its own client boundary.
 */
export function UpcomingEventsSection({ events }: UpcomingEventsSectionProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <section className="border-planora-border border-b bg-white px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-planora-primary text-2xl font-bold md:text-3xl">Upcoming Events</h2>
        <div className="-mx-4 mt-8 overflow-x-auto px-4 pb-2 md:mx-0 md:overflow-visible md:px-0">
          <div className="flex snap-x snap-mandatory gap-4 md:grid md:snap-none md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex w-[min(100%,22rem)] shrink-0 snap-start justify-center md:w-auto md:shrink md:justify-self-center"
              >
                <EventCard event={event} variant="compact" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
