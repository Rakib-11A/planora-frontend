import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

const linkBtnBase =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold motion-safe:transition motion-safe:duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary';

export default function EventNotFound() {
  return (
    <div className="relative w-full overflow-hidden pb-24 pt-16">
      <div
        className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-b from-slate-100/90 via-white to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30"
        aria-hidden
      />
      <div className="relative z-[1] mx-auto max-w-lg px-4 text-center sm:px-6">
        <p className="text-xs font-bold uppercase tracking-widest text-planora-primary dark:text-sky-300">
          404
        </p>
        <h1 className="gradient-text mt-2 text-3xl font-black tracking-tight sm:text-4xl">Event not found</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          It may be private, removed, or the link is incorrect. Head back to the public calendar and try another
          listing.
        </p>
        <Link
          href={routes.events}
          className={cn(
            linkBtnBase,
            'mt-8 bg-planora-primary text-white shadow-md motion-safe:hover:scale-[1.02] motion-safe:hover:shadow-glow-primary hover:bg-planora-primary/90'
          )}
        >
          <ArrowLeft className="size-4 shrink-0" aria-hidden />
          Back to events
        </Link>
      </div>
    </div>
  );
}
