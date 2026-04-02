"use client";

import { ArrowLeft, User, Users } from "lucide-react";

interface AgeGateStepProps {
  onAdult: () => void;
  onMinor: () => void;
  onBack: () => void;
}

export function AgeGateStep({ onAdult, onMinor, onBack }: AgeGateStepProps) {
  return (
    <div className="max-w-[480px] w-full mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-6"
      >
        <ArrowLeft size={16} />
        로그인으로 돌아가기
      </button>

      <h1 className="text-2xl font-bold">나이 확인</h1>
      <p className="text-sm text-muted-foreground mt-2 mb-10">
        가입 절차를 안내해 드리기 위해 나이를 확인합니다.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* 14세 이상 */}
        <button
          type="button"
          onClick={onAdult}
          className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-border bg-background p-8 text-center transition-all duration-150 hover:border-primary hover:bg-primary/5 cursor-pointer"
        >
          <div className="size-14 rounded-full bg-muted flex items-center justify-center transition-colors group-hover:bg-primary/10">
            <User
              size={28}
              className="text-muted-foreground transition-colors group-hover:text-primary"
            />
          </div>
          <div>
            <p className="text-base font-semibold">만 14세 이상</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              직접 본인인증을
              <br />
              진행합니다
            </p>
          </div>
        </button>

        {/* 14세 미만 */}
        <button
          type="button"
          onClick={onMinor}
          className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-border bg-background p-8 text-center transition-all duration-150 hover:border-amber-500 hover:bg-amber-50 cursor-pointer"
        >
          <div className="size-14 rounded-full bg-muted flex items-center justify-center transition-colors group-hover:bg-amber-100">
            <Users
              size={28}
              className="text-muted-foreground transition-colors group-hover:text-amber-600"
            />
          </div>
          <div>
            <p className="text-base font-semibold">만 14세 미만</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              보호자 동의 후
              <br />
              가입이 가능합니다
            </p>
          </div>
        </button>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-6">
        정보통신망법에 따라 만 14세 미만은 법정대리인의 동의가 필요합니다.
      </p>
    </div>
  );
}
