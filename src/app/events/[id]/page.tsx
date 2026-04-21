import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { EventDetailClient } from '@/components/events/event-detail-client';
import { EventPayScrollHandler } from '@/components/events/event-pay-scroll-handler';
import { fetchEventById } from '@/lib/events';
import { fetchEventReviews } from '@/lib/reviews';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const event = await fetchEventById(id);
  if (!event) {
    notFound();
  }

  let initialReviews: Awaited<ReturnType<typeof fetchEventReviews>>['items'] = [];
  try {
    const data = await fetchEventReviews(id, 1, 20);
    initialReviews = data.items;
  } catch (err) {
    console.error('[events] reviews fetch failed', err);
  }

  return (
    <>
      <Suspense fallback={null}>
        <EventPayScrollHandler />
      </Suspense>
      <EventDetailClient event={event} initialReviews={initialReviews} />
    </>
  );
}
