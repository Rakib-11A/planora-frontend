'use client';

import { CalendarX } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { EventCardMinimal } from '@/components/home/event-card-minimal';
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
      className="w-full rounded-lg border border-border bg-surface p-5 shadow-sm"
      aria-hidden
    >
      <div className="flex items-center justify-between gap-3">
        <div className="h-3.5 w-28 rounded shimmer" />
        <div className="h-6 w-14 rounded-full shimmer" />
      </div>
      <div className="mt-4 h-5 w-4/5 rounded shimmer" />
      <div className="mt-2 h-4 w-full rounded shimmer" />
      <div className="mt-1.5 h-4 w-3/4 rounded shimmer" />
      <div className="mt-5 flex gap-4">
        <div className="h-3.5 w-20 rounded shimmer" />
        <div className="h-3.5 w-20 rounded shimmer" />
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
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        aria-busy="true"
        aria-label="Loading events"
      >
        <EventCardSkeleton />
        <EventCardSkeleton />
        <EventCardSkeleton />
        <EventCardSkeleton />
        <EventCardSkeleton />
        <EventCardSkeleton />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-slate-300/60',
          'bg-gradient-to-b from-white/50 to-slate-50/80 px-6 py-16 text-center',
          'backdrop-blur-sm dark:border-white/15 dark:from-slate-900/50 dark:to-slate-900/30'
        )}
        role="status"
        aria-live="polite"
      >
        <div className="flex size-14 items-center justify-center rounded-xl bg-planora-primary/10 dark:bg-planora-primary/20">
          <CalendarX className="text-planora-primary size-8" aria-hidden />
        </div>
        <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">{emptyMessage}</p>
        <Button
          type="button"
          variant="primary"
          className="motion-safe:transition motion-safe:duration-200 motion-safe:hover:scale-105"
          onClick={() => router.push(routes.events)}
        >
          Browse all events
        </Button>
      </div>
    );
  }

  return (
    <ul
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
      aria-label="Events list"
    >
      {events.map((event) => (
        <li key={event.id} className="flex">
          <EventCardMinimal event={event} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
