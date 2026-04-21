'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { api, unwrapApiData } from '@/lib/api';
import { initiatePaymentResponseSchema } from '@/lib/schemas/me';
import type { ApiResponse } from '@/types/api';
import { formatCurrency } from '@/lib/utils';

function navigateToCheckout(paymentUrl: string): void {
  if (typeof window === 'undefined') return;
  try {
    const target = new URL(paymentUrl, window.location.origin);
    if (target.origin === window.location.origin) {
      window.location.assign(target.toString());
      return;
    }
  } catch {
    // non-absolute URL
  }
  window.open(paymentUrl, '_blank', 'noopener,noreferrer');
}

export interface EventPayBlockProps {
  eventId: string;
  fee: number;
}

export function EventPayBlock({ eventId, fee }: EventPayBlockProps) {
  const router = useRouter();
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function startPay() {
    setBusy(true);
    try {
      const raw = (await api.post(`events/${eventId}/pay`)) as ApiResponse<unknown>;
      const parsed = initiatePaymentResponseSchema.safeParse(unwrapApiData(raw));
      if (!parsed.success) {
        toast.error('Unexpected payment response.');
        return;
      }
      const { paymentId: pid, paymentUrl } = parsed.data;
      setPaymentId(pid);
      navigateToCheckout(paymentUrl);
      toast.success(
        'Opening checkout. After paying, confirm on the next screen (or use Verify on this page).'
      );
    } catch {
      toast.error('Could not start payment. You may need to join first or payment may already exist.');
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    if (!paymentId) {
      toast.error('Start payment first to obtain a payment reference.');
      return;
    }
    setBusy(true);
    try {
      await api.post(`payments/${paymentId}/verify`);
      toast.success('Payment verified. You will remain pending until the host approves your registration.');
      router.refresh();
    } catch {
      toast.error('Verification failed. Try again after completing checkout.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card variant="glass" id="event-pay">
      <CardTitle className="gradient-text text-xl font-bold">Complete payment</CardTitle>
      <CardDescription>
        Fee {formatCurrency(fee, 'BDT', 'en-BD')}. Open the secure checkout, then confirm here if needed. Paid
        registrations stay pending until the event organizer approves you.
      </CardDescription>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="primary" isLoading={busy} onClick={() => void startPay()}>
          Pay now
        </Button>
        <Button type="button" variant="outline" disabled={!paymentId} onClick={() => void verify()}>
          I completed checkout — verify
        </Button>
      </div>
    </Card>
  );
}
