'use client';

import { useMemo, useState } from 'react';

import { EventsGrid } from '@/components/events/events-grid';
import { CategoryFilter } from '@/components/home/category-filter';
import type { EventWithType } from '@/types/event';

export interface EventCategoriesSectionProps {
  events: EventWithType[];
}

/**
 * Client-only: category chips filter the grid locally. Swap for server-driven filters when APIs support it.
 */
export function EventCategoriesSection({ events }: EventCategoriesSectionProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredEvents = useMemo(() => {
    if (activeCategory === 'all') return events;
    return events.filter((e) => e.eventType === activeCategory);
  }, [activeCategory, events]);

  return (
    <section className="bg-planora-surface/50 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-planora-primary text-2xl font-bold md:text-3xl">Browse by Category</h2>
        <div className="mt-6">
          <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        </div>
        <div className="mt-10">
          <EventsGrid
            events={filteredEvents}
            emptyMessage="No events match this category. Try another filter or browse all public events."
          />
        </div>
      </div>
    </section>
  );
}
