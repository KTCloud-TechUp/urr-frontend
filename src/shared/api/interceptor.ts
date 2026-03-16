import { apiRequest, ApiError, type ApiRequestInit, type ApiResponse } from "./client";

// Injected by useAuthStore to avoid circular imports
let onTokenReissued: ((token: string) => void) | null = null;
let onAuthFailed: (() => void) | null = null;

export function registerAuthHandlers(handlers: {
  onTokenReissued: (token: string) => void;
  onAuthFailed: () => void;
}) {
  onTokenReissued = handlers.onTokenReissued;
  onAuthFailed = handlers.onAuthFailed;
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
      "/api/auth/token/reissue",
      { method: "POST" },
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
    throw err;
  }
}
