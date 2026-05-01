'use client';

import { Suspense } from 'react';

import { ExplorePage } from '@/components/explore/explore-page';

function ExploreFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4 text-sm text-muted">
      Loading…
    </div>
  );
}

export function ExplorePageClient() {
  return (
    <Suspense fallback={<ExploreFallback />}>
      <ExplorePage />
    </Suspense>
  );
}
