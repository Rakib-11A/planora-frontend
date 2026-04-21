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
import type { ApiResponse } from '@/types/api';

interface RegisterResponse {
  message: string;
}

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = (await api.post('auth/register', {
        name,
        email,
        password,
      })) as ApiResponse<RegisterResponse>;
      const { message } = unwrapApiData(res);
      toast.success(message);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Registration failed. Email may already be in use.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card variant="glass">
      <CardTitle className="gradient-text text-xl font-bold tracking-tight">Create account</CardTitle>
      <CardDescription className="text-slate-600 dark:text-slate-300">
        8+ characters with upper, lower, and a number.
      </CardDescription>
      <form className="mt-6" onSubmit={(ev) => void onSubmit(ev)}>
        <FormStack>
          <div>
            <Label htmlFor="reg-name">Name</Label>
            <Input
              id="reg-name"
              className="mt-1"
              required
              minLength={2}
              maxLength={50}
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              className="mt-1"
              type="email"
              required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="reg-password">Password</Label>
            <Input
              id="reg-password"
              className="mt-1"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Register
          </Button>
        </FormStack>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
        Already have an account?{' '}
        <Link
          href={routes.login}
          className="text-planora-primary font-medium motion-safe:transition-colors hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary"
        >
          Sign in
        </Link>
        {' · '}
        <Link
          href={routes.verifyEmail}
          className="text-planora-primary font-medium motion-safe:transition-colors hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary"
        >
          Verify email
        </Link>
      </p>
    </Card>
  );
}
