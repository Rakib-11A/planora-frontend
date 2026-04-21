'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { EventInvitationsPanel } from '@/components/events/event-invitations-panel';
import { EventOrganizerParticipantsPanel } from '@/components/events/event-organizer-participants-panel';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { FormStack } from '@/components/ui/form-stack';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MarketingHero } from '@/components/ui/marketing-hero';
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
  /** Snapshot for hero only — avoids the marketing title changing on every keystroke. */
  const [headlineTitle, setHeadlineTitle] = useState('');

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = (await api.get(`events/${eventId}`)) as ApiResponse<EventWithType>;
        const ev = unwrapApiData(res);
        if (cancelled) return;
        setHeadlineTitle(ev.title);
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
    return (
      <div className="w-full">
        <div className="mb-6">
          <div className="bg-planora-muted/25 h-4 w-56 animate-pulse rounded-md" />
        </div>
        <div className="overflow-hidden rounded-3xl border border-white/35 bg-white/40 p-6 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35">
          <div className="bg-planora-muted/15 mb-6 h-40 animate-pulse rounded-2xl" />
          <div className="space-y-3">
            <div className="bg-planora-muted/20 h-12 animate-pulse rounded-xl" />
            <div className="bg-planora-muted/20 h-24 animate-pulse rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?.id && createdById && user.id === createdById;

  return (
    <div className="w-full">
      <Breadcrumbs
        className="mb-6 text-slate-600 dark:text-slate-300 [&_a]:font-medium [&_a]:text-planora-primary [&_a]:hover:underline dark:[&_a]:text-sky-300"
        items={[
          { href: routes.dashboard, label: 'Dashboard' },
          { href: routes.myEvents, label: 'My events' },
          { href: routes.editEvent(eventId), label: 'Edit' },
        ]}
      />
      <MarketingHero
        className="mb-10"
        eyebrow="Organizer"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title={headlineTitle.length > 0 ? headlineTitle : 'Edit event'}
        description="Update listing copy, schedule, venue, and visibility. Saving returns you to the public event page."
      >
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={routes.event(eventId)}
            className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/55 px-4 py-2 text-sm font-semibold text-planora-primary shadow-sm backdrop-blur-md motion-safe:transition motion-safe:duration-200 hover:border-planora-primary/35 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary dark:border-white/15 dark:bg-slate-900/50 dark:text-sky-300 dark:hover:bg-slate-900/70"
          >
            View public page
          </Link>
        </div>
      </MarketingHero>

      <section className="rounded-3xl border border-white/35 bg-white/35 p-5 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
        <div className="mx-auto max-w-2xl">
          <Card
            variant="glass"
            className="motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary"
          >
            <CardTitle className="gradient-text text-xl font-bold">Event details</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Changes apply immediately for new visitors after you save.
            </CardDescription>
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
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(ev) => setIsPublic(ev.target.checked)}
                  />
                  Public listing
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
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
        </div>

        {isOwner ? (
          <div className="mx-auto mt-10 max-w-2xl space-y-10">
            <EventOrganizerParticipantsPanel eventId={eventId} />
            <EventInvitationsPanel eventId={eventId} />
          </div>
        ) : null}
      </section>
    </div>
  );
}
