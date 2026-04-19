'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
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
    return <p className="text-planora-muted px-4 py-10 text-sm">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">My events</h1>
        <Button type="button" variant="primary" onClick={() => router.push(routes.createEvent)}>
          Create event
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="text-planora-muted mt-6 text-sm">You have not created any events yet.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((ev) => (
            <li
              key={ev.id}
              className="border-planora-border flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-white px-4 py-3"
            >
              <div>
                <Link
                  href={routes.event(ev.id)}
                  className="text-planora-primary font-medium hover:underline"
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
                className="hover:text-planora-primary text-sm font-medium text-gray-700 hover:underline"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
