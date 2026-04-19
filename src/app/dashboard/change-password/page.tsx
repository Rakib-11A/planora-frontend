import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ChangePasswordForm } from '@/components/auth/change-password-form';
import { routes } from '@/constants/config';

export default function ChangePasswordPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { href: routes.dashboard, label: 'Dashboard' },
          { href: routes.changePassword, label: 'Change password' },
        ]}
      />
      <ChangePasswordForm />
    </div>
  );
}
