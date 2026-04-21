'use client';

import { cn } from '@/lib/utils';

/** Chip ids for home category filtering (kebab-case); keep in sync with `EventCategoriesSection` rules. */
export const CATEGORY_FILTER_IDS = [
  'all',
  'public-free',
  'public-paid',
  'private-free',
  'private-paid',
] as const;

export type CategoryFilterId = (typeof CATEGORY_FILTER_IDS)[number];

const CATEGORY_LABELS: Record<CategoryFilterId, string> = {
  all: 'All Events',
  'public-free': 'Public Free',
  'public-paid': 'Public Paid',
  'private-free': 'Private Free',
  'private-paid': 'Private Paid',
};

export interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  /** Optional counts keyed by category id; omit or partial until wired to API. */
  counts?: Partial<Record<CategoryFilterId, number>>;
}

export function CategoryFilter({ activeCategory, onCategoryChange, counts }: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        className="flex snap-x snap-mandatory gap-3 px-1 py-1 md:flex-wrap md:overflow-visible md:px-0"
        role="tablist"
        aria-label="Event categories"
      >
        {CATEGORY_FILTER_IDS.map((id) => {
          const isActive = activeCategory === id;
          const count = counts?.[id];
          const showBadge = count !== undefined && count >= 0;

          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onCategoryChange(id)}
              className={cn(
                'flex shrink-0 snap-start items-center gap-2 rounded-full border px-6 py-2 text-sm font-medium transition-colors duration-200',
                'focus-visible:ring-planora-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                isActive
                  ? 'border-planora-primary bg-planora-primary text-white'
                  : 'border-planora-border hover:border-planora-primary bg-white text-gray-700'
              )}
            >
              <span>{CATEGORY_LABELS[id]}</span>
              {showBadge ? (
                <span
                  className={cn(
                    'min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-xs font-semibold tabular-nums',
                    isActive ? 'bg-white/20 text-white' : 'bg-planora-surface text-planora-primary'
                  )}
                >
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
