'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { EventInvitationsPanel } from '@/components/events/event-invitations-panel';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormStack } from '@/components/ui/form-stack';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { EventWithType } from '@/types/event';

export interface EditEventFormProps {
  eventId: string;
}

function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EditEventForm({ eventId }: EditEventFormProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [createdById, setCreatedById] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTimeLocal, setDateTimeLocal] = useState('');
  const [venue, setVenue] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [fee, setFee] = useState('0');

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = (await api.get(`events/${eventId}`)) as ApiResponse<EventWithType>;
        const ev = unwrapApiData(res);
        if (cancelled) return;
        setTitle(ev.title);
        setDescription(ev.description);
        setDateTimeLocal(toLocalInputValue(ev.dateTime));
        setVenue(ev.venue);
        setIsPublic(ev.isPublic);
        setIsPaid(ev.isPaid);
        setFee(String(typeof ev.fee === 'number' ? ev.fee : Number(ev.fee)));
        setCreatedById(ev.createdById);
      } catch {
        if (!cancelled) toast.error('Could not load event.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const dt = new Date(dateTimeLocal);
    if (Number.isNaN(dt.getTime())) {
      toast.error('Pick a valid date and time.');
      return;
    }
    const feeNum = isPaid ? Number(fee) : 0;
    if (isPaid && (!Number.isFinite(feeNum) || feeNum <= 0)) {
      toast.error('Paid events need a fee greater than 0.');
      return;
    }

    setSaving(true);
    try {
      const body = {
        title: title.trim(),
        description: description.trim(),
        dateTime: dt.toISOString(),
        venue: venue.trim(),
        isPublic,
        isPaid,
        fee: feeNum,
      };
      await api.patch(`events/${eventId}`, body);
      toast.success('Event updated.');
      router.push(routes.event(eventId));
      router.refresh();
    } catch {
      toast.error('Update failed. You may not be the owner.');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete(`events/${eventId}`);
      toast.success('Event deleted.');
      router.push(routes.myEvents);
      router.refresh();
    } catch {
      toast.error('Delete failed.');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <p className="text-planora-muted text-sm">Loading event…</p>;
  }

  const isOwner = user?.id && createdById && user.id === createdById;

  return (
    <div className="max-w-xl">
      <Breadcrumbs
        items={[
          { href: routes.dashboard, label: 'Dashboard' },
          { href: routes.myEvents, label: 'My events' },
          { href: routes.editEvent(eventId), label: 'Edit' },
        ]}
      />
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">Edit event</h1>
        <form className="mt-6" onSubmit={(ev) => void onSubmit(ev)}>
          <FormStack>
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                className="mt-1"
                required
                maxLength={150}
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea
                id="edit-desc"
                className="mt-1"
                required
                maxLength={5000}
                rows={4}
                value={description}
                onChange={(ev) => setDescription(ev.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-dt">Starts at (local)</Label>
              <Input
                id="edit-dt"
                className="mt-1"
                type="datetime-local"
                required
                value={dateTimeLocal}
                onChange={(ev) => setDateTimeLocal(ev.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-venue">Venue</Label>
              <Input
                id="edit-venue"
                className="mt-1"
                required
                maxLength={300}
                value={venue}
                onChange={(ev) => setVenue(ev.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(ev) => setIsPublic(ev.target.checked)}
              />
              Public listing
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={isPaid} onChange={(ev) => setIsPaid(ev.target.checked)} />
              Paid event
            </label>
            {isPaid ? (
              <div>
                <Label htmlFor="edit-fee">Fee (BDT)</Label>
                <Input
                  id="edit-fee"
                  className="mt-1"
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={fee}
                  onChange={(ev) => setFee(ev.target.value)}
                />
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button type="submit" variant="primary" isLoading={saving}>
                Save changes
              </Button>
              <Button
                type="button"
                variant="danger"
                disabled={saving || deleting}
                isLoading={deleting}
                onClick={() => void onDelete()}
              >
                Delete
              </Button>
            </div>
          </FormStack>
        </form>
      </Card>
      {isOwner ? <EventInvitationsPanel eventId={eventId} /> : null}
    </div>
  );
}
