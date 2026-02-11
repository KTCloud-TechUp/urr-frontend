import { SocialAuthResponse } from "@/shared/api/auth/social";

/**
 * 인증 토큰 저장 함수
 *
 * 보안 주의사항:
 * - refreshToken은 서버가 HttpOnly, Secure 쿠키로 설정해야 함 (클라이언트에서 접근 불가)
 * - accessToken은 sessionStorage에 저장하여 XSS 공격에 덜 취약하게 함
 * - localStorage 사용 시 페이지 닫아도 토큰이 유지되어 노출 시간 증가
 *
 * @param tokens OAuth 응답 토큰
 */
export const persistAuthTokens = (tokens: SocialAuthResponse) => {
  const { accessToken, refreshToken } = tokens;

  // accessToken은 sessionStorage에 저장 (브라우저 탭 닫으면 자동 삭제)
  if (accessToken) {
    sessionStorage.setItem("accessToken", accessToken);
  }

  // refreshToken은 서버에서 HttpOnly, Secure 쿠키로 자동 설정되므로 클라이언트에서 저장하지 않음
  if (refreshToken) {
    console.warn(
      "Refresh token should be managed by server as HttpOnly cookie, not stored in localStorage",
    );
  }
};
