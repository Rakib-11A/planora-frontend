'use client';

import Link from 'next/link';
import { startTransition, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { MarketingHero } from '@/components/ui/marketing-hero';
import { Card } from '@/components/ui/card';
import { routes } from '@/constants/config';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import { formatDate } from '@/lib/utils';

const myReviewRowSchema = z.object({
  id: z.string(),
  userId: z.string(),
  eventId: z.string(),
  rating: z.number(),
  comment: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: z.object({ id: z.string(), name: z.string() }),
  event: z.object({
    id: z.string(),
    title: z.string(),
    dateTime: z.string(),
  }),
});

const myReviewsPageSchema = z.object({
  items: z.array(myReviewRowSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

type MyReviewRow = z.infer<typeof myReviewRowSchema>;

export default function MyReviewsPage() {
  const [items, setItems] = useState<MyReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await api.get('me/reviews?page=1&limit=50')) as ApiResponse<unknown>;
      const parsed = myReviewsPageSchema.safeParse(unwrapApiData(res));
      setItems(parsed.success ? parsed.data.items : []);
    } catch {
      toast.error('Could not load your reviews.');
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
        eyebrow="Reputation"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="My reviews"
        description="Ratings you left on events you attended. Edit or remove them from the event page while the review period is open."
      />

      <section className="rounded-3xl border border-white/35 bg-white/35 p-5 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
        {loading ? (
          <div className="space-y-3">
            <div className="bg-planora-muted/20 h-20 animate-pulse rounded-2xl" />
            <div className="bg-planora-muted/20 h-20 animate-pulse rounded-2xl" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-planora-muted text-sm">You have not submitted any reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((r) => (
              <li key={r.id}>
                <Card variant="glass" padding="sm" className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link
                      href={routes.event(r.event.id)}
                      className="font-semibold text-planora-primary hover:underline dark:text-sky-300"
                    >
                      {r.event.title}
                    </Link>
                    <p className="text-planora-muted text-xs">
                      {formatDate(r.event.dateTime)} · {r.rating}/5
                    </p>
                    {r.comment ? <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{r.comment}</p> : null}
                  </div>
                  <Link
                    href={routes.event(r.event.id)}
                    className="inline-flex items-center justify-center rounded-full border border-planora-primary/40 bg-white/50 px-4 py-2 text-sm font-semibold text-planora-primary hover:bg-planora-primary/10 dark:border-white/15 dark:bg-slate-900/50 dark:text-sky-300"
                  >
                    Open event
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
