"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import Image from "next/image";
import { Button, Input, Checkbox } from "@/shared/ui";

type AuthMode = "login" | "register";

interface AuthStepProps {
  onComplete: (data: {
    provider: "kakao" | "naver" | "email";
    email?: string;
    password?: string;
    mode?: "login" | "register";
  }) => void;
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 1C4.58 1 1 3.79 1 7.21c0 2.17 1.44 4.08 3.62 5.18l-.93 3.4c-.08.28.25.5.49.34l4.07-2.68c.24.02.49.04.75.04 4.42 0 8-2.79 8-6.28C17 3.79 13.42 1 9 1z"
        fill="#191919"
      />
    </svg>
  );
}

function NaverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M12.13 9.59L5.61 1H1v16h4.87V9.41L12.39 17H17V1h-4.87v8.59z"
        fill="white"
      />
    </svg>
  );
}

function validateEmail(email: string): string | null {
  if (!email) return null; // don't show error for empty
  if (!email.includes("@")) return "이메일 주소에 @를 포함해주세요";
  const [local, domain] = email.split("@");
  if (!local) return "@ 앞에 내용을 입력해주세요";
  if (!domain || !domain.includes("."))
    return "올바른 이메일 형식을 입력해주세요 (예: user@example.com)";
  const [, ext] = domain.split(".");
  if (!ext) return "올바른 이메일 도메인을 입력해주세요";
  return null;
}

export function AuthStep({ onComplete }: AuthStepProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Track whether fields have been "touched" (blurred)
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  // Track submission attempt
  const [attempted, setAttempted] = useState(false);

  const emailError = validateEmail(email);
  const passwordError =
    password && password.length < 8 ? "비밀번호는 8자 이상이어야 합니다" : null;
  const confirmError =
    mode === "register" && passwordConfirm && password !== passwordConfirm
      ? "비밀번호가 일치하지 않습니다"
      : null;

  const showEmailError = emailError && (emailTouched || attempted);
  const showPasswordError = passwordError && (passwordTouched || attempted);
  const showConfirmError = confirmError && (confirmTouched || attempted);

  const isEmailValid = email.length > 0 && !emailError;
  const isPasswordValid = password.length >= 8;

  const canSubmitLogin = isEmailValid && isPasswordValid;
  const canSubmitRegister =
    isEmailValid &&
    isPasswordValid &&
    password === passwordConfirm &&
    passwordConfirm.length > 0;

  function handleSubmit() {
    setAttempted(true);

    if (mode === "login") {
      if (!canSubmitLogin) return;
      onComplete({ provider: "email", email, password, mode: "login" });
    } else {
      if (!canSubmitRegister) return;
      onComplete({ provider: "email", email, password, mode: "register" });
    }
  }

  function handleForgotPassword() {
    if (!email) {
      setEmailTouched(true);
      return;
    }
    if (emailError) {
      setEmailTouched(true);
      return;
    }
    setResetSent(true);
    setTimeout(() => setResetSent(false), 3000);
  }

  function switchMode(newMode: AuthMode) {
    setMode(newMode);
    setPassword("");
    setPasswordConfirm("");
    setEmailTouched(false);
    setPasswordTouched(false);
    setConfirmTouched(false);
    setAttempted(false);
    setResetSent(false);
  }

  return (
    <div className="max-w-[400px] w-full mx-auto flex flex-col items-center">
      <Image
        src="/logos/logo5.svg"
        alt="URR"
        width={128}
        height={64}
        className="h-16 w-auto"
        priority
      />
      <h1 className="text-2xl font-bold mt-6">
        {mode === "login" ? "우르르에 오신 것을 환영합니다" : "회원가입"}
      </h1>
      <p className="text-sm text-muted-foreground mt-2 text-center">
        {mode === "login"
          ? "K-POP 팬을 위한 공정한 티켓팅 플랫폼"
          : "계정을 만들고 공정한 티켓팅을 시작하세요"}
      </p>

      {/* Social login buttons */}
      <div className="mt-10 space-y-3 w-full">
        <button
          onClick={() => onComplete({ provider: "kakao" })}
          className="w-full h-12 rounded-lg bg-[#FEE500] text-[#191919] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#FEE500]/90 transition-colors cursor-pointer"
        >
          <KakaoIcon />
          카카오로 시작하기
        </button>

        <button
          onClick={() => onComplete({ provider: "naver" })}
          className="w-full h-12 rounded-lg bg-[#03C75A] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#03C75A]/90 transition-colors cursor-pointer"
        >
          <NaverIcon />
          네이버로 시작하기
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full mt-8">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground shrink-0">또는</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Email form */}
      <div className="mt-6 space-y-4 w-full">
        {/* Email */}
        <div>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            placeholder="이메일 주소"
            className={
              showEmailError
                ? "border-destructive focus-visible:ring-destructive/30"
                : ""
            }
          />
          {showEmailError && (
            <p className="text-xs text-destructive mt-1.5">{emailError}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            placeholder="비밀번호 (8자 이상)"
            className={
              showPasswordError
                ? "border-destructive focus-visible:ring-destructive/30"
                : ""
            }
          />
          {showPasswordError && (
            <p className="text-xs text-destructive mt-1.5">{passwordError}</p>
          )}
        </div>

        {/* Password confirm — register only */}
        {mode === "register" && (
          <div>
            <Input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              onBlur={() => setConfirmTouched(true)}
              placeholder="비밀번호 확인"
              className={
                showConfirmError
                  ? "border-destructive focus-visible:ring-destructive/30"
                  : ""
              }
            />
            {showConfirmError && (
              <p className="text-xs text-destructive mt-1.5">{confirmError}</p>
            )}
          </div>
        )}

        {/* Login mode extras: auto-login + forgot password */}
        {mode === "login" && (
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox
                checked={autoLogin}
                onCheckedChange={(v) => setAutoLogin(v === true)}
              />
              <span className="text-xs text-muted-foreground">자동 로그인</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors cursor-pointer"
            >
              비밀번호 찾기
            </button>
          </div>
        )}

        {/* Reset email sent notice */}
        {resetSent && (
          <div className="rounded-lg bg-success/10 border border-success/30 px-3 py-2.5">
            <p className="text-xs text-success font-medium">
              비밀번호 재설정 이메일이 {email}(으)로 발송되었습니다.
            </p>
          </div>
        )}

        {/* Submit button */}
        <Button
          className="w-full h-12 mt-3"
          disabled={mode === "login" ? !canSubmitLogin : !canSubmitRegister}
          onClick={handleSubmit}
        >
          <Mail size={16} />
          {mode === "login" ? "로그인" : "회원가입"}
        </Button>

        {/* Mode switch */}
        <div className="text-center pt-1">
          {mode === "login" ? (
            <p className="text-xs text-muted-foreground">
              계정이 없으신가요?{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="text-primary font-medium hover:underline underline-offset-2 cursor-pointer"
              >
                회원가입
              </button>
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-primary font-medium hover:underline underline-offset-2 cursor-pointer"
              >
                로그인
              </button>
            </p>
          )}
        </div>
      </div>

      <p className="mt-8 text-xs text-muted-foreground text-center leading-relaxed">
        서비스에 가입하면 URR의{" "}
        <button
          type="button"
          className="underline underline-offset-2 hover:text-foreground"
        >
          서비스 이용약관
        </button>{" "}
        및{" "}
        <button
          type="button"
          className="underline underline-offset-2 hover:text-foreground"
        >
          개인정보 처리방침
        </button>
        에
        <br />
        동의하는 것으로 간주합니다.
      </p>
    </div>
  );
}
