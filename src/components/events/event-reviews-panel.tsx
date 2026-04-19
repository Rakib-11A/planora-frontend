'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { EventReviewItem } from '@/types/review';
import { formatDate } from '@/lib/utils';

export interface EventReviewsPanelProps {
  eventId: string;
  initialReviews: EventReviewItem[];
}

export function EventReviewsPanel({ eventId, initialReviews }: EventReviewsPanelProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(routes.login);
      return;
    }
    setSubmitting(true);
    try {
      const body = { rating, comment: comment.trim() || undefined };
      const res = (await api.post(`events/${eventId}/reviews`, body)) as ApiResponse<unknown>;
      unwrapApiData(res);
      toast.success('Review submitted.');
      setComment('');
      router.refresh();
    } catch {
      toast.error(
        'Could not submit review. You may need approved participation or may have reviewed already.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border-planora-border rounded-lg border bg-white p-4">
      <h2 className="text-lg font-semibold text-gray-900">Reviews</h2>
      <ul className="mt-4 space-y-4">
        {initialReviews.length === 0 ? (
          <li className="text-sm text-gray-600">No reviews yet.</li>
        ) : (
          initialReviews.map((r) => (
            <li key={r.id} className="border-planora-border border-b pb-3 last:border-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-gray-900">{r.user.name}</span>
                <span className="text-sm text-gray-600">{r.rating}/5</span>
              </div>
              <p className="text-planora-muted text-xs">{formatDate(r.createdAt)}</p>
              {r.comment ? <p className="mt-1 text-sm text-gray-700">{r.comment}</p> : null}
            </li>
          ))
        )}
      </ul>

      {isAuthenticated ? (
        <form
          className="border-planora-border mt-6 border-t pt-4"
          onSubmit={(ev) => void submitReview(ev)}
        >
          <h3 className="text-sm font-semibold text-gray-900">Write a review</h3>
          <label className="mt-2 block text-sm text-gray-700">
            Rating (1–5)
            <input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(ev) => setRating(Number(ev.target.value))}
              className="border-planora-border mt-1 block w-24 rounded-md border px-2 py-1"
            />
          </label>
          <label className="mt-2 block text-sm text-gray-700">
            Comment (optional)
            <textarea
              value={comment}
              onChange={(ev) => setComment(ev.target.value)}
              rows={3}
              maxLength={500}
              className="border-planora-border mt-1 block w-full rounded-md border px-2 py-1"
            />
          </label>
          <Button type="submit" variant="primary" className="mt-3" isLoading={submitting}>
            Submit review
          </Button>
        </form>
      ) : (
        <p className="text-planora-muted mt-4 text-sm">Sign in to leave a review.</p>
      )}
    </div>
  );
}
