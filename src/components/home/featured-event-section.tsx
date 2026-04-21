import { EventCardMinimal } from '@/components/home/event-card-minimal';
import { SectionHeading } from '@/components/home/section-heading';
import type { EventWithType } from '@/types/event';

export interface FeaturedEventSectionProps {
  event: EventWithType;
}

/**
 * Single editorial highlight for the admin-curated featured event (or the
 * first upcoming public event as a fallback, passed in from page.tsx).
 *
 * Renders nothing on its own — compose inside a RevealSection for rhythm.
 */
export function FeaturedEventSection({ event }: FeaturedEventSectionProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <SectionHeading
        eyebrow="In the spotlight"
        title="This week's pick"
        subtitle="The one event we think you should know about."
        align="left"
        className="mb-10 md:mb-12"
      />
      <EventCardMinimal event={event} variant="featured" eyebrow="Featured" />
    </div>
  );
}
