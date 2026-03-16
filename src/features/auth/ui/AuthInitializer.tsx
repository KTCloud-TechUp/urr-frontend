"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { registerAuthHandlers, tokenStore } from "@/shared/api";
import { reissueToken } from "../api/reissue";

function Spinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export function AuthInitializer({ children }: { children: ReactNode }) {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 핸들러 등록 — reissueToken 호출 전에 먼저 등록
    registerAuthHandlers({
      onTokenReissued: (token) => tokenStore.setToken(token),
      onAuthFailed: () => {
        tokenStore.clearToken();
        routerRef.current.replace("/onboarding");
      },
    });

    // 이미 토큰이 있으면 (소셜 로그인 직후 등) reissue 스킵
    if (tokenStore.getToken()) {
      setReady(true);
      return;
    }

    // 새로고침 시 httpOnly 쿠키로 세션 복원
    reissueToken().then((token) => {
      if (token) {
        tokenStore.setToken(token);
      }
      // 토큰 없어도 ready=true — 이후 API 401 시 onAuthFailed가 리다이렉트 처리
      setReady(true);
    });
  }, []);

  if (!ready) return <Spinner />;

  return <>{children}</>;
}
