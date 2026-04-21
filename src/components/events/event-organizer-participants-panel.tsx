'use client';

import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { DataTableShell } from '@/components/ui/data-table-shell';
import { api, unwrapApiData } from '@/lib/api';
import { eventParticipantsListSchema, type EventParticipantRow } from '@/lib/schemas/me';
import type { ApiResponse } from '@/types/api';
import { cn, formatDate } from '@/lib/utils';

const theadClass =
  'border-b border-slate-200/90 bg-slate-100/80 text-xs font-semibold uppercase text-slate-600 dark:border-white/10 dark:bg-slate-900/55 dark:text-slate-400';

const tbodyClass = 'divide-y divide-slate-200/80 dark:divide-white/10';

type StatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'OTHER';

export interface EventOrganizerParticipantsPanelProps {
  eventId: string;
}

export function EventOrganizerParticipantsPanel({ eventId }: EventOrganizerParticipantsPanelProps) {
  const [rows, setRows] = useState<EventParticipantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('ALL');
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await api.get(`events/${eventId}/participants`)) as ApiResponse<unknown>;
      const parsed = eventParticipantsListSchema.safeParse(unwrapApiData(res));
      setRows(parsed.success ? parsed.data : []);
    } catch {
      toast.error('Could not load participants.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === 'ALL') return rows;
    if (filter === 'PENDING') return rows.filter((r) => r.status === 'PENDING');
    if (filter === 'APPROVED') return rows.filter((r) => r.status === 'APPROVED');
    return rows.filter((r) => r.status !== 'PENDING' && r.status !== 'APPROVED');
  }, [rows, filter]);

  async function act(
    participantUserId: string,
    kind: 'approve' | 'reject' | 'ban',
  ): Promise<void> {
    const path =
      kind === 'approve'
        ? `events/${eventId}/participants/${participantUserId}/approve`
        : kind === 'reject'
          ? `events/${eventId}/participants/${participantUserId}/reject`
          : `events/${eventId}/participants/${participantUserId}/ban`;
    if (kind === 'ban' && !window.confirm('Ban this user from the event? They will not be able to register again.')) {
      return;
    }
    setBusyUserId(participantUserId);
    try {
      await api.patch(path);
      toast.success(
        kind === 'approve' ? 'Approved.' : kind === 'reject' ? 'Rejected.' : 'User banned from this event.'
      );
      await load();
    } catch {
      toast.error('Action failed.');
    } finally {
      setBusyUserId(null);
    }
  }

  const filterBtn = (key: StatusFilter, label: string) => (
    <button
      key={key}
      type="button"
      onClick={() => setFilter(key)}
      className={cn(
        'rounded-full px-3 py-1.5 text-xs font-semibold motion-safe:transition',
        filter === key
          ? 'bg-planora-primary text-white shadow-sm dark:bg-planora-primary/90'
          : 'bg-white/50 text-slate-700 hover:bg-white/80 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15'
      )}
    >
      {label}
    </button>
  );

  return (
    <Card
      variant="glass"
      className="motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary"
    >
      <CardTitle className="gradient-text text-xl font-bold">Participants</CardTitle>
      <CardDescription className="text-slate-600 dark:text-slate-300">
        Approve pending registrations, reject requests, or ban attendees. Banned users cannot join again.
      </CardDescription>

      <div className="mt-4 flex flex-wrap gap-2">
        {filterBtn('ALL', 'All')}
        {filterBtn('PENDING', 'Pending')}
        {filterBtn('APPROVED', 'Approved')}
        {filterBtn('OTHER', 'Other')}
      </div>

      <DataTableShell variant="glass" className="mt-6 overflow-x-auto rounded-2xl">
        {loading ? (
          <p className="text-planora-muted p-6 text-sm">Loading participants…</p>
        ) : filtered.length === 0 ? (
          <p className="text-planora-muted p-6 text-sm">No rows for this filter.</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className={theadClass}>
                <th className="px-4 py-3">Attendee</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Since</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={tbodyClass}>
              {filtered.map((row) => {
                const busy = busyUserId === row.userId;
                return (
                  <tr key={row.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 dark:text-slate-100">{row.user.name}</div>
                      <div className="text-planora-muted text-xs">{row.user.email}</div>
                    </td>
                    <td className="px-4 py-3 font-medium">{row.status}</td>
                    <td className="text-planora-muted px-4 py-3 text-xs">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        {row.status === 'PENDING' ? (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              variant="primary"
                              isLoading={busy}
                              onClick={() => void act(row.userId, 'approve')}
                            >
                              Approve
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              isLoading={busy}
                              onClick={() => void act(row.userId, 'reject')}
                            >
                              Reject
                            </Button>
                          </>
                        ) : null}
                        {(row.status === 'PENDING' || row.status === 'APPROVED') && (
                          <Button
                            type="button"
                            size="sm"
                            variant="danger"
                            isLoading={busy}
                            onClick={() => void act(row.userId, 'ban')}
                          >
                            Ban
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </DataTableShell>
    </Card>
  );
}
