"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { startSocialLogin, type SocialProvider } from "../api/startSocialLogin";

export type AuthProvider = SocialProvider | "email";

interface AuthCompleteData {
  provider: AuthProvider;
  email?: string;
  password?: string;
  mode?: "login" | "register";
}

interface UseOnboardingAuthParams {
  onEmailRegister: () => void;
}

export function useOnboardingAuth({
  onEmailRegister,
}: UseOnboardingAuthParams) {
  const router = useRouter();

  const handleSocialLogin = useCallback(
    async (provider: SocialProvider) => {
      try {
        const redirectUri = `${window.location.origin}/onboarding`;
        const redirectUrl = await startSocialLogin({ provider, redirectUri });

        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }

        // Backend may set session cookie directly and return success.
        router.push("/");
      } catch (error) {
        console.error("Social login error", error);
      }
    },
    [router],
  );

  const handleAuthComplete = useCallback(
    (data: AuthCompleteData) => {
      if (data.provider !== "email") {
        void handleSocialLogin(data.provider);
        return;
      }

      if (data.mode === "login") {
        router.push("/");
        return;
      }

      onEmailRegister();
    },
    [handleSocialLogin, onEmailRegister, router],
  );

  const handleIdentityComplete = useCallback(() => {
    // Mock: create account with identity data then redirect.
    router.push("/");
  }, [router]);

  return {
    handleAuthComplete,
    handleIdentityComplete,
  };
}
