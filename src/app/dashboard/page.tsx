'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';
import { UserRole } from '@/types/user';

const links = [
  { href: routes.createEvent, title: 'Create event', body: 'Publish a new listing.' },
  { href: routes.myEvents, title: 'My events', body: 'Events you organize.' },
  { href: routes.participations, title: 'Participations', body: 'Registrations you hold.' },
  { href: routes.invitations, title: 'Invitations', body: 'Private event inbox.' },
  { href: routes.payments, title: 'Payments', body: 'Checkout history.' },
  { href: routes.notifications, title: 'Notifications', body: 'System messages.' },
  { href: routes.profile, title: 'Profile', body: 'Account snapshot.' },
  { href: routes.changePassword, title: 'Change password', body: 'Update credentials.' },
] as const;

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Shortcuts to everything you need after signing in."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="block">
            <Card className="h-full transition-colors hover:border-planora-primary/40">
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.body}</CardDescription>
            </Card>
          </Link>
        ))}
        {user?.role === UserRole.ADMIN ? (
          <Link href={routes.admin} className="block">
            <Card className="h-full border-amber-200 bg-amber-50/50 transition-colors hover:border-amber-400">
              <CardTitle>Admin console</CardTitle>
              <CardDescription>Moderation and infrastructure tools.</CardDescription>
            </Card>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
