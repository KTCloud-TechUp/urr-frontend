"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  AuthStep,
  IdentityStep,
  OnboardingHero,
  useOnboardingAuth,
} from "@/features/auth/onboarding";
import { tokenStore } from "@/shared/api/tokenStore";
import { reissueToken } from "@/features/auth/api/reissue";

type FlowState = "auth" | "identity";

function OnboardingWidgetInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStep = searchParams.get("step") === "identity" ? "identity" : "auth";
  const isSocial = initialStep === "identity";
  const socialError = searchParams.get("error") as "kakao" | "naver" | null;
  const [flowState, setFlowState] = useState<FlowState>(initialStep);
  // identity step은 소셜 신규가입 플로우 — 체크 불필요
  const [authChecked, setAuthChecked] = useState(initialStep === "identity");

  useEffect(() => {
    if (initialStep !== "auth") return;

    // 메모리에 토큰이 있으면 이미 로그인 상태
    if (tokenStore.getToken()) {
      router.replace("/");
      return;
    }

    // is_authenticated 쿠키가 없으면 로그아웃/탈퇴 상태 — reissue 스킵
    const hasSession = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("is_authenticated=1"));
    if (!hasSession) {
      setTimeout(() => setAuthChecked(true), 0);
      return;
    }

    // 세션 복원 시도 (refresh_token 쿠키 유효 여부 확인)
    reissueToken().then((token) => {
      if (token) {
        tokenStore.setToken(token);
        router.replace("/");
      } else {
        setAuthChecked(true);
      }
    });
  }, [initialStep, router]);

  const { handleAuthComplete, handleIdentityComplete, loginError, identityError } = useOnboardingAuth({
    onEmailRegister: () => setFlowState("identity"),
    isSocial,
  });

  if (!authChecked) return null;

  const heroStep = flowState === "auth" ? 1 : 2;

  return (
    <div className="flex h-screen">
      {/* Left: Form panel */}
      <div className="w-1/2 h-full overflow-y-auto flex flex-col items-center justify-center px-8 py-16">
        <div
          key={flowState}
          className="w-full flex justify-center animate-in fade-in duration-300"
        >
          {flowState === "auth" && <AuthStep onComplete={handleAuthComplete} socialError={socialError} loginError={loginError} />}
          {flowState === "identity" && (
            <IdentityStep
              onComplete={handleIdentityComplete}
              onBack={() => setFlowState("auth")}
              identityError={identityError}
            />
          )}
        </div>
      </div>

      {/* Right: Marketing hero panel */}
      <div className="w-1/2 h-full">
        <OnboardingHero step={heroStep} />
      </div>
    </div>
  );
}

export default function OnboardingWidget() {
  return (
    <Suspense>
      <OnboardingWidgetInner />
    </Suspense>
  );
}
