import { CtaSection } from '@/components/home/cta-section';
import { EventCategoriesSection } from '@/components/home/event-categories-section';
import { HeroSection } from '@/components/home/hero-section';
import { UpcomingEventsSection } from '@/components/home/upcoming-events-section';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { EventWithType } from '@/types/event';

const UPCOMING_LIMIT = 9;
const BROWSE_LIMIT = 30;

async function fetchPublicEvents(limit: number): Promise<EventWithType[]> {
  try {
    const res = (await api.get(`events?page=1&limit=${limit}&isPublic=true`)) as ApiResponse<
      PaginatedResponse<EventWithType>
    >;
    return unwrapApiData(res).items;
  } catch (err) {
    console.error('[home] Failed to load public events list', err);
    return [];
  }
}

/**
 * TODO: Backend does not expose `GET /events/featured` yet. This call will fail until
 * the route exists — we catch and return null, then fall back to the first public event.
 */
async function fetchFeaturedEvent(): Promise<EventWithType | null> {
  try {
    const res = (await api.get('events/featured')) as ApiResponse<EventWithType>;
    return unwrapApiData(res);
  } catch (err) {
    console.error(
      '[home] GET /events/featured unavailable (expected until backend adds the route)',
      err
    );
    return null;
  }
}

export default async function Home() {
  const [publicBrowse, featuredFromApi] = await Promise.all([
    fetchPublicEvents(BROWSE_LIMIT),
    fetchFeaturedEvent(),
  ]);

  const upcomingEvents = publicBrowse.slice(0, UPCOMING_LIMIT);

  const featuredEvent =
    featuredFromApi ?? (publicBrowse.length > 0 ? (publicBrowse[0] ?? null) : null);

  return (
    <div className="flex flex-col">
      <HeroSection featuredEvent={featuredEvent} />
      <UpcomingEventsSection events={upcomingEvents} />
      <EventCategoriesSection events={publicBrowse} />
      <CtaSection />
    </div>
  );
}
