'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { WorkspaceLoadingPill, WorkspacePageGradient } from '@/components/layout/workspace-atmosphere';
import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const sessionHydrated = useAuthStore((s) => s.sessionHydrated);

  useEffect(() => {
    void useAuthStore.getState().checkAuth();
  }, []);

  useEffect(() => {
    if (!sessionHydrated || isLoading) return;
    if (!isAuthenticated) {
      router.replace(routes.login);
    }
  }, [sessionHydrated, isAuthenticated, isLoading, router]);

  if (!sessionHydrated || isLoading) {
    return (
      <div className="relative min-h-[45vh] overflow-hidden">
        <WorkspacePageGradient />
        <div className="relative z-[1] flex min-h-[45vh] items-center justify-center px-4">
          <WorkspaceLoadingPill />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-[45vh] overflow-hidden">
        <WorkspacePageGradient />
        <div className="relative z-[1] flex min-h-[45vh] items-center justify-center px-4">
          <WorkspaceLoadingPill message="Redirecting to sign in…" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden pb-16">
      <WorkspacePageGradient />
      <div className="relative z-[1] mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</div>
    </div>
  );
}
