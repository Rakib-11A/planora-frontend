'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { DataTableShell } from '@/components/ui/data-table-shell';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse } from '@/types/api';

const theadClass =
  'border-b border-slate-200/90 bg-slate-100/80 text-xs font-semibold uppercase text-slate-600 dark:border-white/10 dark:bg-slate-900/55 dark:text-slate-400';

const tbodyClass = 'divide-y divide-slate-200/80 dark:divide-white/10';

interface CacheStats {
  degraded: boolean;
  totalKeys: number;
  memoryUsed: string | null;
  hitRatePercent: number | null;
  hits: number;
  misses: number;
  topKeys: { key: string; score: number }[];
}

export default function AdminCachePage() {
  const [data, setData] = useState<CacheStats | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = (await api.get('admin/cache/stats')) as ApiResponse<CacheStats>;
        setData(unwrapApiData(res));
      } catch {
        toast.error('Could not load cache stats.');
      }
    })();
  }, []);

  return (
    <div className="w-full">
      <MarketingHero
        className="mb-10"
        eyebrow="Infrastructure"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="Cache"
        description="Redis snapshot for Planora cache middleware."
      />

      <section className="rounded-3xl border border-white/35 bg-white/35 p-5 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
        {!data ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-planora-muted/20 h-48 animate-pulse rounded-2xl" />
            <div className="bg-planora-muted/20 h-48 animate-pulse rounded-2xl" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card
              variant="glass"
              className="motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary"
            >
              <CardTitle className="gradient-text text-lg font-bold">Summary</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                {data.degraded ? 'Redis unavailable or degraded.' : 'Redis connected.'}
              </CardDescription>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-planora-muted">Total keys</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">{data.totalKeys}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-planora-muted">Memory</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">{data.memoryUsed ?? '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-planora-muted">Hit rate</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">
                    {data.hitRatePercent === null ? '—' : `${data.hitRatePercent}%`}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-planora-muted">Hits / misses</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">
                    {data.hits} / {data.misses}
                  </dd>
                </div>
              </dl>
            </Card>
            <Card
              variant="glass"
              className="motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary"
            >
              <CardTitle className="gradient-text text-lg font-bold">Top keys</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                Most frequent cache entries by score.
              </CardDescription>
              <DataTableShell variant="glass" className="mt-4">
                <table className="min-w-full text-left text-xs">
                  <thead className={theadClass}>
                    <tr>
                      <th scope="col" className="px-3 py-3">
                        Key
                      </th>
                      <th scope="col" className="px-3 py-3">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className={tbodyClass}>
                    {data.topKeys.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="text-planora-muted px-3 py-4 text-center">
                          No samples
                        </td>
                      </tr>
                    ) : (
                      data.topKeys.map((k) => (
                        <tr key={k.key} className="bg-white/30 dark:bg-transparent">
                          <td className="max-w-[12rem] truncate px-3 py-2 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                            {k.key}
                          </td>
                          <td className="px-3 py-2 text-slate-800 dark:text-slate-200">{k.score}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </DataTableShell>
            </Card>
          </div>
        )}
      </section>
    </div>
  );
}
