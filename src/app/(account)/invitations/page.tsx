'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { routes } from '@/constants/config';
import { api, unwrapApiData } from '@/lib/api';
import { myInvitationsListSchema, type MyInvitation } from '@/lib/schemas/me';
import type { ApiResponse } from '@/types/api';
import { formatDate } from '@/lib/utils';

export default function InvitationsPage() {
  const [items, setItems] = useState<MyInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await api.get('me/invitations')) as ApiResponse<unknown>;
      const parsed = myInvitationsListSchema.safeParse(unwrapApiData(res));
      setItems(parsed.success ? parsed.data : []);
    } catch {
      toast.error('Could not load invitations.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function accept(id: string) {
    try {
      await api.post(`invitations/${id}/accept`);
      toast.success('Invitation accepted.');
      await load();
    } catch {
      toast.error('Could not accept.');
    }
  }

  async function decline(id: string) {
    try {
      await api.post(`invitations/${id}/decline`);
      toast.success('Invitation declined.');
      await load();
    } catch {
      toast.error('Could not decline.');
    }
  }

  return (
    <div>
      <PageHeader title="Invitations" description="Private event invites sent to you." />
      {loading ? (
        <p className="text-planora-muted text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState title="Inbox empty" description="When an organizer invites you, it will appear here." />
      ) : (
        <ul className="space-y-3">
          {items.map((inv) => (
            <li key={inv.id}>
              <Card padding="sm" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link
                    href={routes.event(inv.event.id)}
                    className="text-planora-primary font-semibold hover:underline"
                  >
                    {inv.event.title}
                  </Link>
                  <p className="text-planora-muted text-xs">
                    From {inv.inviter.name} · {formatDate(inv.createdAt)}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{inv.status}</p>
                </div>
                {inv.status === 'PENDING' ? (
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="primary" onClick={() => void accept(inv.id)}>
                      Accept
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => void decline(inv.id)}>
                      Decline
                    </Button>
                  </div>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
