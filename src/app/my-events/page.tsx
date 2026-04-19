'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { PageShell } from '@/components/ui/page-shell';
import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';
import { fetchMyEventsList } from '@/lib/events';
import type { EventWithType } from '@/types/event';
import { formatDate } from '@/lib/utils';

export default function MyEventsPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoadingAuth = useAuthStore((s) => s.isLoading);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const [items, setItems] = useState<EventWithType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!isAuthenticated) {
      router.replace(routes.login);
      return;
    }
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
  }, [isAuthenticated, isLoadingAuth, router]);

  if (isLoadingAuth || loading) {
    return (
      <PageShell>
        <p className="text-planora-muted text-sm">Loading…</p>
      </PageShell>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PageShell>
      <Breadcrumbs
        items={[
          { href: routes.dashboard, label: 'Dashboard' },
          { href: routes.myEvents, label: 'My events' },
        ]}
      />
      <PageHeader
        title="My events"
        description="Events you created and manage on Planora."
        actions={
          <Button type="button" variant="primary" onClick={() => router.push(routes.createEvent)}>
            Create event
          </Button>
        }
      />
      {items.length === 0 ? (
        <EmptyState
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
              <Card padding="sm" className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <Link
                    href={routes.event(ev.id)}
                    className="text-planora-primary font-semibold hover:underline"
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
                  className="text-sm font-medium text-slate-700 hover:text-planora-primary hover:underline"
                >
                  Edit
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
