"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requestNaverAuth } from "@/shared/api/auth/social";
import { persistAuthTokens } from "@/shared/lib/auth/tokenStorage";

function NaverCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const storedState = sessionStorage.getItem("oauth_state");

      // CSRF 검증
      if (!state || !storedState || state !== storedState) {
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
        const data = await requestNaverAuth(code, state);
        persistAuthTokens(data);

        // 세션 스토리지 정리
        sessionStorage.removeItem("oauth_state");

        // 로그인 성공 후 메인 페이지로 이동
        router.push("/");
      } catch (error) {
        console.error("Naver login error:", error);
        router.push("/login?error=login_failed");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900 mx-auto"></div>
        <p className="text-neutral-600">네이버 로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function NaverCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900"></div>
            <p className="text-neutral-600">네이버 로그인 처리 중...</p>
          </div>
        </div>
      }
    >
      <NaverCallbackContent />
    </Suspense>
  );
}
