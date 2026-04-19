import { AuthGlassScene } from '@/components/auth/auth-glass-scene';
import { ChangePasswordForm } from '@/components/auth/change-password-form';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { routes } from '@/constants/config';

export default function ChangePasswordPage() {
  return (
    <AuthGlassScene minHeightClass="min-h-[calc(100dvh-10rem)]" className="py-6 md:py-10">
      <Breadcrumbs
        className="mb-6 text-slate-600 dark:text-slate-300 [&_a]:font-medium [&_a]:text-planora-primary [&_a]:hover:underline [&_a]:focus-visible:outline [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-2 [&_a]:focus-visible:outline-planora-primary dark:[&_a]:text-sky-300"
        items={[
          { href: routes.dashboard, label: 'Dashboard' },
          { href: routes.changePassword, label: 'Change password' },
        ]}
      />
      <ChangePasswordForm />
    </AuthGlassScene>
  );
}
