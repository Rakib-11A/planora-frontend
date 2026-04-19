'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { FormStack } from '@/components/ui/form-stack';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { routes } from '@/constants/config';
import { api, unwrapApiData } from '@/lib/api';
import { changePasswordFormSchema } from '@/lib/schemas/auth-forms';
import type { ApiResponse } from '@/types/api';

export function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    const parsed = changePasswordFormSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        currentPassword: flat.currentPassword?.[0],
        newPassword: flat.newPassword?.[0],
        confirmPassword: flat.confirmPassword?.[0],
      });
      return;
    }
    setLoading(true);
    try {
      const res = (await api.patch('auth/change-password', parsed.data)) as ApiResponse<{
        message: string;
      }>;
      toast.success(unwrapApiData(res).message);
      router.push(routes.dashboard);
      router.refresh();
    } catch {
      toast.error('Could not change password. Check your current password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardTitle>Change password</CardTitle>
      <CardDescription>Your session stays active after a successful update.</CardDescription>
      <form className="mt-6" onSubmit={(ev) => void onSubmit(ev)}>
        <FormStack>
          <div>
            <Label htmlFor="cur-pw">Current password</Label>
            <Input
              id="cur-pw"
              className="mt-1"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(ev) => setCurrentPassword(ev.target.value)}
              error={fieldErrors.currentPassword}
            />
          </div>
          <div>
            <Label htmlFor="new-pw">New password</Label>
            <Input
              id="new-pw"
              className="mt-1"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(ev) => setNewPassword(ev.target.value)}
              error={fieldErrors.newPassword}
            />
          </div>
          <div>
            <Label htmlFor="conf-pw">Confirm new password</Label>
            <Input
              id="conf-pw"
              className="mt-1"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(ev) => setConfirmPassword(ev.target.value)}
              error={fieldErrors.confirmPassword}
            />
          </div>
          <Button type="submit" variant="primary" isLoading={loading}>
            Save password
          </Button>
        </FormStack>
      </form>
    </Card>
  );
}
