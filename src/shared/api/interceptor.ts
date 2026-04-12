import { apiRequest, ApiError, type ApiRequestInit, type ApiResponse } from "./client";

// Injected by useAuthStore to avoid circular imports
let onTokenReissued: ((token: string) => void) | null = null;
let onAuthFailed: (() => void) | null = null;
let onRateLimited: (() => void) | null = null;

export function registerAuthHandlers(handlers: {
  onTokenReissued: (token: string) => void;
  onAuthFailed: () => void;
  onRateLimited?: () => void;
}) {
  onTokenReissued = handlers.onTokenReissued;
  onAuthFailed = handlers.onAuthFailed;
  onRateLimited = handlers.onRateLimited ?? null;
}

/**
 * 429 Too Many Requests 수신 시 /queue 페이지로 리다이렉트.
 * window 환경에서만 동작 (SSR 안전).
 */
export function redirectToQueue() {
  if (typeof window === "undefined") return;
  const redirect = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.replace(`/queue?redirect=${redirect}`);
}

interface ReissueResponseData {
  tokens: {
    accessToken: string;
    tokenType: string;
    expiresInSeconds: number;
  };
  user: {
    userId: number;
    email: string;
    nickname: string;
    role: string;
    onboardingCompleted: boolean;
  };
  onboardingRequired: boolean;
  nextPath: string;
}

interface ApiBaseResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: T;
}

let isReissuing = false;
// Queue of resolvers waiting for reissue to complete
let reissueWaiters: Array<(token: string | null) => void> = [];

async function reissueToken(): Promise<string | null> {
  if (isReissuing) {
    // Wait for the in-flight reissue to finish
    return new Promise((resolve) => {
      reissueWaiters.push(resolve);
    });
  }

  isReissuing = true;
  try {
    const res = await apiRequest<ApiBaseResponse<ReissueResponseData>>(
      "/auth/token/reissue",
      { method: "POST", service: "users" },
    );
    const newToken = res.data.data.tokens.accessToken;
    onTokenReissued?.(newToken);
    reissueWaiters.forEach((resolve) => resolve(newToken));
    return newToken;
  } catch {
    onAuthFailed?.();
    reissueWaiters.forEach((resolve) => resolve(null));
    return null;
  } finally {
    isReissuing = false;
    reissueWaiters = [];
  }
}

/**
 * fetch wrapper that handles 401 → token reissue → retry once.
 */
export async function fetchWithAuth<T = unknown>(
  path: string,
  options: ApiRequestInit = {},
): Promise<ApiResponse<T>> {
  try {
    return await apiRequest<T>(path, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      const newToken = await reissueToken();
      if (!newToken) {
        throw err; // propagate original 401
      }
      // Retry original request — token getter now returns new token
      return await apiRequest<T>(path, options);
    }
    if (err instanceof ApiError && err.status === 429) {
      if (onRateLimited) {
        onRateLimited();
      } else {
        redirectToQueue();
      }
    }
    throw err;
  }
}
