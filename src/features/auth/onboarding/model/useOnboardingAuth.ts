"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { tokenStore } from "@/shared/api/tokenStore";
import { login, register, socialOnboarding, kakaoRejoin } from "@/features/auth/api";
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
  onSuccess?: (userName: string) => void;
  isSocial?: boolean;
  rejoinToken?: string;
}

export function useOnboardingAuth({
  onEmailRegister,
  onSuccess,
  isSocial = false,
  rejoinToken,
}: UseOnboardingAuthParams) {
  const router = useRouter();
  const pendingRegisterRef = useRef<Pick<
    RegisterParams,
    "email" | "password"
  > | null>(null);

  const [loginError, setLoginError] = useState<string | null>(null);
  const [identityError, setIdentityError] = useState<string | null>(null);

  const handleAuthComplete = async (data: AuthCompleteData) => {
    if (data.provider === "kakao") {
      const redirectUri = `${window.location.origin}/auth/callback/kakao`;
      window.location.href = buildKakaoAuthUrl(redirectUri);
      return;
    }

    if (data.provider === "naver") {
      const redirectUri = `${window.location.origin}/auth/callback/naver`;
      window.location.href = buildNaverAuthUrl(redirectUri);
      return;
    }

    if (data.mode === "login") {
      setLoginError(null);
      try {
        const result = await login(data.email!, data.password!);
        tokenStore.setToken(result.tokens.accessToken);
        router.push("/");
      } catch {
        setLoginError("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
      return;
    }

    // Email register — save partial data, proceed to identity step
    pendingRegisterRef.current = {
      email: data.email!,
      password: data.password!,
    };
    onEmailRegister();
  };

  const handleIdentityComplete = async (identityData: IdentityData) => {
    const raw = identityData.birthDate;
    const birthDate =
      raw.length === 8
        ? `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
        : raw;

    const gender: "MALE" | "FEMALE" =
      identityData.gender === "male" ? "MALE" : "FEMALE";

    setIdentityError(null);

    if (rejoinToken) {
      try {
        const result = await kakaoRejoin(rejoinToken, true);
        tokenStore.setToken(result.tokens.accessToken);
        if (onSuccess) {
          onSuccess(identityData.nickname);
        } else {
          router.push("/");
        }
      } catch {
        setIdentityError("재가입 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      return;
    }

    if (isSocial) {
      try {
        await socialOnboarding({
          nickname: identityData.nickname,
          birthDate,
          phone: identityData.phoneNumber,
          gender,
        });
        if (onSuccess) {
          onSuccess(identityData.nickname);
        } else {
          router.push("/");
        }
      } catch {
        setIdentityError("온보딩 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      return;
    }

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
      if (onSuccess) {
        onSuccess(identityData.userName);
      } else {
        router.push("/");
      }
    } catch {
      setIdentityError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return {
    handleAuthComplete,
    handleIdentityComplete,
    loginError,
    identityError,
  };
}
