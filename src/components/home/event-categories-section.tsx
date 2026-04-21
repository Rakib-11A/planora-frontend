'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { EventsGrid } from '@/components/events/events-grid';
import { SectionHeading } from '@/components/home/section-heading';
import {
  CATEGORY_FILTER_IDS,
  CategoryFilter,
  type CategoryFilterId,
} from '@/components/home/category-filter';
import { routes } from '@/constants/config';
import type { EventWithType } from '@/types/event';

export interface EventCategoriesSectionProps {
  events: EventWithType[];
}

/** Backend field is `fee`; treat as registration fee for filtering. */
function getRegistrationFee(event: EventWithType): number {
  const n = typeof event.fee === 'string' ? Number(event.fee) : event.fee;
  return Number.isFinite(n) ? n : 0;
}

function isCategoryFilterId(id: string): id is CategoryFilterId {
  return (CATEGORY_FILTER_IDS as readonly string[]).includes(id);
}

function eventsPageHrefForCategory(id: CategoryFilterId): string {
  if (id === 'all') return routes.events;
  const params = new URLSearchParams();
  switch (id) {
    case 'public-free':
      params.set('isPublic', 'true');
      params.set('isPaid', 'false');
      break;
    case 'public-paid':
      params.set('isPublic', 'true');
      params.set('isPaid', 'true');
      break;
    case 'private-free':
      params.set('isPublic', 'false');
      params.set('isPaid', 'false');
      break;
    case 'private-paid':
      params.set('isPublic', 'false');
      params.set('isPaid', 'true');
      break;
    default:
      return routes.events;
  }
  return `${routes.events}?${params.toString()}`;
}

function applyFilter(category: CategoryFilterId, source: EventWithType[]): EventWithType[] {
  if (category === 'all') return source;

  return source.filter((event) => {
    const fee = getRegistrationFee(event);
    const isFree = fee === 0;
    const isPaid = fee > 0;

    switch (category) {
      case 'public-free':
        return event.isPublic === true && isFree;
      case 'public-paid':
        return event.isPublic === true && isPaid;
      case 'private-free':
        return event.isPublic === false && isFree;
      case 'private-paid':
        return event.isPublic === false && isPaid;
      default:
        return true;
    }
  });
}

/**
 * Client-only: category chips filter the grid locally using `isPublic` + numeric `fee`.
 */
export function EventCategoriesSection({ events }: EventCategoriesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilterId>('all');
  const [filteredEvents, setFilteredEvents] = useState<EventWithType[]>(() => events);
  const [isLoading, setIsLoading] = useState(false);

  const eventsRef = useRef(events);
  const activeCategoryRef = useRef(activeCategory);
  const filterRequestRef = useRef(0);

  useEffect(() => {
    eventsRef.current = events;
    activeCategoryRef.current = activeCategory;
  }, [events, activeCategory]);

  useEffect(() => {
    setFilteredEvents(applyFilter(activeCategoryRef.current, events));
  }, [events]);

  const handleCategoryChange = useCallback((category: string) => {
    if (!isCategoryFilterId(category)) return;

    const request = ++filterRequestRef.current;
    setIsLoading(true);
    setActiveCategory(category);

    void (async () => {
      try {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 100);
        });
        if (request !== filterRequestRef.current) return;
        setFilteredEvents(applyFilter(category, eventsRef.current));
      } finally {
        if (request === filterRequestRef.current) {
          setIsLoading(false);
        }
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-0">
      <SectionHeading
        title="Browse by Category"
        subtitle="Filter public events by type, then explore the full grid."
        align="center"
      />
      <div className="mt-2">
        <CategoryFilter activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
      </div>
      <p className="text-planora-muted mx-auto mt-4 max-w-2xl text-center text-sm">
        Same filters on the{' '}
        <Link href={routes.events} className="font-semibold text-planora-primary underline dark:text-sky-300">
          Events
        </Link>{' '}
        page (with search & sign-in for private lists):{' '}
        {CATEGORY_FILTER_IDS.filter((id) => id !== 'all').map((id, i) => (
          <span key={id}>
            {i > 0 ? ' · ' : null}
            <Link
              href={eventsPageHrefForCategory(id)}
              className="font-medium text-planora-primary underline-offset-2 hover:underline dark:text-sky-300"
            >
              {id.replace(/-/g, ' ')}
            </Link>
          </span>
        ))}
        .
      </p>
      <div className="mt-10">
        <EventsGrid
          events={filteredEvents}
          isLoading={isLoading}
          emptyMessage="No events match this category. Try another filter or browse all public events."
        />
      </div>
    </div>
  );
}
