import { Calendar, Shield, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';

import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

const linkBtnBase =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold motion-safe:transition motion-safe:duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary';

export default function AboutPage() {
  return (
    <div className="w-full px-4 pb-16 sm:px-6">
      <MarketingHero
        className="mb-10"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="About Planora"
        description="We help organizers publish trustworthy events and help people discover experiences worth their time—discovery, participation, payments, and moderation in one place."
      />

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <Card variant="glass" className="motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary">
          <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-planora-primary/15 text-planora-primary dark:bg-planora-primary/25">
            <Sparkles className="size-6" aria-hidden />
          </div>
          <CardTitle className="gradient-text text-xl font-bold">Our focus</CardTitle>
          <CardDescription className="mt-2 text-slate-600 dark:text-slate-300">
            Clear listings, honest participation flows, and tools that scale from a first meetup to a busy
            calendar—without losing the human touch.
          </CardDescription>
        </Card>

        <Card variant="glass" className="motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary">
          <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-planora-secondary/15 text-planora-secondary dark:bg-planora-secondary/25">
            <Shield className="size-6" aria-hidden />
          </div>
          <CardTitle className="gradient-text text-xl font-bold">Trust and safety</CardTitle>
          <CardDescription className="mt-2 text-slate-600 dark:text-slate-300">
            Public discovery, authenticated registration, invitations, payments, and admin moderation stay
            aligned with the live API—this page will grow as marketing copy lands.
          </CardDescription>
        </Card>

        <Card variant="glass" className="md:col-span-2 motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary">
          <CardTitle className="gradient-text text-xl font-bold">What you can do today</CardTitle>
          <CardDescription className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Explore what is live, join with an account, and—when you are ready—host your own.
          </CardDescription>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Calendar, label: 'Discover', text: 'Browse public events and open a card for full detail.' },
              { icon: Users, label: 'Participate', text: 'Sign in to register, pay where required, and track invites.' },
              { icon: Sparkles, label: 'Organize', text: 'Create listings, manage attendees, and iterate from feedback.' },
            ].map(({ icon: Icon, label, text }) => (
              <li
                key={label}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/50 p-4 text-left shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-800/40"
              >
                <Icon className="text-planora-primary size-5 shrink-0" aria-hidden />
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</span>
                <span className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{text}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mx-auto mt-10 flex max-w-5xl flex-col items-center justify-center gap-4 rounded-3xl border border-white/30 bg-white/50 px-6 py-8 text-center shadow-depth-soft backdrop-blur-md dark:border-white/10 dark:bg-slate-900/40 sm:flex-row sm:gap-6">
        <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Ready to browse or have questions for the team?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={routes.events}
            className={cn(
              linkBtnBase,
              'bg-planora-primary text-white shadow-md motion-safe:hover:scale-105 motion-safe:hover:shadow-glow-primary hover:bg-planora-primary/90'
            )}
          >
            Browse events
          </Link>
          <Link
            href={routes.contact}
            className={cn(
              linkBtnBase,
              'border-2 border-planora-primary/40 bg-white/60 text-planora-primary hover:border-planora-primary hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/15'
            )}
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
