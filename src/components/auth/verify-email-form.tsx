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
import { TOKEN_KEY, routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';
import { api, getApiErrorMessage, unwrapApiData } from '@/lib/api';
import { resendOtpFormSchema, verifyEmailFormSchema } from '@/lib/schemas/auth-forms';
import type { ApiResponse } from '@/types/api';
import type { AuthResponse } from '@/types/user';

export function VerifyEmailForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; otp?: string }>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const parsed = verifyEmailFormSchema.safeParse({ email, otp });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setErrors({ email: flat.email?.[0], otp: flat.otp?.[0] });
      return;
    }
    setLoading(true);
    try {
      const res = (await api.post('auth/verify-email', parsed.data)) as ApiResponse<AuthResponse>;
      const { user, accessToken } = unwrapApiData(res);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(TOKEN_KEY, accessToken);
      }
      setUser(user);
      setEmail('');
      setOtp('');
      toast.success('Email verified! Welcome to Planora 🎉');
      router.push(routes.home);
      router.refresh();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Verification failed. Check the code and try again.'));
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setErrors({});
    const parsed = resendOtpFormSchema.safeParse({ email });
    if (!parsed.success) {
      setErrors({ email: parsed.error.flatten().fieldErrors.email?.[0] });
      return;
    }
    setResendBusy(true);
    try {
      const res = (await api.post('auth/resend-otp', parsed.data)) as ApiResponse<{
        message: string;
      }>;
      toast.success(unwrapApiData(res).message);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not resend code.'));
    } finally {
      setResendBusy(false);
    }
  }

  return (
    <Card>
      <CardTitle className="text-xl font-bold tracking-tight">Verify email</CardTitle>
      <CardDescription>
        Enter the email you registered with and the 6-digit code from your inbox.
      </CardDescription>
      <form className="mt-6" onSubmit={(ev) => void onSubmit(ev)}>
        <FormStack>
          <div>
            <Label htmlFor="verify-email">Email</Label>
            <Input
              id="verify-email"
              className="mt-1"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              error={errors.email}
            />
          </div>
          <div>
            <Label htmlFor="verify-otp">One-time code</Label>
            <Input
              id="verify-otp"
              className="mt-1"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(ev) => setOtp(ev.target.value.replace(/\D/g, '').slice(0, 6))}
              error={errors.otp}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Verify
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            isLoading={resendBusy}
            onClick={() => void resend()}
          >
            Resend code
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
      </p>
    </Card>
  );
}
