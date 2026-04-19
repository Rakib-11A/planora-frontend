import { EventsGrid } from '@/components/events/events-grid';
import { PageHeader } from '@/components/ui/page-header';
import { PageShell } from '@/components/ui/page-shell';
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
    <PageShell size="full">
      <PageHeader
        title={q.length > 0 ? `Results for “${q}”` : 'Public events'}
        description={
          q.length > 0
            ? 'Matching public listings from Planora.'
            : 'Browse upcoming public listings. Sign in to join or create your own.'
        }
      />
      <EventsGrid
        events={items}
        emptyMessage={
          q.length > 0
            ? 'No public events matched your search. Try different keywords.'
            : 'No public events are available right now.'
        }
      />
    </PageShell>
  );
}
