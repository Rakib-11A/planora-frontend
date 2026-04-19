'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
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
    <form
      onSubmit={(ev) => void onSubmit(ev)}
      className="max-w-xl space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h1 className="text-2xl font-bold text-gray-900">Create event</h1>
      <label className="block text-sm font-medium text-gray-700">
        Title
        <input
          required
          maxLength={150}
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          className="border-planora-border mt-1 block w-full rounded-md border px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium text-gray-700">
        Description
        <textarea
          required
          maxLength={5000}
          rows={4}
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          className="border-planora-border mt-1 block w-full rounded-md border px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium text-gray-700">
        Starts at (local)
        <input
          type="datetime-local"
          required
          value={dateTimeLocal}
          onChange={(ev) => setDateTimeLocal(ev.target.value)}
          className="border-planora-border mt-1 block w-full rounded-md border px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium text-gray-700">
        Venue
        <input
          required
          maxLength={300}
          value={venue}
          onChange={(ev) => setVenue(ev.target.value)}
          className="border-planora-border mt-1 block w-full rounded-md border px-3 py-2"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(ev) => setIsPublic(ev.target.checked)}
        />
        Public listing
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={isPaid} onChange={(ev) => setIsPaid(ev.target.checked)} />
        Paid event
      </label>
      {isPaid ? (
        <label className="block text-sm font-medium text-gray-700">
          Fee (USD)
          <input
            type="number"
            min={0.01}
            step={0.01}
            value={fee}
            onChange={(ev) => setFee(ev.target.value)}
            className="border-planora-border mt-1 block w-full rounded-md border px-3 py-2"
          />
        </label>
      ) : null}
      <Button type="submit" variant="primary" isLoading={loading}>
        Create
      </Button>
    </form>
  );
}
