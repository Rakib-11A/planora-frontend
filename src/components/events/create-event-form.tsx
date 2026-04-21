'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { FormStack } from '@/components/ui/form-stack';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { Textarea } from '@/components/ui/textarea';
import { routes } from '@/constants/config';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { EventWithType } from '@/types/event';

export function CreateEventForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTimeLocal, setDateTimeLocal] = useState('');
  const [venue, setVenue] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [fee, setFee] = useState('0');
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
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
      const res = (await api.post('events', body)) as ApiResponse<EventWithType>;
      const created = unwrapApiData(res);
      toast.success('Event created.');
      router.push(routes.event(created.id));
      router.refresh();
    } catch {
      toast.error('Could not create event. Check fields and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <Breadcrumbs
        className="mb-6 text-slate-600 dark:text-slate-300 [&_a]:font-medium [&_a]:text-planora-primary [&_a]:hover:underline dark:[&_a]:text-sky-300"
        items={[
          { href: routes.dashboard, label: 'Dashboard' },
          { href: routes.createEvent, label: 'Create event' },
        ]}
      />
      <MarketingHero
        className="mb-10"
        eyebrow="New listing"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="Create event"
        description="Publish a public or private listing, set venue and schedule, and optionally collect a registration fee in BDT."
      />

      <section className="rounded-3xl border border-white/35 bg-white/35 p-5 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
        <div className="mx-auto max-w-2xl">
          <Card
            variant="glass"
            className="motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary"
          >
            <CardTitle className="gradient-text text-xl font-bold">Event details</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Required fields are validated before your listing goes live.
            </CardDescription>
            <form className="mt-6" onSubmit={(ev) => void onSubmit(ev)}>
              <FormStack>
                <div>
                  <Label htmlFor="create-title">Title</Label>
                  <Input
                    id="create-title"
                    className="mt-1"
                    required
                    maxLength={150}
                    value={title}
                    onChange={(ev) => setTitle(ev.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="create-desc">Description</Label>
                  <Textarea
                    id="create-desc"
                    className="mt-1"
                    required
                    maxLength={5000}
                    rows={4}
                    value={description}
                    onChange={(ev) => setDescription(ev.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="create-dt">Starts at (local)</Label>
                  <Input
                    id="create-dt"
                    className="mt-1"
                    type="datetime-local"
                    required
                    value={dateTimeLocal}
                    onChange={(ev) => setDateTimeLocal(ev.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="create-venue">Venue</Label>
                  <Input
                    id="create-venue"
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
                    <Label htmlFor="create-fee">Fee (BDT)</Label>
                    <Input
                      id="create-fee"
                      className="mt-1"
                      type="number"
                      min={0.01}
                      step={0.01}
                      value={fee}
                      onChange={(ev) => setFee(ev.target.value)}
                    />
                  </div>
                ) : null}
                <Button type="submit" variant="primary" isLoading={loading}>
                  Create
                </Button>
              </FormStack>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}
