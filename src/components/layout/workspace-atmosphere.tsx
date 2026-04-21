import { cn } from '@/lib/utils';

/** Full-bleed vertical gradient used behind workspace / account / admin pages. */
export function WorkspacePageGradient({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 -z-0 bg-gradient-to-b from-slate-100/90 via-white to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30',
        className
      )}
      aria-hidden
    />
  );
}

const pillClass =
  'rounded-full border border-white/40 bg-white/60 px-5 py-2.5 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-md dark:border-white/15 dark:bg-slate-900/50 dark:text-slate-300';

export function WorkspaceLoadingPill({ message = 'Checking session…' }: { message?: string }) {
  return <p className={pillClass}>{message}</p>;
}
