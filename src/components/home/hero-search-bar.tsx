'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import { routes } from '@/constants/config';

/**
 * Minimal search control for the hero.
 *
 * Clean surface field (no glass, no floating label, no glow ring). Uses the
 * semantic input tokens so light/dark are consistent with the rest of the app.
 */
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
      role="search"
      aria-label="Search public events"
      className="bg-surface border-border focus-within:ring-ring focus-within:ring-offset-background relative flex items-center gap-1 rounded-full border p-1.5 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-offset-2"
    >
      <label htmlFor={inputId} className="sr-only">
        Search events
      </label>
      <Search className="text-muted ml-3 size-4 shrink-0" aria-hidden />
      <input
        id={inputId}
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search events…"
        autoComplete="off"
        className="text-foreground placeholder:text-muted min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
      />
      <Button type="submit" size="sm" className="rounded-full px-4">
        Search
      </Button>
    </form>
  );
}
