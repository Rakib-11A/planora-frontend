import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { PageShell } from '@/components/ui/page-shell';

export default function PrivacyPage() {
  return (
    <PageShell size="wide">
      <PageHeader
        title="Privacy policy"
        description="High-level placeholder for legal copy."
      />
      <Card>
        <CardTitle>Data handling</CardTitle>
        <CardDescription>
          Planora stores account and event data required to run the service. Replace this stub with your
          jurisdiction-specific policy before production launch.
        </CardDescription>
      </Card>
    </PageShell>
  );
}
