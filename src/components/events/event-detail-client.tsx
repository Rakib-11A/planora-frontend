'use client';

import { ArrowLeft, MapPin, User } from 'lucide-react';
import Link from 'next/link';

import { EventParticipation } from '@/components/events/event-participation';
import { EventReviewsPanel } from '@/components/events/event-reviews-panel';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { MarketingHero } from '@/components/ui/marketing-hero';
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

function eventTypeLabel(raw: string): string {
  return raw
    .split('_')
    .filter(Boolean)
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

export interface EventDetailClientProps {
  event: EventWithType;
  initialReviews: EventReviewItem[];
}

const chipBase =
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-sm';

export function EventDetailClient({ event, initialReviews }: EventDetailClientProps) {
  const start = getStartDateTime(event);
  const dateLine = formatDate(start, undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="relative w-full overflow-hidden pb-20">
      <div
        className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-b from-slate-100/90 via-white to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30"
        aria-hidden
      />
      <div className="relative z-[1] px-4 sm:px-6">
        <div className="mx-auto mb-6 max-w-5xl">
          <Link
            href={routes.events}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/55 px-4 py-2 text-sm font-semibold text-planora-primary shadow-sm backdrop-blur-md motion-safe:transition motion-safe:duration-200 hover:border-planora-primary/35 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary dark:border-white/15 dark:bg-slate-900/50 dark:text-sky-300 dark:hover:bg-slate-900/70"
          >
            <ArrowLeft className="size-4 shrink-0" aria-hidden />
            Back to events
          </Link>
        </div>

        <MarketingHero
          className="mb-10"
          eyebrow={eventTypeLabel(event.eventType)}
          sectionMaxWidthClass="max-w-5xl"
          innerMaxWidthClass="max-w-4xl"
          title={event.title}
          description={dateLine}
        >
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span
              className={cn(
                chipBase,
                'border-slate-200/80 bg-white/60 text-slate-700 dark:border-white/15 dark:bg-slate-900/45 dark:text-slate-200'
              )}
            >
              {event.isPublic ? 'Public' : 'Private'}
            </span>
            <span
              className={cn(
                chipBase,
                'border-sky-300/50 bg-sky-100/70 text-sky-900 dark:border-sky-400/30 dark:bg-sky-950/50 dark:text-sky-100'
              )}
            >
              {feeLabel(event)}
            </span>
            <span
              className={cn(
                chipBase,
                'border-amber-300/50 bg-amber-100/70 text-amber-950 dark:border-amber-400/25 dark:bg-amber-950/40 dark:text-amber-100'
              )}
            >
              {eventTypeLabel(event.eventType)}
            </span>
          </div>
        </MarketingHero>

        <div className="mx-auto max-w-5xl space-y-8">
          <section className="rounded-3xl border border-white/35 bg-white/35 p-5 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
            <Card
              variant="glass"
              className="motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary"
            >
              <CardTitle className="gradient-text text-xl font-bold">Details</CardTitle>
              <div className="mt-5 space-y-4">
                <div className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-planora-primary/12 text-planora-primary dark:bg-planora-primary/20">
                    <MapPin className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Venue
                    </p>
                    <p className="mt-0.5 font-medium text-slate-900 dark:text-slate-100">{event.venue}</p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-planora-secondary/12 text-planora-secondary dark:bg-planora-secondary/20">
                    <User className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Organizer
                    </p>
                    <p className="mt-0.5 font-medium text-slate-900 dark:text-slate-100">
                      {event.createdBy?.name ?? '—'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 border-t border-white/40 pt-6 dark:border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  About
                </h3>
                <CardDescription className="mt-2 whitespace-pre-wrap text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {event.description}
                </CardDescription>
              </div>
            </Card>

            <div className="mt-8">
              <EventParticipation
                eventId={event.id}
                isPaid={event.isPaid}
                isPublic={event.isPublic}
                eventFee={feeAmount(event)}
              />
            </div>

            <div className="mt-8">
              <EventReviewsPanel eventId={event.id} initialReviews={initialReviews} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
