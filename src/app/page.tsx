import { CtaSection } from '@/components/home/cta-section';
import { EventCategoriesSection } from '@/components/home/event-categories-section';
import { HeroSection } from '@/components/home/hero-section';
import { HomeScrollChrome } from '@/components/home/home-scroll-chrome';
import { RevealSection } from '@/components/home/reveal-section';
import { UpcomingEventsSection } from '@/components/home/upcoming-events-section';
import { fetchFeaturedEvent, fetchPublicEventsForHome } from '@/lib/events';
import type { EventWithType } from '@/types/event';

const UPCOMING_LIMIT = 9;
const BROWSE_LIMIT = 30;

/** Hero prefers `GET /api/events/featured` (admin-curated public event); if unset, uses the first upcoming public listing. */
export default async function Home() {
  // Sequential fetches ease backend rate limits during dev (HMR / Strict Mode bursts).
  const publicBrowse = await fetchPublicEventsForHome(BROWSE_LIMIT);
  const featuredFromApi = await fetchFeaturedEvent();

  const upcomingEvents = publicBrowse.slice(0, UPCOMING_LIMIT);

  const featuredEvent: EventWithType | null =
    featuredFromApi ?? (publicBrowse.length > 0 ? (publicBrowse[0] ?? null) : null);

  return (
    <HomeScrollChrome>
      <div className="flex flex-col">
        <HeroSection featuredEvent={featuredEvent} />
        <RevealSection variant="white">
          <UpcomingEventsSection events={upcomingEvents} />
        </RevealSection>
        <RevealSection variant="muted">
          <EventCategoriesSection events={publicBrowse} />
        </RevealSection>
        <RevealSection variant="gradient">
          <CtaSection />
        </RevealSection>
      </div>
    </HomeScrollChrome>
  );
}
