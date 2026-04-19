'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

export function HeroSearchBar() {
  const router = useRouter();
  const inputId = useId();
  const [query, setQuery] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    const url = q.length > 0 ? `${routes.events}?search=${encodeURIComponent(q)}` : routes.events;
    router.push(url);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative mx-auto mt-10 w-full max-w-xl"
      role="search"
      aria-label="Search public events"
    >
      <div className="glass-effect relative flex flex-wrap items-center gap-2 rounded-full border border-white/30 px-2 py-2 shadow-glass backdrop-blur-xl sm:flex-nowrap dark:border-white/10">
        <Search
          className="text-planora-primary pointer-events-none ml-2 size-5 shrink-0 opacity-90 sm:ml-3"
          aria-hidden
        />
        <div className="relative min-w-0 flex-1 px-1">
          <input
            id={inputId}
            type="search"
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder=" "
            autoComplete="off"
            className={cn(
              'peer w-full min-w-0 rounded-full bg-transparent px-2 pb-2 pt-5 text-base text-slate-900 outline-none dark:text-slate-100',
              'focus-visible:ring-planora-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
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
            Search events
          </label>
        </div>
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="motion-safe:transition motion-safe:duration-300 w-full shrink-0 rounded-full sm:w-auto hover:scale-105 hover:shadow-glow-primary"
        >
          Search
        </Button>
      </div>
    </form>
  );
}
