'use client';

import { startTransition, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { DataTableShell } from '@/components/ui/data-table-shell';
import { FormStack } from '@/components/ui/form-stack';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, unwrapApiData } from '@/lib/api';
import { eventInvitationsListSchema, type EventInvitationRow } from '@/lib/schemas/me';
import type { ApiResponse } from '@/types/api';
import { formatDate } from '@/lib/utils';

const theadClass =
  'border-b border-slate-200/90 bg-slate-100/80 text-xs font-semibold uppercase text-slate-600 dark:border-white/10 dark:bg-slate-900/55 dark:text-slate-400';

const tbodyClass = 'divide-y divide-slate-200/80 dark:divide-white/10';

export interface EventInvitationsPanelProps {
  eventId: string;
}

export function EventInvitationsPanel({ eventId }: EventInvitationsPanelProps) {
  const [rows, setRows] = useState<EventInvitationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteeEmail, setInviteeEmail] = useState('');
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await api.get(`events/${eventId}/invitations`)) as ApiResponse<unknown>;
      const parsed = eventInvitationsListSchema.safeParse(unwrapApiData(res));
      setRows(parsed.success ? parsed.data : []);
    } catch {
      toast.error('Could not load invitations.');
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

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inviteeEmail.trim().toLowerCase();
    if (!trimmed) {
      toast.error('Enter the invitee email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error('Enter a valid email address.');
      return;
    }
    setSending(true);
    try {
      await api.post(`events/${eventId}/invite`, { inviteeEmail: trimmed });
      toast.success('Invitation sent.');
      setInviteeEmail('');
      await load();
    } catch {
      // API interceptor already shows the specific error (e.g. "No user found with that email address")
    } finally {
      setSending(false);
    }
  }

  async function cancelRow(id: string) {
    try {
      await api.post(`invitations/${id}/cancel`);
      toast.success('Invitation cancelled.');
      await load();
    } catch {
      toast.error('Could not cancel invitation.');
    }
  }

  return (
    <Card
      variant="glass"
      className="motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary"
    >
      <CardTitle className="gradient-text text-xl font-bold">Invitations</CardTitle>
      <CardDescription className="text-slate-600 dark:text-slate-300">
        Invite a registered Planora user by their email address.
      </CardDescription>
      <form className="mt-4 max-w-lg" onSubmit={(ev) => void sendInvite(ev)}>
        <FormStack>
          <div>
            <Label htmlFor="invitee-email">Invitee email address</Label>
            <Input
              id="invitee-email"
              className="mt-1"
              type="email"
              placeholder="user@example.com"
              value={inviteeEmail}
              onChange={(ev) => setInviteeEmail(ev.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary" isLoading={sending}>
            Send invitation
          </Button>
        </FormStack>
      </form>
      <h3 className="mt-8 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Sent invitations
      </h3>
      {loading ? (
        <div className="mt-3 space-y-2">
          <div className="bg-planora-muted/20 h-10 animate-pulse rounded-lg" />
          <div className="bg-planora-muted/20 h-10 animate-pulse rounded-lg" />
        </div>
      ) : rows.length === 0 ? (
        <p className="text-planora-muted mt-2 text-sm">No invitations yet.</p>
      ) : (
        <DataTableShell variant="glass" className="mt-3">
          <table className="min-w-full text-left text-sm">
            <thead className={theadClass}>
              <tr>
                <th scope="col" className="px-4 py-3">
                  Invitee
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-4 py-3">
                  Sent
                </th>
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className={tbodyClass}>
              {rows.map((r) => (
                <tr key={r.id} className="bg-white/30 dark:bg-transparent">
                  <td className="px-4 py-2">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{r.invitee.name}</div>
                    <div className="text-planora-muted text-xs">{r.invitee.email}</div>
                  </td>
                  <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200">{r.status}</td>
                  <td className="text-planora-muted px-4 py-2 text-xs">
                    {formatDate(r.createdAt, undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {r.status === 'PENDING' ? (
                      <Button type="button" variant="ghost" size="sm" onClick={() => void cancelRow(r.id)}>
                        Cancel
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTableShell>
      )}
    </Card>
  );
}
