'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { EventsBrowseHero } from '@/components/events/events-browse-hero';
import { EventsGrid } from '@/components/events/events-grid';
import { EventsPageSearch } from '@/components/events/events-page-search';
import { EventsPageToolbar } from '@/components/events/events-page-toolbar';
import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';
import { fetchEventsList } from '@/lib/events';
import type { EventWithType } from '@/types/event';
import { cn } from '@/lib/utils';

function parseBool(v: string | null): boolean | undefined {
  if (v === null) return undefined;
  const t = v.trim().toLowerCase();
  if (t === 'true') return true;
  if (t === 'false') return false;
  return undefined;
}

const FILTER_PRESETS = [
  { label: 'All public', isPublic: true as const, isPaid: undefined },
  { label: 'Public free', isPublic: true as const, isPaid: false },
  { label: 'Public paid', isPublic: true as const, isPaid: true },
  { label: 'Private free', isPublic: false as const, isPaid: false },
  { label: 'Private paid', isPublic: false as const, isPaid: true },
] as const;

export function EventsBrowsePage() {
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const qSearch = searchParams.get('search') ?? '';
  const qIsPublic = parseBool(searchParams.get('isPublic'));
  const qIsPaid = parseBool(searchParams.get('isPaid'));

  const [items, setItems] = useState<EventWithType[]>([]);
  const [loading, setLoading] = useState(true);

  const activePreset = useMemo(() => {
    const pub = qIsPublic ?? true;
    const match = FILTER_PRESETS.find((p) => {
      if (p.isPublic !== pub) return false;
      if (p.isPaid === undefined) return qIsPaid === undefined;
      return qIsPaid === p.isPaid;
    });
    return match?.label ?? 'Custom';
  }, [qIsPublic, qIsPaid]);

  const load = useCallback(async () => {
    setLoading(true);
    const isPublic = qIsPublic ?? true;
    const isPaid = qIsPaid;

    if (isPublic === false && !isAuthenticated) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const data = await fetchEventsList({
        page: 1,
        limit: 24,
        isPublic,
        ...(isPaid !== undefined ? { isPaid } : {}),
        ...(qSearch.trim().length > 0 ? { search: qSearch.trim() } : {}),
      });
      setItems(data.items);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        toast.error('Sign in to browse private events.');
      } else {
        toast.error('Could not load events.');
      }
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [qIsPublic, qIsPaid, qSearch, isAuthenticated]);

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, [load]);

  const needsAuthForPrivate = (qIsPublic ?? true) === false && !isAuthenticated;

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
          title={qSearch.length > 0 ? `Results for “${qSearch}”` : 'Discover events'}
          description={
            qSearch.length > 0
              ? 'Search matches event titles and organizer names. Refine filters or open a card for full details.'
              : 'Filter by visibility and pricing, search organizers or titles, then open any card for dates, venue, and how to join.'
          }
        >
          <EventsPageSearch key={`${qSearch}-${String(qIsPublic)}-${String(qIsPaid)}`} defaultQuery={qSearch} />
        </EventsBrowseHero>

        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap gap-2">
            {FILTER_PRESETS.map((p) => {
              const params = new URLSearchParams();
              params.set('isPublic', String(p.isPublic));
              if (p.isPaid !== undefined) params.set('isPaid', String(p.isPaid));
              if (qSearch.trim()) params.set('search', qSearch.trim());
              const href = `${routes.events}?${params.toString()}`;
              const active =
                (qIsPublic ?? true) === p.isPublic &&
                (p.isPaid === undefined ? qIsPaid === undefined : qIsPaid === p.isPaid);
              return (
                <Link
                  key={p.label}
                  href={href}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-semibold motion-safe:transition',
                    active
                      ? 'bg-planora-primary text-white shadow-sm dark:bg-planora-primary/90'
                      : 'border border-white/50 bg-white/45 text-slate-700 hover:border-planora-primary/40 dark:border-white/10 dark:bg-slate-900/45 dark:text-slate-200'
                  )}
                >
                  {p.label}
                </Link>
              );
            })}
          </div>

          {needsAuthForPrivate ? (
            <p className="text-planora-muted mb-6 rounded-2xl border border-dashed border-planora-primary/30 bg-white/40 px-4 py-3 text-sm dark:bg-slate-900/40">
              <Link href={routes.login} className="font-semibold text-planora-primary underline dark:text-sky-300">
                Sign in
              </Link>{' '}
              to load private events you host, were invited to, or already joined.
            </p>
          ) : null}

          <EventsPageToolbar count={items.length} activeSearch={qSearch} activePreset={activePreset} />

          <section className="rounded-3xl border border-white/35 bg-white/35 p-4 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
            <EventsGrid
              events={items}
              isLoading={loading}
              emptyMessage={
                needsAuthForPrivate
                  ? 'Private listings require an account.'
                  : qSearch.length > 0
                    ? 'No events matched your search and filters. Try different keywords or clear filters.'
                    : 'No events matched these filters right now.'
              }
            />
          </section>
        </div>
      </div>
    </div>
  );
}
