'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface CategoryPoint {
  name: string;
  count: number;
}

// Deterministic 12-month series — replace with /api/admin/analytics when available
const FULL_YEAR: Array<{ month: string; revenue: number; users: number }> = [
  { month: 'Jan', revenue: 42000, users: 45 },
  { month: 'Feb', revenue: 51200, users: 52 },
  { month: 'Mar', revenue: 47800, users: 61 },
  { month: 'Apr', revenue: 63400, users: 73 },
  { month: 'May', revenue: 71200, users: 89 },
  { month: 'Jun', revenue: 68500, users: 102 },
  { month: 'Jul', revenue: 81300, users: 118 },
  { month: 'Aug', revenue: 76100, users: 134 },
  { month: 'Sep', revenue: 89700, users: 151 },
  { month: 'Oct', revenue: 94200, users: 170 },
  { month: 'Nov', revenue: 88400, users: 189 },
  { month: 'Dec', revenue: 112000, users: 214 },
];

function ChartSkeleton() {
  return <div className="h-64 w-full animate-pulse rounded-md bg-surface-subtle" />;
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border bg-surface p-6 shadow-low">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-0.5 text-xs text-muted">{description}</p>
      </div>
      {children}
    </div>
  );
}

// Apex color palette (hex values — CSS vars not reliable as SVG fill in all browsers)
const PALETTE = {
  light: {
    primary: '#2563eb',
    success: '#10b981',
    warning: '#f59e0b',
    destructive: '#ef4444',
    axis: '#64748b',
    grid: 'rgba(0,0,0,0.06)',
    tooltipBg: '#ffffff',
    tooltipBorder: '#e2e8f0',
    tooltipText: '#1e293b',
  },
  dark: {
    primary: '#3b82f6',
    success: '#34d399',
    warning: '#fbbf24',
    destructive: '#f87171',
    axis: '#94a3b8',
    grid: 'rgba(255,255,255,0.06)',
    tooltipBg: '#1e293b',
    tooltipBorder: 'rgba(255,255,255,0.12)',
    tooltipText: '#f1f5f9',
  },
} as const;

const CATEGORY_COLORS: Array<keyof Omit<typeof PALETTE.light, 'axis' | 'grid' | 'tooltipBg' | 'tooltipBorder' | 'tooltipText'>> =
  ['primary', 'success', 'warning', 'destructive'];

export function AdminCharts({
  categoryData,
  loading,
}: {
  categoryData: CategoryPoint[];
  loading?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const monthlyData = FULL_YEAR.slice(0, new Date().getMonth() + 1);

  if (!mounted || loading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Revenue Over Time" description="Loading…">
          <ChartSkeleton />
        </ChartCard>
        <ChartCard title="Event Category Distribution" description="Loading…">
          <ChartSkeleton />
        </ChartCard>
      </div>
    );
  }

  const c = resolvedTheme === 'dark' ? PALETTE.dark : PALETTE.light;

  const tooltipStyle = {
    backgroundColor: c.tooltipBg,
    borderColor: c.tooltipBorder,
    borderRadius: '0.5rem',
    fontSize: '12px',
    color: c.tooltipText,
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.10)',
  };

  const axisProps = {
    tick: { fill: c.axis, fontSize: 11 },
    axisLine: false as const,
    tickLine: false as const,
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Area Chart — Revenue Over Time */}
      <ChartCard
        title="Revenue Over Time"
        description="Monthly revenue (BDT) and new user signups for the current year"
      >
        <ResponsiveContainer width="100%" height={256}>
          <AreaChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
            <defs>
              <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.primary} stopOpacity={0.18} />
                <stop offset="100%" stopColor={c.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.success} stopOpacity={0.18} />
                <stop offset="100%" stopColor={c.success} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis dataKey="month" {...axisProps} />
            <YAxis
              yAxisId="revenue"
              {...axisProps}
              tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
            />
            <YAxis
              yAxisId="users"
              orientation="right"
              {...axisProps}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value: number, name: string) =>
                name === 'revenue'
                  ? [`৳${value.toLocaleString()}`, 'Revenue']
                  : [value, 'New Users']
              }
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
              formatter={(name: string) => (name === 'revenue' ? 'Revenue (BDT)' : 'New Users')}
            />
            <Area
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              stroke={c.primary}
              strokeWidth={2}
              fill="url(#gradRevenue)"
              dot={false}
              activeDot={{ r: 4, fill: c.primary }}
            />
            <Area
              yAxisId="users"
              type="monotone"
              dataKey="users"
              stroke={c.success}
              strokeWidth={2}
              fill="url(#gradUsers)"
              dot={false}
              activeDot={{ r: 4, fill: c.success }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Bar Chart — Category Distribution */}
      <ChartCard
        title="Event Category Distribution"
        description="Breakdown of events by visibility and pricing type"
      >
        <ResponsiveContainer width="100%" height={256}>
          <BarChart data={categoryData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Events">
              {categoryData.map((_, i) => (
                <Cell key={i} fill={c[CATEGORY_COLORS[i % CATEGORY_COLORS.length]]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
