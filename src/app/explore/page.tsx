import { type Metadata } from 'next';

import { ExplorePageClient } from '@/app/explore/explore-page-client';

export const metadata: Metadata = {
  title: 'Explore Events — Planora',
  description:
    'Search, filter by category and price, and sort events on Planora. Every filter you apply is encoded in the URL — share the exact view with anyone.',
};

export default function ExplorePage() {
  return <ExplorePageClient />;
}
