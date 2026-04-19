export default function EventDetailLoading() {
  return (
    <div className="relative w-full overflow-hidden pb-20">
      <div
        className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-b from-slate-100/90 via-white to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30"
        aria-hidden
      />
      <div className="relative z-[1] px-4 py-10 sm:px-6">
        <div className="mx-auto mb-6 max-w-5xl">
          <div className="bg-planora-muted/25 h-10 w-40 animate-pulse rounded-full" />
        </div>
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/35 bg-white/40 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35">
          <div className="bg-planora-muted/15 h-48 animate-pulse md:h-56" />
          <div className="space-y-4 p-5 md:p-8">
            <div className="bg-planora-muted/20 h-6 w-2/3 animate-pulse rounded-md" />
            <div className="bg-planora-muted/20 h-4 w-full animate-pulse rounded-md" />
            <div className="bg-planora-muted/20 h-4 w-5/6 animate-pulse rounded-md" />
            <div className="bg-planora-muted/20 mt-6 h-36 w-full animate-pulse rounded-2xl" />
            <div className="bg-planora-muted/20 h-28 w-full animate-pulse rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
