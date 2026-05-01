import { isAxiosError } from 'axios';

import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { EventWithType } from '@/types/event';

function emptyEventsPage(page: number, limit: number): PaginatedResponse<EventWithType> {
  return {
    items: [],
    pagination: { page, limit, total: 0, totalPages: 1 },
  };
}

export async function fetchEventsList(params: {
  page?: number;
  limit?: number;
  isPublic?: boolean;
  isPaid?: boolean;
  search?: string;
}): Promise<PaginatedResponse<EventWithType>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 12;
  const search = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (params.isPublic !== undefined) {
    search.set('isPublic', String(params.isPublic));
  }
  if (params.isPaid !== undefined) {
    search.set('isPaid', String(params.isPaid));
  }
  if (params.search?.trim()) {
    search.set('search', params.search.trim());
  }

  try {
    const res = (await api.get(`events?${search.toString()}`)) as ApiResponse<
      PaginatedResponse<EventWithType>
    >;
    return unwrapApiData(res);
  } catch (err) {
    if (isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 429 || status === 503) {
        console.warn(
          `[events] GET events rate-limited or unavailable (${status}); returning empty list for SSR.`
        );
        return emptyEventsPage(page, limit);
      }
    }
    throw err;
  }
}

export async function fetchEventById(id: string): Promise<EventWithType | null> {
  try {
    const res = (await api.get(`events/${id}`)) as ApiResponse<EventWithType>;
    return unwrapApiData(res);
  } catch (err) {
    if (isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 404 || status === 403) {
        return null;
      }
      if (status === 429 || status === 503) {
        console.warn(
          `[events] GET event/${id} rate-limited or unavailable (${status}); treating as missing.`
        );
        return null;
      }
    }
    throw err;
  }
}

/** @returns null when route is missing or request fails */
export async function fetchFeaturedEvent(): Promise<EventWithType | null> {
  try {
    const res = (await api.get('events/featured')) as ApiResponse<EventWithType>;
    return unwrapApiData(res);
  } catch {
    return null;
  }
}

export async function fetchPublicEventsForHome(limit: number): Promise<EventWithType[]> {
  try {
    const data = await fetchEventsList({ page: 1, limit, isPublic: true });
    return data.items;
  } catch (err) {
    console.error('[events] Failed to load public events', err);
    return [];
  }
}

/** Client-only: requires a Bearer token (`GET /api/events/mine`). */
export async function fetchMyEventsList(
  page = 1,
  limit = 20
): Promise<PaginatedResponse<EventWithType>> {
  const res = (await api.get(`events/mine?page=${page}&limit=${limit}`)) as ApiResponse<
    PaginatedResponse<EventWithType>
  >;
  return unwrapApiData(res);
}

/**
 * Fetch related events for cross-linking on the details page.
 * Prioritizes events with the same type (PUBLIC/PRIVATE + FREE/PAID).
 * Excludes the current event.
 */
export async function fetchRelatedEvents(
  currentEventId: string,
  eventType: string,
  limit = 4
): Promise<EventWithType[]> {
  try {
    // Fetch public events and filter client-side
    const data = await fetchEventsList({ page: 1, limit: 20, isPublic: true });

    // Filter out current event and prioritize same type
    const related = data.items
      .filter((e) => e.id !== currentEventId)
      .sort((a, b) => {
        // Prioritize same event type
        const aSameType = a.eventType === eventType ? 1 : 0;
        const bSameType = b.eventType === eventType ? 1 : 0;
        if (aSameType !== bSameType) return bSameType - aSameType;
        // Then by rating
        return b.avgRating - a.avgRating;
      })
      .slice(0, limit);

    return related;
  } catch (err) {
    console.error('[events] Related events fetch failed', err);
    return [];
  }
}
