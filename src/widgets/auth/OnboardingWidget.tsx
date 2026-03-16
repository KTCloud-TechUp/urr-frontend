"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  AuthStep,
  IdentityStep,
  OnboardingHero,
  useOnboardingAuth,
} from "@/features/auth/onboarding";

type FlowState = "auth" | "identity";

function OnboardingWidgetInner() {
  const searchParams = useSearchParams();
  const initialStep = searchParams.get("step") === "identity" ? "identity" : "auth";
  const isSocial = initialStep === "identity";
  const [flowState, setFlowState] = useState<FlowState>(initialStep);

  const { handleAuthComplete, handleIdentityComplete } = useOnboardingAuth({
    onEmailRegister: () => setFlowState("identity"),
    isSocial,
  });

  const heroStep = flowState === "auth" ? 1 : 2;

  return (
    <div className="flex h-screen">
      {/* Left: Form panel */}
      <div className="w-1/2 h-full overflow-y-auto flex flex-col items-center justify-center px-8 py-16">
        <div
          key={flowState}
          className="w-full flex justify-center animate-in fade-in duration-300"
        >
          {flowState === "auth" && <AuthStep onComplete={handleAuthComplete} />}
          {flowState === "identity" && (
            <IdentityStep
              onComplete={handleIdentityComplete}
              onBack={() => setFlowState("auth")}
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
