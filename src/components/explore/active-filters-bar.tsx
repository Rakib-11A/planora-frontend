'use client';

import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

const PRICE_RANGE_LABELS: Record<string, string> = {
  '0-500': 'Under ৳500',
  '500-2000': '৳500–৳2,000',
  '2000-5000': '৳2,000–৳5,000',
  '5000+': 'Above ৳5,000',
};

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      role="listitem"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-primary/30',
        'bg-primary-subtle px-3 py-1 text-xs font-semibold text-primary'
      )}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className={cn(
          'rounded-full text-primary/60 transition-colors hover:text-primary',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary'
        )}
        aria-label={`Remove ${label} filter`}
      >
        <X className="size-3" aria-hidden />
      </button>
    </span>
  );
}

export function ActiveFiltersBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const qSearch = searchParams.get('search');
  const qIsPublic = searchParams.get('isPublic');
  const qIsPaid = searchParams.get('isPaid');
  const qPriceRange = searchParams.get('priceRange');

  function removeParam(...keys: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of keys) params.delete(key);
    params.delete('page');
    const qs = params.toString();
    router.replace(qs ? `${routes.explore}?${qs}` : routes.explore);
  }

  function clearAllFilters() {
    const params = new URLSearchParams();
    if (qSearch) params.set('search', qSearch);
    const sort = searchParams.get('sort');
    if (sort) params.set('sort', sort);
    const qs = params.toString();
    router.replace(qs ? `${routes.explore}?${qs}` : routes.explore);
  }

  const chips: { id: string; label: string; remove: () => void }[] = [];
  if (qIsPublic === 'true') chips.push({ id: 'isPublic', label: 'Public Only', remove: () => removeParam('isPublic') });
  if (qIsPublic === 'false') chips.push({ id: 'isPublic', label: 'Private Only', remove: () => removeParam('isPublic') });
  if (qIsPaid === 'false') chips.push({ id: 'isPaid', label: 'Free', remove: () => removeParam('isPaid') });
  if (qIsPaid === 'true') chips.push({ id: 'isPaid', label: 'Paid', remove: () => removeParam('isPaid', 'priceRange') });
  if (qPriceRange) {
    chips.push({
      id: 'priceRange',
      label: PRICE_RANGE_LABELS[qPriceRange] ?? qPriceRange,
      remove: () => removeParam('priceRange'),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="list"
      aria-label="Active filters"
    >
      <span className="text-caption text-muted">Active:</span>
      {chips.map((chip) => (
        <FilterChip key={chip.id} label={chip.label} onRemove={chip.remove} />
      ))}
      <button
        type="button"
        onClick={clearAllFilters}
        className={cn(
          'ml-1 text-xs text-muted underline-offset-2 transition-colors',
          'hover:text-destructive hover:underline',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
        )}
      >
        Clear all
      </button>
    </div>
  );
}
