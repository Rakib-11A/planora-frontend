import { EventsGrid } from '@/components/events/events-grid';
import { PageHeader } from '@/components/ui/page-header';
import { PageShell } from '@/components/ui/page-shell';
import { fetchEventsList } from '@/lib/events';

export default async function EventsPage() {
  let items: Awaited<ReturnType<typeof fetchEventsList>>['items'] = [];
  try {
    const data = await fetchEventsList({ page: 1, limit: 24, isPublic: true });
    items = data.items;
  } catch (err) {
    console.error('[events] list page fetch failed', err);
  }

  return (
    <PageShell size="full">
      <PageHeader
        title="Public events"
        description="Browse upcoming public listings. Sign in to join or create your own."
      />
      <EventsGrid events={items} emptyMessage="No public events are available right now." />
    </PageShell>
  );
}
