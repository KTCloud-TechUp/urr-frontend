const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://urr.guru";

// External getter — injected by useAuthStore to avoid circular imports
let getAccessToken: (() => string | null) | null = null;

export function registerTokenGetter(getter: () => string | null) {
  getAccessToken = getter;
}

export interface ApiRequestInit extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  ok: boolean;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiRequestInit = {},
): Promise<ApiResponse<T>> {
  const { body, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  };

  const token = getAccessToken?.();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = new ApiError(response.status, response);
    throw error;
  }

  // 204 No Content
  if (response.status === 204) {
    return { data: undefined as T, status: 204, ok: true };
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return { data: undefined as T, status: response.status, ok: true };
  }

  const data = (await response.json()) as T;
  return { data, status: response.status, ok: true };
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly response: Response,
  ) {
    super(`API error: ${status}`);
    this.name = "ApiError";
  }
}
