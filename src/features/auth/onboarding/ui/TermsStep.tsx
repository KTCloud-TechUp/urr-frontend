"use client";

import { useState } from "react";
import { ArrowLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { Button, Checkbox } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

interface TermsStepProps {
  onComplete: () => void;
  onBack: () => void;
  isMinor?: boolean;
}

interface TermItem {
  id: string;
  required: boolean;
  label: string;
  description?: string;
}

const TERMS: TermItem[] = [
  {
    id: "service",
    required: true,
    label: "서비스 이용약관 동의",
    description: "우르르 서비스 이용에 관한 기본 약관",
  },
  {
    id: "privacy",
    required: true,
    label: "개인정보 수집 및 이용 동의",
    description: "본인인증 및 서비스 제공을 위한 개인정보 처리 방침",
  },
  {
    id: "marketing",
    required: false,
    label: "마케팅 정보 수신 동의",
    description: "공연 오픈 알림, 혜택 및 이벤트 안내 수신 (선택)",
  },
];

export function TermsStep({
  onComplete,
  onBack,
  isMinor = false,
}: TermsStepProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({
    service: false,
    privacy: false,
    marketing: false,
    guardianConsent: false,
  });

  const allRequired = TERMS.filter((t) => t.required).every(
    (t) => checked[t.id],
  );
  const guardianConsentMet = !isMinor || checked.guardianConsent;
  const canSubmit = allRequired && guardianConsentMet;

  const allChecked =
    TERMS.every((t) => checked[t.id]) && (!isMinor || checked.guardianConsent);

  const handleToggleAll = (value: boolean) => {
    const next: Record<string, boolean> = {};
    TERMS.forEach((t) => {
      next[t.id] = value;
    });
    if (isMinor) next.guardianConsent = value;
    setChecked(next);
  };

  const handleToggle = (id: string, value: boolean) => {
    setChecked((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="max-w-[480px] w-full mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-6"
      >
        <ArrowLeft size={16} />
        이전으로 돌아가기
      </button>

      <h1 className="text-2xl font-bold">약관 동의</h1>
      <p className="text-sm text-muted-foreground mt-2 mb-8">
        서비스 이용을 위한 약관에 동의해 주세요.
      </p>

      <div className="space-y-3">
        {/* 모두 동의 */}
        <div
          className="flex items-center gap-3 py-3.5 px-4 rounded-xl bg-muted/60 border border-border cursor-pointer"
          onClick={() => handleToggleAll(!allChecked)}
        >
          <Checkbox
            id="all"
            checked={allChecked}
            onCheckedChange={(v) => handleToggleAll(!!v)}
            className="pointer-events-none"
          />
          <label
            htmlFor="all"
            className="text-sm font-semibold cursor-pointer select-none flex-1"
          >
            모두 동의합니다
          </label>
        </div>

        <div className="h-px bg-border" />

        {/* 개별 약관 */}
        {TERMS.map((term) => (
          <div key={term.id} className="flex items-start gap-3 py-2 px-1">
            <Checkbox
              id={term.id}
              checked={!!checked[term.id]}
              onCheckedChange={(v) => handleToggle(term.id, !!v)}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <label
                htmlFor={term.id}
                className="text-sm font-medium cursor-pointer select-none flex items-center gap-1.5"
              >
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded font-medium",
                    term.required
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {term.required ? "필수" : "선택"}
                </span>
                {term.label}
              </label>
              {term.description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {term.description}
                </p>
              )}
            </div>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        ))}

        {/* 미성년자 보호자 동의 항목 */}
        {isMinor && (
          <>
            <div className="h-px bg-border" />
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={16} className="text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  법정대리인 동의 확인
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="guardianConsent"
                  checked={!!checked.guardianConsent}
                  onCheckedChange={(v) => handleToggle("guardianConsent", !!v)}
                  className="mt-0.5"
                />
                <label
                  htmlFor="guardianConsent"
                  className="text-sm cursor-pointer select-none text-foreground leading-relaxed"
                >
                  <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-primary/10 text-primary mr-1.5">
                    필수
                  </span>
                  법정대리인(보호자)이 위 약관 내용을 확인하였으며, 미성년자의
                  URR 서비스 가입에 동의합니다.
                </label>
              </div>
            </div>
          </>
        )}
      </div>

      <Button
        size="lg"
        className="w-full mt-10"
        disabled={!canSubmit}
        onClick={onComplete}
      >
        동의하고 가입하기
      </Button>
    </div>
  );
}
