'use client';

import { CalendarX } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { EventCard } from '@/components/events/event-card';
import { Button } from '@/components/ui/button';
import { routes } from '@/constants/config';
import type { EventWithType } from '@/types/event';
import { cn } from '@/lib/utils';

export interface EventsGridProps {
  events: EventWithType[];
  isLoading?: boolean;
  emptyMessage?: string;
}

function EventCardSkeleton() {
  return (
    <div
      className={cn(
        'border-planora-border w-full max-w-sm overflow-hidden rounded-lg border bg-white',
        'justify-self-center'
      )}
      aria-hidden
    >
      <div className="h-48 animate-pulse bg-gray-200" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

export function EventsGrid({
  events,
  isLoading = false,
  emptyMessage = 'No events to show yet.',
}: EventsGridProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        aria-busy="true"
        aria-label="Loading events"
      >
        <EventCardSkeleton />
        <EventCardSkeleton />
        <EventCardSkeleton />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div
        className="border-planora-border bg-planora-surface/40 flex flex-col items-center justify-center gap-6 rounded-lg border border-dashed px-6 py-16 text-center"
        role="status"
        aria-live="polite"
      >
        <CalendarX className="text-planora-muted size-14" aria-hidden />
        <p className="max-w-md text-base text-gray-600">{emptyMessage}</p>
        <Button type="button" variant="primary" onClick={() => router.push(routes.events)}>
          Explore All Events
        </Button>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Events list">
      {events.map((event) => (
        <li key={event.id} className="flex justify-center">
          <EventCard event={event} variant="default" />
        </li>
      ))}
    </ul>
  );
}
