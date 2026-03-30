"use client";

import { useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { useGeneralQueueSimulation } from "@/features/booking";
import { useNavigationBlock } from "@/features/booking";

// ── Leave Confirmation Dialog ─────────────────────────
function LeaveDialog({
  onStay,
  onLeave,
}: {
  onStay: () => void;
  onLeave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onStay} />
      <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-semibold text-foreground">
          대기열을 나가시겠습니까?
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          대기열을 나가면 현재 대기순서가 초기화됩니다. 다시 접속 시 새로운
          순서를 받게 됩니다.
        </p>
        <div className="mt-5 flex gap-3 justify-end">
          <Button variant="outline" size="sm" onClick={onStay}>
            대기 유지
          </Button>
          <Button
            size="sm"
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={onLeave}
          >
            나가기
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Inner page (needs useSearchParams) ───────────────
function QueuePageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const redirectUrl = searchParams.get("redirect") || "/";
  const pageTitle = searchParams.get("title") || "";

  const { position, totalInQueue, estimatedWait, phase } =
    useGeneralQueueSimulation();

  const { showPrompt, requestLeave, cancelLeave, confirmLeave } =
    useNavigationBlock(phase === "waiting");

  // Auto-redirect on promotion
  useEffect(() => {
    if (phase !== "promoted") return;
    const timeout = setTimeout(() => {
      router.replace(redirectUrl);
    }, 800);
    return () => clearTimeout(timeout);
  }, [phase, router, redirectUrl]);

  const handleLeave = useCallback(() => {
    confirmLeave();
    router.replace("/");
  }, [confirmLeave, router]);

  const initialPosition = 4588;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((initialPosition - position) / initialPosition) * 100),
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      {/* Promoted overlay */}
      {phase === "promoted" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="text-center">
            <div className="size-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-foreground">
              접속이 완료되었습니다
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              페이지로 이동합니다...
            </p>
          </div>
        </div>
      )}

      {/* Logo */}
      <Image
        src="/logo_final.svg"
        alt="URR"
        width={40}
        height={40}
        className="h-10 w-auto mb-10"
      />

      {/* Title area */}
      <div className="text-center mb-2">
        <h1 className="text-[22px] font-bold text-foreground leading-tight">
          접속 인원이 많아 대기 중입니다.
        </h1>
        <p className="text-base font-semibold text-primary mt-1">
          조금만 기다려주세요.
        </p>
      </div>

      {/* Destination label */}
      {pageTitle && (
        <p className="text-sm text-muted-foreground mb-6">{pageTitle}</p>
      )}

      {/* Queue Info Card */}
      <div className="w-full max-w-120 bg-white border border-border rounded-xl shadow-sm p-6 mb-6">
        {/* Position */}
        <div className="text-center mb-5">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            나의 대기순서
          </p>
          <p
            key={position}
            className="text-[56px] font-bold text-foreground leading-none tabular-nums tracking-tight animate-counter-roll"
          >
            {position.toLocaleString()}
          </p>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-5">
          <div
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 size-4 rounded-full bg-primary border-2 border-white shadow-md transition-all duration-700 ease-out"
            style={{ left: `calc(${progressPercent}% - 8px)` }}
          />
        </div>

        {/* Stats */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">현재 대기인원</span>
            <span className="font-semibold text-foreground tabular-nums">
              {totalInQueue.toLocaleString()}명
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">예상 대기시간</span>
            <span className="font-semibold text-foreground">
              {estimatedWait}
            </span>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="w-full max-w-120 space-y-1.5 mb-8">
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          · 잠시만 기다려주시면, 페이지로 연결됩니다.
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          · 새로고침 하거나 재접속 하시면 대기순서가 초기화 되어 대기시간이 더
          길어집니다.
        </p>
      </div>

      {/* Leave button */}
      <Button
        variant="ghost"
        className="text-muted-foreground hover:text-foreground cursor-pointer"
        onClick={requestLeave}
      >
        대기열 나가기
      </Button>

      {/* Branding footer */}
      <div className="mt-12 w-full max-w-120 rounded-xl bg-accent/60 overflow-hidden">
        <div className="px-6 py-5 flex items-center gap-4">
          <Image
            src="/logo_final.svg"
            alt="URR"
            width={32}
            height={32}
            className="h-8 w-auto opacity-80"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">
              공정한 티켓팅의 시작, URR에서!
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              진짜 팬이 먼저, 공정하게.
            </p>
          </div>
        </div>
      </div>

      {/* Leave confirmation dialog */}
      {showPrompt && <LeaveDialog onStay={cancelLeave} onLeave={handleLeave} />}
    </div>
  );
}

// ── Page export (Suspense for useSearchParams) ────────
export default function QueuePage() {
  return (
    <Suspense>
      <QueuePageInner />
    </Suspense>
  );
}
