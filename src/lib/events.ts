import { isAxiosError } from 'axios';

import { api, unwrapApiData } from '@/lib/api';
import { API_URL } from '@/constants/config';
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
  // #region agent log
  fetch('http://127.0.0.1:7530/ingest/f1827538-6564-4331-b43b-32c165d17185',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'50d2c1'},body:JSON.stringify({sessionId:'50d2c1',runId:'pre-fix',hypothesisId:'H1',location:'src/lib/events.ts:fetchEventById:entry',message:'fetchEventById called',data:{id,apiUrl:API_URL,axiosBaseUrl:api.defaults.baseURL ?? null,isServer:typeof window==='undefined'},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  // #region agent log
  console.error('[debug-50d2c1][H1] fetchEventById entry', {
    id,
    apiUrl: API_URL,
    axiosBaseUrl: api.defaults.baseURL ?? null,
    isServer: typeof window === 'undefined',
  });
  // #endregion
  try {
    // #region agent log
    fetch('http://127.0.0.1:7530/ingest/f1827538-6564-4331-b43b-32c165d17185',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'50d2c1'},body:JSON.stringify({sessionId:'50d2c1',runId:'pre-fix',hypothesisId:'H2',location:'src/lib/events.ts:fetchEventById:beforeGet',message:'calling api.get for event detail',data:{requestPath:`events/${id}`},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    // #region agent log
    console.error('[debug-50d2c1][H2] before api.get event detail', {
      requestPath: `events/${id}`,
      baseURL: api.defaults.baseURL ?? null,
    });
    // #endregion
    const res = (await api.get(`events/${id}`)) as ApiResponse<EventWithType>;
    return unwrapApiData(res);
  } catch (err) {
    // #region agent log
    fetch('http://127.0.0.1:7530/ingest/f1827538-6564-4331-b43b-32c165d17185',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'50d2c1'},body:JSON.stringify({sessionId:'50d2c1',runId:'pre-fix',hypothesisId:'H3',location:'src/lib/events.ts:fetchEventById:catch',message:'fetchEventById threw error',data:{isAxiosError:isAxiosError(err),errorName:err instanceof Error?err.name:'unknown',errorMessage:err instanceof Error?err.message:String(err)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    // #region agent log
    console.error('[debug-50d2c1][H3] fetchEventById catch', {
      isAxios: isAxiosError(err),
      status: isAxiosError(err) ? err.response?.status : null,
      code: isAxiosError(err) ? err.code : null,
      message: err instanceof Error ? err.message : String(err),
      requestUrl: isAxiosError(err) ? err.config?.url : null,
      requestBaseUrl: isAxiosError(err) ? err.config?.baseURL : null,
    });
    // #endregion
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
