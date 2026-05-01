'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { RoleSidebar, SidebarNavItem } from '@/components/layout/role-sidebar';
import { WorkspaceLoadingPill, WorkspacePageGradient } from '@/components/layout/workspace-atmosphere';
import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';
import { UserRole } from '@/types/user';

interface RoleLayoutWrapperProps {
  children: React.ReactNode;
  /** If set, user must have exactly this role; otherwise redirects to home. */
  requiredRole?: UserRole;
  sidebarTitle: string;
  sidebarItems: SidebarNavItem[];
  sidebarStorageKey?: string;
  loadingMessage?: string;
  deniedMessage?: string;
}

export function RoleLayoutWrapper({
  children,
  requiredRole,
  sidebarTitle,
  sidebarItems,
  sidebarStorageKey,
  loadingMessage,
  deniedMessage = 'Redirecting…',
}: RoleLayoutWrapperProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
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
      return;
    }
    if (requiredRole && user?.role !== requiredRole) {
      router.replace(routes.home);
    }
  }, [sessionHydrated, isAuthenticated, isLoading, user, requiredRole, router]);

  if (!sessionHydrated || isLoading) {
    return (
      <div className="relative min-h-[45vh] overflow-hidden">
        <WorkspacePageGradient />
        <div className="relative z-[1] flex min-h-[45vh] items-center justify-center px-4">
          <WorkspaceLoadingPill message={loadingMessage} />
        </div>
      </div>
    );
  }

  const isAuthorized = isAuthenticated && (!requiredRole || user?.role === requiredRole);

  if (!isAuthorized) {
    return (
      <div className="relative min-h-[45vh] overflow-hidden">
        <WorkspacePageGradient />
        <div className="relative z-[1] flex min-h-[45vh] items-center justify-center px-4">
          <WorkspaceLoadingPill message={deniedMessage} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden pb-16">
      <WorkspacePageGradient />
      <div className="relative z-[1] mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <RoleSidebar
            title={sidebarTitle}
            items={sidebarItems}
            storageKey={sidebarStorageKey}
          />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
