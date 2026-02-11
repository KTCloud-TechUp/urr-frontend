"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requestKakaoAuth } from "@/shared/api/auth/social";
import { persistAuthTokens } from "@/shared/lib/auth/tokenStorage";

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code) {
        console.error("No authorization code received");
        router.push("/login?error=no_code");
        return;
      }

      // CSRF 검증: state 파라미터 확인
      const storedState = sessionStorage.getItem("oauth_state_kakao");
      if (!state || state !== storedState) {
        console.error("State mismatch: CSRF attack detected");
        router.push("/login?error=csrf_detected");
        return;
      }

      // 검증 완료 후 상태값 삭제
      sessionStorage.removeItem("oauth_state_kakao");

      try {
        const data = await requestKakaoAuth(code, state ?? undefined);
        persistAuthTokens(data);

        // 로그인 성공 후 메인 페이지로 이동
        router.push("/");
      } catch (error) {
        console.error("Kakao login error:", error);
        router.push("/login?error=login_failed");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return null;
}

export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-yellow-400"></div>
            <p className="text-neutral-600">카카오 로그인 처리 중...</p>
          </div>
        </div>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  );
}
