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
import { api, unwrapApiData } from '@/lib/api';
import { forgotPasswordFormSchema } from '@/lib/schemas/auth-forms';
import type { ApiResponse } from '@/types/api';

export function ForgotPasswordForm() {
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
    } catch {
      toast.error('Could not start reset. Try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardTitle>Reset password</CardTitle>
      <CardDescription>
        Enter the email for your account. If it exists, you will receive reset instructions.
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
            Send reset link
          </Button>
        </FormStack>
      </form>
      <p className="text-planora-muted mt-6 text-center text-sm">
        <Link href={routes.login} className="text-planora-primary font-medium hover:underline">
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}
