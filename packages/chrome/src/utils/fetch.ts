export function get<T>(url: RequestInfo, options?: RequestInit) {
  return fetch(url, { ...options, method: 'GET' })
    .then((res) => res.json())
    .then(({ data }: { data: T }) => data);
}

export function post<R, T extends Record<string, any> = Record<string, any>>(url: RequestInfo, data: T, options?: Omit<RequestInit, 'body'>) {
  return fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      ...options?.headers,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then<R>(({ data }) => data);
}
