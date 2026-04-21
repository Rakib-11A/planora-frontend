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
  // #region agent log
  fetch('http://127.0.0.1:7530/ingest/f1827538-6564-4331-b43b-32c165d17185',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'50d2c1'},body:JSON.stringify({sessionId:'50d2c1',runId:'pre-fix',hypothesisId:'H4',location:'src/app/events/[id]/page.tsx:entry',message:'EventDetailPage render start',data:{id},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  // #region agent log
  console.error('[debug-50d2c1][H4] EventDetailPage entry', { id });
  // #endregion
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
