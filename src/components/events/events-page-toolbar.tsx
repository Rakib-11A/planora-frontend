import Link from 'next/link';

import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

export interface EventsPageToolbarProps {
  count: number;
  activeSearch: string;
  /** Short label for active filter preset (e.g. Public free). */
  activePreset?: string;
}

/**
 * Server-friendly strip above the grid: result count, clear search, short hint.
 */
export function EventsPageToolbar({ count, activeSearch, activePreset }: EventsPageToolbarProps) {
  const hasQuery = activeSearch.length > 0;

  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-4 rounded-2xl border border-white/40 bg-white/45 px-4 py-4 shadow-depth-soft backdrop-blur-md sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-slate-900/45'
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center rounded-full bg-planora-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-planora-primary dark:bg-planora-primary/20 dark:text-sky-200">
          {count} {count === 1 ? 'listing' : 'listings'}
          {hasQuery ? ' matched' : ' live'}
        </span>
        {hasQuery ? (
          <Link
            href={routes.events}
            className="text-sm font-semibold text-slate-600 underline-offset-4 transition-colors hover:text-planora-primary hover:underline dark:text-slate-300 dark:hover:text-sky-200"
          >
            Clear search
          </Link>
        ) : null}
        {activePreset ? (
          <span className="text-planora-muted text-xs font-semibold uppercase tracking-wide">
            Filter: {activePreset}
          </span>
        ) : null}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Open a card for the full rundown—date, venue, organizer, and join options.
      </p>
    </div>
  );
}
