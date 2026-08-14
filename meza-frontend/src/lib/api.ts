const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `Request failed with status ${status}`);
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions extends RequestInit {
  skipRefresh?: boolean;
}

function extractErrorMessage(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;

  // DRF's default shape for auth-level errors: {"detail": "..."}
  if ("detail" in body && typeof (body as any).detail === "string") {
    return (body as any).detail;
  }

  // DRF's default shape for serializer validation errors:
  // {"password": ["too similar to email"], "email": ["already exists"]}
  // Flatten every field's messages into one readable string.
  const messages: string[] = [];
  for (const [field, value] of Object.entries(body as Record<string, unknown>)) {
    const fieldMessages = Array.isArray(value) ? value : [value];
    for (const msg of fieldMessages) {
      if (typeof msg === "string") {
        messages.push(field === "non_field_errors" ? msg : `${field}: ${msg}`);
      }
    }
  }

  return messages.length > 0 ? messages.join(" ") : undefined;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipRefresh, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    // Sends and receives the httpOnly auth cookies on every request.
    credentials: "include",
  });

  // Access cookie expired mid-session — try one silent refresh, then
  // retry the original request once.
  if (response.status === 401 && !skipRefresh && path !== "/auth/refresh/") {
    const refreshed = await refreshSession();
    if (refreshed) {
      return request<T>(path, { ...options, skipRefresh: true });
    }
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiError(response.status, body, extractErrorMessage(body));
  }

  return body as T;
}

async function refreshSession(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}


export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
};