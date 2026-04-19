import Link from 'next/link';

import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { routes } from '@/constants/config';

const cards = [
  { href: routes.adminUsers, title: 'Users', body: 'Search, ban, and unban accounts.' },
  { href: routes.adminEvents, title: 'Events', body: 'Review listings and soft-delete events.' },
  { href: routes.adminReviews, title: 'Reviews', body: 'Moderate reviews tied to events.' },
  { href: routes.adminCache, title: 'Cache', body: 'Redis health and hot keys.' },
  { href: routes.adminRateLimits, title: 'Rate limits', body: 'Blocked request buckets.' },
] as const;

export default function AdminHomePage() {
  return (
    <div>
      <PageHeader
        title="Admin console"
        description="Operational tools backed by `/api/admin/*`. Changes apply immediately."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="block">
            <Card className="h-full transition-colors hover:border-planora-primary/40">
              <CardTitle>{c.title}</CardTitle>
              <CardDescription>{c.body}</CardDescription>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
