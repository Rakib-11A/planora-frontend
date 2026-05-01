import { BarChart3, CalendarRange, Users } from 'lucide-react';

const stats = [
  { label: 'Managed Events', value: '—', icon: CalendarRange },
  { label: 'Team Members', value: '—', icon: Users },
  { label: 'Analytics', value: '—', icon: BarChart3 },
];

export default function ManagerOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h2 font-bold text-foreground">Manager Overview</h1>
        <p className="mt-1 text-body text-muted">Monitor events and team performance from your manager dashboard.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-white/35 bg-white/45 p-5 shadow-low backdrop-blur-md dark:border-white/10 dark:bg-slate-900/45"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-planora-primary/10">
              <Icon className="size-5 text-planora-primary" aria-hidden />
            </div>
            <div>
              <p className="text-h3 font-bold text-foreground">{value}</p>
              <p className="text-caption text-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/35 bg-white/45 p-6 shadow-low backdrop-blur-md dark:border-white/10 dark:bg-slate-900/45">
        <p className="text-sm text-muted">Analytics and event data will appear here once available.</p>
      </div>
    </div>
  );
}
