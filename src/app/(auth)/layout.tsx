import type { ReactNode } from 'react';

import { AuthGlassScene } from '@/components/auth/auth-glass-scene';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthGlassScene>{children}</AuthGlassScene>;
}
