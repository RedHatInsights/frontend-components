export const API_BASE = '/api/chrome-service/v1';
export const LAST_VISITED_URL = `${API_BASE}/last-visited`;
export const FAVORITE_PAGE_URL = `${API_BASE}/favorite-pages`;
export const IDENTITY_URL = `${API_BASE}/user`;
export const VISITED_BUNDLES_URL = `${API_BASE}/user/visited-bundles`;

// Required to handle server error responses
function fetchWrapper(url: RequestInfo, options?: RequestInit) {
  return fetch(url, options).then(async (res) => {
    if (!res.ok) {
      // clone response for further stream readers
      const clone = res.clone();
      // determine error response payload type
      const isJson = clone.headers.get('content-type')?.includes('application/json');
      const error = isJson ? await clone.json() : await clone.text();
      throw error;
    }
    return res.json();
  });
}

export function get<T>(url: RequestInfo, options?: RequestInit) {
  return fetchWrapper(url, { ...options, method: 'GET' }).then(({ data }: { data: T }) => data);
}

export function post<R, T extends Record<string, any> = Record<string, any>>(url: RequestInfo, data: T, options?: Omit<RequestInit, 'body'>) {
  return fetchWrapper(url, {
    credentials: 'include',
    ...options,
    headers: {
      ...options?.headers,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  }).then<R>(({ data }) => data);
}
