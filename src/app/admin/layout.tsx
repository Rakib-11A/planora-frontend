'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { WorkspaceLoadingPill, WorkspacePageGradient } from '@/components/layout/workspace-atmosphere';
import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';
import { UserRole } from '@/types/user';
import { cn } from '@/lib/utils';

const adminNav = [
  { href: routes.admin, label: 'Overview' },
  { href: routes.adminUsers, label: 'Users' },
  { href: routes.adminEvents, label: 'Events' },
  { href: routes.adminFeatured, label: 'Featured' },
  { href: routes.adminReviews, label: 'Reviews' },
  { href: routes.adminCache, label: 'Cache' },
  { href: routes.adminRateLimits, label: 'Rate limits' },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const sessionHydrated = useAuthStore((s) => s.sessionHydrated);

  useEffect(() => {
    void useAuthStore.getState().checkAuth();
  }, []);

  useEffect(() => {
    if (!sessionHydrated || isLoading) return;
    if (!user || user.role !== UserRole.ADMIN) {
      router.replace(routes.home);
    }
  }, [sessionHydrated, user, isLoading, router]);

  if (!sessionHydrated || isLoading) {
    return (
      <div className="relative min-h-[45vh] overflow-hidden">
        <WorkspacePageGradient />
        <div className="relative z-[1] flex min-h-[45vh] items-center justify-center px-4">
          <WorkspaceLoadingPill message="Checking admin access…" />
        </div>
      </div>
    );
  }

  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="relative min-h-[45vh] overflow-hidden">
        <WorkspacePageGradient />
        <div className="relative z-[1] flex min-h-[45vh] items-center justify-center px-4">
          <WorkspaceLoadingPill message="Redirecting…" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden pb-16">
      <WorkspacePageGradient />
      <div className="relative z-[1] mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <aside className="lg:w-56 lg:shrink-0">
            <div className="rounded-3xl border border-white/35 bg-white/45 p-4 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/45 lg:sticky lg:top-24">
              <p className="text-xs font-bold uppercase tracking-widest text-planora-primary dark:text-sky-300">
                Admin
              </p>
              <nav className="mt-4 flex flex-col gap-1" aria-label="Admin">
                {adminNav.map((item) => {
                  const active =
                    item.href === routes.admin
                      ? pathname === routes.admin
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'rounded-full px-3 py-2 text-sm font-semibold motion-safe:transition motion-safe:duration-200',
                        active
                          ? 'bg-planora-primary/15 text-planora-primary dark:bg-planora-primary/25 dark:text-sky-200'
                          : 'text-slate-700 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-white/10'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
