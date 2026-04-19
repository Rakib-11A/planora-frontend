'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { PageShell } from '@/components/ui/page-shell';
import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(routes.login);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-planora-muted text-sm">Checking session…</p>
      </div>
    );
  }

  return <PageShell size="wide">{children}</PageShell>;
}
