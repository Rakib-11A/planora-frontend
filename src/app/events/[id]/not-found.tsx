import Link from 'next/link';

import { routes } from '@/constants/config';

export default function EventNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Event not found</h1>
      <p className="text-planora-muted mt-2 text-sm">
        It may be private, removed, or the link is incorrect.
      </p>
      <Link
        href={routes.events}
        className="text-planora-primary mt-6 inline-block font-medium hover:underline"
      >
        Back to events
      </Link>
    </div>
  );
}
