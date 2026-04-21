'use client';

import Link from 'next/link';
import { startTransition, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { routes } from '@/constants/config';
import { api, unwrapApiData } from '@/lib/api';
import { myParticipationsResponseSchema, type MyParticipationItem } from '@/lib/schemas/me';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { formatDate } from '@/lib/utils';

const emptyGlass =
  'rounded-2xl border border-dashed border-planora-primary/25 bg-white/40 backdrop-blur-sm dark:border-white/15 dark:bg-slate-900/40';

export default function ParticipationsPage() {
  const [items, setItems] = useState<MyParticipationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await api.get('me/participations?page=1&limit=50')) as ApiResponse<
        PaginatedResponse<MyParticipationItem>
      >;
      const parsed = myParticipationsResponseSchema.safeParse(unwrapApiData(res));
      setItems(parsed.success ? parsed.data.items : []);
    } catch {
      toast.error('Could not load participations.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, [load]);

  return (
    <div className="w-full">
      <MarketingHero
        className="mb-10"
        eyebrow="Registrations"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="My participations"
        description="Events you have joined or requested to join."
      />

      <section className="rounded-3xl border border-white/35 bg-white/35 p-5 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
        {loading ? (
          <div className="space-y-3">
            <div className="bg-planora-muted/20 h-16 animate-pulse rounded-2xl" />
            <div className="bg-planora-muted/20 h-16 animate-pulse rounded-2xl" />
            <div className="bg-planora-muted/20 h-16 animate-pulse rounded-2xl" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            className={emptyGlass}
            title="No participations yet"
            description="Browse public events and join one to see it listed here."
            action={
              <Link
                href={routes.events}
                className="text-planora-primary text-sm font-semibold hover:underline dark:text-sky-300"
              >
                Browse events
              </Link>
            }
          />
        ) : (
          <ul className="space-y-3">
            {items.map((p) => (
              <li key={p.id}>
                <Card
                  variant="glass"
                  padding="sm"
                  className="flex flex-wrap items-center justify-between gap-3 motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary"
                >
                  <div>
                    <Link
                      href={routes.event(p.event.id)}
                      className="font-semibold text-planora-primary hover:underline dark:text-sky-300"
                    >
                      {p.event.title}
                    </Link>
                    <p className="text-planora-muted text-xs">
                      {formatDate(p.event.dateTime, undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                      {' · '}
                      <span className="font-medium text-slate-700 dark:text-slate-300">{p.status}</span>
                    </p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
