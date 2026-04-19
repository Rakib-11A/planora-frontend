import { isAxiosError } from 'axios';

import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { EventReviewItem } from '@/types/review';

function emptyReviews(page: number, limit: number): PaginatedResponse<EventReviewItem> {
  return {
    items: [],
    pagination: { page, limit, total: 0, totalPages: 1 },
  };
}

export async function fetchEventReviews(
  eventId: string,
  page = 1,
  limit = 20
): Promise<PaginatedResponse<EventReviewItem>> {
  try {
    const res = (await api.get(
      `events/${eventId}/reviews?page=${page}&limit=${limit}`
    )) as ApiResponse<PaginatedResponse<EventReviewItem>>;
    return unwrapApiData(res);
  } catch (err) {
    if (isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 429 || status === 503) {
        console.warn(
          `[reviews] GET reviews rate-limited or unavailable (${status}); returning empty list.`
        );
        return emptyReviews(page, limit);
      }
    }
    throw err;
  }
}
