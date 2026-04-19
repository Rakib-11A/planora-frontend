'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app error]', error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
      <p className="text-planora-muted mt-2 max-w-md text-center text-sm">{error.message}</p>
      <Button type="button" variant="primary" className="mt-6" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
