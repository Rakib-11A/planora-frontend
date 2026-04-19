import { EventsGrid } from '@/components/events/events-grid';
import { EventsBrowseHero } from '@/components/events/events-browse-hero';
import { EventsPageSearch } from '@/components/events/events-page-search';
import { EventsPageToolbar } from '@/components/events/events-page-toolbar';
import { fetchEventsList } from '@/lib/events';

interface EventsPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { search } = await searchParams;
  const q = typeof search === 'string' ? search.trim() : '';

  let items: Awaited<ReturnType<typeof fetchEventsList>>['items'] = [];
  try {
    const data = await fetchEventsList({
      page: 1,
      limit: 24,
      isPublic: true,
      ...(q.length > 0 ? { search: q } : {}),
    });
    items = data.items;
  } catch (err) {
    console.error('[events] list page fetch failed', err);
  }

  return (
    <div className="relative w-full overflow-hidden pb-20">
      <div
        className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-b from-slate-100/90 via-white to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30"
        aria-hidden
      />
      <div className="relative z-[1] px-4 sm:px-6">
        <EventsBrowseHero
          className="mb-10"
          eyebrow="Public calendar"
          title={q.length > 0 ? `Results for “${q}”` : 'Discover public events'}
          description={
            q.length > 0
              ? 'Refine keywords or jump back to the full feed—every card opens the full event story.'
              : 'Fresh listings from organizers across Planora. Search, skim the grid, then dive into any event for dates, venue, and how to join.'
          }
        >
          <EventsPageSearch key={q || '__all'} defaultQuery={q} />
        </EventsBrowseHero>

        <div className="mx-auto max-w-7xl">
          <EventsPageToolbar count={items.length} activeSearch={q} />

          <section className="rounded-3xl border border-white/35 bg-white/35 p-4 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
            <EventsGrid
              events={items}
              emptyMessage={
                q.length > 0
                  ? 'No public events matched your search. Try different keywords or clear the search field.'
                  : 'No public events are available right now. Check back soon or create the first one after signing in.'
              }
            />
          </section>
        </div>
      </div>
    </div>
  );
}
