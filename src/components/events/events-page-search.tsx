'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  const inputId = useId();
  const [query, setQuery] = useState(defaultQuery);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    const url = q.length > 0 ? `${routes.events}?search=${encodeURIComponent(q)}` : routes.events;
    router.push(url);
  }

  function applyQuick(term: string) {
    setQuery(term);
    router.push(`${routes.events}?search=${encodeURIComponent(term)}`);
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-2xl">
      <form onSubmit={onSubmit} role="search" aria-label="Search public events on this page">
        <div className="glass-effect flex flex-wrap items-center gap-2 rounded-full border border-white/40 px-2 py-2 shadow-lifted backdrop-blur-xl dark:border-white/15 sm:flex-nowrap">
          <Search
            className="text-planora-primary pointer-events-none ml-2 size-5 shrink-0 sm:ml-3"
            aria-hidden
          />
          <div className="relative min-w-0 flex-1 px-1">
            <input
              id={inputId}
              type="search"
              name="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder=" "
              autoComplete="off"
              className={cn(
                'peer w-full min-w-0 rounded-full bg-transparent px-2 pb-2 pt-5 text-base text-slate-900 outline-none dark:text-slate-100',
                'focus-visible:ring-2 focus-visible:ring-planora-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
              )}
            />
            <label
              htmlFor={inputId}
              className={cn(
                'text-planora-muted pointer-events-none absolute left-2 top-1/2 origin-left -translate-y-1/2 text-sm transition-all',
                'peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:scale-90 peer-focus:text-xs',
                'peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:text-xs'
              )}
            >
              Search by title, venue, or keyword
            </label>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full shrink-0 rounded-full sm:w-auto motion-safe:transition motion-safe:duration-300 motion-safe:hover:scale-105 motion-safe:hover:shadow-glow-primary"
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
