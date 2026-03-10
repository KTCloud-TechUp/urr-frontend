"use client";

import { useState } from "react";
import {
  AuthStep,
  IdentityStep,
  OnboardingHero,
  useOnboardingAuth,
} from "@/features/auth/onboarding";

type FlowState = "auth" | "identity";

export default function OnboardingWidget() {
  const [flowState, setFlowState] = useState<FlowState>("auth");

  const { handleAuthComplete, handleIdentityComplete } = useOnboardingAuth({
    onEmailRegister: () => setFlowState("identity"),
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
