'use client';

import { RoleSidebar } from '@/components/layout/role-sidebar';
import { USER_NAV_ITEMS } from '@/constants/navigation';

export function WorkspaceAppSidebar() {
  return (
    <RoleSidebar
      title="Workspace"
      items={USER_NAV_ITEMS}
      storageKey="planora_user_sidebar_collapsed"
    />
  );
}
