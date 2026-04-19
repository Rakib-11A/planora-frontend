import { Calendar, Database, Gauge, MessageSquareText, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';

import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

const cards = [
  { href: routes.adminUsers, title: 'Users', body: 'Search, ban, and unban accounts.', icon: Users, iconClass: 'bg-sky-500/15 text-sky-700 dark:bg-sky-400/20 dark:text-sky-200' },
  { href: routes.adminEvents, title: 'Events', body: 'Review listings and soft-delete events.', icon: Calendar, iconClass: 'bg-planora-primary/15 text-planora-primary dark:bg-planora-primary/25' },
  {
    href: routes.adminFeatured,
    title: 'Featured event',
    body: 'Pick the public event highlighted on the homepage hero.',
    icon: Sparkles,
    iconClass: 'bg-fuchsia-500/15 text-fuchsia-800 dark:bg-fuchsia-400/20 dark:text-fuchsia-100',
  },
  { href: routes.adminReviews, title: 'Reviews', body: 'Moderate reviews tied to events.', icon: MessageSquareText, iconClass: 'bg-violet-500/15 text-violet-700 dark:bg-violet-400/20 dark:text-violet-200' },
  { href: routes.adminCache, title: 'Cache', body: 'Redis health and hot keys.', icon: Database, iconClass: 'bg-emerald-500/15 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200' },
  { href: routes.adminRateLimits, title: 'Rate limits', body: 'Blocked request buckets.', icon: Gauge, iconClass: 'bg-amber-500/15 text-amber-900 dark:bg-amber-400/20 dark:text-amber-100' },
] as const;

export default function AdminHomePage() {
  return (
    <div className="w-full">
      <MarketingHero
        className="mb-10"
        eyebrow="Operations"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="Admin console"
        description="Operational tools backed by `/api/admin/*`. Changes apply immediately."
      />

      <section className="rounded-3xl border border-white/35 bg-white/35 p-4 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 sm:p-6 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.href} href={c.href} className="group block">
                <Card
                  variant="glass"
                  className="h-full motion-safe:transition-shadow motion-safe:duration-300 motion-safe:group-hover:shadow-glow-primary"
                >
                  <div className={cn('mb-3 flex size-11 items-center justify-center rounded-2xl', c.iconClass)}>
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <CardTitle className="gradient-text text-lg font-bold">{c.title}</CardTitle>
                  <CardDescription className="mt-2 text-slate-600 dark:text-slate-300">{c.body}</CardDescription>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
