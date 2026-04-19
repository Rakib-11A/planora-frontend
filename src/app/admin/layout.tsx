'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { PageShell } from '@/components/ui/page-shell';
import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';
import { UserRole } from '@/types/user';
import { cn } from '@/lib/utils';

const adminNav = [
  { href: routes.admin, label: 'Overview' },
  { href: routes.adminUsers, label: 'Users' },
  { href: routes.adminEvents, label: 'Events' },
  { href: routes.adminReviews, label: 'Reviews' },
  { href: routes.adminCache, label: 'Cache' },
  { href: routes.adminRateLimits, label: 'Rate limits' },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== UserRole.ADMIN) {
      router.replace(routes.home);
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== UserRole.ADMIN) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-planora-muted text-sm">Checking admin access…</p>
      </div>
    );
  }

  return (
    <PageShell size="full">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <p className="text-planora-primary text-xs font-semibold tracking-wide uppercase">Admin</p>
          <nav className="mt-3 flex flex-col gap-1" aria-label="Admin">
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
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-planora-primary/10 text-planora-primary'
                      : 'text-slate-700 hover:bg-slate-100'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </PageShell>
  );
}
