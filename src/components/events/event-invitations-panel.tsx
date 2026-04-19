'use client';

import { useCallback, useEffect, useState } from 'react';
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

export interface EventInvitationsPanelProps {
  eventId: string;
}

export function EventInvitationsPanel({ eventId }: EventInvitationsPanelProps) {
  const [rows, setRows] = useState<EventInvitationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteeId, setInviteeId] = useState('');
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
    void load();
  }, [load]);

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inviteeId.trim();
    if (!trimmed) {
      toast.error('Enter the invitee user ID (CUID).');
      return;
    }
    setSending(true);
    try {
      await api.post(`events/${eventId}/invite`, { inviteeId: trimmed });
      toast.success('Invitation sent.');
      setInviteeId('');
      await load();
    } catch {
      toast.error('Invite failed. Check the user ID and permissions.');
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
    <Card className="mt-8">
      <CardTitle>Invitations</CardTitle>
      <CardDescription>
        Private events use invitations. Paste a user&apos;s Planora ID (CUID from their profile URL or
        database seed).
      </CardDescription>
      <form className="mt-4 max-w-lg" onSubmit={(ev) => void sendInvite(ev)}>
        <FormStack>
          <div>
            <Label htmlFor="invitee-id">Invitee user ID</Label>
            <Input
              id="invitee-id"
              className="mt-1"
              placeholder="clxxxxxxxx..."
              value={inviteeId}
              onChange={(ev) => setInviteeId(ev.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary" isLoading={sending}>
            Send invitation
          </Button>
        </FormStack>
      </form>
      <h3 className="mt-8 text-sm font-semibold text-slate-900">Sent invitations</h3>
      {loading ? (
        <p className="text-planora-muted mt-2 text-sm">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-planora-muted mt-2 text-sm">No invitations yet.</p>
      ) : (
        <DataTableShell className="mt-3">
          <table className="min-w-full text-left text-sm">
            <thead className="border-planora-border bg-slate-50 text-xs font-semibold text-slate-600 uppercase">
              <tr>
                <th scope="col" className="px-4 py-2">
                  Invitee
                </th>
                <th scope="col" className="px-4 py-2">
                  Status
                </th>
                <th scope="col" className="px-4 py-2">
                  Sent
                </th>
                <th scope="col" className="px-4 py-2">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-planora-border divide-y">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2">
                    <div className="font-medium text-slate-900">{r.invitee.name}</div>
                    <div className="text-planora-muted text-xs">{r.invitee.email}</div>
                  </td>
                  <td className="px-4 py-2 font-medium">{r.status}</td>
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
