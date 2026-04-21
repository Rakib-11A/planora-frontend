import { MarketingHero, type MarketingHeroProps } from '@/components/ui/marketing-hero';

export type EventsBrowseHeroProps = MarketingHeroProps;

/** Hero for `/events` — thin wrapper around {@link MarketingHero}. */
export function EventsBrowseHero(props: EventsBrowseHeroProps) {
  return <MarketingHero {...props} />;
}
