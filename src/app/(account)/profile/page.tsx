'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { FormStack } from '@/components/ui/form-stack';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';
import { api, unwrapApiData } from '@/lib/api';
import {
  updateProfileFormSchema,
  type UpdateProfileFormValues,
} from '@/lib/schemas/auth-forms';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/user';
import { formatDate } from '@/lib/utils';

type FieldErrors = Partial<Record<keyof UpdateProfileFormValues, string>>;

export default function ProfilePage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [user, setLocalUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = (await api.get('auth/me')) as ApiResponse<User>;
        const u = unwrapApiData(res);
        if (cancelled) return;
        setLocalUser(u);
        setName(u.name);
        setAvatar(u.avatar ?? '');
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

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || saving) return;

    const trimmedAvatar = avatar.trim();
    const parsed = updateProfileFormSchema.safeParse({
      name: name.trim(),
      avatar: trimmedAvatar,
    });
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === 'name' || key === 'avatar') next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});

    const noChange =
      parsed.data.name === user.name &&
      (parsed.data.avatar ?? '') === (user.avatar ?? '');
    if (noChange) {
      toast.success('Nothing to update.');
      return;
    }

    void (async () => {
      setSaving(true);
      try {
        const payload: { name?: string; avatar?: string | null } = {};
        if (parsed.data.name !== user.name) payload.name = parsed.data.name;
        const nextAvatar = parsed.data.avatar === '' ? null : (parsed.data.avatar ?? null);
        if (nextAvatar !== (user.avatar ?? null)) payload.avatar = nextAvatar;

        const res = (await api.patch('auth/me', payload)) as ApiResponse<User>;
        const updated = unwrapApiData(res);
        setLocalUser(updated);
        setUser(updated);
        toast.success('Profile updated.');
      } catch {
        toast.error('Could not update profile.');
      } finally {
        setSaving(false);
      }
    })();
  }

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

  const previewSrc = avatar.trim() !== '' ? avatar.trim() : (user.avatar ?? '');

  return (
    <div className="w-full">
      <MarketingHero
        className="mb-10"
        eyebrow="Account"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="Profile"
        description="Update your display name and avatar. Email is the account identity and cannot be changed here."
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
          <CardTitle className="gradient-text text-xl font-bold">Edit profile</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-300">
            Changes apply immediately and replace existing values.
          </CardDescription>

          <form onSubmit={onSubmit} className="mt-6" noValidate>
            <FormStack>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
                <div className="border-planora-primary/30 bg-planora-primary/10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 text-lg font-bold text-planora-primary">
                  {previewSrc !== '' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewSrc}
                      alt={`${user.name} avatar preview`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>{user.name.slice(0, 1).toUpperCase()}</span>
                  )}
                </div>
                <p className="text-planora-muted text-xs sm:text-sm">
                  Paste a public image URL (e.g. uploaded to your CDN). Leave blank to remove.
                </p>
              </div>

              <div>
                <Label htmlFor="profile-name">Name</Label>
                <Input
                  id="profile-name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  required
                  error={errors.name}
                  disabled={saving}
                  autoComplete="name"
                />
              </div>

              <div>
                <Label htmlFor="profile-avatar">Avatar URL</Label>
                <Input
                  id="profile-avatar"
                  name="avatar"
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://…"
                  error={errors.avatar}
                  disabled={saving}
                  autoComplete="url"
                />
              </div>
            </FormStack>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button type="submit" variant="primary" isLoading={saving}>
                Save changes
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => {
                  setName(user.name);
                  setAvatar(user.avatar ?? '');
                  setErrors({});
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </Card>

        <Card
          variant="glass"
          className="mt-6 motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-glow-primary"
        >
          <CardTitle className="gradient-text text-lg font-bold">Account details</CardTitle>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
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
