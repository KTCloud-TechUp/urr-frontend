"use client";

import {
  loginWithGoogle,
  loginWithKakao,
  loginWithNaver,
} from "@/lib/auth/socialLogin";

export default function SocialLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-105">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold text-neutral-900">URR</h1>
          <p className="text-lg font-medium text-neutral-700">
            모든 팬의 설렘,
          </p>
          <p className="text-lg font-medium text-neutral-700">URR에서</p>
        </div>

        {/* Login Buttons */}
        <div className="flex flex-col gap-3">
          {/* 구글 버튼 */}
          <button
            type="button"
            onClick={loginWithGoogle}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white text-base font-medium text-neutral-900 transition-opacity hover:opacity-90"
          >
            <span className="text-lg font-bold text-blue-600">G</span>
            <span>구글로 시작하기</span>
          </button>

          {/* 네이버 버튼 */}
          <button
            type="button"
            onClick={loginWithNaver}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-md bg-[#03C75A] text-base font-medium text-white transition-opacity hover:opacity-90"
          >
            <span className="text-lg font-bold">N</span>
            <span>네이버로 시작하기</span>
          </button>

          {/* 카카오 버튼 */}
          <button
            type="button"
            onClick={loginWithKakao}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-md bg-[#FEE500] text-base font-medium text-neutral-900 transition-opacity hover:opacity-90"
          >
            <span className="text-lg font-bold">K</span>
            <span>카카오로 시작하기</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500">
            공용 PC에서는 로그인 유지를 해제해주세요
          </p>
        </div>
      </div>
    </main>
  );
}
