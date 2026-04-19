'use client';

import { useParams } from 'next/navigation';

import { EditEventForm } from '@/components/events/edit-event-form';

export default function EditEventPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  if (!id) {
    return <p className="text-sm text-gray-600">Invalid event.</p>;
  }
  return <EditEventForm eventId={id} />;
}
