'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, Search, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTableShell } from '@/components/ui/data-table-shell';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { cn, formatDate } from '@/lib/utils';

export interface ApprovalRow {
  id: string;
  title: string;
  organizer: string;
  type: string;
  submittedAt: string;
  fee: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const STATUS_BADGE: Record<ApprovalRow['status'], { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-warning-subtle text-warning' },
  APPROVED: { label: 'Approved', className: 'bg-success-subtle text-success' },
  REJECTED: { label: 'Rejected', className: 'bg-destructive-subtle text-destructive' },
};

const ROWS_PER_PAGE = 8;

const theadClass =
  'border-b border-slate-200/90 bg-slate-100/80 text-xs font-semibold uppercase text-slate-600 dark:border-white/10 dark:bg-slate-900/55 dark:text-slate-400';
const tbodyClass = 'divide-y divide-slate-200/80 dark:divide-white/10';

function TableSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-5 w-36 animate-pulse rounded bg-surface-subtle" />
        <div className="h-9 w-56 animate-pulse rounded-md bg-surface-subtle" />
      </div>
      <div className="h-11 w-full animate-pulse rounded-md bg-surface-subtle" />
      <div className="h-48 w-full animate-pulse rounded-md bg-surface-subtle" />
    </div>
  );
}

export function AdminPendingTable({
  rows,
  loading,
  onStatusChange,
}: {
  rows: ApprovalRow[];
  loading?: boolean;
  onStatusChange: (id: string, status: 'APPROVED' | 'REJECTED') => void;
}) {
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.title.toLowerCase().includes(q) || r.organizer.toLowerCase().includes(q)
    );
  }, [rows, filter]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  function handleApprove(id: string) {
    toast.success('Event approved.');
    onStatusChange(id, 'APPROVED');
  }

  async function handleReject(id: string) {
    if (!window.confirm('Reject and soft-delete this event?')) return;
    try {
      await api.delete(`admin/events/${id}`);
      toast.success('Event rejected.');
      onStatusChange(id, 'REJECTED');
    } catch {
      toast.error('Action failed — please try again.');
    }
  }

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Pending Approvals
          {filtered.length !== rows.length && (
            <span className="ml-2 text-xs font-normal text-muted">
              — {filtered.length} of {rows.length} shown
            </span>
          )}
        </h3>
        <div className="relative max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <Input
            aria-label="Filter events"
            placeholder="Filter by title or organizer…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-8 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <DataTableShell>
        <table className="min-w-full text-left text-xs sm:text-sm">
          <thead className={theadClass}>
            <tr>
              <th scope="col" className="px-3 py-3">Event</th>
              <th scope="col" className="hidden px-3 py-3 sm:table-cell">Organizer</th>
              <th scope="col" className="hidden px-3 py-3 md:table-cell">Type</th>
              <th scope="col" className="hidden px-3 py-3 lg:table-cell">Submitted</th>
              <th scope="col" className="px-3 py-3">Status</th>
              <th scope="col" className="px-3 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className={tbodyClass}>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-sm text-muted">
                  No events match your filter.
                </td>
              </tr>
            ) : (
              pageRows.map((row) => {
                const badge = STATUS_BADGE[row.status];
                return (
                  <tr key={row.id} className="bg-white/30 dark:bg-transparent">
                    <td className="max-w-[180px] px-3 py-2.5">
                      <p className="truncate font-medium text-foreground" title={row.title}>
                        {row.title}
                      </p>
                    </td>
                    <td className="hidden px-3 py-2.5 text-muted sm:table-cell">{row.organizer}</td>
                    <td className="hidden px-3 py-2.5 text-muted md:table-cell">{row.type}</td>
                    <td className="hidden px-3 py-2.5 text-muted lg:table-cell">
                      {formatDate(row.submittedAt, undefined, { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
                          badge.className
                        )}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      {row.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => handleApprove(row.id)}
                          >
                            <CheckCircle className="size-3.5 text-success" aria-hidden />
                            Approve
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="danger"
                            className="gap-1.5"
                            onClick={() => void handleReject(row.id)}
                          >
                            <XCircle className="size-3.5" aria-hidden />
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </DataTableShell>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted">
          <span>
            {(currentPage - 1) * ROWS_PER_PAGE + 1}–
            {Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} of {filtered.length} events
          </span>
          <div className="flex gap-1">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
