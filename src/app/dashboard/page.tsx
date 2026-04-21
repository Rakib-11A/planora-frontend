'use client';

import {
  Bell,
  CalendarPlus,
  CalendarRange,
  CreditCard,
  Inbox,
  KeyRound,
  Shield,
  Ticket,
  UserCircle,
} from 'lucide-react';
import Link from 'next/link';

import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types/user';

const links = [
  {
    href: routes.createEvent,
    title: 'Create event',
    body: 'Publish a new listing.',
    icon: CalendarPlus,
    iconClass: 'bg-planora-primary/15 text-planora-primary dark:bg-planora-primary/25',
  },
  {
    href: routes.myEvents,
    title: 'My events',
    body: 'Events you organize.',
    icon: CalendarRange,
    iconClass: 'bg-sky-500/15 text-sky-700 dark:bg-sky-400/20 dark:text-sky-200',
  },
  {
    href: routes.participations,
    title: 'Participations',
    body: 'Registrations you hold.',
    icon: Ticket,
    iconClass: 'bg-violet-500/15 text-violet-700 dark:bg-violet-400/20 dark:text-violet-200',
  },
  {
    href: routes.invitations,
    title: 'Invitations',
    body: 'Private event inbox.',
    icon: Inbox,
    iconClass: 'bg-planora-secondary/15 text-planora-secondary dark:bg-planora-secondary/25',
  },
  {
    href: routes.payments,
    title: 'Payments',
    body: 'Checkout history.',
    icon: CreditCard,
    iconClass: 'bg-emerald-500/15 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200',
  },
  {
    href: routes.notifications,
    title: 'Notifications',
    body: 'System messages.',
    icon: Bell,
    iconClass: 'bg-amber-500/15 text-amber-900 dark:bg-amber-400/20 dark:text-amber-100',
  },
  {
    href: routes.profile,
    title: 'Profile',
    body: 'Account snapshot.',
    icon: UserCircle,
    iconClass: 'bg-slate-500/12 text-slate-700 dark:bg-slate-400/20 dark:text-slate-200',
  },
  {
    href: routes.changePassword,
    title: 'Change password',
    body: 'Update credentials.',
    icon: KeyRound,
    iconClass: 'bg-rose-500/12 text-rose-800 dark:bg-rose-400/20 dark:text-rose-100',
  },
] as const;

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const greeting =
    user?.name != null && user.name.length > 0
      ? `Signed in as ${user.name}. Pick a workflow below—everything here is scoped to your account.`
      : 'Shortcuts to everything you need after signing in.';

  return (
    <div className="w-full">
      <MarketingHero
        className="mb-10"
        eyebrow="Organizer hub"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="Dashboard"
        description={greeting}
      />

      <section className="rounded-3xl border border-white/35 bg-white/35 p-4 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 sm:p-6 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group block">
                <Card
                  variant="glass"
                  className="h-full motion-safe:transition-shadow motion-safe:duration-300 motion-safe:group-hover:shadow-glow-primary"
                >
                  <div
                    className={cn(
                      'mb-3 flex size-11 items-center justify-center rounded-2xl',
                      item.iconClass
                    )}
                  >
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <CardTitle className="gradient-text text-lg font-bold">{item.title}</CardTitle>
                  <CardDescription className="mt-2 text-slate-600 dark:text-slate-300">{item.body}</CardDescription>
                </Card>
              </Link>
            );
          })}
          {user?.role === UserRole.ADMIN ? (
            <Link href={routes.admin} className="group block sm:col-span-2 lg:col-span-1">
              <Card
                variant="glass"
                className={cn(
                  'h-full border-amber-300/40 bg-amber-50/35 dark:border-amber-400/25 dark:bg-amber-950/25',
                  'motion-safe:transition-shadow motion-safe:duration-300 motion-safe:group-hover:shadow-[0_0_28px_-4px_rgba(245,158,11,0.35)]'
                )}
              >
                <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-900 dark:bg-amber-400/20 dark:text-amber-100">
                  <Shield className="size-6" aria-hidden />
                </div>
                <CardTitle className="text-lg font-bold text-amber-950 dark:text-amber-50">Admin console</CardTitle>
                <CardDescription className="mt-2 text-amber-950/80 dark:text-amber-100/85">
                  Moderation and infrastructure tools.
                </CardDescription>
              </Card>
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}
