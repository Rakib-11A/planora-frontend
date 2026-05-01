'use client';

import { ArrowLeft, Calendar, Clock, MapPin, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { type ReactNode } from 'react';

import { ApexCard } from '@/components/ui/card';
import { CardSkeleton } from '@/components/ui/card-skeleton';
import { ImageGallery, ImageGallerySkeleton } from '@/components/ui/image-gallery';
import { ListingGrid } from '@/components/ui/listing-grid';
import { SpecsTable, SpecsTableSkeleton, createSpecs } from '@/components/ui/specs-table';
import { Button } from '@/components/ui/button';
import { routes } from '@/constants/config';
import type { EventWithType } from '@/types/event';
import type { EventReviewItem } from '@/types/review';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

/**
 * ApexDetailsPage — A comprehensive, production-ready details page.
 *
 * Layout Structure:
 *   1. Header: Back navigation + Breadcrumb
 *   2. Hero: Title, primary meta, CTA
 *   3. Main Content (2-col on desktop):
 *      - Left: Image Gallery
 *      - Right: Primary info, specs, CTA card
 *   4. Description Section
 *   5. Reviews Section
 *   6. Related Items Section
 *
 * Design System Compliance:
 *   - Apex §3: Typography scale (.text-h1, .text-h4, .text-body-lg)
 *   - Apex §2: Color tokens (surface, border, muted, primary)
 *   - Apex §5A: radius-md, shadow-low/medium
 *   - Apex §6: motion-safe transitions, page entry animation
 */

export interface ApexDetailsPageProps {
  /** Main item to display */
  event: EventWithType;
  /** Initial reviews to display */
  initialReviews: EventReviewItem[];
  /** Related items for cross-linking */
  relatedItems?: EventWithType[];
  /** Loading state for related items */
  relatedItemsLoading?: boolean;
  /** Custom images for gallery (defaults to event main image) */
  galleryImages?: string[];
}

/**
 * Page Header with back navigation
 */
function PageHeader({ backHref, backLabel }: { backHref: string; backLabel: string }) {
  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <Link
        href={backHref}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2',
          'text-sm font-semibold text-primary shadow-sm',
          'transition-all duration-200 hover:border-primary/30 hover:bg-primary-subtle',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
        )}
      >
        <ArrowLeft className="size-4 shrink-0" aria-hidden />
        {backLabel}
      </Link>
    </nav>
  );
}

/**
 * Hero Section — Title, badges, primary meta
 */
function DetailsHero({ event }: { event: EventWithType }) {
  const formattedDate = formatDate(event.startDateTime ?? event.dateTime, undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const fee = typeof event.fee === 'number' ? event.fee : Number(event.fee);
  const isFree = fee === 0;

  const badgeClass = cn(
    'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide',
    'border backdrop-blur-sm'
  );

  return (
    <header className="mb-8">
      <h1 className="text-h1 text-foreground mb-4 font-bold">{event.title}</h1>

      {/* Meta row */}
      <div className="mb-6 flex flex-wrap items-center gap-4 text-muted">
        <span className="text-body-lg flex items-center gap-2">
          <Calendar className="size-5 shrink-0 text-primary/70" aria-hidden />
          {formattedDate}
        </span>
        <span className="text-body-lg flex items-center gap-2">
          <MapPin className="size-5 shrink-0 text-primary/70" aria-hidden />
          {event.venue || 'Online'}
        </span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            badgeClass,
            'border-emerald-300/50 bg-emerald-100/70 text-emerald-900',
            'dark:border-emerald-400/30 dark:bg-emerald-950/50 dark:text-emerald-100'
          )}
        >
          {isFree ? 'Free' : formatCurrency(fee, 'BDT', 'en-BD')}
        </span>
        <span
          className={cn(
            badgeClass,
            event.isPublic
              ? 'border-slate-300/50 bg-slate-100/70 text-slate-800 dark:border-slate-400/30 dark:bg-slate-800/50 dark:text-slate-200'
              : 'border-violet-300/50 bg-violet-100/70 text-violet-900 dark:border-violet-400/30 dark:bg-violet-950/50 dark:text-violet-100'
          )}
        >
          {event.isPublic ? 'Public' : 'Private'}
        </span>
        {event.avgRating > 0 ? (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900',
              'dark:bg-amber-950/50 dark:text-amber-100'
            )}
          >
            <Star className="size-3.5 fill-amber-400" aria-hidden />
            {event.avgRating.toFixed(1)} ({event.totalReviews})
          </span>
        ) : null}
      </div>
    </header>
  );
}

/**
 * CTA Card — Sticky booking/participation card
 */
function CtaCard({ event }: { event: EventWithType }) {
  const fee = typeof event.fee === 'number' ? event.fee : Number(event.fee);

  return (
    <div
      className={cn(
        'sticky top-6 rounded-lg border border-border bg-surface p-6 shadow-medium',
        'dark:bg-surface'
      )}
    >
      {/* Price */}
      <div className="mb-4 border-b border-border pb-4">
        <span className="text-caption text-muted uppercase tracking-wide">Price</span>
        <p className="text-h3 text-foreground mt-1 font-bold">
          {fee === 0 ? 'Free' : formatCurrency(fee, 'BDT', 'en-BD')}
        </p>
      </div>

      {/* Quick info */}
      <dl className="mb-6 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Users className="size-4 shrink-0 text-muted" aria-hidden />
          <dt className="text-muted">Participants</dt>
          <dd className="text-foreground font-medium">{event.participationCount || 0}</dd>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Star className="size-4 shrink-0 text-amber-500" aria-hidden />
          <dt className="text-muted">Rating</dt>
          <dd className="text-foreground font-medium">
            {event.avgRating > 0 ? `${event.avgRating.toFixed(1)} (${event.totalReviews})` : 'No reviews'}
          </dd>
        </div>
      </dl>

      {/* Primary CTA */}
      <Button
        type="button"
        variant="primary"
        size="lg"
        className="w-full"
        aria-label={`Register for ${event.title}`}
      >
        {fee === 0 ? 'Register Now' : 'Buy Ticket'}
      </Button>

      {/* Secondary actions */}
      <div className="mt-3 flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="md"
          className="flex-1"
          aria-label="Share event"
        >
          Share
        </Button>
        <Button
          type="button"
          variant="outline"
          size="md"
          className="flex-1"
          aria-label="Save to favorites"
        >
          Save
        </Button>
      </div>
    </div>
  );
}

/**
 * Description Section
 */
function DescriptionSection({ description }: { description: string }) {
  if (!description) return null;

  return (
    <section className="py-8">
      <h2 className="text-h4 text-foreground mb-4 font-semibold">About This Event</h2>
      <div
        className="text-body-lg text-foreground prose prose-slate max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br/>') }}
      />
    </section>
  );
}

/**
 * Reviews Summary Section
 */
function ReviewsSummary({
  eventId,
  reviews,
}: {
  eventId: string;
  reviews: EventReviewItem[];
}) {
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
      : 0;

  return (
    <section className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-h4 text-foreground font-semibold">
          Reviews & Ratings
        </h2>
        {totalReviews > 0 ? (
          <span className="text-caption text-muted">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </span>
        ) : null}
      </div>

      {/* Rating summary */}
      <div className="mb-6 rounded-lg border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-start gap-6">
          {/* Average rating */}
          <div className="text-center">
            <p className="text-5xl font-bold text-foreground">{avgRating.toFixed(1)}</p>
            <div className="mt-2 flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'size-5',
                    star <= Math.round(avgRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  )}
                  aria-hidden
                />
              ))}
            </div>
            <p className="text-caption text-muted mt-2">Based on {totalReviews} reviews</p>
          </div>

          {/* Rating distribution */}
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((r) => r.rating === rating).length;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={rating} className="mb-2 flex items-center gap-3">
                  <span className="text-caption text-muted w-16">{rating} star</span>
                  <div className="flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-2 bg-amber-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                      aria-label={`${rating} stars: ${percentage.toFixed(0)}%`}
                    />
                  </div>
                  <span className="text-caption text-muted w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Individual reviews preview */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {reviews.slice(0, 2).map((review) => (
            <div
              key={review.id}
              className="rounded-lg border border-border bg-surface p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-primary-subtle flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {review.user?.name?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {review.user?.name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-muted">
                      {formatDate(review.createdAt, undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        'size-3.5',
                        star <= review.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      )}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>
              {review.comment ? (
                <p className="text-body text-muted line-clamp-3">{review.comment}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface-subtle p-8 text-center">
          <p className="text-muted">No reviews yet. Be the first to review this event!</p>
        </div>
      )}
    </section>
  );
}

/**
 * Related Items Section
 */
function RelatedItemsSection({
  items,
  isLoading,
}: {
  items: EventWithType[];
  isLoading?: boolean;
}) {
  if (items.length === 0 && !isLoading) return null;

  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-h4 text-foreground mb-6 font-semibold">
        Related Events
      </h2>
      <ListingGrid<EventWithType>
        items={items}
        isLoading={isLoading}
        renderItem={(event) => <ApexCard event={event} />}
        getKey={(event) => event.id}
        emptyMessage="No related events found"
        skeletonCount={4}
      />
    </section>
  );
}

/**
 * Main Details Page Component
 */
export function ApexDetailsPage({
  event,
  initialReviews,
  relatedItems = [],
  relatedItemsLoading = false,
  galleryImages,
}: ApexDetailsPageProps) {
  // Generate gallery images (fallback to placeholder)
  const images = galleryImages?.length
    ? galleryImages
    : [`/images/events/${event.id}.jpg`];

  // Generate specs for the table
  const formattedDate = formatDate(event.startDateTime ?? event.dateTime, undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const specs = createSpecs.forEvent({
    formattedDate,
    venue: event.venue || 'Online',
    organizer: event.organizer || event.createdBy,
    participationCount: event.participationCount,
  });

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-b from-surface-subtle via-surface to-surface-subtle dark:from-background dark:via-surface dark:to-background"
        aria-hidden
      />

      {/* Page entry animation */}
      <div className="animate-fade-in">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <PageHeader backHref={routes.events} backLabel="Back to Events" />

          {/* Hero */}
          <DetailsHero event={event} />

          {/* Main Content — 2 column layout on desktop */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column — Image Gallery (2 cols on desktop) */}
            <div className="lg:col-span-2">
              <ImageGallery
                images={images}
                alt={event.title}
                priority
                className="mb-8"
              />

              {/* Specifications */}
              <div className="mb-8">
                <SpecsTable
                  specs={specs}
                  variant="grid"
                  title="Event Details"
                />
              </div>

              {/* Description */}
              <DescriptionSection description={event.description} />

              {/* Reviews */}
              <ReviewsSummary eventId={event.id} reviews={initialReviews} />

              {/* Related Items */}
              <RelatedItemsSection
                items={relatedItems}
                isLoading={relatedItemsLoading}
              />
            </div>

            {/* Right Column — Sticky CTA */}
            <div className="lg:col-span-1">
              <CtaCard event={event} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ApexDetailsPageSkeleton — Full page skeleton loader
 */
export function ApexDetailsPageSkeleton() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button skeleton */}
        <div className="mb-6 h-10 w-32 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />

        {/* Hero skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-10 w-3/4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-5 w-1/2 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-20 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-8 w-20 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column */}
          <div className="lg:col-span-2">
            <ImageGallerySkeleton />
            <div className="mt-8">
              <SpecsTableSkeleton count={4} />
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
              <div className="mb-4 h-8 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-12 w-full rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
