'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { routes } from '@/constants/config';
import { api, unwrapApiData } from '@/lib/api';
import { myInvitationsListSchema, type MyInvitation } from '@/lib/schemas/me';
import type { ApiResponse } from '@/types/api';
import { formatDate } from '@/lib/utils';

const emptyGlass =
  'rounded-2xl border border-dashed border-planora-primary/25 bg-white/40 backdrop-blur-sm dark:border-white/15 dark:bg-slate-900/40';

export default function InvitationsPage() {
  const router = useRouter();
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
    startTransition(() => {
      void load();
    });
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

  async function payAndAccept(id: string, eventId: string) {
    try {
      await api.post(`invitations/${id}/accept`);
      toast.success('Invitation accepted. Continue to payment on the event page.');
      await load();
      router.push(`${routes.event(eventId)}?pay=1`);
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
    <div className="w-full">
      <MarketingHero
        className="mb-10"
        eyebrow="Inbox"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="Invitations"
        description="Private event invites sent to you."
      />

      <section className="rounded-3xl border border-white/35 bg-white/35 p-5 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
        {loading ? (
          <div className="space-y-3">
            <div className="bg-planora-muted/20 h-24 animate-pulse rounded-2xl" />
            <div className="bg-planora-muted/20 h-24 animate-pulse rounded-2xl" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            className={emptyGlass}
            title="Inbox empty"
            description="When an organizer invites you, it will appear here."
          />
        ) : (
          <ul className="space-y-3">
            {items.map((inv) => (
              <li key={inv.id}>
                <Card
                  variant="glass"
                  padding="sm"
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary"
                >
                  <div>
                    <Link
                      href={routes.event(inv.event.id)}
                      className="font-semibold text-planora-primary hover:underline dark:text-sky-300"
                    >
                      {inv.event.title}
                    </Link>
                    <p className="text-planora-muted text-xs">
                      From {inv.inviter.name} · {formatDate(inv.createdAt)}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">{inv.status}</p>
                  </div>
                  {inv.status === 'PENDING' ? (
                    <div className="flex flex-wrap gap-2">
                      {inv.event.isPaid ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="primary"
                          onClick={() => void payAndAccept(inv.id, inv.event.id)}
                        >
                          Pay & accept
                        </Button>
                      ) : (
                        <Button type="button" size="sm" variant="primary" onClick={() => void accept(inv.id)}>
                          Accept
                        </Button>
                      )}
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
      </section>
    </div>
  );
}
