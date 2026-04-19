'use client';

import Link from 'next/link';

import { EventParticipation } from '@/components/events/event-participation';
import { EventReviewsPanel } from '@/components/events/event-reviews-panel';
import { Card, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { PageShell } from '@/components/ui/page-shell';
import { routes } from '@/constants/config';
import type { EventWithType } from '@/types/event';
import type { EventReviewItem } from '@/types/review';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

function getStartDateTime(event: EventWithType): string {
  return event.startDateTime ?? event.dateTime;
}

function feeLabel(event: EventWithType): string {
  const n = typeof event.fee === 'number' ? event.fee : Number(event.fee);
  const fee = Number.isFinite(n) ? n : 0;
  if (fee === 0) return 'FREE';
  return formatCurrency(fee, 'BDT', 'en-BD');
}

function feeAmount(event: EventWithType): number {
  const n = typeof event.fee === 'number' ? event.fee : Number(event.fee);
  return Number.isFinite(n) ? n : 0;
}

export interface EventDetailClientProps {
  event: EventWithType;
  initialReviews: EventReviewItem[];
}

export function EventDetailClient({ event, initialReviews }: EventDetailClientProps) {
  const start = getStartDateTime(event);

  return (
    <PageShell size="default">
      <Link
        href={routes.events}
        className="text-planora-primary text-sm font-medium hover:underline"
      >
        Back to events
      </Link>
      <PageHeader
        className="mt-4"
        title={event.title}
        description={formatDate(start, undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })}
      />
      <div className="-mt-4 mb-8 flex flex-wrap gap-2">
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-xs font-semibold',
            event.isPublic ? 'bg-slate-100 text-slate-800' : 'bg-indigo-100 text-indigo-900'
          )}
        >
          {event.isPublic ? 'PUBLIC' : 'PRIVATE'}
        </span>
        <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-900">
          {feeLabel(event)}
        </span>
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
          {event.eventType.replace(/_/g, ' ')}
        </span>
      </div>
      <Card className="mb-8">
        <CardTitle>Details</CardTitle>
        <p className="text-planora-muted mt-3 text-sm">
          <span className="font-medium text-slate-800">Venue:</span> {event.venue}
        </p>
        <p className="text-planora-muted mt-1 text-sm">
          <span className="font-medium text-slate-800">Organizer:</span>{' '}
          {event.createdBy?.name ?? '—'}
        </p>
        <h3 className="mt-6 text-base font-semibold text-slate-900">About</h3>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
          {event.description}
        </p>
      </Card>
      <EventParticipation
        eventId={event.id}
        isPaid={event.isPaid}
        isPublic={event.isPublic}
        eventFee={feeAmount(event)}
      />
      <div className="mt-10">
        <EventReviewsPanel eventId={event.id} initialReviews={initialReviews} />
      </div>
    </PageShell>
  );
}
