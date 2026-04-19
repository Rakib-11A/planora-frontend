import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { PageShell } from '@/components/ui/page-shell';

export default function ContactPage() {
  return (
    <PageShell size="wide">
      <PageHeader
        title="Contact"
        description="Reach the team running this Planora deployment."
      />
      <Card>
        <CardTitle>Placeholder</CardTitle>
        <CardDescription>
          Add a support email, ticketing link, or contact form when you are ready. Until then, refer to
          repository maintainers or your deployment notes.
        </CardDescription>
      </Card>
    </PageShell>
  );
}
