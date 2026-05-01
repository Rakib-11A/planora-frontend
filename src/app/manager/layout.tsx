'use client';

import {
  BarChart3,
  CalendarRange,
  KeyRound,
  LayoutDashboard,
  Users,
} from 'lucide-react';

import { RoleLayoutWrapper } from '@/components/layout/role-layout-wrapper';
import type { SidebarNavItem } from '@/components/layout/role-sidebar';
import { routes } from '@/constants/config';
import { UserRole } from '@/types/user';

const managerNavItems: SidebarNavItem[] = [
  { href: routes.manager, label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: routes.managerEvents, label: 'Event Management', icon: CalendarRange },
  { href: routes.managerAnalytics, label: 'Analytics', icon: BarChart3 },
  { href: routes.managerTeam, label: 'Team', icon: Users },
  { href: routes.managerSettings, label: 'Settings', icon: KeyRound },
];

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayoutWrapper
      requiredRole={UserRole.MANAGER}
      sidebarTitle="Manager"
      sidebarItems={managerNavItems}
      sidebarStorageKey="planora_manager_sidebar_collapsed"
      loadingMessage="Checking manager access…"
      deniedMessage="Access denied. Redirecting…"
    >
      {children}
    </RoleLayoutWrapper>
  );
}
