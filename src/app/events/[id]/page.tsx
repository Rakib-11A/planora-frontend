import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { ApexDetailsPage, ApexDetailsPageSkeleton } from '@/components/ui/apex-details-page';
import { EventPayScrollHandler } from '@/components/events/event-pay-scroll-handler';
import { fetchEventById, fetchRelatedEvents } from '@/lib/events';
import { fetchEventReviews } from '@/lib/reviews';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch main event
  const event = await fetchEventById(id);
  if (!event) {
    notFound();
  }

  // Fetch reviews
  let initialReviews: Awaited<ReturnType<typeof fetchEventReviews>>['items'] = [];
  try {
    const data = await fetchEventReviews(id, 1, 20);
    initialReviews = data.items;
  } catch (err) {
    console.error('[events] reviews fetch failed', err);
  }

  // Fetch related events (for cross-linking)
  let relatedEvents: Awaited<ReturnType<typeof fetchRelatedEvents>> = [];
  try {
    // Fetch related events based on the same organizer or similar category
    relatedEvents = await fetchRelatedEvents(id, event.eventType, 4);
  } catch (err) {
    console.error('[events] related events fetch failed', err);
  }

  return (
    <>
      <Suspense fallback={null}>
        <EventPayScrollHandler />
      </Suspense>
      <Suspense fallback={<ApexDetailsPageSkeleton />}>
        <ApexDetailsPage
          event={event}
          initialReviews={initialReviews}
          relatedItems={relatedEvents}
          relatedItemsLoading={false}
        />
      </Suspense>
    </>
  );
}
