# URR API 스펙

## JWT 토큰 전략

```
accessToken  → module-level 변수 (tokenStore.ts)
               — 새로고침 시 소멸, XSS로부터 안전
refreshToken → httpOnly Cookie (backend Set-Cookie)
               — credentials: "include"로 자동 첨부
```

**Silent Refresh 흐름 (새로고침 시):**

```
앱 마운트 → AuthInitializer → GET /api/auth/me (쿠키 자동 첨부)
  ├─ 200 + onboardingCompleted: true  → 정상 렌더
  ├─ 200 + onboardingCompleted: false → /onboarding 리다이렉트
  └─ 401 → interceptor → POST /api/auth/token/reissue
               ├─ 성공 → tokenStore.setToken(accessToken) → 재시도
               └─ 실패 → tokenStore.clearToken() → /onboarding 리다이렉트
```

---

## API 응답 타입

### 공통 래퍼

```ts
interface ApiBaseResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: T;
}
```

### 공통 인증 응답 데이터 (로그인/회원가입/OAuth/토큰 재발급 공통)

```ts
interface AuthResponseData {
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
  };
  onboardingRequired: boolean;
  nextPath: string;
}
```

### GET /api/auth/me

```ts
data: {
  userId: number;
  email: string;
  nickname: string;
  role: string; // 백엔드 role → 프론트 TierLevel 매핑 필요
  onboardingCompleted: boolean;
}
```

### POST /api/auth/login

```ts
body: {
  email: string;
  password: string;
}
response: ApiBaseResponse<AuthResponseData>;
```

### POST /api/auth/register

```ts
body: {
  email: string;
  password: string;
  name: string;
  email: string;
  birthDate: string; // "YYYY-MM-DD"
  phone: string;
  gender: "MALE" | "FEMALE";
}
response: ApiBaseResponse<AuthResponseData>;
```

### POST /api/auth/oauth/kakao

```ts
body: {
  code: string;
  redirectUri: string;
}
response: ApiBaseResponse<AuthResponseData>;
```

### POST /api/auth/logout

```ts
response: ApiBaseResponse<{}>;
```

### DELETE /api/auth/me

```ts
response: ApiBaseResponse<{}>;
```

---

## 카카오 OAuth 흐름

```
1. 유저 클릭 → 프론트가 카카오 OAuth URL로 리다이렉트
   https://kauth.kakao.com/oauth/authorize
     ?client_id=NEXT_PUBLIC_KAKAO_CLIENT_ID
     &redirect_uri={origin}/onboarding
     &response_type=code

2. 카카오 → /onboarding?code=xxx 리다이렉트

3. OnboardingWidget에서 useSearchParams()로 code 감지
   → POST /api/auth/oauth/kakao { code, redirectUri }

4. 백엔드 응답 → tokenStore.setToken(accessToken) → 홈 or 온보딩 진행
```

> ⚠️ 현재 `startSocialLogin.ts`는 잘못된 흐름 (백엔드에 redirectUri만 전송). Phase 5에서 완전 교체.

---

## 엔드포인트 목록 (Spring Boot)

```
# 인증 — 소셜
POST  /api/auth/oauth/kakao          ← 카카오 OAuth 로그인 (인가코드 → 토큰 발급)
POST  /api/auth/onboarding/social    ← 소셜 로그인 온보딩 완료 처리

# 인증 — ID 기반
POST  /api/auth/register             ← 회원가입 + 토큰 발급
POST  /api/auth/login                ← 로그인 + 토큰 발급

# 토큰 / 세션
POST  /api/auth/token/reissue        ← Access/Refresh 토큰 재발급
POST  /api/auth/logout               ← 로그아웃 (Refresh 토큰 무효화)

# 사용자
GET    /api/auth/me                  ← 현재 로그인 유저 정보 조회
DELETE /api/auth/me                  ← 회원 탈퇴

# 아티스트/공연
GET   /api/events
GET   /api/events/:id
GET   /api/events/artists
GET   /api/events/artists/:id

# 예매
GET   /api/ticketing/:eventId
POST  /api/ticketing/book
GET   /api/ticketing/my-tickets
GET   /api/ticketing/queue/status

# 결제
POST  /api/payments/create
POST  /api/payments/confirm
GET   /api/payments/{orderId}
POST  /api/payments/{paymentKey}/cancel

# 커뮤니티
GET   /api/community/posts
POST  /api/community/posts
POST  /api/community/posts/:id/comment
```

인증 헤더: `Authorization: Bearer <accessToken>`
401 응답 시 `/api/auth/token/reissue`로 자동 갱신 후 재시도.
