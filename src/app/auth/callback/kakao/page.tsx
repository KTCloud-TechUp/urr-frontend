"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requestKakaoAuth } from "@/shared/api/auth/social";
import { persistAuthTokens } from "@/shared/lib/auth/tokenStorage";

/**
 * 로딩 UI 컴포넌트
 */
function LoadingSpinner({ providerName }: { providerName: string }) {
  const spinnerColors: Record<string, string> = {
    kakao: "border-t-yellow-400",
    google: "border-t-blue-500",
    naver: "border-t-neutral-900",
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div
          className={`mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 ${spinnerColors[providerName]}`}
        ></div>
        <p className="text-neutral-600">{providerName} 로그인 처리 중...</p>
      </div>
    </div>
  );
}

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      // CSRF 검증: state 파라미터 확인
      const storedState = sessionStorage.getItem("oauth_state_kakao");
      if (!state || !storedState || state !== storedState) {
        sessionStorage.removeItem("oauth_state_kakao");
        console.error("State mismatch - possible CSRF attack");
        router.push("/login?error=invalid_state");
        return;
      }

      if (!code) {
        console.error("No authorization code received");
        sessionStorage.removeItem("oauth_state_kakao");
        router.push("/login?error=no_code");
        return;
      }

      try {
        const data = await requestKakaoAuth(code, state ?? undefined);
        persistAuthTokens(data);
        sessionStorage.removeItem("oauth_state_kakao");
        router.push("/");
      } catch (error) {
        console.error("Kakao login error:", error);
        sessionStorage.removeItem("oauth_state_kakao");
        router.push("/login?error=login_failed");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return <LoadingSpinner providerName="카카오" />;
}

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<LoadingSpinner providerName="카카오" />}>
      <KakaoCallbackContent />
    </Suspense>
  );
}
