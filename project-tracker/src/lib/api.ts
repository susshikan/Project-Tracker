const DEFAULT_API_BASE_URL = "http://localhost:3001/api"

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? DEFAULT_API_BASE_URL

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

export type ApiFetchOptions<TBody = unknown> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  token?: string | null
  body?: TBody
  headers?: Record<string, string>
  signal?: AbortSignal
}

export async function apiFetch<TResponse, TBody = unknown>(
  path: string,
  { method = "GET", token, body, headers = {}, signal }: ApiFetchOptions<TBody> = {},
): Promise<TResponse> {
  const sanitizedPath = path.startsWith("/") ? path : `/${path}`
  const url = `${API_BASE_URL}${sanitizedPath}`

  const finalHeaders: Record<string, string> = { ...headers }
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`
  }

  const init: RequestInit = {
    method,
    headers: finalHeaders,
    signal,
  }

  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body)
    if (!finalHeaders["Content-Type"]) {
      finalHeaders["Content-Type"] = "application/json"
    }
  }

  const response = await fetch(url, init)

  if (!response.ok) {
    let errorData: unknown
    try {
      errorData = await response.json()
    } catch {
      errorData = undefined
    }

    const messageFromBody =
      typeof errorData === "object" && errorData !== null
        ? "message" in errorData && typeof (errorData as { message?: unknown }).message === "string"
          ? (errorData as { message: string }).message
          : "error" in errorData && typeof (errorData as { error?: unknown }).error === "string"
            ? (errorData as { error: string }).error
            : null
        : null

    throw new ApiError(
      messageFromBody ?? response.statusText ?? "Request failed",
      response.status,
      errorData,
    )
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  try {
    return (await response.json()) as TResponse
  } catch {
    return undefined as TResponse
  }
}
