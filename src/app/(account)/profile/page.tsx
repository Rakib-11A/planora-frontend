'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { routes } from '@/constants/config';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/user';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = (await api.get('auth/me')) as ApiResponse<User>;
        if (!cancelled) setUser(unwrapApiData(res));
      } catch {
        if (!cancelled) toast.error('Could not load profile.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-planora-muted text-sm">Loading profile…</p>;
  }

  if (!user) {
    return <p className="text-planora-muted text-sm">Profile unavailable.</p>;
  }

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Your account details from Planora. Name and email are managed by the API; use password tools below to update credentials."
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(routes.changePassword)}
          >
            Change password
          </Button>
        }
      />
      <Card>
        <CardTitle>Account</CardTitle>
        <CardDescription>Read-only snapshot of your signed-in user.</CardDescription>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-planora-muted text-xs font-medium tracking-wide uppercase">Name</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">{user.name}</dd>
          </div>
          <div>
            <dt className="text-planora-muted text-xs font-medium tracking-wide uppercase">Email</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-planora-muted text-xs font-medium tracking-wide uppercase">Role</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">{user.role}</dd>
          </div>
          <div>
            <dt className="text-planora-muted text-xs font-medium tracking-wide uppercase">Email verified</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">
              {user.isEmailVerified ? 'Yes' : 'No'}
            </dd>
          </div>
          <div>
            <dt className="text-planora-muted text-xs font-medium tracking-wide uppercase">Member since</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">
              {formatDate(user.createdAt, undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
