'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { EditEventForm } from '@/components/events/edit-event-form';
import { routes } from '@/constants/config';

export default function EditEventPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  if (!id) {
    return (
      <div className="w-full">
        <div className="rounded-3xl border border-white/35 bg-white/40 px-6 py-12 text-center shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/40">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Invalid event link.</p>
          <Link
            href={routes.myEvents}
            className="mt-4 inline-flex text-sm font-semibold text-planora-primary underline-offset-4 hover:underline dark:text-sky-300"
          >
            Back to my events
          </Link>
        </div>
      </div>
    );
  }
  return <EditEventForm eventId={id} />;
}
