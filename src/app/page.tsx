import { CtaSection } from '@/components/home/cta-section';
import { EventCategoriesSection } from '@/components/home/event-categories-section';
import { FeaturedEventSection } from '@/components/home/featured-event-section';
import { HeroSection } from '@/components/home/hero-section';
import { RevealSection } from '@/components/home/reveal-section';
import { UpcomingEventsSection } from '@/components/home/upcoming-events-section';
import { fetchFeaturedEvent, fetchPublicEventsForHome } from '@/lib/events';
import type { EventWithType } from '@/types/event';

// Always SSR so event edits appear immediately — no Full Route Cache or stale Router Cache.
export const dynamic = 'force-dynamic';

const UPCOMING_LIMIT = 9;
const BROWSE_LIMIT = 30;

/**
 * Homepage composition.
 *
 * Featured event is curated by admins via `GET /api/events/featured`. When
 * unset (or during cold start), we fall back to the first public browse
 * event. Upcoming excludes the featured event so nothing appears twice.
 */
export default async function Home() {
  // Sequential fetches keep dev rate limits happy (HMR + StrictMode bursts).
  const publicBrowse = await fetchPublicEventsForHome(BROWSE_LIMIT);
  const featuredFromApi = await fetchFeaturedEvent();

  const featuredEvent: EventWithType | null =
    featuredFromApi ?? (publicBrowse.length > 0 ? (publicBrowse[0] ?? null) : null);

  const upcomingEvents = publicBrowse
    .filter((ev) => ev.id !== featuredEvent?.id)
    .slice(0, UPCOMING_LIMIT);

  return (
    <div className="flex flex-col">
      <HeroSection />

      {featuredEvent ? (
        <RevealSection variant="surface">
          <FeaturedEventSection event={featuredEvent} />
        </RevealSection>
      ) : null}

      <RevealSection variant="subtle">
        <UpcomingEventsSection events={upcomingEvents} />
      </RevealSection>

      <RevealSection variant="surface">
        <EventCategoriesSection events={publicBrowse} />
      </RevealSection>

      <RevealSection variant="subtle">
        <CtaSection />
      </RevealSection>
    </div>
  );
}
