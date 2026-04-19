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
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { AuthResponse } from '@/types/user';

export function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = (await api.post('auth/login', { email, password })) as ApiResponse<AuthResponse>;
      const { user, accessToken } = unwrapApiData(res);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(TOKEN_KEY, accessToken);
      }
      setUser(user);
      toast.success('Signed in.');
      router.push(routes.home);
      router.refresh();
    } catch {
      toast.error('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardTitle>Sign in</CardTitle>
      <CardDescription>Welcome back. Use your Planora account credentials.</CardDescription>
      <form className="mt-6" onSubmit={(ev) => void onSubmit(ev)}>
        <FormStack>
          <div>
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              className="mt-1"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>
          <div>
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="login-password">Password</Label>
              <Link
                href={routes.forgotPassword}
                className="text-planora-primary text-xs font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="login-password"
              className="mt-1"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Continue
          </Button>
        </FormStack>
      </form>
      <p className="text-planora-muted mt-4 text-center text-sm">
        New here?{' '}
        <Link href={routes.verifyEmail} className="text-planora-primary font-medium hover:underline">
          Verify email
        </Link>
      </p>
    </Card>
  );
}
