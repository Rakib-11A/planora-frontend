'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { DataTableShell } from '@/components/ui/data-table-shell';
import { PageHeader } from '@/components/ui/page-header';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import { formatDate } from '@/lib/utils';

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

  if (!data) {
    return <p className="text-planora-muted text-sm">Loading…</p>;
  }

  return (
    <div>
      <PageHeader title="Rate limits" description="Blocked counters per limiter bucket." />
      <Card>
        <CardTitle>Snapshot</CardTitle>
        <CardDescription>
          Fetched {formatDate(data.fetchedAt, undefined, { dateStyle: 'medium', timeStyle: 'short' })} ·{' '}
          {data.degraded ? 'Degraded mode' : 'Live'}
        </CardDescription>
        <DataTableShell className="mt-4">
          <table className="min-w-full text-left text-sm">
            <thead className="border-planora-border bg-slate-50 text-xs font-semibold text-slate-600 uppercase">
              <tr>
                <th scope="col" className="px-3 py-2">
                  Bucket
                </th>
                <th scope="col" className="px-3 py-2">
                  Blocked
                </th>
              </tr>
            </thead>
            <tbody className="divide-planora-border divide-y">
              {data.buckets.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-planora-muted px-3 py-4 text-center">
                    No blocked buckets
                  </td>
                </tr>
              ) : (
                data.buckets.map((b) => (
                  <tr key={b.bucket}>
                    <td className="px-3 py-2 font-mono text-xs">{b.bucket}</td>
                    <td className="px-3 py-2 font-medium">{b.blockedCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </DataTableShell>
      </Card>
    </div>
  );
}
