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
import { formatTimer } from "@/shared/lib/format";

type VerificationState = "idle" | "sent" | "expired" | "verifying";

interface IdentityStepProps {
  onComplete: (data: {
    userName: string;
    nickname: string;
    phoneNumber: string;
    birthDate: string;
    gender: "male" | "female";
  }) => void;
  onBack: () => void;
}

function validateName(name: string): string | null {
  if (!name) return null;
  if (!/^[가-힣a-zA-Z\s]{2,20}$/.test(name.trim()))
    return "이름은 2~20자의 한글 또는 영문만 입력 가능합니다";
  return null;
}

function validateNickname(nickname: string): string | null {
  if (!nickname) return null;
  if (nickname.trim().length < 2) return "닉네임은 2자 이상이어야 합니다";
  if (nickname.trim().length > 20) return "닉네임은 20자 이하여야 합니다";
  if (!/^[가-힣a-zA-Z0-9]+$/.test(nickname.trim()))
    return "닉네임은 한글, 영문, 숫자만 사용 가능합니다";
  return null;
}

function validateDob(dob: string): string | null {
  if (dob.length === 0) return null;
  if (dob.length !== 8) return "생년월일 8자리를 모두 입력해주세요";

  const year = parseInt(dob.slice(0, 4), 10);
  const month = parseInt(dob.slice(4, 6), 10);
  const day = parseInt(dob.slice(6, 8), 10);

  if (month < 1 || month > 12) return "올바른 월을 입력해주세요 (01~12)";
  if (day < 1 || day > 31) return "올바른 일을 입력해주세요 (01~31)";

  // 실제 존재하는 날짜 체크
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "존재하지 않는 날짜입니다";
  }

  const today = new Date();
  if (date > today) return "미래 날짜는 입력할 수 없습니다";

  // 만 14세 이상
  const age14 = new Date(today.getFullYear() - 14, today.getMonth(), today.getDate());
  if (date > age14) return "만 14세 이상만 가입 가능합니다";

  // 너무 오래된 날짜 (130세 초과)
  const age130 = new Date(today.getFullYear() - 130, today.getMonth(), today.getDate());
  if (date < age130) return "올바른 생년월일을 입력해주세요";

  return null;
}

function validatePhone(phone: string): string | null {
  if (!phone) return null;
  if (!/^01[016789]\d{7,8}$/.test(phone))
    return "올바른 휴대폰 번호를 입력해주세요 (010, 011, 016~019)";
  return null;
}

export function IdentityStep({ onComplete, onBack }: IdentityStepProps) {
  const [carrier, setCarrier] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [nationality, setNationality] = useState<"domestic" | "foreign" | null>(
    null,
  );
  const [phone, setPhone] = useState("");

  const [nameTouched, setNameTouched] = useState(false);
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const [dobTouched, setDobTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [sendAttempted, setSendAttempted] = useState(false);

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

  const nameError = validateName(name);
  const nicknameError = validateNickname(nickname);
  const dobError = validateDob(dob);
  const phoneError = validatePhone(phone);

  const showNameError = nameError && (nameTouched || sendAttempted);
  const showNicknameError = nicknameError && (nicknameTouched || sendAttempted);
  const showDobError = dobError && (dobTouched || sendAttempted);
  const showPhoneError = phoneError && (phoneTouched || sendAttempted);

  const showCarrierError = sendAttempted && !carrier;
  const showGenderError = sendAttempted && gender === null;
  const showNationalityError = sendAttempted && nationality === null;

  const allFieldsValid =
    !nameError &&
    name.trim().length >= 2 &&
    !nicknameError &&
    nickname.trim().length >= 2 &&
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
      onComplete({
        userName: name,
        nickname,
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
            <p className="text-xs text-destructive mt-1.5">통신사를 선택해주세요</p>
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

        {/* Nickname */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">닉네임</label>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onBlur={() => setNicknameTouched(true)}
            placeholder="2~20자, 한글·영문·숫자"
            className={
              showNicknameError
                ? "border-destructive focus-visible:ring-destructive/30"
                : ""
            }
          />
          {showNicknameError && (
            <p className="text-xs text-destructive mt-1.5">{nicknameError}</p>
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
            <p className="text-xs text-destructive mt-1.5">성별을 선택해주세요</p>
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
            <p className="text-xs text-destructive mt-1.5">내/외국인을 선택해주세요</p>
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
