'use client';

import {
  BarChart3,
  Clock,
  Database,
  FileSearch,
  Gauge,
  LayoutDashboard,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';

import { RoleLayoutWrapper } from '@/components/layout/role-layout-wrapper';
import type { SidebarNavItem } from '@/components/layout/role-sidebar';
import { routes } from '@/constants/config';
import { UserRole } from '@/types/user';

const adminNavItems: SidebarNavItem[] = [
  { href: routes.admin, label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: routes.adminUsers, label: 'User Management', icon: Users },
  { href: routes.adminEvents, label: 'Event Approval', icon: FileSearch },
  { href: routes.adminAnalytics, label: 'Analytics', icon: BarChart3 },
  { href: routes.adminSystemLogs, label: 'System Logs', icon: Clock },
  { href: routes.adminFeatured, label: 'Featured', icon: Star },
  { href: routes.adminReviews, label: 'Reviews', icon: ShieldCheck },
  { href: routes.adminCache, label: 'Cache', icon: Database },
  { href: routes.adminRateLimits, label: 'Rate Limits', icon: Gauge },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayoutWrapper
      requiredRole={UserRole.ADMIN}
      sidebarTitle="Admin"
      sidebarItems={adminNavItems}
      sidebarStorageKey="planora_admin_sidebar_collapsed"
      loadingMessage="Checking admin access…"
      deniedMessage="Access denied. Redirecting…"
    >
      {children}
    </RoleLayoutWrapper>
  );
}
