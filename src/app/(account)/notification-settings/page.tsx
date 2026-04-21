'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import { cn } from '@/lib/utils';

const preferencesResponseSchema = z.object({
  preferences: z.object({
    emailEnabled: z.boolean(),
    mutedTypes: z.array(z.string()),
  }),
  availableTypes: z.array(z.string()),
  defaults: z.object({
    emailEnabled: z.boolean(),
    mutedTypes: z.array(z.string()),
  }),
});

const TYPE_LABELS: Record<string, { title: string; description: string }> = {
  INVITATION_RECEIVED: {
    title: 'Invitations received',
    description: 'A host invites you to join their event.',
  },
  INVITATION_ACCEPTED: {
    title: 'Invitations accepted',
    description: 'Someone you invited accepts the invite.',
  },
  PARTICIPATION_APPROVED: {
    title: 'Participation approved',
    description: 'A host approves your join request.',
  },
  PARTICIPATION_REJECTED: {
    title: 'Participation rejected',
    description: 'A host rejects your join request.',
  },
  PAYMENT_SUCCESS: {
    title: 'Payment received',
    description: 'A registration payment is confirmed by the gateway.',
  },
  EVENT_REMINDER: {
    title: 'Event reminders',
    description: 'Upcoming-event reminders for events you joined.',
  },
};

function labelFor(type: string) {
  return TYPE_LABELS[type] ?? { title: type, description: '' };
}

export default function NotificationSettingsPage() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [mutedTypes, setMutedTypes] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [original, setOriginal] = useState<{ emailEnabled: boolean; mutedTypes: string[] } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await api.get('me/notification-preferences')) as ApiResponse<unknown>;
      const parsed = preferencesResponseSchema.safeParse(unwrapApiData(res));
      if (!parsed.success) {
        toast.error('Could not load notification preferences.');
        return;
      }
      const { preferences, availableTypes } = parsed.data;
      setEmailEnabled(preferences.emailEnabled);
      setMutedTypes(preferences.mutedTypes);
      setAvailable(availableTypes);
      setOriginal({ emailEnabled: preferences.emailEnabled, mutedTypes: preferences.mutedTypes });
    } catch {
      toast.error('Could not load notification preferences.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const dirty = useMemo(() => {
    if (!original) return false;
    if (original.emailEnabled !== emailEnabled) return true;
    if (original.mutedTypes.length !== mutedTypes.length) return true;
    const a = [...original.mutedTypes].sort();
    const b = [...mutedTypes].sort();
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return true;
    return false;
  }, [original, emailEnabled, mutedTypes]);

  function toggleMuted(type: string, muted: boolean) {
    setMutedTypes((prev) => {
      const set = new Set(prev);
      if (muted) set.add(type);
      else set.delete(type);
      return Array.from(set);
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!dirty || saving) return;
    setSaving(true);
    try {
      const res = (await api.patch('me/notification-preferences', {
        emailEnabled,
        mutedTypes,
      })) as ApiResponse<unknown>;
      const parsed = preferencesResponseSchema
        .pick({ preferences: true })
        .safeParse(unwrapApiData(res));
      if (parsed.success) {
        setOriginal({
          emailEnabled: parsed.data.preferences.emailEnabled,
          mutedTypes: parsed.data.preferences.mutedTypes,
        });
        toast.success('Preferences saved.');
      } else {
        await load();
        toast.success('Preferences saved.');
      }
    } catch {
      toast.error('Could not save preferences.');
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    if (!original || saving) return;
    setEmailEnabled(original.emailEnabled);
    setMutedTypes(original.mutedTypes);
  }

  return (
    <div className="w-full">
      <MarketingHero
        className="mb-10"
        eyebrow="Settings"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="Notification settings"
        description="Choose which Planora updates you want delivered by email. In-app notifications stay visible in your inbox so you never miss important account events."
      />

      <section className="rounded-3xl border border-white/35 bg-white/35 p-5 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
        {loading ? (
          <div className="space-y-3">
            <div className="bg-planora-muted/20 h-24 animate-pulse rounded-2xl" />
            <div className="bg-planora-muted/20 h-32 animate-pulse rounded-2xl" />
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <Card variant="glass">
              <CardTitle className="gradient-text text-lg font-bold">Email delivery</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                Master switch for transactional emails. When off, no emails will be sent regardless of per-category settings below.
              </CardDescription>
              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-white/40 bg-white/60 p-3 dark:border-white/10 dark:bg-slate-900/60">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-planora-primary"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  disabled={saving}
                />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Send me email notifications
                </span>
              </label>
            </Card>

            <Card
              variant="glass"
              className={cn('mt-6', !emailEnabled && 'opacity-60')}
            >
              <CardTitle className="gradient-text text-lg font-bold">Per-category email</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                Uncheck a category to stop receiving its emails. (You will still see the in-app notification.)
              </CardDescription>
              <ul className="mt-4 space-y-2">
                {available.map((type) => {
                  const muted = mutedTypes.includes(type);
                  const meta = labelFor(type);
                  return (
                    <li key={type}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/40 bg-white/60 p-3 dark:border-white/10 dark:bg-slate-900/60">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 accent-planora-primary"
                          checked={!muted}
                          onChange={(e) => toggleMuted(type, !e.target.checked)}
                          disabled={saving || !emailEnabled}
                        />
                        <span>
                          <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {meta.title}
                          </span>
                          {meta.description ? (
                            <span className="text-planora-muted block text-xs">{meta.description}</span>
                          ) : null}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </Card>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button type="submit" variant="primary" isLoading={saving} disabled={!dirty}>
                Save preferences
              </Button>
              <Button type="button" variant="outline" onClick={reset} disabled={!dirty || saving}>
                Reset
              </Button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
