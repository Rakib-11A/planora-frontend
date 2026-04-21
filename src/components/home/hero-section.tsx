import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { HeroSearchBar } from '@/components/home/hero-search-bar';
import { buttonVariants } from '@/components/ui/button';
import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

/**
 * Editorial hero — Stripe/Linear/Notion tone.
 *
 * Typography carries the page. Background is a single subtle radial wash,
 * theme-reactive, with no parallax, blobs, tilt, or ambient animation.
 * Featured events live in their own section below (see FeaturedEventSection).
 */
export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Subtle radial wash — indigo tint in light, brighter indigo in dark. */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 -z-10',
          'bg-[radial-gradient(60rem_32rem_at_50%_-10%,rgba(79,70,229,0.10),transparent_70%)]',
          'dark:bg-[radial-gradient(60rem_32rem_at_50%_-10%,rgba(99,102,241,0.22),transparent_70%)]'
        )}
        aria-hidden
      />
      {/* Hairline divider separates hero from first section. */}
      <div
        className="bg-border pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-px"
        aria-hidden
      />

      <div className="mx-auto max-w-5xl px-4 pb-24 pt-16 text-center sm:pt-20 md:pb-32 md:pt-28">
        <p className="text-primary text-xs font-semibold uppercase tracking-[0.14em]">
          Plan. Host. Sell out.
        </p>

        <h1
          className={cn(
            'text-foreground mt-5 text-balance font-semibold tracking-tight',
            'text-4xl leading-[1.08] sm:text-5xl md:text-6xl lg:text-[4.5rem]'
          )}
        >
          Events that run <span className="text-muted-strong">themselves.</span>
        </h1>

        <p className="text-muted mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed sm:text-lg">
          Planora is the quietest way to create, invite, sell, and manage events.
          Built for organizers who want clarity — not a dashboard that shouts.
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
            className={buttonVariants({ variant: 'ghost', size: 'lg' })}
          >
            Browse events
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="mx-auto mt-14 max-w-xl">
          <HeroSearchBar />
        </div>
      </div>
    </section>
  );
}
