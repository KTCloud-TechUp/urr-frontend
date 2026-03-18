// === 공통 API 응답 래퍼 ===

export interface ApiBaseResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// === 로그인/회원가입/OAuth/토큰 재발급 공통 응답 ===

export interface AuthResponseData {
  tokens: {
    accessToken: string;
    tokenType: string;
    expiresInSeconds: number;
  };
  user: {
    userId: number;
    email: string;
    nickname: string;
    role: string;
    onboardingCompleted: boolean;
    marketingConsent: boolean;
    pushConsent: boolean;
    smsConsent: boolean;
  };
  onboardingRequired: boolean;
  nextPath: string;
}

// === /api/auth/me ===

export interface MeResponseData {
  userId: number;
  email: string;
  nickname: string;
  role: string;
  onboardingCompleted: boolean;
  marketingConsent: boolean;
  pushConsent: boolean;
  smsConsent: boolean;
}

// === 프론트 auth 도메인 모델 ===
// API 응답을 변환한 결과 — UI 전반에서 사용

export interface AuthUser {
  userId: number;
  email: string;
  nickname: string;
  role: string;
  onboardingCompleted: boolean;
  marketingConsent: boolean;
  pushConsent: boolean;
  smsConsent: boolean;
}
