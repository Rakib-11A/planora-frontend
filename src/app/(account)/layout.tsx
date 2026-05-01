'use client';

import { RoleLayoutWrapper } from '@/components/layout/role-layout-wrapper';
import { USER_NAV_ITEMS } from '@/constants/navigation';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayoutWrapper
      sidebarTitle="Workspace"
      sidebarItems={USER_NAV_ITEMS}
      sidebarStorageKey="planora_user_sidebar_collapsed"
    >
      {children}
    </RoleLayoutWrapper>
  );
}
