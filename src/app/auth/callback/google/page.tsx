"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { requestGoogleAuth } from "@/shared/api/auth/social";
import { persistAuthTokens } from "@/shared/lib/auth/tokenStorage";

/**
 * 로드 중 UI 컴포넌트
 */
function LoadingSpinner({ providerName }: { providerName: string }) {
  const spinnerColors: Record<string, string> = {
    일로: "border-t-yellow-400",
    구글: "border-t-blue-500",
    네이버: "border-t-neutral-900",
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

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const storedState = sessionStorage.getItem("oauth_state_google");

      // CSRF 검증: state 파라미터 확인
      if (!state || !storedState || state !== storedState) {
        sessionStorage.removeItem("oauth_state_google");
        console.error("State mismatch - possible CSRF attack");
        router.push("/login?error=invalid_state");
        return;
      }

      if (!code) {
        console.error("No authorization code received");
        sessionStorage.removeItem("oauth_state_google");
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
        sessionStorage.removeItem("oauth_state_google");
        router.push("/login?error=login_failed");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return <LoadingSpinner providerName="구글" />;
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<LoadingSpinner providerName="구글" />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
