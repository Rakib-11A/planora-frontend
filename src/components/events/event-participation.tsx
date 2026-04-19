'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { EventPayBlock } from '@/components/events/event-pay-block';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';
import { api, unwrapApiData } from '@/lib/api';
import { myParticipationsResponseSchema, type MyParticipationItem } from '@/lib/schemas/me';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

export interface EventParticipationProps {
  eventId: string;
  isPaid: boolean;
  isPublic: boolean;
  /** Canonical fee from the event payload (BDT). */
  eventFee: number;
}

export function EventParticipation({ eventId, isPaid, isPublic, eventFee }: EventParticipationProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [busy, setBusy] = useState(false);
  const [loadingMine, setLoadingMine] = useState(false);
  const [mine, setMine] = useState<MyParticipationItem | null>(null);

  const loadMine = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingMine(true);
    try {
      const res = (await api.get('me/participations?page=1&limit=100')) as ApiResponse<
        PaginatedResponse<MyParticipationItem>
      >;
      const data = unwrapApiData(res);
      const parsed = myParticipationsResponseSchema.safeParse(data);
      if (!parsed.success) {
        setMine(null);
        return;
      }
      const found = parsed.data.items.find((p) => p.eventId === eventId) ?? null;
      setMine(found);
    } catch {
      setMine(null);
    } finally {
      setLoadingMine(false);
    }
  }, [eventId, isAuthenticated]);

  useEffect(() => {
    startTransition(() => {
      void loadMine();
    });
  }, [loadMine]);

  async function join() {
    setBusy(true);
    try {
      await api.post(`events/${eventId}/join`);
      toast.success('Join request submitted.');
      await loadMine();
      router.refresh();
    } catch {
      toast.error('Could not join this event. You may need to sign in or already be registered.');
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    setBusy(true);
    try {
      await api.post(`events/${eventId}/cancel`);
      toast.success('Participation cancelled.');
      setMine(null);
      router.refresh();
    } catch {
      toast.error('Could not cancel participation.');
    } finally {
      setBusy(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <Card variant="glass">
        <CardTitle className="gradient-text text-xl font-bold">Participation</CardTitle>
        <CardDescription>Sign in to join this event.</CardDescription>
        <Button type="button" variant="primary" className="mt-4" onClick={() => router.push(routes.login)}>
          Go to login
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardTitle className="gradient-text text-xl font-bold">Participation</CardTitle>
        <CardDescription>
          {isPublic && !isPaid
            ? 'Public free events approve you immediately when you join.'
            : isPaid
              ? 'Join to register, then complete payment while your participation is pending.'
              : 'Request to join; organizers approve private events.'}
        </CardDescription>
        {loadingMine ? (
          <p className="text-planora-muted mt-4 text-sm">Checking your registration…</p>
        ) : !mine ? (
          <div className="mt-4">
            <Button type="button" variant="primary" isLoading={busy} onClick={() => void join()}>
              Join event
            </Button>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {(mine.status === 'PENDING' || mine.status === 'APPROVED') && (
              <Button type="button" variant="outline" isLoading={busy} onClick={() => void cancel()}>
                Cancel registration
              </Button>
            )}
            <p className="text-planora-muted w-full text-sm">
              Status: <span className="font-semibold text-slate-800">{mine.status}</span>
            </p>
          </div>
        )}
      </Card>
      {mine && isPaid && mine.status === 'PENDING' ? (
        <EventPayBlock eventId={eventId} fee={eventFee > 0 ? eventFee : 0} />
      ) : null}
    </div>
  );
}
