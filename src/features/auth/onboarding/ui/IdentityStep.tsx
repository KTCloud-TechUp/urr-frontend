"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { formatTimer } from "@/shared/lib/format";
import {
  validateName,
  validateDob,
  validatePhone,
} from "../lib/validators";

type VerificationState =
  | "idle"
  | "sent"
  | "expired"
  | "verifying"
  | "duplicate";

interface IdentityStepProps {
  onComplete: (data: {
    userName: string;
    phoneNumber: string;
    birthDate: string;
    gender: "male" | "female";
  }) => void;
  onBack: () => void;
  identityError?: string | null;
}

export function IdentityStep({
  onComplete,
  onBack,
  identityError,
}: IdentityStepProps) {
  const [carrier, setCarrier] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [nationality, setNationality] = useState<"domestic" | "foreign" | null>(
    null,
  );
  const [phone, setPhone] = useState("");

  const [nameTouched, setNameTouched] = useState(false);
  const [dobTouched, setDobTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [sendAttempted, setSendAttempted] = useState(false);

  const [verificationState, setVerificationState] =
    useState<VerificationState>("idle");
  const [code, setCode] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

  useEffect(() => {
    if (verificationState !== "sent") return;

    const id = setInterval(() => {
      setTimerSeconds((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setVerificationState("expired");
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [verificationState]);

  const nameError = validateName(name);
  const dobError = validateDob(dob);
  const phoneError = validatePhone(phone);

  const showNameError = nameError && (nameTouched || sendAttempted);
  const showDobError = dobError && (dobTouched || sendAttempted);
  const showPhoneError = phoneError && (phoneTouched || sendAttempted);
  const showCarrierError = sendAttempted && !carrier;
  const showGenderError = sendAttempted && gender === null;
  const showNationalityError = sendAttempted && nationality === null;

  const allFieldsValid =
    !nameError &&
    name.trim().length >= 2 &&
    !dobError &&
    dob.length === 8 &&
    !phoneError &&
    phone.length >= 10 &&
    carrier &&
    gender !== null &&
    nationality !== null;

  const handleSendCode = () => {
    setSendAttempted(true);
    if (!allFieldsValid) return;
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
      // Mock: phone 01099999999 triggers duplicate account dialog
      if (phone === "01099999999") {
        setVerificationState("duplicate");
        setShowDuplicateDialog(true);
        return;
      }
      onComplete({
        userName: name,
        phoneNumber: phone,
        birthDate: dob,
        gender: gender!,
      });
    }, 1000);
  };

  const isCodeValid =
    verificationState === "sent" && code.length === 6;

  return (
    <div className="max-w-120 w-full mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-6"
      >
        <ArrowLeft size={16} />
        이전으로 돌아가기
      </button>

      <div className="flex items-center gap-3 mb-2">
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <ShieldCheck size={20} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold">본인 인증</h1>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        1인 1계정 인증으로 봇과 매크로를 방지합니다.
      </p>

      <div className="mt-8 space-y-4">
        {/* Carrier */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">통신사</label>
          <Select value={carrier} onValueChange={setCarrier}>
            <SelectTrigger
              className={cn("w-full", showCarrierError && "border-destructive")}
            >
              <SelectValue placeholder="통신사 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="skt">SKT</SelectItem>
              <SelectItem value="kt">KT</SelectItem>
              <SelectItem value="lgu">LGU+</SelectItem>
              <SelectItem value="mvno">알뜰폰</SelectItem>
            </SelectContent>
          </Select>
          {showCarrierError && (
            <p className="text-xs text-destructive mt-1.5">
              통신사를 선택해주세요
            </p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">이름</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setNameTouched(true)}
            placeholder="실명 입력"
            className={
              showNameError
                ? "border-destructive focus-visible:ring-destructive/30"
                : ""
            }
          />
          {showNameError && (
            <p className="text-xs text-destructive mt-1.5">{nameError}</p>
          )}
        </div>

        {/* DOB */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">생년월일</label>
          <Input
            value={dob}
            onChange={(e) =>
              setDob(e.target.value.replace(/\D/g, "").slice(0, 8))
            }
            onBlur={() => setDobTouched(true)}
            placeholder="YYYYMMDD"
            maxLength={8}
            inputMode="numeric"
            className={
              showDobError
                ? "border-destructive focus-visible:ring-destructive/30"
                : ""
            }
          />
          {showDobError && (
            <p className="text-xs text-destructive mt-1.5">{dobError}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">성별</label>
          <div
            className={cn(
              "flex rounded-lg border overflow-hidden",
              showGenderError ? "border-destructive" : "border-input",
            )}
          >
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
                "flex-1 py-2.5 text-sm font-medium transition-colors border-l cursor-pointer",
                showGenderError ? "border-destructive" : "border-input",
                gender === "female"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-accent",
              )}
              onClick={() => setGender("female")}
            >
              여성
            </button>
          </div>
          {showGenderError && (
            <p className="text-xs text-destructive mt-1.5">
              성별을 선택해주세요
            </p>
          )}
        </div>

        {/* Nationality */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">내/외국인</label>
          <div
            className={cn(
              "flex rounded-lg border overflow-hidden",
              showNationalityError ? "border-destructive" : "border-input",
            )}
          >
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
                "flex-1 py-2.5 text-sm font-medium transition-colors border-l cursor-pointer",
                showNationalityError ? "border-destructive" : "border-input",
                nationality === "foreign"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-accent",
              )}
              onClick={() => setNationality("foreign")}
            >
              외국인
            </button>
          </div>
          {showNationalityError && (
            <p className="text-xs text-destructive mt-1.5">
              내/외국인을 선택해주세요
            </p>
          )}
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
              onBlur={() => setPhoneTouched(true)}
              placeholder="01012345678"
              inputMode="numeric"
              className={cn(
                "flex-1",
                showPhoneError &&
                  "border-destructive focus-visible:ring-destructive/30",
              )}
            />
            <Button
              variant="outline"
              onClick={
                verificationState === "expired" ? handleResend : handleSendCode
              }
              disabled={verificationState === "verifying"}
              className="shrink-0"
            >
              {verificationState === "idle" ? "인증번호 발송" : "재발송"}
            </Button>
          </div>
          {showPhoneError && (
            <p className="text-xs text-destructive mt-1.5">{phoneError}</p>
          )}
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

      <Button
        size="lg"
        className="w-full mt-16"
        disabled={!isCodeValid}
        onClick={handleVerify}
      >
        {verificationState === "verifying" ? "확인 중..." : "다음"}
      </Button>

      {identityError && (
        <p className="text-xs text-destructive text-center mt-3">
          {identityError}
        </p>
      )}

      {/* 중복 계정 팝업 */}
      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                <ShieldCheck size={16} className="text-muted-foreground" />
              </div>
              <DialogTitle>이미 가입된 계정이 있습니다</DialogTitle>
            </div>
            <DialogDescription className="text-sm leading-relaxed pt-1">
              이 번호로 가입된 계정이 있습니다.
              <br />
              <span className="font-medium text-foreground">
                가입 경로: 카카오
              </span>
              <br />
              <br />
              기존 계정으로 로그인하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="w-full"
              onClick={() => {
                setShowDuplicateDialog(false);
                onBack();
              }}
            >
              로그인 화면으로 돌아가기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
