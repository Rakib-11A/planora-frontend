import { EventsGrid } from '@/components/events/events-grid';
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
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-planora-primary text-3xl font-bold">Public Events</h1>
      <p className="text-planora-muted mt-2 text-sm">
        Browse upcoming public events. Sign in to join or create your own.
      </p>
      <div className="mt-8">
        <EventsGrid events={items} emptyMessage="No public events are available right now." />
      </div>
    </div>
  );
}
