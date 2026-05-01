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
import { registerFormSchema } from '@/lib/schemas/auth-forms';
import type { ApiResponse } from '@/types/api';

interface RegisterResponse {
  message: string;
}

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    const parsed = registerFormSchema.safeParse({ name, email, password, confirmPassword });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        name: flat.name?.[0],
        email: flat.email?.[0],
        password: flat.password?.[0],
        confirmPassword: flat.confirmPassword?.[0],
      });
      return;
    }

    // Backend registerSchema uses .strict() — confirmPassword is not in it, so strip it
    const { confirmPassword: _omit, ...body } = parsed.data;
    void _omit;

    setLoading(true);
    try {
      const res = (await api.post('auth/register', body)) as ApiResponse<RegisterResponse>;
      const { message } = unwrapApiData(res);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFieldErrors({});
      toast.success(message);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Registration failed. Email may already be in use.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardTitle className="text-h3">Create account</CardTitle>
      <CardDescription>8+ characters with upper, lower, and a number.</CardDescription>
      <form className="mt-6" onSubmit={(ev) => void onSubmit(ev)}>
        <FormStack>
          <div>
            <Label htmlFor="reg-name">Name</Label>
            <Input
              id="reg-name"
              className="mt-1"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              error={fieldErrors.name}
            />
          </div>
          <div>
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              className="mt-1"
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              error={fieldErrors.email}
            />
          </div>
          <div>
            <Label htmlFor="reg-password">Password</Label>
            <Input
              id="reg-password"
              className="mt-1"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              error={fieldErrors.password}
            />
          </div>
          <div>
            <Label htmlFor="reg-confirm">Confirm password</Label>
            <Input
              id="reg-confirm"
              className="mt-1"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(ev) => setConfirmPassword(ev.target.value)}
              error={fieldErrors.confirmPassword}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Register
          </Button>
        </FormStack>
      </form>
      <p className="text-muted mt-6 text-center text-sm">
        Already have an account?{' '}
        <Link
          href={routes.login}
          className="text-primary font-medium motion-safe:transition-colors hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Sign in
        </Link>
        {' · '}
        <Link
          href={routes.verifyEmail}
          className="text-primary font-medium motion-safe:transition-colors hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Verify email
        </Link>
      </p>
    </Card>
  );
}
