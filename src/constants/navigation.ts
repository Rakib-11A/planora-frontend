import {
  Bell,
  BellRing,
  CalendarRange,
  CreditCard,
  Inbox,
  KeyRound,
  LayoutDashboard,
  MessageSquareText,
  Ticket,
  UserCircle,
} from 'lucide-react';

import type { SidebarNavItem } from '@/components/layout/role-sidebar';
import { routes } from '@/constants/config';

/** Shared nav items for the user workspace (dashboard + account sections). */
export const USER_NAV_ITEMS: SidebarNavItem[] = [
  { href: routes.dashboard, label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: routes.myEvents, label: 'My Events', icon: CalendarRange },
  { href: routes.invitations, label: 'Invitations', icon: Inbox },
  { href: routes.reviews, label: 'My Reviews', icon: MessageSquareText },
  { href: routes.participations, label: 'Participations', icon: Ticket },
  { href: routes.payments, label: 'Payments', icon: CreditCard },
  { href: routes.profile, label: 'Profile', icon: UserCircle },
  { href: routes.notifications, label: 'Notifications', icon: Bell },
  { href: routes.notificationSettings, label: 'Notification Settings', icon: BellRing },
  { href: routes.changePassword, label: 'Settings', icon: KeyRound },
];
