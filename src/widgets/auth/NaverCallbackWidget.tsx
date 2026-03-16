"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { naverLogin } from "@/features/auth/api";
import { tokenStore } from "@/shared/api/tokenStore";

function Spinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function NaverCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.replace("/onboarding");
      return;
    }

    const redirectUri = `${window.location.origin}/auth/callback/naver`;

    naverLogin(code, redirectUri)
      .then((result) => {
        tokenStore.setToken(result.tokens.accessToken);
        if (result.onboardingRequired) {
          router.replace("/onboarding?step=identity");
        } else {
          router.replace("/");
        }
      })
      .catch(() => {
        setError(true);
      });
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <p className="text-sm text-muted-foreground">네이버 로그인에 실패했습니다.</p>
        <button
          onClick={() => router.replace("/onboarding")}
          className="text-sm text-primary underline cursor-pointer"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return <Spinner />;
}

export default function NaverCallbackWidget() {
  return (
    <Suspense fallback={<Spinner />}>
      <NaverCallbackInner />
    </Suspense>
  );
}
