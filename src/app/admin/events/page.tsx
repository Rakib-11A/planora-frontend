'use client';

import Link from 'next/link';
import { startTransition, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { DataTableShell } from '@/components/ui/data-table-shell';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { routes } from '@/constants/config';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { formatDate } from '@/lib/utils';

const theadClass =
  'border-b border-slate-200/90 bg-slate-100/80 text-xs font-semibold uppercase text-slate-600 dark:border-white/10 dark:bg-slate-900/55 dark:text-slate-400';

const tbodyClass = 'divide-y divide-slate-200/80 dark:divide-white/10';

interface AdminEventRow {
  id: string;
  title: string;
  dateTime: string;
  venue: string;
  isPublic: boolean;
  isPaid: boolean;
  deletedAt: string | null;
  createdBy: { name: string; email: string };
}

export default function AdminEventsPage() {
  const [items, setItems] = useState<AdminEventRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await api.get('admin/events?page=1&limit=25')) as ApiResponse<
        PaginatedResponse<AdminEventRow>
      >;
      setItems(unwrapApiData(res).items);
    } catch {
      toast.error('Could not load events.');
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

  async function removeEvent(id: string) {
    if (!window.confirm('Soft-delete this event?')) return;
    try {
      await api.delete(`admin/events/${id}`);
      toast.success('Event deleted.');
      await load();
    } catch {
      toast.error('Delete failed.');
    }
  }

  return (
    <div className="w-full">
      <MarketingHero
        className="mb-10"
        eyebrow="Catalog"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="Events"
        description="Soft-deleted events retain history server-side."
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
                    Title
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Organizer
                  </th>
                  <th scope="col" className="px-3 py-3">
                    When
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Flags
                  </th>
                  <th scope="col" className="px-3 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className={tbodyClass}>
                {items.map((ev) => (
                  <tr key={ev.id} className="bg-white/30 dark:bg-transparent">
                    <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{ev.title}</td>
                    <td className="text-planora-muted px-3 py-2">{ev.createdBy.name}</td>
                    <td className="text-planora-muted px-3 py-2">
                      {formatDate(ev.dateTime, undefined, { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-800 dark:text-slate-200">
                      {ev.isPublic ? 'Public' : 'Private'} · {ev.isPaid ? 'Paid' : 'Free'}
                      {ev.deletedAt ? ' · DELETED' : ''}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <Link
                          href={routes.event(ev.id)}
                          className="text-sm font-medium text-planora-primary hover:underline dark:text-sky-300"
                        >
                          View
                        </Link>
                        {ev.deletedAt ? null : (
                          <Button type="button" size="sm" variant="danger" onClick={() => void removeEvent(ev.id)}>
                            Delete
                          </Button>
                        )}
                      </div>
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
