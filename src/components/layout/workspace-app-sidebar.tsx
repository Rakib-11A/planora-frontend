'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  CalendarRange,
  CreditCard,
  Inbox,
  KeyRound,
  LayoutDashboard,
  MessageSquareText,
  Ticket,
  UserCircle,
} from 'lucide-react';

import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

const links = [
  { href: routes.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { href: routes.myEvents, label: 'My events', icon: CalendarRange },
  { href: routes.invitations, label: 'Invitations', icon: Inbox },
  { href: routes.reviews, label: 'My reviews', icon: MessageSquareText },
  { href: routes.participations, label: 'Participations', icon: Ticket },
  { href: routes.payments, label: 'Payments', icon: CreditCard },
  { href: routes.profile, label: 'Profile', icon: UserCircle },
  { href: routes.notifications, label: 'Notifications', icon: Bell },
  { href: routes.changePassword, label: 'Settings', icon: KeyRound },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === routes.dashboard) return pathname === routes.dashboard;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function WorkspaceAppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:w-56 lg:shrink-0">
      <div className="rounded-3xl border border-white/35 bg-white/45 p-4 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/45 lg:sticky lg:top-24">
        <p className="text-xs font-bold uppercase tracking-widest text-planora-primary dark:text-sky-300">Workspace</p>
        <nav className="mt-4 flex flex-col gap-1" aria-label="Workspace">
          {links.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold motion-safe:transition motion-safe:duration-200',
                  active
                    ? 'bg-planora-primary/15 text-planora-primary dark:bg-planora-primary/25 dark:text-sky-200'
                    : 'text-slate-700 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-white/10'
                )}
              >
                <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
