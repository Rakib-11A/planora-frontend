'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

const VALID_SORT_VALUES = new Set<string>(SORT_OPTIONS.map((o) => o.value));

export function parseSortValue(raw: string | null): SortValue {
  if (raw && VALID_SORT_VALUES.has(raw)) return raw as SortValue;
  return 'newest';
}

export function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = parseSortValue(searchParams.get('sort'));

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'newest') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    params.delete('page');
    const qs = params.toString();
    router.replace(qs ? `${routes.explore}?${qs}` : routes.explore);
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <label
        htmlFor="explore-sort"
        className="text-caption whitespace-nowrap text-muted"
      >
        Sort by
      </label>
      <select
        id="explore-sort"
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'bg-input text-foreground border-input-border',
          'h-9 cursor-pointer rounded-md border px-2.5 text-sm',
          'motion-safe:transition-colors motion-safe:duration-150',
          'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
        )}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
