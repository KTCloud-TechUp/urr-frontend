# Auth 리팩토링 체크리스트

## 현재 상태 요약

| 영역            | 현황                                              |
| --------------- | ------------------------------------------------- |
| API 클라이언트  | `shared/api/` 완료 (Phase 1)                      |
| 토큰 관리       | `tokenStore.ts` 완료 (Phase 2)                    |
| auth API 타입   | `features/auth/model/types.ts` 완료 (Phase 2)     |
| TanStack Query  | 설치 + Provider + `useCurrentUser` 완료 (Phase 3) |
| AuthInitializer | LayoutShell에 적용 완료 (Phase 3)                 |
| Zustand         | 설치 완료, auth에는 사용 안 함                    |
| 인증 API 연동   | 미완료 (Phase 5)                                  |
| 온보딩 플로우   | 2단계만 구현, PRD는 8단계 (Phase 6)               |

---

## 역할 분리 원칙

| 상태          | 저장소                                     | 이유                                  |
| ------------- | ------------------------------------------ | ------------------------------------- |
| `accessToken` | module-level 변수 (`tokenStore.ts`)        | 반응형 불필요, XSS 방어               |
| `user` 데이터 | TanStack Query `['auth', 'me']`            | 서버 데이터, 캐시 관리                |
| `isLoggedIn`  | Query 결과에서 파생 (`data !== undefined`) | 별도 상태 불필요                      |
| 예매 상태머신 | Zustand                                    | 복잡한 클라이언트 전용 상태 (Phase 7) |
| 사이드바 상태 | Context + useReducer                       | 이미 구현됨                           |

> **Zustand는 auth에 사용하지 않는다.** 예매 플로우 상태머신에 아껴둔다.

---

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

## Phase 1 — 패키지 설치 + API 클라이언트 ✅

- [x] `zustand`, `@tanstack/react-query` 설치
- [x] `src/shared/api/client.ts` — fetch wrapper
- [x] `src/shared/api/interceptor.ts` — 401 → reissue → 재시도 (동시 401 큐잉)
  - [x] 토큰 재발급 응답 타입 수정 (`data.data.tokens.accessToken`)
- [x] `src/shared/api/index.ts` — barrel export

## Phase 2 — tokenStore + auth API 타입 ✅

- [x] `src/shared/api/tokenStore.ts` — module-level accessToken 관리
- [x] `src/features/auth/model/types.ts` — `ApiBaseResponse<T>`, `MeResponseData`, `AuthUser`
- [x] `src/features/auth/api/me.ts` — `GET /api/auth/me`

## Phase 3 — TanStack Query 셋업 + AuthInitializer ✅

- [x] `src/shared/lib/queryClient.ts` — QueryClient 싱글톤 (staleTime 5분, retry 1)
- [x] `src/app/providers.tsx` — `QueryClientProvider`
- [x] `src/features/auth/model/useCurrentUser.ts` — `useQuery(['auth', 'me'])`, retry: 0
- [x] `src/features/auth/ui/AuthInitializer.tsx` — 인증 초기화 + 가드 + 인터셉터 핸들러 등록
- [x] `src/app/layout.tsx` — Providers 추가
- [x] `src/widgets/layout/LayoutShell.tsx` — AuthInitializer 주입

## Phase 4 — Phase 3에서 커버됨 ✅

AuthInitializer가 LayoutShell(보호된 페이지 전용)에 적용되어 라우트 보호 완료.

## Phase 5 — 인증 API 연동 ✅

- [x] `src/features/auth/model/types.ts` 보강 — `AuthResponseData` 추가
- [x] `src/features/auth/api/login.ts` — `POST /api/auth/login`
- [x] `src/features/auth/api/register.ts` — `POST /api/auth/register`
- [x] `src/features/auth/api/logout.ts` — `POST /api/auth/logout`
- [x] `src/features/auth/api/deleteAccount.ts` — `DELETE /api/auth/me`
- [x] `src/features/auth/api/kakaoLogin.ts` — `POST /api/auth/oauth/kakao`
- [x] `src/features/auth/onboarding/api/buildKakaoAuthUrl.ts` — 카카오 OAuth URL 생성 (`startSocialLogin.ts` 교체)
- [x] `src/features/auth/onboarding/ui/AuthStep.tsx` — email/password 기반으로 수정 + 회원가입 시 이메일 필드 추가
- [x] `src/features/auth/onboarding/model/useOnboardingAuth.ts` — 실제 API 호출로 교체
  - 로그인: `login()` → `tokenStore.setToken()` → `/`
  - 회원가입: AuthStep 데이터 보관 → IdentityStep 완료 후 `register()` 호출
  - 카카오: `buildKakaoAuthUrl()` → `window.location.href` 리다이렉트
- [x] `OnboardingWidget` — `?code` 파라미터 감지 → `kakaoLogin()` 호출 + Suspense 래핑

## Phase 6 — 온보딩 플로우 완성 (8단계)

- [ ] `TermsStep` — 약관 동의
- [ ] `ArtistSelectStep` — 아티스트 선택 (1명 이상 필수)
- [ ] `MembershipIntroStep` — 등급 혜택 비교표
- [ ] `MelonLinkStep` — 멜론 연동 (선택)
- [ ] `CompleteStep` — 완료 화면
- [ ] `OnboardingWidget` — 8단계 flowState 확장

## Phase 7 — 예매 상태머신 Zustand store

- [ ] `src/features/booking/model/useBookingStore.ts`
  - `bookingState`, `selectedSeats`, `vqaAttempts` 등
  - (auth와 별개, 예매 API 연동 시점에 진행)
