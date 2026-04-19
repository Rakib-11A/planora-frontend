'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { DataTableShell } from '@/components/ui/data-table-shell';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import { formatDate } from '@/lib/utils';

const theadClass =
  'border-b border-slate-200/90 bg-slate-100/80 text-xs font-semibold uppercase text-slate-600 dark:border-white/10 dark:bg-slate-900/55 dark:text-slate-400';

const tbodyClass = 'divide-y divide-slate-200/80 dark:divide-white/10';

interface RateLimitStats {
  degraded: boolean;
  fetchedAt: string;
  buckets: { bucket: string; blockedCount: number }[];
}

export default function AdminRateLimitsPage() {
  const [data, setData] = useState<RateLimitStats | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = (await api.get('admin/rate-limits')) as ApiResponse<RateLimitStats>;
        setData(unwrapApiData(res));
      } catch {
        toast.error('Could not load rate limit stats.');
      }
    })();
  }, []);

  return (
    <div className="w-full">
      <MarketingHero
        className="mb-10"
        eyebrow="Traffic"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="Rate limits"
        description="Blocked counters per limiter bucket."
      />

      <section className="rounded-3xl border border-white/35 bg-white/35 p-5 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
        {!data ? (
          <div className="bg-planora-muted/20 h-56 animate-pulse rounded-2xl" />
        ) : (
          <Card
            variant="glass"
            className="motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary"
          >
            <CardTitle className="gradient-text text-lg font-bold">Snapshot</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Fetched {formatDate(data.fetchedAt, undefined, { dateStyle: 'medium', timeStyle: 'short' })} ·{' '}
              {data.degraded ? 'Degraded mode' : 'Live'}
            </CardDescription>
            <DataTableShell variant="glass" className="mt-4">
              <table className="min-w-full text-left text-sm">
                <thead className={theadClass}>
                  <tr>
                    <th scope="col" className="px-3 py-3">
                      Bucket
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Blocked
                    </th>
                  </tr>
                </thead>
                <tbody className={tbodyClass}>
                  {data.buckets.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-planora-muted px-3 py-4 text-center">
                        No blocked buckets
                      </td>
                    </tr>
                  ) : (
                    data.buckets.map((b) => (
                      <tr key={b.bucket} className="bg-white/30 dark:bg-transparent">
                        <td className="px-3 py-2 font-mono text-xs text-slate-800 dark:text-slate-200">{b.bucket}</td>
                        <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{b.blockedCount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </DataTableShell>
          </Card>
        )}
      </section>
    </div>
  );
}
