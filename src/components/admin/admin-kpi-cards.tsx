'use client';

import { AlertCircle, ArrowDown, ArrowUp, DollarSign, TrendingUp, Users } from 'lucide-react';

import { cn, formatCurrency } from '@/lib/utils';

export interface KpiMetrics {
  totalRevenue: number;
  activeUsers: number;
  pendingApprovals: number;
  conversionRate: number;
  revenueTrend: number;
  usersTrend: number;
  approvalsTrend: number;
  conversionTrend: number;
}

const CARD_CONFIGS = [
  {
    key: 'totalRevenue' as const,
    trendKey: 'revenueTrend' as const,
    label: 'Total Revenue',
    format: (v: number) => formatCurrency(v, 'BDT', 'en-BD'),
    trendLabel: 'vs last month',
    icon: DollarSign,
    iconBg: 'bg-primary-subtle',
    iconColor: 'text-primary',
  },
  {
    key: 'activeUsers' as const,
    trendKey: 'usersTrend' as const,
    label: 'Active Users',
    format: (v: number) => v.toLocaleString(),
    trendLabel: 'vs last month',
    icon: Users,
    iconBg: 'bg-success-subtle',
    iconColor: 'text-success',
  },
  {
    key: 'pendingApprovals' as const,
    trendKey: 'approvalsTrend' as const,
    label: 'Pending Approvals',
    format: (v: number) => String(v),
    trendLabel: 'new this week',
    absolute: true,
    icon: AlertCircle,
    iconBg: 'bg-warning-subtle',
    iconColor: 'text-warning',
  },
  {
    key: 'conversionRate' as const,
    trendKey: 'conversionTrend' as const,
    label: 'Conversion Rate',
    format: (v: number) => `${v.toFixed(1)}%`,
    trendLabel: 'vs last month',
    icon: TrendingUp,
    iconBg: 'bg-primary-subtle',
    iconColor: 'text-primary',
  },
] as const;

function CardSkeleton() {
  return (
    <div className="rounded-md border border-border bg-surface p-6 shadow-low">
      <div className="flex items-start justify-between">
        <div className="h-4 w-28 animate-pulse rounded bg-surface-subtle" />
        <div className="size-10 animate-pulse rounded-xl bg-surface-subtle" />
      </div>
      <div className="mt-4 h-8 w-24 animate-pulse rounded bg-surface-subtle" />
      <div className="mt-4 h-4 w-20 animate-pulse rounded bg-surface-subtle" />
    </div>
  );
}

function Trend({ value, label, absolute }: { value: number; label: string; absolute?: boolean }) {
  const up = value >= 0;
  return (
    <div className={cn('flex items-center gap-1 text-xs font-semibold', up ? 'text-success' : 'text-destructive')}>
      {up ? <ArrowUp className="size-3" aria-hidden /> : <ArrowDown className="size-3" aria-hidden />}
      <span>{absolute ? String(Math.abs(value)) : `${Math.abs(value).toFixed(1)}%`}</span>
      <span className="font-normal text-muted">{label}</span>
    </div>
  );
}

export function AdminKpiCards({ metrics, loading }: { metrics: KpiMetrics; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {CARD_CONFIGS.map((cfg) => {
        const Icon = cfg.icon;
        return (
          <div key={cfg.key} className="rounded-md border border-border bg-surface p-6 shadow-low">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted">{cfg.label}</p>
              <div className={cn('flex size-10 items-center justify-center rounded-xl', cfg.iconBg)}>
                <Icon className={cn('size-5', cfg.iconColor)} aria-hidden />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-foreground">
              {cfg.format(metrics[cfg.key])}
            </p>
            <div className="mt-4">
              <Trend
                value={metrics[cfg.trendKey]}
                label={cfg.trendLabel}
                absolute={'absolute' in cfg ? cfg.absolute : false}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
