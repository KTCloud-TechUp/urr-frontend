"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requestGoogleAuth } from "@/shared/api/auth/social";
import { persistAuthTokens } from "@/shared/lib/auth/tokenStorage";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const storedState = sessionStorage.getItem("oauth_state_google");

      // state 값이 모두 null이거나 undefined일 경우 우회 방지
      if (!state || !storedState || state !== storedState) {
        // 값이 일치하지 않을 경우 저장된 상태를 초기화
        sessionStorage.removeItem("oauth_state_google");
        console.error("State mismatch - possible CSRF attack");
        router.push("/login?error=invalid_state");
        return;
      }

      if (!code) {
        console.error("No authorization code received");
        router.push("/login?error=no_code");
        return;
      }

      try {
        const data = await requestGoogleAuth(code, state);
        persistAuthTokens(data);

        sessionStorage.removeItem("oauth_state_google");
        router.push("/");
      } catch (error) {
        console.error("Google login error:", error);
        router.push("/login?error=login_failed");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-blue-500"></div>
        <p className="text-neutral-600">구글 로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-blue-500"></div>
            <p className="text-neutral-600">구글 로그인 처리 중...</p>
          </div>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
