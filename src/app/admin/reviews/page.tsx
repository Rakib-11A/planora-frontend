'use client';

import { startTransition, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { DataTableShell } from '@/components/ui/data-table-shell';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

const theadClass =
  'border-b border-slate-200/90 bg-slate-100/80 text-xs font-semibold uppercase text-slate-600 dark:border-white/10 dark:bg-slate-900/55 dark:text-slate-400';

const tbodyClass = 'divide-y divide-slate-200/80 dark:divide-white/10';

interface AdminReviewRow {
  id: string;
  rating: number;
  comment: string;
  deletedAt: string | null;
  createdAt: string;
  user: { name: string; email: string };
  event: { id: string; title: string };
}

export default function AdminReviewsPage() {
  const [items, setItems] = useState<AdminReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await api.get('admin/reviews?page=1&limit=25')) as ApiResponse<
        PaginatedResponse<AdminReviewRow>
      >;
      setItems(unwrapApiData(res).items);
    } catch {
      toast.error('Could not load reviews.');
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

  async function removeReview(id: string) {
    if (!window.confirm('Soft-delete this review?')) return;
    try {
      await api.delete(`admin/reviews/${id}`);
      toast.success('Review deleted.');
      await load();
    } catch {
      toast.error('Delete failed.');
    }
  }

  return (
    <div className="w-full">
      <MarketingHero
        className="mb-10"
        eyebrow="Moderation"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="Reviews"
        description="Remove abusive or spam reviews."
      />

      <section className="rounded-3xl border border-white/35 bg-white/35 p-5 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
        {loading ? (
          <div className="space-y-3">
            <div className="bg-planora-muted/20 h-12 animate-pulse rounded-xl" />
            <div className="bg-planora-muted/20 h-40 animate-pulse rounded-2xl" />
          </div>
        ) : (
          <DataTableShell variant="glass">
            <table className="min-w-full text-left text-xs sm:text-sm">
              <thead className={theadClass}>
                <tr>
                  <th scope="col" className="px-3 py-3">
                    Event
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Author
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Rating
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Comment
                  </th>
                  <th scope="col" className="px-3 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className={tbodyClass}>
                {items.map((r) => (
                  <tr key={r.id} className="bg-white/30 dark:bg-transparent">
                    <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{r.event.title}</td>
                    <td className="text-planora-muted px-3 py-2">{r.user.name}</td>
                    <td className="px-3 py-2 text-slate-800 dark:text-slate-200">{r.rating}★</td>
                    <td className="text-planora-muted max-w-xs truncate px-3 py-2">{r.comment ?? '—'}</td>
                    <td className="px-3 py-2 text-right">
                      {r.deletedAt ? (
                        <span className="text-planora-muted text-xs">Deleted</span>
                      ) : (
                        <Button type="button" size="sm" variant="danger" onClick={() => void removeReview(r.id)}>
                          Delete
                        </Button>
                      )}
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
