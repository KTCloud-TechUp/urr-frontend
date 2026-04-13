"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { LayoutProvider, useLayout } from "./model/useLayout";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { Footer } from "./Footer";
import { cn } from "@/shared/lib/utils";
import { AuthInitializer } from "@/features/auth/ui/AuthInitializer";
import { useCurrentUser } from "@/features/auth/model/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { tokenStore } from "@/shared/api/tokenStore";

// Pages without sidebar/topbar
const NO_SHELL_ROUTES = ["/onboarding", "/auth/callback", "/queue", "/landing", "/booking/complete"];

function OnboardingGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    if (isLoading) return;
    if (user && !user.onboardingCompleted) {
      router.replace("/onboarding?step=identity");
      return;
    }
    if (isError) {
      // fetchMe 실패 (CORS 등) — 잔존 토큰 초기화 후 랜딩으로 이동
      tokenStore.clearToken();
      queryClient.clear();
      router.replace("/landing");
    }
  }, [user, isLoading, isError, router, queryClient]);

  return <>{children}</>;
}

function ShellInner({ children }: { children: ReactNode }) {
  const { isSidebarExpanded } = useLayout();
  const pathname = usePathname();
  const isFullWidth = /^\/events\/[^/]+\/booking$/.test(pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Suspense fallback={null}>
        <AppSidebar />
      </Suspense>
      <div
        className="flex flex-1 flex-col min-w-0 transition-[margin-left] duration-250 ease-out"
        style={{ marginLeft: isSidebarExpanded ? 220 : 64 }}
      >
        <TopBar />
        <main
          className={cn(
            "flex-1",
            isFullWidth ? "overflow-hidden" : "overflow-y-auto",
          )}
        >
          <div
            className={cn(
              !isFullWidth && "px-8 pt-10 pb-6 max-w-300 mx-auto",
              isFullWidth && "h-full",
            )}
          >
            {children}
          </div>
          {!isFullWidth && (
            <>
              <div className="h-20" />
              <Footer />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const noShell = NO_SHELL_ROUTES.some((r) => pathname.startsWith(r));

  if (noShell) {
    return <>{children}</>;
  }

  return (
    <LayoutProvider>
      <AuthInitializer>
        <OnboardingGuard>
          <ShellInner>{children}</ShellInner>
        </OnboardingGuard>
      </AuthInitializer>
    </LayoutProvider>
  );
}
