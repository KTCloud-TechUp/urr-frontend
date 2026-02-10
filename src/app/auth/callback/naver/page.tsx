"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NaverCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const storedState = sessionStorage.getItem("oauth_state");

      // CSRF 검증
      if (state !== storedState) {
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
        // 백엔드 API로 인증 코드 전송
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/naver/callback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, state }),
          },
        );

        if (!response.ok) {
          throw new Error("Login failed");
        }

        const data = await response.json();

        // 토큰 저장 (예: localStorage 또는 쿠키)
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          if (data.refreshToken) {
            localStorage.setItem("refreshToken", data.refreshToken);
          }
        }

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
