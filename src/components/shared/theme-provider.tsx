'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';

/**
 * Thin client boundary around `next-themes`. Kept separate so the root layout
 * (a Server Component) can render it without becoming a client component itself.
 *
 * Configure at the mount site (`app/layout.tsx`) — not here — so behaviour stays
 * declarative and co-located with the provider's usage.
 */
export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} />;
}
