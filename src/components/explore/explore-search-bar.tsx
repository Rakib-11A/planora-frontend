'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

const DEBOUNCE_MS = 300;

export function ExploreSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputId = useId();

  const [query, setQuery] = useState(searchParams.get('search') ?? '');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildUrl = useCallback(
    (value: string): string => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set('search', value.trim());
      } else {
        params.delete('search');
      }
      params.delete('page');
      const qs = params.toString();
      return qs ? `${routes.explore}?${qs}` : routes.explore;
    },
    [searchParams]
  );

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      router.replace(buildUrl(query));
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, buildUrl, router]);

  return (
    <div className="relative flex items-center">
      <label htmlFor={inputId} className="sr-only">
        Search events
      </label>
      <Search
        className="pointer-events-none absolute left-3 size-4 text-muted"
        aria-hidden
      />
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title or organizer…"
        autoComplete="off"
        className={cn(
          'bg-input text-foreground border-input-border placeholder:text-muted',
          'block h-11 w-full rounded-md border pl-9 text-sm',
          query ? 'pr-10' : 'pr-4',
          'motion-safe:transition-colors motion-safe:duration-150',
          'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
        )}
      />
      {query.length > 0 && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className={cn(
            'absolute right-3 rounded-sm text-muted transition-colors hover:text-foreground',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
          )}
          aria-label="Clear search"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
