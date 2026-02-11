/**
 * 소셜 로그인 유틸리티 함수
 */

/**
 * 환경 변수 검증 함수
 * 필수 환경 변수가 설정되지 않았거나 빈 값인 경우 에러 발생
 */
const validateEnvVariable = (
  value: string | undefined,
  variableName: string,
): string => {
  if (!value || value.trim() === "") {
    const errorMessage = `Environment variable ${variableName} is not set or empty`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  return value;
};

/**
 * Redirect URI 검증 함수
 * 유효한 URL 형식인지 확인하고, http(s) 프로토콜을 사용하는지 검증
 */
const validateRedirectUri = (uri: string, providerName: string): string => {
  try {
    const url = new URL(uri);
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error(`Invalid protocol: ${url.protocol}`);
    }
    return uri;
  } catch (error) {
    const errorMessage = `Invalid redirect URI for ${providerName}: ${uri}`;
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
};

// 네이버 로그인 시작
export const loginWithNaver = () => {
  try {
    const clientId = validateEnvVariable(
      process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
      "NEXT_PUBLIC_NAVER_CLIENT_ID",
    );
    const redirectUri = validateRedirectUri(
      validateEnvVariable(
        process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI,
        "NEXT_PUBLIC_NAVER_REDIRECT_URI",
      ),
      "Naver",
    );

    const state = generateRandomState();

    // 상태값을 세션에 저장 (CSRF 방지)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("oauth_state", state);
    }

    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

    window.location.href = naverAuthUrl;
  } catch (error) {
    console.error("Failed to initiate Naver login:", error);
  }
};

// 카카오 로그인 시작
export const loginWithKakao = () => {
  try {
    const clientId = validateEnvVariable(
      process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
      "NEXT_PUBLIC_KAKAO_CLIENT_ID",
    );
    const redirectUri = validateRedirectUri(
      validateEnvVariable(
        process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
        "NEXT_PUBLIC_KAKAO_REDIRECT_URI",
      ),
      "Kakao",
    );

    const state = generateRandomState();

    // 상태값을 세션에 저장 (CSRF 방지)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("oauth_state_kakao", state);
    }

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`;

    window.location.href = kakaoAuthUrl;
  } catch (error) {
    console.error("Failed to initiate Kakao login:", error);
  }
};

// 구글 로그인 시작
export const loginWithGoogle = () => {
  try {
    const clientId = validateEnvVariable(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
    );
    const redirectUri = validateRedirectUri(
      validateEnvVariable(
        process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
        "NEXT_PUBLIC_GOOGLE_REDIRECT_URI",
      ),
      "Google",
    );

    const state = generateRandomState();

    if (typeof window !== "undefined") {
      sessionStorage.setItem("oauth_state_google", state);
    }

    const scope = encodeURIComponent("openid email profile");
    const googleAuthUrl =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      "&response_type=code" +
      `&scope=${scope}` +
      "&access_type=offline" +
      "&prompt=consent" +
      `&state=${state}`;

    window.location.href = googleAuthUrl;
  } catch (error) {
    console.error("Failed to initiate Google login:", error);
  }
};

/**
 * 암호학적으로 안전한 state 생성 (CSRF 방지용)
 * crypto.getRandomValues()를 사용하여 예측 불가능한 랜덤 값 생성
 * 256비트(32바이트)의 무작위 데이터를 hex 문자열로 인코딩
 */
const generateRandomState = (): string => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};
