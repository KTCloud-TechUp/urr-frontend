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

// ─── Cross-tab token coordination (RTR 멀티탭 충돌 방지) ──────────────────────
// RTR(Refresh Token Rotation) 환경에서 여러 탭이 동시에 reissue를 호출하면
// 먼저 성공한 탭이 refreshToken을 ROTATED 처리해 다른 탭의 reissue가 401로 실패,
// 전체 세션이 강제 만료된다. localStorage 락 + BroadcastChannel로 방지한다.

const AUTH_CHANNEL_NAME = "urr:auth";
const REISSUE_LOCK_KEY = "urr:reissuing-at";
const REISSUE_LOCK_TTL_MS = 5000;

type AuthBroadcast =
  | { type: "token-refreshed"; token: string }
  | { type: "auth-failed" };

function openChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  try {
    return new BroadcastChannel(AUTH_CHANNEL_NAME);
  } catch {
    return null;
  }
}

/** 이 탭이 reissue 락을 획득했으면 true 반환. */
function acquireReissueLock(): boolean {
  try {
    const held = localStorage.getItem(REISSUE_LOCK_KEY);
    if (held && Date.now() - Number(held) < REISSUE_LOCK_TTL_MS) return false;
    localStorage.setItem(REISSUE_LOCK_KEY, String(Date.now()));
    return true;
  } catch {
    return true; // localStorage 미지원 환경에서는 진행
  }
}

function releaseReissueLock(): void {
  try { localStorage.removeItem(REISSUE_LOCK_KEY); } catch { /* noop */ }
}

function isReissueLockHeld(): boolean {
  try {
    const held = localStorage.getItem(REISSUE_LOCK_KEY);
    return !!held && Date.now() - Number(held) < REISSUE_LOCK_TTL_MS;
  } catch {
    return false;
  }
}

/** 다른 탭이 reissue 완료 후 브로드캐스트할 때까지 대기. */
function waitForTokenBroadcast(): Promise<string | null> {
  return new Promise((resolve) => {
    const ch = openChannel();
    if (!ch) { resolve(null); return; }

    const timer = setTimeout(() => {
      ch.close();
      resolve(null);
    }, REISSUE_LOCK_TTL_MS + 1000);

    ch.onmessage = (ev: MessageEvent<AuthBroadcast>) => {
      clearTimeout(timer);
      ch.close();
      resolve(ev.data.type === "token-refreshed" ? ev.data.token : null);
    };
  });
}

// ─── Same-tab in-flight queuing ────────────────────────────────────────────────

let isReissuing = false;
let reissueWaiters: Array<(token: string | null) => void> = [];

async function reissueToken(): Promise<string | null> {
  // 같은 탭: 이미 진행 중인 reissue 완료까지 대기
  if (isReissuing) {
    return new Promise((resolve) => {
      reissueWaiters.push(resolve);
    });
  }

  // 다른 탭이 락을 보유 중이면 브로드캐스트 대기
  if (isReissueLockHeld()) {
    return waitForTokenBroadcast();
  }
  if (!acquireReissueLock()) {
    return waitForTokenBroadcast();
  }

  isReissuing = true;
  const ch = openChannel();

  try {
    const res = await apiRequest<ApiBaseResponse<ReissueResponseData>>(
      "/auth/token/reissue",
      { method: "POST", service: "users" },
    );
    const newToken = res.data.data.tokens.accessToken;
    onTokenReissued?.(newToken);
    ch?.postMessage({ type: "token-refreshed", token: newToken });
    reissueWaiters.forEach((r) => r(newToken));
    return newToken;
  } catch (err) {
    // 네트워크 오류·5xx는 일시 장애이므로 로그아웃하지 않음.
    // refreshToken이 실제로 무효한 경우(401/403)에만 로그아웃.
    const isAuthError =
      err instanceof ApiError && (err.status === 401 || err.status === 403);
    if (isAuthError) {
      ch?.postMessage({ type: "auth-failed" });
      onAuthFailed?.();
    }
    reissueWaiters.forEach((r) => r(null));
    return null;
  } finally {
    isReissuing = false;
    reissueWaiters = [];
    releaseReissueLock();
    ch?.close();
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
