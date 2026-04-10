"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  AuthStep,
  AgeGateStep,
  IdentityStep,
  GuardianIdentityStep,
  TermsStep,
  OnboardingHero,
  SignupCompleteStep,
  useOnboardingAuth,
} from "@/features/auth/onboarding";
import { tokenStore } from "@/shared/api/tokenStore";
import { reissueToken } from "@/features/auth/api/reissue";
import { fetchMe } from "@/features/auth/api/me";
import { logout } from "@/features/auth/api/logout";

type FlowState =
  | "auth"
  | "age-gate"
  | "identity"
  | "guardian-identity"
  | "terms"
  | "complete";

function OnboardingWidgetInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");

  const isSocial = stepParam === "identity";
  const rejoinToken =
    stepParam === "rejoin"
      ? (searchParams.get("rejoinToken") ?? undefined)
      : undefined;
  const socialError = searchParams.get("error") as "kakao" | "naver" | null;

  // Social new-signup → start at age-gate; rejoin → start at identity directly
  const initialStep: FlowState =
    stepParam === "rejoin"
      ? "identity"
      : stepParam === "identity"
        ? "age-gate"
        : "auth";

  const [flowState, setFlowState] = useState<FlowState>(initialStep);
  const [isMinor, setIsMinor] = useState(false);
  const [completedUserName, setCompletedUserName] = useState("");
  const [authChecked, setAuthChecked] = useState(initialStep !== "auth");

  useEffect(() => {
    if (initialStep !== "auth") return;

    if (tokenStore.getToken()) {
      fetchMe()
        .then((user) => {
          if (user.onboardingCompleted) {
            router.replace("/");
          } else {
            router.replace("/onboarding?step=identity");
          }
        })
        .catch(() => {
          // fetchMe 실패 (CORS 포함) — 잔존 토큰 초기화 후 재로그인 유도
          tokenStore.clearToken();
          setAuthChecked(true);
        });
      return;
    }

    const hasSession = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("is_authenticated=1"));
    if (!hasSession) {
      setTimeout(() => setAuthChecked(true), 0);
      return;
    }

    reissueToken().then((token) => {
      if (token) {
        tokenStore.setToken(token);
        router.replace("/");
      } else {
        setAuthChecked(true);
      }
    });
  }, [initialStep, router]);

  const handleSuccess = useCallback((userName: string) => {
    setCompletedUserName(userName);
    setFlowState("complete");
  }, []);

  const {
    handleAuthComplete,
    handleIdentityComplete,
    handleGuardianComplete,
    handleTermsComplete,
    loginError,
    identityError,
  } = useOnboardingAuth({
    onEmailRegister: () => setFlowState("age-gate"),
    onTerms: () => setFlowState("terms"),
    onSuccess: handleSuccess,
    isSocial,
    rejoinToken,
  });

  if (!authChecked) return null;

  const heroStep =
    flowState === "auth"
      ? 1
      : flowState === "age-gate" || flowState === "identity" || flowState === "guardian-identity"
        ? 2
        : flowState === "complete"
          ? 5
          : 3; // terms

  if (flowState === "complete") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-in fade-in duration-300">
          <SignupCompleteStep userName={completedUserName} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Left: Form panel */}
      <div className="w-1/2 h-full overflow-y-auto flex flex-col items-center justify-center px-8 py-16">
        <div
          key={flowState}
          className="w-full flex justify-center animate-in fade-in duration-300"
        >
          {flowState === "auth" && (
            <AuthStep
              onComplete={handleAuthComplete}
              socialError={socialError}
              loginError={loginError}
            />
          )}
          {flowState === "age-gate" && (
            <AgeGateStep
              onAdult={() => {
                setIsMinor(false);
                setFlowState("identity");
              }}
              onMinor={() => {
                setIsMinor(true);
                setFlowState("guardian-identity");
              }}
              onBack={() => {
                // 소셜 온보딩 도중 뒤로 가기 → 소셜 세션 클리어
                if (isSocial) {
                  tokenStore.clearToken();
                  logout().catch(() => {}); // httpOnly refreshToken 클리어, fire-and-forget
                }
                setFlowState("auth");
              }}
            />
          )}
          {flowState === "identity" && (
            <IdentityStep
              onComplete={handleIdentityComplete}
              onBack={() => setFlowState("age-gate")}
              identityError={identityError}
            />
          )}
          {flowState === "guardian-identity" && (
            <GuardianIdentityStep
              onComplete={() => handleGuardianComplete()}
              onBack={() => setFlowState("age-gate")}
            />
          )}
          {flowState === "terms" && (
            <TermsStep
              onComplete={handleTermsComplete}
              onBack={() =>
                setFlowState(isMinor ? "guardian-identity" : "identity")
              }
              isMinor={isMinor}
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
