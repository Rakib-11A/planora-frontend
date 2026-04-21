import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { PageShell } from '@/components/ui/page-shell';

export default function TermsPage() {
  return (
    <PageShell size="wide">
      <PageHeader
        title="Terms of service"
        description="Placeholder terms for the Planora experience."
      />
      <Card>
        <CardTitle>Usage</CardTitle>
        <CardDescription>
          By using Planora you agree to follow applicable laws and respect other users. Replace this
          section with counsel-reviewed terms prior to public marketing.
        </CardDescription>
      </Card>
    </PageShell>
  );
}
