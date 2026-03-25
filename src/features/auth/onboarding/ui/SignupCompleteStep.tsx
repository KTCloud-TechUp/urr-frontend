"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/ui";
import { TierBadge } from "@/entities/user";

interface SignupCompleteStepProps {
  userName: string;
}

export function SignupCompleteStep({ userName }: SignupCompleteStepProps) {
  const router = useRouter();

  return (
    <div className="max-w-[400px] w-full mx-auto flex flex-col items-center text-center">
      <div className="size-16 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle2 size={28} className="text-green-600" />
      </div>

      <h1 className="text-2xl font-bold mt-6">가입 완료!</h1>
      <p className="text-sm text-muted-foreground mt-2">
        {userName}님, URR에 오신 것을 환영합니다
      </p>

      <div className="mt-8 w-full rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-center gap-2">
          <TierBadge tier="mist" size="sm" />
          <span className="text-sm font-medium">Lv.1 미스트 등급</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          아티스트 멤버십에 가입하면 클라우드 등급으로 업그레이드됩니다.
          <br />
          멜론 연동 시 더 높은 등급을 받을 수 있어요!
        </p>
      </div>

      <Button
        size="lg"
        className="w-full mt-10"
        onClick={() => router.push("/")}
      >
        시작하기
      </Button>
    </div>
  );
}
