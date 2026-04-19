'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { routes } from '@/constants/config';
import { api, unwrapApiData } from '@/lib/api';
import { myParticipationsResponseSchema, type MyParticipationItem } from '@/lib/schemas/me';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { formatDate } from '@/lib/utils';

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
    void load();
  }, [load]);

  return (
    <div>
      <PageHeader
        title="My participations"
        description="Events you have joined or requested to join."
      />
      {loading ? (
        <p className="text-planora-muted text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="No participations yet"
          description="Browse public events and join one to see it listed here."
          action={
            <Link
              href={routes.events}
              className="text-planora-primary text-sm font-semibold hover:underline"
            >
              Browse events
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {items.map((p) => (
            <li key={p.id}>
              <Card padding="sm" className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Link
                    href={routes.event(p.event.id)}
                    className="text-planora-primary font-semibold hover:underline"
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
                    <span className="font-medium text-slate-700">{p.status}</span>
                  </p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
