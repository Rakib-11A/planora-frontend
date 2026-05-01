'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { FormStack } from '@/components/ui/form-stack';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { routes } from '@/constants/config';
import { api, getApiErrorMessage, unwrapApiData } from '@/lib/api';
import { forgotPasswordFormSchema } from '@/lib/schemas/auth-forms';
import type { ApiResponse } from '@/types/api';

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    const parsed = forgotPasswordFormSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.flatten().fieldErrors.email?.[0] ?? 'Check your email.');
      return;
    }
    setLoading(true);
    try {
      const res = (await api.post('auth/forgot-password', parsed.data)) as ApiResponse<{
        message: string;
      }>;
      toast.success(unwrapApiData(res).message);
      // Redirect to the reset-password page with email pre-filled so the user
      // can immediately enter the 6-digit code from their inbox.
      router.push(`${routes.resetPassword}?email=${encodeURIComponent(parsed.data.email)}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not start reset. Try again later.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardTitle className="text-h3">Reset password</CardTitle>
      <CardDescription>
        Enter your account email. We&apos;ll send a 6-digit code you can use to set a new password.
      </CardDescription>
      <form className="mt-6" onSubmit={(ev) => void onSubmit(ev)}>
        <FormStack>
          <div>
            <Label htmlFor="forgot-email">Email</Label>
            <Input
              id="forgot-email"
              className="mt-1"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              error={error}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Send reset code
          </Button>
        </FormStack>
      </form>
      <p className="text-muted mt-6 text-center text-sm">
        <Link
          href={routes.login}
          className="text-primary font-medium motion-safe:transition-colors hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Back to sign in
        </Link>
        {' · '}
        <Link
          href={routes.resetPassword}
          className="text-primary font-medium motion-safe:transition-colors hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Already have a code?
        </Link>
      </p>
    </Card>
  );
}
