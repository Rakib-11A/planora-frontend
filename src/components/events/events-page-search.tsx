'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

const QUICK_TERMS = ['Meetup', 'Workshop', 'Conference', 'Music'] as const;

export interface EventsPageSearchProps {
  defaultQuery?: string;
}

/**
 * URL-synced search for `/events` (reads/writes `?search=`). Glass pill + quick chips.
 */
export function EventsPageSearch({ defaultQuery = '' }: EventsPageSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputId = useId();
  const [query, setQuery] = useState(defaultQuery);

  function buildListUrl(searchValue: string): string {
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue.length > 0) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }
    const qs = params.toString();
    return qs.length > 0 ? `${routes.events}?${qs}` : routes.events;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    router.push(buildListUrl(q));
  }

  function applyQuick(term: string) {
    setQuery(term);
    router.push(buildListUrl(term));
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-2xl">
      <form onSubmit={onSubmit} role="search" aria-label="Search events on this page">
        {/* Hidden label for screen readers */}
        <label htmlFor={inputId} className="sr-only">
          Search events
        </label>

        {/*
          Single-row layout on every screen size.
          Mobile: rounded-2xl (pill shape needs single-row content to look right).
          sm+:    rounded-full pill.
        */}
        <div className="glass-effect flex items-center gap-2 rounded-2xl border border-white/40 px-3 py-2 shadow-lifted backdrop-blur-xl sm:rounded-full sm:px-2 sm:py-2 dark:border-white/15">
          <Search
            className="text-planora-primary pointer-events-none ml-1 size-4 shrink-0 sm:ml-2 sm:size-5"
            aria-hidden
          />

          <input
            id={inputId}
            type="search"
            name="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events…"
            autoComplete="off"
            className={cn(
              'min-w-0 flex-1 bg-transparent py-1.5 text-sm text-slate-900 outline-none',
              'placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500',
              'focus-visible:outline-none'
            )}
          />

          {/*
            Compact on mobile (h-8 rounded-xl), full-size on sm+.
            Always a single inline element — no wrapping, no full-width row.
          */}
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className={cn(
              'shrink-0 rounded-xl',
              'sm:h-9 sm:rounded-full sm:px-5 sm:text-sm',
              'motion-safe:transition motion-safe:duration-300 motion-safe:hover:shadow-glow-primary'
            )}
          >
            Search
          </Button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Try
        </span>
        {QUICK_TERMS.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => applyQuick(term)}
            className={cn(
              'rounded-full border border-white/50 bg-white/35 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm',
              'motion-safe:transition motion-safe:duration-200 hover:border-planora-primary/40 hover:bg-planora-primary/10 hover:text-planora-primary',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary',
              'dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-planora-primary/20'
            )}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
