const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export type ApiFetchOptions<TBody = unknown> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string | null;
  body?: TBody;
  signal?: AbortSignal;
};

export async function apiFetch<TResponse = any, TBody = unknown>(
  path: string,
  { method = "GET", token, body, signal }: ApiFetchOptions<TBody> = {},
): Promise<TResponse> {
  const url = API_BASE_URL + (path.startsWith("/") ? path : `/${path}`);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data as TResponse;
}
