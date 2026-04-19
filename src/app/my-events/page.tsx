'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { routes } from '@/constants/config';
import { fetchMyEventsList } from '@/lib/events';
import type { EventWithType } from '@/types/event';
import { formatDate } from '@/lib/utils';

const emptyGlass =
  'rounded-2xl border border-dashed border-planora-primary/25 bg-white/40 backdrop-blur-sm dark:border-white/15 dark:bg-slate-900/40';

export default function MyEventsPage() {
  const router = useRouter();
  const [items, setItems] = useState<EventWithType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await fetchMyEventsList(1, 50);
        if (!cancelled) setItems(data.items);
      } catch {
        if (!cancelled) toast.error('Could not load your events.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <div className="bg-planora-muted/25 h-4 w-48 animate-pulse rounded-md" />
        </div>
        <div className="overflow-hidden rounded-3xl border border-white/35 bg-white/40 p-6 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35">
          <div className="bg-planora-muted/15 mb-6 h-40 animate-pulse rounded-2xl" />
          <div className="space-y-3">
            <div className="bg-planora-muted/20 h-16 animate-pulse rounded-2xl" />
            <div className="bg-planora-muted/20 h-16 animate-pulse rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Breadcrumbs
        className="mb-6 text-slate-600 dark:text-slate-300 [&_a]:font-medium [&_a]:text-planora-primary [&_a]:hover:underline dark:[&_a]:text-sky-300"
        items={[
          { href: routes.dashboard, label: 'Dashboard' },
          { href: routes.myEvents, label: 'My events' },
        ]}
      />
      <MarketingHero
        className="mb-10"
        eyebrow="Organizing"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="My events"
        description="Events you created and manage on Planora."
      >
        <div className="mt-6 flex justify-center">
          <Button type="button" variant="primary" onClick={() => router.push(routes.createEvent)}>
            Create event
          </Button>
        </div>
      </MarketingHero>

      <section className="rounded-3xl border border-white/35 bg-white/35 p-5 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
        {items.length === 0 ? (
          <EmptyState
            className={emptyGlass}
            title="No events yet"
            description="Create your first event to see it in this list."
            action={
              <Button type="button" variant="primary" onClick={() => router.push(routes.createEvent)}>
                Create event
              </Button>
            }
          />
        ) : (
          <ul className="space-y-3">
            {items.map((ev) => (
              <li key={ev.id}>
                <Card
                  variant="glass"
                  padding="sm"
                  className="flex flex-wrap items-center justify-between gap-2 motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary"
                >
                  <div>
                    <Link
                      href={routes.event(ev.id)}
                      className="font-semibold text-planora-primary hover:underline dark:text-sky-300"
                    >
                      {ev.title}
                    </Link>
                    <p className="text-planora-muted text-xs">
                      {formatDate(ev.dateTime, undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <Link
                    href={routes.editEvent(ev.id)}
                    className="text-sm font-medium text-slate-700 hover:text-planora-primary hover:underline dark:text-slate-300 dark:hover:text-sky-300"
                  >
                    Edit
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
