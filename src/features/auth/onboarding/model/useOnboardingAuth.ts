"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { tokenStore } from "@/shared/api/tokenStore";
import { login, register, socialOnboarding } from "@/features/auth/api";
import type { RegisterParams } from "@/features/auth/api";
import { buildKakaoAuthUrl } from "../api/buildKakaoAuthUrl";
import { buildNaverAuthUrl } from "../api/buildNaverAuthUrl";

export type AuthProvider = "kakao" | "naver" | "email";

interface AuthCompleteData {
  provider: AuthProvider;
  email?: string;
  password?: string;
  mode?: "login" | "register";
}

interface IdentityData {
  userName: string;
  nickname: string;
  phoneNumber: string;
  birthDate: string; // "YYYYMMDD"
  gender: "male" | "female";
}

interface UseOnboardingAuthParams {
  onEmailRegister: () => void;
  isSocial?: boolean;
}

export function useOnboardingAuth({
  onEmailRegister,
  isSocial = false,
}: UseOnboardingAuthParams) {
  const router = useRouter();
  // Store register data across steps (AuthStep → IdentityStep)
  const pendingRegisterRef = useRef<Pick<
    RegisterParams,
    "email" | "password"
  > | null>(null);

  const handleAuthComplete = useCallback(
    async (data: AuthCompleteData) => {
      // Kakao OAuth — redirect to Kakao auth page
      if (data.provider === "kakao") {
        const redirectUri = `${window.location.origin}/auth/callback/kakao`;
        window.location.href = buildKakaoAuthUrl(redirectUri);
        return;
      }

      // Naver OAuth — redirect to Naver auth page
      if (data.provider === "naver") {
        const redirectUri = `${window.location.origin}/auth/callback/naver`;
        window.location.href = buildNaverAuthUrl(redirectUri);
        return;
      }

      // Email login
      if (data.mode === "login") {
        try {
          const result = await login(data.email!, data.password!);
          tokenStore.setToken(result.tokens.accessToken);
          router.push("/");
        } catch (error) {
          console.error("Login failed", error);
        }
        return;
      }

      // Email register — save partial data, proceed to identity step
      pendingRegisterRef.current = {
        email: data.email!,
        password: data.password!,
      };
      onEmailRegister();
    },
    [router, onEmailRegister],
  );

  const handleIdentityComplete = useCallback(
    async (identityData: IdentityData) => {
      // Convert birthDate YYYYMMDD → YYYY-MM-DD
      const raw = identityData.birthDate;
      const birthDate =
        raw.length === 8
          ? `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
          : raw;

      const gender: "MALE" | "FEMALE" =
        identityData.gender === "male" ? "MALE" : "FEMALE";

      // Social OAuth flow — call social onboarding endpoint
      if (isSocial) {
        try {
          await socialOnboarding({
            nickname: identityData.nickname,
            birthDate,
            phone: identityData.phoneNumber,
            gender,
          });
          router.push("/");
        } catch (error) {
          console.error("Social onboarding failed", error);
        }
        return;
      }

      // Email register flow
      const pending = pendingRegisterRef.current;
      if (!pending) return;

      try {
        const result = await register({
          email: pending.email,
          password: pending.password,
          name: identityData.userName,
          birthDate,
          phone: identityData.phoneNumber,
          gender,
        });
        tokenStore.setToken(result.tokens.accessToken);
        router.push("/");
      } catch (error) {
        console.error("Register failed", error);
      }
    },
    [router, isSocial],
  );

  return {
    handleAuthComplete,
    handleIdentityComplete,
  };
}
