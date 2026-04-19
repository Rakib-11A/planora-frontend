import Link from 'next/link';

import { routes } from '@/constants/config';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-planora-muted mt-2 text-sm">Manage your events and profile.</p>
      <ul className="text-planora-primary mt-8 list-inside list-disc space-y-2">
        <li>
          <Link href={routes.createEvent} className="hover:underline">
            Create event
          </Link>
        </li>
        <li>
          <Link href={routes.myEvents} className="hover:underline">
            My events
          </Link>
        </li>
      </ul>
    </div>
  );
}
