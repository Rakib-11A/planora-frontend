'use client';

import { Suspense } from 'react';

import { EventsBrowsePage } from '@/components/events/events-browse-page';

function EventsBrowseFallback() {
  return (
    <div className="text-planora-muted flex min-h-[40vh] items-center justify-center px-4 text-sm">
      Loading events…
    </div>
  );
}

export function EventsPageClient() {
  return (
    <Suspense fallback={<EventsBrowseFallback />}>
      <EventsBrowsePage />
    </Suspense>
  );
}
