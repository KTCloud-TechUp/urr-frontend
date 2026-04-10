"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { kakaoLogin, naverLogin } from "@/features/auth/api";
import { tokenStore } from "@/shared/api/tokenStore";

type SocialProvider = "kakao" | "naver";

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
  const queryClient = useQueryClient();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.replace("/onboarding");
      return;
    }

    const redirectUri = `${window.location.origin}/auth/callback/${provider}`;

    if (provider === "kakao") {
      kakaoLogin(code, redirectUri)
        .then((result) => {
          if ("requiresRejoinConfirmation" in result) {
            const params = new URLSearchParams({
              step: "rejoin",
              rejoinToken: result.rejoinToken,
              nickname: result.nickname,
              recoveryEligible: String(result.recoveryEligible),
            });
            router.replace(`/onboarding?${params.toString()}`);
            return;
          }
          tokenStore.clearToken();
          queryClient.clear();
          tokenStore.setToken(result.tokens.accessToken);
          router.replace(result.onboardingRequired ? "/onboarding?step=identity" : "/");
        })
        .catch(() => {
          router.replace("/onboarding?error=kakao");
        });
    } else {
      naverLogin(code, redirectUri)
        .then((result) => {
          tokenStore.clearToken();
          queryClient.clear();
          tokenStore.setToken(result.tokens.accessToken);
          router.replace(result.onboardingRequired ? "/onboarding?step=identity" : "/");
        })
        .catch(() => {
          router.replace("/onboarding?error=naver");
        });
    }
  }, [searchParams, router, provider, queryClient]);

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
