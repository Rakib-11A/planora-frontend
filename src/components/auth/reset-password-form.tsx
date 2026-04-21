'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { FormStack } from '@/components/ui/form-stack';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { routes } from '@/constants/config';
import { api, getApiErrorMessage, unwrapApiData } from '@/lib/api';
import { resetPasswordFormSchema } from '@/lib/schemas/auth-forms';
import type { ApiResponse } from '@/types/api';

export function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    const parsed = resetPasswordFormSchema.safeParse({
      email,
      otp,
      newPassword,
      confirmPassword,
    });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        email: flat.email?.[0],
        otp: flat.otp?.[0],
        newPassword: flat.newPassword?.[0],
        confirmPassword: flat.confirmPassword?.[0],
      });
      return;
    }
    setLoading(true);
    try {
      const res = (await api.post('auth/reset-password', parsed.data)) as ApiResponse<{
        message: string;
      }>;
      toast.success(unwrapApiData(res).message);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Reset failed. Check the code and try again.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card variant="glass">
      <CardTitle className="gradient-text text-xl font-bold tracking-tight">Set a new password</CardTitle>
      <CardDescription className="text-slate-600 dark:text-slate-300">
        Use the 6-digit code sent to your email together with your new password.
      </CardDescription>
      <form className="mt-6" onSubmit={(ev) => void onSubmit(ev)}>
        <FormStack>
          <div>
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              className="mt-1"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              error={fieldErrors.email}
            />
          </div>
          <div>
            <Label htmlFor="reset-otp">One-time code</Label>
            <Input
              id="reset-otp"
              className="mt-1"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(ev) => setOtp(ev.target.value.replace(/\D/g, '').slice(0, 6))}
              error={fieldErrors.otp}
            />
          </div>
          <div>
            <Label htmlFor="reset-new">New password</Label>
            <Input
              id="reset-new"
              className="mt-1"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(ev) => setNewPassword(ev.target.value)}
              error={fieldErrors.newPassword}
            />
          </div>
          <div>
            <Label htmlFor="reset-confirm">Confirm password</Label>
            <Input
              id="reset-confirm"
              className="mt-1"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(ev) => setConfirmPassword(ev.target.value)}
              error={fieldErrors.confirmPassword}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Update password
          </Button>
        </FormStack>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
        <Link
          href={routes.login}
          className="text-planora-primary font-medium motion-safe:transition-colors hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary"
        >
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}
