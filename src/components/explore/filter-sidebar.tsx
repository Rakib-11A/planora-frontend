'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

function parseBool(v: string | null): boolean | undefined {
  if (v === 'true') return true;
  if (v === 'false') return false;
  return undefined;
}

const PRICE_BRACKETS = [
  { label: 'Under ৳500', value: '0-500' },
  { label: '৳500 – ৳2,000', value: '500-2000' },
  { label: '৳2,000 – ৳5,000', value: '2000-5000' },
  { label: 'Above ৳5,000', value: '5000+' },
] as const;

type PriceBracketValue = (typeof PRICE_BRACKETS)[number]['value'];

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const qIsPublic = parseBool(searchParams.get('isPublic'));
  const qIsPaid = parseBool(searchParams.get('isPaid'));
  const qPriceRange = searchParams.get('priceRange') ?? '';

  const visibilityValue: 'all' | 'public' | 'private' =
    qIsPublic === undefined ? 'all' : qIsPublic ? 'public' : 'private';
  const priceValue: 'all' | 'free' | 'paid' =
    qIsPaid === undefined ? 'all' : qIsPaid ? 'paid' : 'free';

  const hasFilters = qIsPublic !== undefined || qIsPaid !== undefined || qPriceRange !== '';

  function navigate(params: URLSearchParams) {
    params.delete('page');
    const qs = params.toString();
    router.replace(qs ? `${routes.explore}?${qs}` : routes.explore);
  }

  function setVisibility(v: 'all' | 'public' | 'private') {
    const params = new URLSearchParams(searchParams.toString());
    if (v === 'all') {
      params.delete('isPublic');
    } else {
      params.set('isPublic', v === 'public' ? 'true' : 'false');
    }
    navigate(params);
  }

  function setPriceType(v: 'all' | 'free' | 'paid') {
    const params = new URLSearchParams(searchParams.toString());
    if (v === 'all') {
      params.delete('isPaid');
      params.delete('priceRange');
    } else if (v === 'free') {
      params.set('isPaid', 'false');
      params.delete('priceRange');
    } else {
      params.set('isPaid', 'true');
    }
    navigate(params);
  }

  function togglePriceRange(value: PriceBracketValue) {
    const params = new URLSearchParams(searchParams.toString());
    if (qPriceRange === value) {
      params.delete('priceRange');
    } else {
      params.set('priceRange', value);
      params.set('isPaid', 'true');
    }
    navigate(params);
  }

  function clearAll() {
    const params = new URLSearchParams();
    const search = searchParams.get('search');
    if (search) params.set('search', search);
    const sort = searchParams.get('sort');
    if (sort) params.set('sort', sort);
    navigate(params);
  }

  const radioBase = cn(
    'size-4 cursor-pointer accent-primary'
  );
  const labelBase = cn(
    'group flex cursor-pointer items-center gap-2.5'
  );
  const labelText = cn(
    'text-body-r text-foreground transition-colors group-hover:text-primary'
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-h4 font-semibold text-foreground">Filters</h2>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className={cn(
              'text-xs font-medium text-primary hover:underline',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            )}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category (Visibility) */}
      <section>
        <h3 className="text-caption mb-3 font-semibold uppercase tracking-wide text-muted-strong">
          Category
        </h3>
        <div className="flex flex-col gap-2.5">
          {(
            [
              { value: 'all', label: 'All Events' },
              { value: 'public', label: 'Public Events' },
              { value: 'private', label: 'Private Events' },
            ] as const
          ).map((opt) => (
            <label key={opt.value} className={labelBase}>
              <input
                type="radio"
                name="filter-visibility"
                value={opt.value}
                checked={visibilityValue === opt.value}
                onChange={() => setVisibility(opt.value)}
                className={radioBase}
              />
              <span className={labelText}>{opt.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section>
        <h3 className="text-caption mb-3 font-semibold uppercase tracking-wide text-muted-strong">
          Pricing
        </h3>
        <div className="flex flex-col gap-2.5">
          {(
            [
              { value: 'all', label: 'All Prices' },
              { value: 'free', label: 'Free' },
              { value: 'paid', label: 'Paid' },
            ] as const
          ).map((opt) => (
            <label key={opt.value} className={labelBase}>
              <input
                type="radio"
                name="filter-price-type"
                value={opt.value}
                checked={priceValue === opt.value}
                onChange={() => setPriceType(opt.value)}
                className={radioBase}
              />
              <span className={labelText}>{opt.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Price Range — only visible when Paid is selected */}
      {qIsPaid === true && (
        <section>
          <h3 className="text-caption mb-3 font-semibold uppercase tracking-wide text-muted-strong">
            Price Range
          </h3>
          <div className="flex flex-col gap-2.5">
            {PRICE_BRACKETS.map((bracket) => (
              <label key={bracket.value} className={labelBase}>
                <input
                  type="checkbox"
                  checked={qPriceRange === bracket.value}
                  onChange={() => togglePriceRange(bracket.value)}
                  className="size-4 cursor-pointer rounded accent-primary"
                />
                <span className={labelText}>{bracket.label}</span>
              </label>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
