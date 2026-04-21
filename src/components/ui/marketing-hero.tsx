import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface MarketingHeroProps {
  /** Small label above the title (e.g. section context). */
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
  /** Max width of the outer rounded panel (default matches marketing pages). */
  sectionMaxWidthClass?: string;
  /** Max width of the inner text column (wider allows wide children e.g. search). */
  innerMaxWidthClass?: string;
}

/**
 * Shared hero: mesh gradient, animated wash, soft blobs — used on marketing-style routes.
 */
export function MarketingHero({
  eyebrow,
  title,
  description,
  children,
  className,
  sectionMaxWidthClass = 'max-w-7xl',
  innerMaxWidthClass = 'max-w-7xl',
}: MarketingHeroProps) {
  return (
    <section
      className={cn(
        'relative mx-auto overflow-hidden rounded-3xl border border-white/35 bg-slate-50/70 shadow-lifted dark:border-white/10 dark:bg-slate-900/50',
        sectionMaxWidthClass,
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-100/90 via-indigo-50/50 to-sky-50/40 dark:from-slate-950 dark:via-indigo-950/30 dark:to-slate-900"
        aria-hidden
      />
      <div
        className="gradient-animated pointer-events-none absolute inset-0 opacity-[0.1] dark:opacity-[0.08]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 top-0 size-64 rounded-full bg-planora-primary/20 blur-3xl dark:bg-planora-primary/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 bottom-0 size-72 rounded-full bg-planora-secondary/15 blur-3xl dark:bg-planora-secondary/8"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-1/3 top-8 size-40 rounded-full bg-amber-300/10 blur-3xl dark:bg-amber-500/5"
        aria-hidden
      />

      <div
        className={cn(
          'relative z-[1] mx-auto px-4 pb-12 pt-10 text-center md:pb-16 md:pt-14',
          innerMaxWidthClass
        )}
      >
        {eyebrow ? (
          <div className="mb-3 flex justify-center">
            <span className="inline-flex items-center rounded-full border border-planora-primary/25 bg-white/50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-planora-primary shadow-sm backdrop-blur-sm dark:border-white/15 dark:bg-white/10 dark:text-sky-200">
              {eyebrow}
            </span>
          </div>
        ) : null}
        <h1 className="gradient-text text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}
