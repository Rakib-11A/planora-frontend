'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { DataTableShell } from '@/components/ui/data-table-shell';
import { PageHeader } from '@/components/ui/page-header';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse } from '@/types/api';

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

  if (!data) {
    return <p className="text-planora-muted text-sm">Loading…</p>;
  }

  return (
    <div>
      <PageHeader title="Cache" description="Redis snapshot for Planora cache middleware." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            {data.degraded ? 'Redis unavailable or degraded.' : 'Redis connected.'}
          </CardDescription>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-planora-muted">Total keys</dt>
              <dd className="font-medium">{data.totalKeys}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-planora-muted">Memory</dt>
              <dd className="font-medium">{data.memoryUsed ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-planora-muted">Hit rate</dt>
              <dd className="font-medium">
                {data.hitRatePercent === null ? '—' : `${data.hitRatePercent}%`}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-planora-muted">Hits / misses</dt>
              <dd className="font-medium">
                {data.hits} / {data.misses}
              </dd>
            </div>
          </dl>
        </Card>
        <Card>
          <CardTitle>Top keys</CardTitle>
          <CardDescription>Most frequent cache entries by score.</CardDescription>
          <DataTableShell className="mt-4">
            <table className="min-w-full text-left text-xs">
              <thead className="border-planora-border bg-slate-50 font-semibold text-slate-600 uppercase">
                <tr>
                  <th scope="col" className="px-3 py-2">
                    Key
                  </th>
                  <th scope="col" className="px-3 py-2">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-planora-border divide-y">
                {data.topKeys.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-planora-muted px-3 py-4 text-center">
                      No samples
                    </td>
                  </tr>
                ) : (
                  data.topKeys.map((k) => (
                    <tr key={k.key}>
                      <td className="max-w-[12rem] truncate px-3 py-2 font-mono text-[11px]">{k.key}</td>
                      <td className="px-3 py-2">{k.score}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </DataTableShell>
        </Card>
      </div>
    </div>
  );
}
