'use client';

import Link from 'next/link';
import { startTransition, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { DataTableShell } from '@/components/ui/data-table-shell';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { routes } from '@/constants/config';
import { api, unwrapApiData } from '@/lib/api';
import { myPaymentsResponseSchema, type MyPaymentItem } from '@/lib/schemas/me';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { formatCurrency, formatDate } from '@/lib/utils';

function amountNumber(p: MyPaymentItem): number {
  const n = typeof p.amount === 'number' ? p.amount : Number(p.amount);
  return Number.isFinite(n) ? n : 0;
}

export default function PaymentsPage() {
  const [items, setItems] = useState<MyPaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await api.get('me/payments?page=1&limit=50')) as ApiResponse<
        PaginatedResponse<MyPaymentItem>
      >;
      const parsed = myPaymentsResponseSchema.safeParse(unwrapApiData(res));
      setItems(parsed.success ? parsed.data.items : []);
    } catch {
      toast.error('Could not load payments.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, [load]);

  async function verify(id: string) {
    try {
      await api.post(`payments/${id}/verify`);
      toast.success('Payment verified.');
      await load();
    } catch {
      toast.error('Verify failed. Payment may already be complete or not ready.');
    }
  }

  return (
    <div>
      <PageHeader title="Payments" description="Registration fees you have initiated or completed." />
      {loading ? (
        <p className="text-planora-muted text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="No payments yet"
          description="Paid events will show checkout activity here after you start a payment."
          action={
            <Link href={routes.events} className="text-planora-primary text-sm font-semibold hover:underline">
              Browse events
            </Link>
          }
        />
      ) : (
        <DataTableShell>
          <table className="min-w-full text-left text-sm">
            <thead className="border-planora-border bg-slate-50 text-xs font-semibold text-slate-600 uppercase">
              <tr>
                <th scope="col" className="px-4 py-2">
                  Event
                </th>
                <th scope="col" className="px-4 py-2">
                  Amount
                </th>
                <th scope="col" className="px-4 py-2">
                  Status
                </th>
                <th scope="col" className="px-4 py-2">
                  When
                </th>
                <th scope="col" className="px-4 py-2">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-planora-border divide-y">
              {items.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2">
                    <Link
                      href={routes.event(p.event.id)}
                      className="text-planora-primary font-medium hover:underline"
                    >
                      {p.event.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2 font-medium">{formatCurrency(amountNumber(p), 'BDT', 'en-BD')}</td>
                  <td className="px-4 py-2">{p.status}</td>
                  <td className="text-planora-muted px-4 py-2 text-xs">
                    {formatDate(p.createdAt, undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {p.status === 'INITIATED' ? (
                      <Button type="button" size="sm" variant="outline" onClick={() => void verify(p.id)}>
                        Verify
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTableShell>
      )}
    </div>
  );
}
