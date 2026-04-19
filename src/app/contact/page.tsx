import { Clock, Mail, Megaphone, Server } from 'lucide-react';
import Link from 'next/link';

import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

const linkBtnBase =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold motion-safe:transition motion-safe:duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary';

export default function ContactPage() {
  return (
    <div className="relative w-full overflow-hidden pb-20">
      <div
        className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-b from-slate-100/90 via-white to-sky-50/35 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/25"
        aria-hidden
      />
      <div className="relative z-[1] px-4 sm:px-6">
        <MarketingHero
          className="mb-10"
          eyebrow="Support"
          sectionMaxWidthClass="max-w-5xl"
          innerMaxWidthClass="max-w-3xl"
          title="Contact Planora"
          description="Whether you are browsing events, hosting one, or operating this deployment, here is how to get unstuck quickly."
        />

        <div className="mx-auto max-w-5xl space-y-8">
          <section className="rounded-3xl border border-white/35 bg-white/35 p-5 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
            <div className="grid gap-6 md:grid-cols-3">
              <Card
                variant="glass"
                className="motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary"
              >
                <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-planora-primary/15 text-planora-primary dark:bg-planora-primary/25">
                  <Mail className="size-6" aria-hidden />
                </div>
                <CardTitle className="gradient-text text-xl font-bold">General & attendees</CardTitle>
                <CardDescription className="mt-2 text-slate-600 dark:text-slate-300">
                  Questions about discovering events, signing in, or joining a listing usually resolve fastest in the
                  product—browse live cards, then open one for full detail and registration.
                </CardDescription>
                <Link
                  href={routes.events}
                  className="mt-4 inline-flex text-sm font-semibold text-planora-primary underline-offset-4 hover:underline dark:text-sky-300"
                >
                  Browse public events
                </Link>
              </Card>

              <Card
                variant="glass"
                className="motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary"
              >
                <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-planora-secondary/15 text-planora-secondary dark:bg-planora-secondary/25">
                  <Megaphone className="size-6" aria-hidden />
                </div>
                <CardTitle className="gradient-text text-xl font-bold">Organizers</CardTitle>
                <CardDescription className="mt-2 text-slate-600 dark:text-slate-300">
                  Creating listings, editing details, and managing participation happen from your dashboard after you
                  sign in.
                </CardDescription>
                <div className="mt-4 flex flex-col gap-2 text-sm font-semibold">
                  <Link
                    href={routes.login}
                    className="text-planora-primary underline-offset-4 hover:underline dark:text-sky-300"
                  >
                    Sign in
                  </Link>
                  <Link
                    href={routes.createEvent}
                    className="text-planora-primary underline-offset-4 hover:underline dark:text-sky-300"
                  >
                    Create an event
                  </Link>
                </div>
              </Card>

              <Card
                variant="glass"
                className="motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary"
              >
                <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700 dark:bg-amber-400/20 dark:text-amber-200">
                  <Server className="size-6" aria-hidden />
                </div>
                <CardTitle className="gradient-text text-xl font-bold">This deployment</CardTitle>
                <CardDescription className="mt-2 text-slate-600 dark:text-slate-300">
                  Operators: wire a support inbox, ticketing tool, or status page in this route when you are ready.
                  Until then, use your repository and deployment notes for maintainer contact.
                </CardDescription>
              </Card>
            </div>

            <Card
              variant="glass"
              padding="sm"
              className="mt-6 border-dashed border-planora-primary/25 bg-white/40 dark:border-white/15 dark:bg-slate-900/40"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-900/5 dark:bg-white/10">
                  <Clock className="size-5 text-slate-600 dark:text-slate-300" aria-hidden />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Before you write
                  </CardTitle>
                  <CardDescription className="mt-1 text-slate-600 dark:text-slate-300">
                    Include the event name or URL, what you expected, and what happened instead. For account issues,
                    mention the email you use to sign in—never share passwords.
                  </CardDescription>
                </div>
              </div>
            </Card>
          </section>

          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/30 bg-white/50 px-6 py-8 text-center shadow-depth-soft backdrop-blur-md dark:border-white/10 dark:bg-slate-900/40 sm:flex-row sm:gap-6">
            <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              New here? See what Planora is building toward, then jump into the calendar.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href={routes.about}
                className={cn(
                  linkBtnBase,
                  'border-2 border-planora-primary/40 bg-white/60 text-planora-primary hover:border-planora-primary hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/15'
                )}
              >
                About Planora
              </Link>
              <Link
                href={routes.events}
                className={cn(
                  linkBtnBase,
                  'bg-planora-primary text-white shadow-md motion-safe:hover:scale-105 motion-safe:hover:shadow-glow-primary hover:bg-planora-primary/90'
                )}
              >
                Browse events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
