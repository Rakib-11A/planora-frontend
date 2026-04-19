'use client';

import { startTransition, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { DataTableShell } from '@/components/ui/data-table-shell';
import { PageHeader } from '@/components/ui/page-header';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

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
    <div>
      <PageHeader title="Reviews" description="Remove abusive or spam reviews." />
      {loading ? (
        <p className="text-planora-muted text-sm">Loading…</p>
      ) : (
        <DataTableShell>
          <table className="min-w-full text-left text-xs sm:text-sm">
            <thead className="border-planora-border bg-slate-50 font-semibold text-slate-600 uppercase">
              <tr>
                <th scope="col" className="px-3 py-2">
                  Event
                </th>
                <th scope="col" className="px-3 py-2">
                  Author
                </th>
                <th scope="col" className="px-3 py-2">
                  Rating
                </th>
                <th scope="col" className="px-3 py-2">
                  Comment
                </th>
                <th scope="col" className="px-3 py-2">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-planora-border divide-y">
              {items.map((r) => (
                <tr key={r.id}>
                  <td className="px-3 py-2 font-medium">{r.event.title}</td>
                  <td className="text-planora-muted px-3 py-2">{r.user.name}</td>
                  <td className="px-3 py-2">{r.rating}★</td>
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
    </div>
  );
}
