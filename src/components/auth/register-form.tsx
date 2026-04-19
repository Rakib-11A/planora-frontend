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
    } catch {
      toast.error('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardTitle>Create account</CardTitle>
      <CardDescription>8+ characters with upper, lower, and a number.</CardDescription>
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
      <p className="text-planora-muted mt-6 text-center text-sm">
        Already have an account?{' '}
        <Link href={routes.login} className="text-planora-primary font-medium hover:underline">
          Sign in
        </Link>
        {' · '}
        <Link href={routes.verifyEmail} className="text-planora-primary font-medium hover:underline">
          Verify email
        </Link>
      </p>
    </Card>
  );
}
