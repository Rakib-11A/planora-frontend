import { Sparkles } from 'lucide-react';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

const linkBtnBase =
  'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-planora-primary focus-visible:ring-offset-2';

const linkBtnPrimary = 'bg-planora-primary text-white hover:bg-planora-primary/90';

const linkBtnOutline =
  'border-2 border-planora-primary bg-transparent text-planora-primary hover:bg-planora-primary/10';

/**
 * Static homepage CTA. Uses `Link` with button styling so navigation works from a
 * Server Component (the `Button` component is client-only and uses `<button>`).
 */
export function CtaSection() {
  return (
    <section className="px-4 py-16">
      <Card
        padding="none"
        className={cn(
          'from-planora-secondary/15 to-planora-accent/15 mx-auto max-w-5xl border-0 bg-gradient-to-r shadow-md'
        )}
      >
        <div className="grid grid-cols-1 items-center gap-10 px-6 py-12 text-center md:grid-cols-2 md:gap-12 md:px-12 md:py-16 md:text-left">
          <div className="flex justify-center md:justify-start">
            <Sparkles
              className="text-planora-primary size-20 drop-shadow-sm md:size-28"
              aria-hidden
            />
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-planora-primary text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-3 max-w-lg text-base text-gray-700 md:text-lg">
              Create your own event or join thousands of others
            </p>
            <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Link href={routes.createEvent} className={cn(linkBtnBase, linkBtnPrimary)}>
                Create Event
              </Link>
              <Link href={routes.events} className={cn(linkBtnBase, linkBtnOutline)}>
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
