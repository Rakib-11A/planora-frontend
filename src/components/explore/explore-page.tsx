'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { startTransition, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import { ApexCard } from '@/components/ui/card';
import { ListingGrid } from '@/components/ui/listing-grid';
import { Button } from '@/components/ui/button';
import { ActiveFiltersBar } from '@/components/explore/active-filters-bar';
import { ExploreSearchBar } from '@/components/explore/explore-search-bar';
import { FilterSidebar } from '@/components/explore/filter-sidebar';
import { PaginationBar } from '@/components/explore/pagination-bar';
import { SortDropdown, parseSortValue, type SortValue } from '@/components/explore/sort-dropdown';
import { fetchEventsList } from '@/lib/events';
import { useAuthStore } from '@/hooks/useAuthStore';
import type { EventWithType } from '@/types/event';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 12;

function parseBool(v: string | null): boolean | undefined {
  if (v === 'true') return true;
  if (v === 'false') return false;
  return undefined;
}

function matchesPriceRange(fee: number, rangeStr: string): boolean {
  switch (rangeStr) {
    case '0-500':
      return fee <= 500;
    case '500-2000':
      return fee > 500 && fee <= 2000;
    case '2000-5000':
      return fee > 2000 && fee <= 5000;
    case '5000+':
      return fee > 5000;
    default:
      return true;
  }
}

function sortEvents(events: EventWithType[], sort: SortValue): EventWithType[] {
  const copy = [...events];
  switch (sort) {
    case 'price_asc':
      return copy.sort((a, b) => Number(a.fee) - Number(b.fee));
    case 'price_desc':
      return copy.sort((a, b) => Number(b.fee) - Number(a.fee));
    case 'popular':
      return copy.sort(
        (a, b) => (b.participationCount ?? 0) - (a.participationCount ?? 0)
      );
    case 'newest':
    default:
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

export function ExplorePage() {
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Read all filter state from URL — this is the single source of truth
  const qSearch = searchParams.get('search') ?? '';
  const qIsPublic = parseBool(searchParams.get('isPublic'));
  const qIsPaid = parseBool(searchParams.get('isPaid'));
  const qPriceRange = searchParams.get('priceRange') ?? '';
  const qSort = parseSortValue(searchParams.get('sort'));
  const qPage = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));

  const [allItems, setAllItems] = useState<EventWithType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const isPublic = qIsPublic ?? true;

    // Private events require authentication — show empty instead of 401
    if (isPublic === false && !isAuthenticated) {
      setAllItems([]);
      setTotalPages(1);
      setLoading(false);
      return;
    }

    try {
      // Over-fetch so client-side sort is globally consistent across pages.
      // A real upgrade path: add ?sort= param to the backend API.
      const data = await fetchEventsList({
        page: 1,
        limit: 200,
        isPublic,
        ...(qIsPaid !== undefined ? { isPaid: qIsPaid } : {}),
        ...(qSearch.trim() ? { search: qSearch.trim() } : {}),
      });

      let items = data.items;

      // Client-side price range filter (narrows within the isPaid=true set)
      if (qPriceRange) {
        items = items.filter((e) =>
          matchesPriceRange(Number(e.fee), qPriceRange)
        );
      }

      // Client-side sort
      items = sortEvents(items, qSort);

      setAllItems(items);
      setTotalPages(Math.max(1, Math.ceil(items.length / PAGE_SIZE)));
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        toast.error('Sign in to browse private events.');
      } else {
        toast.error('Could not load events. Please try again.');
      }
      setAllItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [qIsPublic, qIsPaid, qSearch, qSort, qPriceRange, isAuthenticated]);

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, [load]);

  // Slice the globally-sorted list for the current page
  const pageItems = allItems.slice(
    (qPage - 1) * PAGE_SIZE,
    qPage * PAGE_SIZE
  );

  const resultLabel =
    allItems.length === 0
      ? 'No events found'
      : `${allItems.length} event${allItems.length !== 1 ? 's' : ''} found${qSearch ? ` for "${qSearch}"` : ''}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-h2 text-foreground">Explore Events</h1>
          <p className="text-body-r mt-1 text-muted">
            Filter, sort, and share — every URL is a saved search your friends
            will see exactly as you did.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Toolbar: search + mobile filter trigger + sort */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <ExploreSearchBar />
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile filter trigger — hidden on lg+ */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-haspopup="dialog"
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              Filters
            </Button>
            <SortDropdown />
          </div>
        </div>

        {/* Active filter chips */}
        <div className="mb-4">
          <ActiveFiltersBar />
        </div>

        {/* Result count */}
        {!loading && (
          <p
            className="text-caption mb-6 text-muted"
            aria-live="polite"
            aria-atomic="true"
          >
            {resultLabel}
          </p>
        )}

        {/* 2-column layout: sidebar (25%) + content (75%) */}
        <div className="flex gap-8 lg:gap-10">
          {/* Sidebar — desktop only (lg+) */}
          <aside
            className="hidden w-56 shrink-0 lg:block xl:w-64"
            aria-label="Event filters"
          >
            <div className="sticky top-6 rounded-lg border border-border bg-surface p-5 shadow-low">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main content */}
          <main className="min-w-0 flex-1">
            <ListingGrid
              items={pageItems}
              isLoading={loading}
              renderItem={(event, index) => (
                <ApexCard event={event} priority={index < 4} />
              )}
              getKey={(event) => event.id}
              emptyMessage="No events matched your search or filters. Try clearing some filters or searching with different keywords."
              emptyCTALabel="Clear all filters"
              emptyCTAHref="/explore"
              skeletonCount={PAGE_SIZE}
            />

            {!loading && totalPages > 1 && (
              <div className="mt-10">
                <PaginationBar totalPages={totalPages} currentPage={qPage} />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter drawer — slide-in sheet */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Event filters"
        >
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close filters panel"
            tabIndex={-1}
          />

          {/* Drawer panel */}
          <div
            className={cn(
              'relative z-10 flex w-72 flex-col overflow-y-auto',
              'border-r border-border bg-surface shadow-high',
              'p-6'
            )}
          >
            {/* Drawer header */}
            <div className="mb-5 flex items-center justify-between">
              <span className="text-h4 font-semibold text-foreground">
                Filters
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-md p-1.5 text-muted transition-colors hover:bg-surface-subtle hover:text-foreground',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                )}
                aria-label="Close filters"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            {/* Filters */}
            <FilterSidebar />

            {/* Apply button — closes drawer */}
            <div className="mt-auto pt-6">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setMobileOpen(false)}
              >
                Show Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
