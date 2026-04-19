'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

/**
 * When landing with `?pay=1` (e.g. after “Pay & accept” on invitations), scroll to the payment card once mounted.
 */
export function EventPayScrollHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const pay = searchParams.get('pay');
    if (pay !== '1' && pay !== 'true') return undefined;
    const id = window.setTimeout(() => {
      document.getElementById('event-pay')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 450);
    return () => window.clearTimeout(id);
  }, [searchParams]);

  return null;
}
