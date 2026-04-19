'use client';

import { startTransition, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { api, unwrapApiData } from '@/lib/api';
import { myNotificationsResponseSchema, type NotificationItem } from '@/lib/schemas/me';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { cn, formatDate } from '@/lib/utils';

const emptyGlass =
  'rounded-2xl border border-dashed border-planora-primary/25 bg-white/40 backdrop-blur-sm dark:border-white/15 dark:bg-slate-900/40';

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await api.get('me/notifications?page=1&limit=50')) as ApiResponse<
        PaginatedResponse<NotificationItem>
      >;
      const parsed = myNotificationsResponseSchema.safeParse(unwrapApiData(res));
      setItems(parsed.success ? parsed.data.items : []);
    } catch {
      toast.error('Could not load notifications.');
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

  async function markRead(id: string) {
    try {
      await api.patch(`notifications/${id}/read`);
      await load();
    } catch {
      toast.error('Could not update notification.');
    }
  }

  async function markAll() {
    try {
      await api.patch('notifications/read-all');
      toast.success('All marked read.');
      await load();
    } catch {
      toast.error('Could not mark all read.');
    }
  }

  return (
    <div className="w-full">
      <MarketingHero
        className="mb-10"
        eyebrow="Activity"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="Notifications"
        description="Invitations, approvals, and payment updates."
      >
        <div className="mt-6 flex justify-center">
          <Button type="button" variant="outline" size="sm" onClick={() => void markAll()}>
            Mark all read
          </Button>
        </div>
      </MarketingHero>

      <section className="rounded-3xl border border-white/35 bg-white/35 p-5 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
        {loading ? (
          <div className="space-y-3">
            <div className="bg-planora-muted/20 h-24 animate-pulse rounded-2xl" />
            <div className="bg-planora-muted/20 h-24 animate-pulse rounded-2xl" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState className={emptyGlass} title="You are all caught up" description="No notifications to show." />
        ) : (
          <ul className="space-y-3">
            {items.map((n) => (
              <li key={n.id}>
                <Card
                  variant="glass"
                  padding="sm"
                  className={cn(
                    'motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary',
                    n.isRead
                      ? 'opacity-80'
                      : 'border-planora-primary/35 bg-white/70 shadow-[0_0_24px_-10px_rgba(99,102,241,0.5)] dark:border-sky-400/30 dark:bg-slate-900/70 dark:shadow-[0_0_28px_-12px_rgba(56,189,248,0.25)]'
                  )}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</p>
                      <p className="text-planora-muted mt-1 text-sm">{n.message}</p>
                      <p className="text-planora-muted mt-2 text-xs">
                        {formatDate(n.createdAt, undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                        {' · '}
                        {n.type}
                      </p>
                    </div>
                    {!n.isRead ? (
                      <Button type="button" size="sm" variant="ghost" onClick={() => void markRead(n.id)}>
                        Mark read
                      </Button>
                    ) : null}
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
