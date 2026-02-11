/**
 * 소셜 로그인 유틸리티 함수
 */

// 네이버 로그인 시작
export const loginWithNaver = () => {
  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const redirectUri = encodeURIComponent(
    process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI || "",
  );
  const state = generateRandomState();

  // 상태값을 세션에 저장 (CSRF 방지)
  if (typeof window !== "undefined") {
    sessionStorage.setItem("oauth_state", state);
  }

  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

  window.location.href = naverAuthUrl;
};

// 카카오 로그인 시작
export const loginWithKakao = () => {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  const redirectUri = encodeURIComponent(
    process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || "",
  );
  const state = generateRandomState();

  // 상태값을 세션에 저장 (CSRF 방지)
  if (typeof window !== "undefined") {
    sessionStorage.setItem("oauth_state_kakao", state);
  }

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;

  window.location.href = kakaoAuthUrl;
};

// 구글 로그인 시작
export const loginWithGoogle = () => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = encodeURIComponent(
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "",
  );
  const state = generateRandomState();

  if (typeof window !== "undefined") {
    sessionStorage.setItem("oauth_state_google", state);
  }

  const scope = encodeURIComponent("openid email profile");
  const googleAuthUrl =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    "&response_type=code" +
    `&scope=${scope}` +
    "&access_type=offline" +
    "&prompt=consent" +
    `&state=${state}`;

  window.location.href = googleAuthUrl;
};

// 랜덤 state 생성 (CSRF 방지용)
const generateRandomState = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
