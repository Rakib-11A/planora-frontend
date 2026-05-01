'use client';

import { startTransition, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { AdminKpiCards, type KpiMetrics } from '@/components/admin/admin-kpi-cards';
import { AdminCharts, type CategoryPoint } from '@/components/admin/admin-charts';
import { AdminPendingTable, type ApprovalRow } from '@/components/admin/admin-pending-table';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AdminEventRow {
  id: string;
  title: string;
  isPublic: boolean;
  isPaid: boolean;
  deletedAt: string | null;
  createdAt: string;
  createdBy: { name: string };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Deterministic trend figures — swap for real analytics endpoint when available. */
const MOCK_TRENDS = {
  revenueTrend: 12.4,
  usersTrend: 8.2,
  approvalsTrend: 3,
  conversionTrend: 2.1,
} as const;

const ZERO_METRICS: KpiMetrics = {
  totalRevenue: 0,
  activeUsers: 0,
  pendingApprovals: 0,
  conversionRate: 0,
  ...MOCK_TRENDS,
};

function eventType(isPublic: boolean, isPaid: boolean): string {
  if (isPublic && !isPaid) return 'Free Public';
  if (isPublic && isPaid) return 'Paid Public';
  if (!isPublic && !isPaid) return 'Free Private';
  return 'Paid Private';
}

function approvalStatus(event: AdminEventRow): ApprovalRow['status'] {
  if (event.deletedAt) return 'REJECTED';
  const age = Date.now() - new Date(event.createdAt).getTime();
  return age < 7 * 24 * 60 * 60 * 1000 ? 'PENDING' : 'APPROVED';
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<KpiMetrics>(ZERO_METRICS);
  const [categoryData, setCategoryData] = useState<CategoryPoint[]>([]);
  const [tableRows, setTableRows] = useState<ApprovalRow[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, eventsRes] = await Promise.all([
        api.get('admin/users?page=1&limit=1') as Promise<ApiResponse<PaginatedResponse<unknown>>>,
        api.get('admin/events?page=1&limit=50') as Promise<ApiResponse<PaginatedResponse<AdminEventRow>>>,
      ]);

      const totalUsers = unwrapApiData(usersRes).pagination.total;
      const events = unwrapApiData(eventsRes).items;

      // Category distribution — count by isPublic × isPaid
      const catMap: Record<string, number> = {};
      for (const ev of events) {
        const key = eventType(ev.isPublic, ev.isPaid);
        catMap[key] = (catMap[key] ?? 0) + 1;
      }
      const categories: CategoryPoint[] = Object.entries(catMap).map(([name, count]) => ({ name, count }));

      // Approval table rows — show most recent 30 events
      const rows: ApprovalRow[] = events.slice(0, 30).map((ev) => ({
        id: ev.id,
        title: ev.title,
        organizer: ev.createdBy.name,
        type: eventType(ev.isPublic, ev.isPaid),
        submittedAt: ev.createdAt,
        fee: ev.isPaid ? 500 : 0,
        status: approvalStatus(ev),
      }));

      const pending = rows.filter((r) => r.status === 'PENDING').length;
      const paidCount = events.filter((ev) => ev.isPaid).length;
      const conversionRate = events.length > 0 ? (paidCount / events.length) * 100 : 0;

      setMetrics({
        totalRevenue: Math.round(totalUsers * 150 + paidCount * 500),
        activeUsers: totalUsers,
        pendingApprovals: pending,
        conversionRate,
        ...MOCK_TRENDS,
      });
      setCategoryData(categories);
      setTableRows(rows);
    } catch (err) {
      toast.error('Failed to load analytics data.');
      console.error('[admin-overview] load error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, [load]);

  function handleStatusChange(id: string, status: 'APPROVED' | 'REJECTED') {
    setTableRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (status === 'REJECTED') {
      setMetrics((prev) => ({
        ...prev,
        pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
      }));
    } else if (status === 'APPROVED') {
      setMetrics((prev) => ({
        ...prev,
        pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
      }));
    }
  }

  return (
    <div className="w-full space-y-8">
      <MarketingHero
        eyebrow="Performance"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="Analytics"
        description="Platform health metrics, revenue trends, and event approvals at a glance."
      />

      {/* KPI Cards */}
      <AdminKpiCards metrics={metrics} loading={loading} />

      {/* Charts */}
      <AdminCharts categoryData={categoryData} loading={loading} />

      {/* Pending Approvals Table */}
      <div className="rounded-md border border-border bg-surface p-6 shadow-low">
        <AdminPendingTable rows={tableRows} loading={loading} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
}
