'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { routes } from '@/constants/config';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

function PaymentReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const eventId = searchParams.get('eventId');
  const provider = searchParams.get('provider') ?? 'mock';
  const gatewayStatus = searchParams.get('status');
  const [busy, setBusy] = useState(false);
  const isNegativeReturn =
    gatewayStatus === 'fail' || gatewayStatus === 'cancel' || gatewayStatus === 'cancelled';

  async function confirmPayment() {
    if (!paymentId) return;
    setBusy(true);
    try {
      await api.post(`payments/${paymentId}/verify`);
      toast.success('Payment confirmed. Your registration stays pending until the host approves.');
      router.push(eventId ? routes.event(eventId) : routes.payments);
    } catch {
      toast.error('Could not verify payment. Try again or open the event page and use Verify there.');
    } finally {
      setBusy(false);
    }
  }

  if (!paymentId) {
    return (
      <Card variant="glass" className="mx-auto max-w-lg">
        <CardTitle className="gradient-text text-xl font-bold">Invalid link</CardTitle>
        <CardDescription>This payment return URL is missing a payment reference.</CardDescription>
        <Link
          href={routes.home}
          className={cn(
            'mt-6 inline-flex items-center justify-center rounded-md border-2 border-planora-primary px-4 py-2 text-base font-medium text-planora-primary transition-colors hover:bg-planora-primary/10'
          )}
        >
          Back to home
        </Link>
      </Card>
    );
  }

  const backHref = eventId ? routes.event(eventId) : routes.events;

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Card variant="glass">
        <CardTitle className="gradient-text text-xl font-bold">Complete your payment</CardTitle>
        <CardDescription className="space-y-2">
          <span className="block">
            Provider: <span className="font-semibold text-slate-800">{provider}</span>
          </span>
          {gatewayStatus ? (
            <span className="block">
              Gateway status: <span className="font-semibold text-slate-800">{gatewayStatus}</span>
            </span>
          ) : null}
          {isNegativeReturn ? (
            <span className="block rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-sm text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-100">
              Checkout reported unsuccessful. You can still try Confirm if the gateway later shows
              success, or start payment again from the event page.
            </span>
          ) : null}
          <span className="block text-sm">
            After real gateways (SSLCommerz / ShurjoPay) redirect you here, confirm below so we can
            record the payment. Mock mode also uses this step.
          </span>
        </CardDescription>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button type="button" variant="primary" isLoading={busy} onClick={() => void confirmPayment()}>
            Confirm payment
          </Button>
          <Link
            href={backHref}
            className={cn(
              'inline-flex items-center justify-center rounded-md border-2 border-planora-primary px-4 py-2 text-base font-medium text-planora-primary transition-colors hover:bg-planora-primary/10',
              busy && 'pointer-events-none opacity-50'
            )}
          >
            Back to event
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center px-4 text-sm text-slate-600">
          Loading payment…
        </div>
      }
    >
      <PaymentReturnContent />
    </Suspense>
  );
}
