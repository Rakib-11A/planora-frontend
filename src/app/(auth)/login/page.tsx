import Link from 'next/link';

import { LoginForm } from '@/components/auth/login-form';
import { routes } from '@/constants/config';

export default function LoginPage() {
  return (
    <div>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-slate-600">
        No account?{' '}
        <Link href={routes.register} className="text-planora-primary font-medium hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
