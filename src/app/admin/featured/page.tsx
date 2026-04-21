'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { routes } from '@/constants/config';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { EventWithType } from '@/types/event';
import { formatDate } from '@/lib/utils';

const siteFeaturedResponseSchema = z.object({
  featuredEventId: z.string().nullable(),
  event: z.custom<EventWithType | null>().nullable(),
  warning: z.string().nullable(),
});

const setFeaturedResponseSchema = z.object({
  featuredEventId: z.string().nullable(),
  event: z.custom<EventWithType | null>().nullable(),
});

export default function AdminFeaturedPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [featuredEventId, setFeaturedEventId] = useState<string | null>(null);
  const [event, setEvent] = useState<EventWithType | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [inputId, setInputId] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await api.get('admin/site/featured')) as ApiResponse<unknown>;
      const parsed = siteFeaturedResponseSchema.safeParse(unwrapApiData(res));
      if (!parsed.success) {
        toast.error('Could not parse featured settings.');
        return;
      }
      setFeaturedEventId(parsed.data.featuredEventId);
      setEvent(parsed.data.event);
      setWarning(parsed.data.warning);
      setInputId(parsed.data.featuredEventId ?? '');
    } catch {
      toast.error('Could not load featured event.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function applyFeatured(nextId: string | null) {
    setSaving(true);
    try {
      const res = (await api.patch('admin/site/featured', { eventId: nextId })) as ApiResponse<unknown>;
      const parsed = setFeaturedResponseSchema.safeParse(unwrapApiData(res));
      if (!parsed.success) {
        toast.error('Unexpected response from server.');
        return;
      }
      setFeaturedEventId(parsed.data.featuredEventId);
      setEvent(parsed.data.event);
      setWarning(null);
      setInputId(parsed.data.featuredEventId ?? '');
      toast.success(nextId === null ? 'Featured event cleared.' : 'Featured event updated.');
      await load();
    } catch {
      toast.error('Update failed. Use a public event id, or clear with the button below.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full">
      <Breadcrumbs
        className="mb-6 text-slate-600 dark:text-slate-300 [&_a]:font-medium [&_a]:text-planora-primary [&_a]:hover:underline dark:[&_a]:text-sky-300"
        items={[
          { href: routes.admin, label: 'Admin' },
          { href: routes.adminFeatured, label: 'Featured event' },
        ]}
      />
      <MarketingHero
        className="mb-10"
        eyebrow="Marketing"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="Homepage featured event"
        description="Only public, active events may be featured. Copy an event id from the Events admin grid or the public event URL."
      />

      <Card variant="glass" padding="default" className="max-w-2xl space-y-6">
        {loading ? (
          <p className="text-planora-muted text-sm">Loading…</p>
        ) : (
          <>
            {warning ? (
              <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
                {warning}
              </p>
            ) : null}
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Current selection</p>
              {event ? (
                <div className="mt-2 space-y-1">
                  <p className="font-semibold text-planora-primary dark:text-sky-300">{event.title}</p>
                  <p className="text-planora-muted text-xs">{formatDate(event.dateTime)}</p>
                  <p className="text-planora-muted font-mono text-xs">id: {featuredEventId}</p>
                  <Link
                    href={routes.event(event.id)}
                    className="text-sm font-semibold text-planora-primary underline-offset-4 hover:underline dark:text-sky-300"
                  >
                    View public page
                  </Link>
                </div>
              ) : (
                <p className="text-planora-muted mt-2 text-sm">
                  {featuredEventId
                    ? 'Selection points to a missing event — clear it or choose another id.'
                    : 'None set. The homepage falls back to the first upcoming public event.'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="featured-event-id">Public event id (CUID)</Label>
              <Input
                id="featured-event-id"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                placeholder="clxxxxxxxx..."
                className="font-mono text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="primary"
                isLoading={saving}
                onClick={() => {
                  const t = inputId.trim();
                  if (t.length === 0) {
                    toast.error('Enter a public event id, or use Clear featured.');
                    return;
                  }
                  void applyFeatured(t);
                }}
              >
                Save featured
              </Button>
              <Button type="button" variant="outline" isLoading={saving} onClick={() => void applyFeatured(null)}>
                Clear featured
              </Button>
              <Link
                href={routes.adminEvents}
                className="text-planora-muted hover:text-planora-primary inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold underline-offset-4 hover:underline dark:hover:text-sky-300"
              >
                Browse events
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
