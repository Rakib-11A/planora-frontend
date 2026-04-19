'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { DataTableShell } from '@/components/ui/data-table-shell';
import { PageHeader } from '@/components/ui/page-header';
import { routes } from '@/constants/config';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { formatDate } from '@/lib/utils';

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
    void load();
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
    <div>
      <PageHeader title="Events" description="Soft-deleted events retain history server-side." />
      {loading ? (
        <p className="text-planora-muted text-sm">Loading…</p>
      ) : (
        <DataTableShell>
          <table className="min-w-full text-left text-xs sm:text-sm">
            <thead className="border-planora-border bg-slate-50 font-semibold text-slate-600 uppercase">
              <tr>
                <th scope="col" className="px-3 py-2">
                  Title
                </th>
                <th scope="col" className="px-3 py-2">
                  Organizer
                </th>
                <th scope="col" className="px-3 py-2">
                  When
                </th>
                <th scope="col" className="px-3 py-2">
                  Flags
                </th>
                <th scope="col" className="px-3 py-2">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-planora-border divide-y">
              {items.map((ev) => (
                <tr key={ev.id}>
                  <td className="px-3 py-2 font-medium">{ev.title}</td>
                  <td className="text-planora-muted px-3 py-2">{ev.createdBy.name}</td>
                  <td className="text-planora-muted px-3 py-2">
                    {formatDate(ev.dateTime, undefined, { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {ev.isPublic ? 'Public' : 'Private'} · {ev.isPaid ? 'Paid' : 'Free'}
                    {ev.deletedAt ? ' · DELETED' : ''}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Link
                        href={routes.event(ev.id)}
                        className="text-planora-primary text-sm font-medium hover:underline"
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
    </div>
  );
}
