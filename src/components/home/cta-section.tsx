import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

/**
 * Closing CTA band.
 *
 * Single centered headline + short supporting line + two CTAs. No decorative
 * icon, no gradient-fill card. A thin surface card with a subtle radial wash
 * provides a closing gesture without competing with the hero.
 */
export function CtaSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-4 md:py-8">
      <div
        className={cn(
          'bg-surface border-border relative isolate overflow-hidden rounded-xl border shadow-sm',
          'px-6 py-16 text-center sm:px-10 md:py-20'
        )}
      >
        {/* Subtle corner wash — doesn't compete with the hero. */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 -z-10',
            'bg-[radial-gradient(40rem_20rem_at_50%_0%,rgba(79,70,229,0.08),transparent_70%)]',
            'dark:bg-[radial-gradient(40rem_20rem_at_50%_0%,rgba(99,102,241,0.16),transparent_70%)]'
          )}
          aria-hidden
        />

        <h2 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
          Ready to host your next event?
        </h2>
        <p className="text-muted mx-auto mt-4 max-w-xl text-base leading-relaxed">
          Create an event in under a minute. Invite your guests. Sell tickets if
          you need to. That&apos;s it.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={routes.createEvent}
            className={buttonVariants({ variant: 'primary', size: 'lg', className: 'px-6' })}
          >
            Create an event
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href={routes.events}
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            Browse events
          </Link>
        </div>
      </div>
    </section>
  );
}
