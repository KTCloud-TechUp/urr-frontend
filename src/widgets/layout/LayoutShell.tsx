"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LayoutProvider, useLayout } from "./model/useLayout";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { Footer } from "./Footer";
import { cn } from "@/shared/lib/utils";

// Pages without sidebar/topbar
const NO_SHELL_ROUTES = ["/onboarding"];

function ShellInner({ children }: { children: ReactNode }) {
  const { isSidebarExpanded } = useLayout();
  const pathname = usePathname();
  const isFullWidth = /^\/events\/[^/]+\/booking$/.test(pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div
        className="flex flex-1 flex-col min-w-0 transition-[margin-left] duration-250 ease-out"
        style={{ marginLeft: isSidebarExpanded ? 220 : 64 }}
      >
        <TopBar />
        <main className={cn("flex-1", isFullWidth ? "overflow-hidden" : "overflow-y-auto")}>
          <div
            className={cn(
              !isFullWidth && "px-8 pt-10 pb-6 max-w-[1200px] mx-auto",
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
      <ShellInner>{children}</ShellInner>
    </LayoutProvider>
  );
}
