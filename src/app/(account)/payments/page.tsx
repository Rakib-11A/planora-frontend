'use client';

import Link from 'next/link';
import { startTransition, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { DataTableShell } from '@/components/ui/data-table-shell';
import { EmptyState } from '@/components/ui/empty-state';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { routes } from '@/constants/config';
import { api, unwrapApiData } from '@/lib/api';
import { myPaymentsResponseSchema, type MyPaymentItem } from '@/lib/schemas/me';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { formatCurrency, formatDate } from '@/lib/utils';

const emptyGlass =
  'rounded-2xl border border-dashed border-planora-primary/25 bg-white/40 backdrop-blur-sm dark:border-white/15 dark:bg-slate-900/40';

const theadClass =
  'border-b border-slate-200/90 bg-slate-100/80 text-xs font-semibold uppercase text-slate-600 dark:border-white/10 dark:bg-slate-900/55 dark:text-slate-400';

const tbodyClass = 'divide-y divide-slate-200/80 dark:divide-white/10';

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
    <div className="w-full">
      <MarketingHero
        className="mb-10"
        eyebrow="Billing"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="Payments"
        description="Registration fees you have initiated or completed."
      />

      <section className="rounded-3xl border border-white/35 bg-white/35 p-5 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
        {loading ? (
          <div className="space-y-3">
            <div className="bg-planora-muted/20 h-12 animate-pulse rounded-xl" />
            <div className="bg-planora-muted/20 h-32 animate-pulse rounded-2xl" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            className={emptyGlass}
            title="No payments yet"
            description="Paid events will show checkout activity here after you start a payment."
            action={
              <Link
                href={routes.events}
                className="text-planora-primary text-sm font-semibold hover:underline dark:text-sky-300"
              >
                Browse events
              </Link>
            }
          />
        ) : (
          <DataTableShell variant="glass">
            <table className="min-w-full text-left text-sm">
              <thead className={theadClass}>
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Event
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Amount
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3">
                    When
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className={tbodyClass}>
                {items.map((p) => (
                  <tr key={p.id} className="bg-white/30 dark:bg-transparent">
                    <td className="px-4 py-3">
                      <Link
                        href={routes.event(p.event.id)}
                        className="font-medium text-planora-primary hover:underline dark:text-sky-300"
                      >
                        {p.event.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(amountNumber(p), 'BDT', 'en-BD')}
                    </td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{p.status}</td>
                    <td className="text-planora-muted px-4 py-3 text-xs">
                      {formatDate(p.createdAt, undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right">
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
      </section>
    </div>
  );
}
