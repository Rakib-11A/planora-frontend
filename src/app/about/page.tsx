import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { PageShell } from '@/components/ui/page-shell';

export default function AboutPage() {
  return (
    <PageShell size="wide">
      <PageHeader
        title="About Planora"
        description="Planora helps organizers publish events and helps attendees discover experiences worth their time."
      />
      <Card>
        <CardTitle>Our focus</CardTitle>
        <CardDescription>
          This page is a lightweight placeholder until marketing copy is finalized. The product already
          supports public discovery, authenticated participation, payments, invitations, and admin
          moderation aligned with the live API.
        </CardDescription>
      </Card>
    </PageShell>
  );
}
