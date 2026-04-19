'use client';

import { startTransition, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { api, unwrapApiData } from '@/lib/api';
import { myNotificationsResponseSchema, type NotificationItem } from '@/lib/schemas/me';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { formatDate } from '@/lib/utils';

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
    <div>
      <PageHeader
        title="Notifications"
        description="Invitations, approvals, and payment updates."
        actions={
          <Button type="button" variant="outline" size="sm" onClick={() => void markAll()}>
            Mark all read
          </Button>
        }
      />
      {loading ? (
        <p className="text-planora-muted text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState title="You are all caught up" description="No notifications to show." />
      ) : (
        <ul className="space-y-3">
          {items.map((n) => (
            <li key={n.id}>
              <Card
                padding="sm"
                className={n.isRead ? 'opacity-80' : 'border-planora-primary/30 bg-indigo-50/40'}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{n.title}</p>
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
    </div>
  );
}
