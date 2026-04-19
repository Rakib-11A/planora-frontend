'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { MarketingHero } from '@/components/ui/marketing-hero';
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
    return (
      <div className="w-full">
        <div className="bg-planora-muted/15 mb-10 h-48 animate-pulse rounded-3xl" />
        <section className="rounded-3xl border border-white/35 bg-white/35 p-8 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35">
          <div className="bg-planora-muted/20 h-40 animate-pulse rounded-2xl" />
        </section>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full">
        <MarketingHero
          className="mb-10"
          eyebrow="Account"
          sectionMaxWidthClass="max-w-5xl"
          innerMaxWidthClass="max-w-3xl"
          title="Profile"
          description="Your account details from Planora."
        />
        <section className="rounded-3xl border border-white/35 bg-white/35 p-8 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35">
          <p className="text-planora-muted text-sm">Profile unavailable.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full">
      <MarketingHero
        className="mb-10"
        eyebrow="Account"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="Profile"
        description="Your account details from Planora. Name and email are managed by the API; use password tools to update credentials."
      >
        <div className="mt-6 flex justify-center">
          <Button type="button" variant="outline" onClick={() => router.push(routes.changePassword)}>
            Change password
          </Button>
        </div>
      </MarketingHero>

      <section className="rounded-3xl border border-white/35 bg-white/35 p-5 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
        <Card
          variant="glass"
          className="motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary"
        >
          <CardTitle className="gradient-text text-xl font-bold">Account</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            Read-only snapshot of your signed-in user.
          </CardDescription>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-planora-muted text-xs font-medium uppercase tracking-wide">Name</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</dd>
            </div>
            <div>
              <dt className="text-planora-muted text-xs font-medium uppercase tracking-wide">Email</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{user.email}</dd>
            </div>
            <div>
              <dt className="text-planora-muted text-xs font-medium uppercase tracking-wide">Role</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{user.role}</dd>
            </div>
            <div>
              <dt className="text-planora-muted text-xs font-medium uppercase tracking-wide">Email verified</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                {user.isEmailVerified ? 'Yes' : 'No'}
              </dd>
            </div>
            <div>
              <dt className="text-planora-muted text-xs font-medium uppercase tracking-wide">Member since</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                {formatDate(user.createdAt, undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </dd>
            </div>
          </dl>
        </Card>
      </section>
    </div>
  );
}
