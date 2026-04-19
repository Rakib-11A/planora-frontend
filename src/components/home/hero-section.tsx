'use client';

import { Calendar, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { EventCard } from '@/components/events/event-card';
import { Button } from '@/components/ui/button';
import { routes } from '@/constants/config';
import type { EventWithType } from '@/types/event';
import { cn, formatDate } from '@/lib/utils';

export interface HeroSectionProps {
  featuredEvent: EventWithType | null;
}

const MAX_DESCRIPTION_LENGTH = 150;

function truncateDescription(text: string, max = MAX_DESCRIPTION_LENGTH): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}...`;
}

export function HeroSection({ featuredEvent }: HeroSectionProps) {
  const router = useRouter();

  return (
    <section
      className={cn(
        'from-planora-primary/10 to-planora-secondary/10 w-full bg-gradient-to-r px-4 py-20 transition-colors duration-300'
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
        <div className="min-w-0">
          {featuredEvent ? (
            <>
              <span className="bg-planora-primary/15 text-planora-primary inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                Featured Event
              </span>
              <h1 className="text-planora-primary mt-4 text-4xl leading-tight font-bold md:text-5xl">
                {featuredEvent.title}
              </h1>
              <div className="text-planora-muted mt-4 flex flex-col gap-2">
                <p className="text-foreground flex items-center gap-2 text-base font-medium">
                  <Calendar className="text-planora-primary size-5 shrink-0" aria-hidden />
                  {formatDate(featuredEvent.dateTime, undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
                <p className="flex items-start gap-2 text-sm">
                  <MapPin className="text-planora-primary mt-0.5 size-5 shrink-0" aria-hidden />
                  <span className="line-clamp-2">{featuredEvent.venue}</span>
                </p>
              </div>
              <p className="mt-4 text-base leading-relaxed text-gray-700">
                {truncateDescription(featuredEvent.description)}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => router.push(routes.event(featuredEvent.id))}
                >
                  Join Now
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push(routes.events)}>
                  View All Events
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-planora-primary text-4xl leading-tight font-bold md:text-5xl">
                Discover Amazing Events
              </h1>
              <p className="mt-4 max-w-xl text-lg text-gray-700">
                Create, manage, and participate in events seamlessly
              </p>
              <div className="mt-8">
                <Button type="button" variant="primary" onClick={() => router.push(routes.events)}>
                  Explore Events
                </Button>
              </div>
            </>
          )}
        </div>

        {featuredEvent ? (
          <div className="min-w-0 justify-self-center md:justify-self-end">
            <EventCard event={featuredEvent} variant="featured" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
