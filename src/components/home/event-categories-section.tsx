'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { EventsGrid } from '@/components/events/events-grid';
import {
  CATEGORY_FILTER_IDS,
  CategoryFilter,
  type CategoryFilterId,
} from '@/components/home/category-filter';
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
    <section className="bg-planora-surface/50 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-planora-primary text-2xl font-bold md:text-3xl">Browse by Category</h2>
        <div className="mt-6">
          <CategoryFilter activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
        </div>
        <div className="mt-10">
          <EventsGrid
            events={filteredEvents}
            isLoading={isLoading}
            emptyMessage="No events match this category. Try another filter or browse all public events."
          />
        </div>
      </div>
    </section>
  );
}
