"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

type VerificationState = "idle" | "sent" | "expired" | "verifying";

interface IdentityStepProps {
  onComplete: (data: {
    userName: string;
    phoneNumber: string;
    birthDate: string;
    gender: "male" | "female";
  }) => void;
  onBack: () => void;
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function IdentityStep({ onComplete, onBack }: IdentityStepProps) {
  const [carrier, setCarrier] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [nationality, setNationality] = useState<"domestic" | "foreign" | null>(
    null,
  );
  const [phone, setPhone] = useState("");

  const [verificationState, setVerificationState] =
    useState<VerificationState>("idle");
  const [code, setCode] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(180);

  useEffect(() => {
    if (verificationState !== "sent") return;

    const id = setInterval(() => {
      setTimerSeconds((prev) => {
        const newSeconds = prev - 1;
        if (newSeconds <= 0) {
          setVerificationState("expired");
          return 0;
        }
        return newSeconds;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [verificationState]);

  const canSendCode =
    phone.length >= 10 &&
    carrier &&
    name.trim() &&
    dob.length === 8 &&
    gender !== null &&
    nationality !== null;

  const handleSendCode = () => {
    setVerificationState("sent");
    setTimerSeconds(180);
    setCode("");
  };

  const handleResend = () => {
    setTimerSeconds(180);
    setVerificationState("sent");
    setCode("");
  };

  const handleVerify = () => {
    if (code.length !== 6) return;
    setVerificationState("verifying");
    setTimeout(() => {
      onComplete({
        userName: name,
        phoneNumber: phone,
        birthDate: dob,
        gender: gender!,
      });
    }, 1000);
  };

  const isCodeValid = verificationState === "sent" && code.length === 6;

  return (
    <div className="max-w-120 w-full mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-6"
      >
        <ArrowLeft size={16} />
        로그인으로 돌아가기
      </button>

      <h1 className="text-2xl font-bold">본인 인증</h1>
      <p className="text-sm text-muted-foreground mt-2">
        1인 1계정 인증으로 봇과 매크로를 방지합니다.
      </p>

      <div className="mt-8 space-y-4">
        {/* Carrier */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">통신사</label>
          <Select value={carrier} onValueChange={setCarrier}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="통신사 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="skt">SKT</SelectItem>
              <SelectItem value="kt">KT</SelectItem>
              <SelectItem value="lgu">LGU+</SelectItem>
              <SelectItem value="mvno">알뜰폰</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Name */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">이름</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="실명 입력"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">생년월일</label>
          <Input
            value={dob}
            onChange={(e) =>
              setDob(e.target.value.replace(/\D/g, "").slice(0, 8))
            }
            placeholder="YYYYMMDD"
            maxLength={8}
            inputMode="numeric"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">성별</label>
          <div className="flex rounded-lg border border-input overflow-hidden">
            <button
              type="button"
              className={cn(
                "flex-1 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                gender === "male"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-accent",
              )}
              onClick={() => setGender("male")}
            >
              남성
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 py-2.5 text-sm font-medium transition-colors border-l border-input cursor-pointer",
                gender === "female"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-accent",
              )}
              onClick={() => setGender("female")}
            >
              여성
            </button>
          </div>
        </div>

        {/* Nationality */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">내/외국인</label>
          <div className="flex rounded-lg border border-input overflow-hidden">
            <button
              type="button"
              className={cn(
                "flex-1 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                nationality === "domestic"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-accent",
              )}
              onClick={() => setNationality("domestic")}
            >
              내국인
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 py-2.5 text-sm font-medium transition-colors border-l border-input cursor-pointer",
                nationality === "foreign"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-accent",
              )}
              onClick={() => setNationality("foreign")}
            >
              외국인
            </button>
          </div>
        </div>

        {/* Phone + Send code */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            휴대폰 번호
          </label>
          <div className="flex gap-2">
            <Input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
              }
              placeholder="01012345678"
              inputMode="numeric"
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={
                verificationState === "expired" ? handleResend : handleSendCode
              }
              disabled={!canSendCode || verificationState === "verifying"}
              className="shrink-0"
            >
              {verificationState === "idle" ? "인증번호 발송" : "재발송"}
            </Button>
          </div>
        </div>

        {/* Verification code section */}
        {verificationState !== "idle" && (
          <div className="space-y-3 pt-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                인증번호
              </label>
              <div className="flex items-center gap-3">
                <Input
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="6자리 입력"
                  maxLength={6}
                  inputMode="numeric"
                  disabled={
                    verificationState === "expired" ||
                    verificationState === "verifying"
                  }
                  className="font-mono tracking-[0.3em] text-center"
                />
                <span
                  className={cn(
                    "font-mono text-sm shrink-0 w-12 text-right",
                    timerSeconds <= 30
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {formatTimer(timerSeconds)}
                </span>
              </div>
            </div>

            {verificationState === "expired" && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-destructive">
                  인증 시간이 만료되었습니다.
                </p>
                <Button variant="ghost" size="sm" onClick={handleResend}>
                  재발송
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit — always visible, disabled until code verified */}
      <Button
        size="lg"
        className="w-full mt-16"
        disabled={!isCodeValid}
        onClick={handleVerify}
      >
        {verificationState === "verifying" ? "확인 중..." : "시작하기"}
      </Button>
    </div>
  );
}
