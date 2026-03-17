"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { kakaoLogin, naverLogin } from "@/features/auth/api";
import { tokenStore } from "@/shared/api/tokenStore";

type SocialProvider = "kakao" | "naver";

const loginFn = {
  kakao: kakaoLogin,
  naver: naverLogin,
} as const;

const providerLabel: Record<SocialProvider, string> = {
  kakao: "카카오",
  naver: "네이버",
};

function Spinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function SocialCallbackInner({ provider }: { provider: SocialProvider }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.replace("/onboarding");
      return;
    }

    const redirectUri = `${window.location.origin}/auth/callback/${provider}`;

    loginFn[provider](code, redirectUri)
      .then((result) => {
        tokenStore.setToken(result.tokens.accessToken);
        if (result.onboardingRequired) {
          router.replace("/onboarding?step=identity");
        } else {
          router.replace("/");
        }
      })
      .catch(() => {
        router.replace(`/onboarding?error=${provider}`);
      });
  }, [searchParams, router, provider]);

  return <Spinner />;
}

export default function SocialCallbackWidget({
  provider,
}: {
  provider: SocialProvider;
}) {
  return (
    <Suspense fallback={<Spinner />}>
      <SocialCallbackInner provider={provider} />
    </Suspense>
  );
}
