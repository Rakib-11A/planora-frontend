'use client';

import { Globe, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
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
import { cn } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';
import type { EventWithType } from '@/types/event';

type EventTypeId = 'public_free' | 'public_paid' | 'private_free' | 'private_paid';

type EventTypeOption = {
  id: EventTypeId;
  label: string;
  description: string;
  Icon: typeof Globe;
  isPublic: boolean;
  isPaid: boolean;
};

const EVENT_TYPE_OPTIONS: EventTypeOption[] = [
  {
    id: 'public_free',
    label: 'Public · Free',
    description: 'Open to everyone, no fee',
    Icon: Globe,
    isPublic: true,
    isPaid: false,
  },
  {
    id: 'public_paid',
    label: 'Public · Paid',
    description: 'Open to everyone, with a fee',
    Icon: Globe,
    isPublic: true,
    isPaid: true,
  },
  {
    id: 'private_free',
    label: 'Private · Free',
    description: 'Invite-only, no fee',
    Icon: Lock,
    isPublic: false,
    isPaid: false,
  },
  {
    id: 'private_paid',
    label: 'Private · Paid',
    description: 'Invite-only, with a fee',
    Icon: Lock,
    isPublic: false,
    isPaid: true,
  },
];

export function CreateEventForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTimeLocal, setDateTimeLocal] = useState('');
  const [venue, setVenue] = useState('');
  const [eventTypeId, setEventTypeId] = useState<EventTypeId>('public_free');
  const [fee, setFee] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedType = EVENT_TYPE_OPTIONS.find((o) => o.id === eventTypeId)!;
  const { isPublic, isPaid } = selectedType;

  // Min datetime in local-time format so the browser blocks past selection.
  // Add 1 minute buffer so the picked time won't have already passed by the time
  // the request hits the server.
  const minDateTime = useMemo(() => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffset + 60000).toISOString().slice(0, 16);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const dt = new Date(dateTimeLocal);
    if (Number.isNaN(dt.getTime())) {
      toast.error('Pick a valid date and time.');
      return;
    }
    // Guard against past dates even if the user typed one manually
    if (dt <= new Date()) {
      toast.error('Event date and time must be in the future.');
      return;
    }

    const feeNum = isPaid ? Number(fee) : 0;
    if (isPaid && (!Number.isFinite(feeNum) || feeNum <= 0)) {
      toast.error('Enter a fee greater than 0 for paid events.');
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
      toast.success('Event created successfully!');
      router.push(routes.event(created.id));
      router.refresh();
    } catch {
      // The API interceptor already shows the specific backend error as a toast.
      // Showing a second generic toast here would confuse the user with two messages.
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
              Fill in the details below to publish your event listing.
            </CardDescription>

            <form className="mt-6" onSubmit={(ev) => void onSubmit(ev)}>
              <FormStack>
                {/* Title */}
                <div>
                  <Label htmlFor="create-title">Title</Label>
                  <Input
                    id="create-title"
                    className="mt-1"
                    required
                    maxLength={150}
                    placeholder="e.g. Annual Tech Meetup 2026"
                    value={title}
                    onChange={(ev) => setTitle(ev.target.value)}
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="create-desc">Description</Label>
                  <Textarea
                    id="create-desc"
                    className="mt-1"
                    required
                    maxLength={5000}
                    rows={4}
                    placeholder="Tell attendees what to expect…"
                    value={description}
                    onChange={(ev) => setDescription(ev.target.value)}
                  />
                </div>

                {/* Date & Time */}
                <div>
                  <Label htmlFor="create-dt">Starts at (your local time)</Label>
                  <Input
                    id="create-dt"
                    className="mt-1"
                    type="datetime-local"
                    required
                    min={minDateTime}
                    value={dateTimeLocal}
                    onChange={(ev) => setDateTimeLocal(ev.target.value)}
                  />
                </div>

                {/* Venue */}
                <div>
                  <Label htmlFor="create-venue">Venue</Label>
                  <Input
                    id="create-venue"
                    className="mt-1"
                    required
                    maxLength={300}
                    placeholder="e.g. Bashundhara City, Dhaka"
                    value={venue}
                    onChange={(ev) => setVenue(ev.target.value)}
                  />
                </div>

                {/* Event Type — clear 4-option selector */}
                <div>
                  <Label className="mb-2 block">Event type</Label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {EVENT_TYPE_OPTIONS.map((opt) => {
                      const isSelected = eventTypeId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setEventTypeId(opt.id)}
                          aria-pressed={isSelected}
                          className={cn(
                            'flex flex-col items-start gap-1 rounded-lg border p-3 text-left text-sm',
                            'motion-safe:transition-all motion-safe:duration-150',
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30'
                              : 'border-border bg-white/50 text-foreground hover:border-border-strong hover:bg-white/70',
                            'dark:bg-slate-800/50',
                            isSelected && 'dark:border-sky-400 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/20',
                            !isSelected && 'dark:hover:border-slate-600 dark:hover:bg-slate-700/50',
                          )}
                        >
                          <span className="flex items-center gap-1.5 font-semibold leading-none">
                            <opt.Icon className="size-3.5 shrink-0" aria-hidden />
                            {opt.label}
                          </span>
                          <span className="text-xs leading-snug opacity-70">{opt.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fee — only for paid event types */}
                {isPaid ? (
                  <div>
                    <Label htmlFor="create-fee">Registration fee (BDT)</Label>
                    <Input
                      id="create-fee"
                      className="mt-1"
                      type="number"
                      min={1}
                      step={1}
                      required
                      placeholder="e.g. 500"
                      value={fee}
                      onChange={(ev) => setFee(ev.target.value)}
                    />
                  </div>
                ) : null}

                <Button type="submit" variant="primary" isLoading={loading}>
                  Create event
                </Button>
              </FormStack>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}
