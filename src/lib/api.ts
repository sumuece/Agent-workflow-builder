/**
 * API client using native fetch only (no axios).
 */

const base =
  typeof import.meta.env.VITE_API_URL === 'string'
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
    : '';

export type ApiUser = {
  id: number;
  email: string;
  name: string;
  created_at?: string;
};

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export async function apiFetch(
  path: string,
  init: RequestInit & { token?: string | null } = {}
): Promise<Response> {
  const { token, headers, ...rest } = init;
  const h = new Headers(headers);
  if (token) h.set('Authorization', `Bearer ${token}`);
  if (!h.has('Accept')) h.set('Accept', 'application/json');
  return fetch(`${base}${path}`, { ...rest, headers: h });
}

export async function apiLogin(email: string, password: string) {
  const res = await apiFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await parseJson<{ token?: string; user?: ApiUser; error?: string }>(
    res
  );
  if (!res.ok) {
    throw new Error(data?.error || 'Login failed');
  }
  if (!data.token || !data.user) throw new Error('Invalid server response');
  return { token: data.token, user: data.user };
}

export async function apiRegister(
  email: string,
  password: string,
  name: string
) {
  const res = await apiFetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  const data = await parseJson<{ token?: string; user?: ApiUser; error?: string }>(
    res
  );
  if (!res.ok) {
    throw new Error(data?.error || 'Registration failed');
  }
  if (!data.token || !data.user) throw new Error('Invalid server response');
  return { token: data.token, user: data.user };
}

export async function apiMe(token: string) {
  const res = await apiFetch('/api/auth/me', { token });
  const data = await parseJson<{ user?: ApiUser; error?: string }>(res);
  if (!res.ok) throw new Error(data?.error || 'Session invalid');
  if (!data.user) throw new Error('Invalid server response');
  return data.user;
}

export async function apiGetWorkflow(token: string) {
  const res = await apiFetch('/api/workflows', { token });
  const data = await parseJson<{
    document: unknown;
    updatedAt: string | null;
    error?: string;
  }>(res);
  if (!res.ok) throw new Error(data?.error || 'Failed to load workflow');
  return data;
}

export async function apiPutWorkflow(token: string, document: object) {
  const res = await apiFetch('/api/workflows', {
    method: 'PUT',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document }),
  });
  const data = await parseJson<{ ok?: boolean; error?: string }>(res);
  if (!res.ok) throw new Error(data?.error || 'Failed to save workflow');
  return data;
}

export async function apiValidateWorkflow(token: string, document: object) {
  const res = await apiFetch('/api/workflows/validate', {
    method: 'POST',
    token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document }),
  });
  const data = await parseJson<{
    ok?: boolean;
    nodeCount?: number;
    edgeCount?: number;
    error?: string;
  }>(res);
  if (!res.ok) throw new Error(data?.error || 'Validation failed');
  return data;
}
