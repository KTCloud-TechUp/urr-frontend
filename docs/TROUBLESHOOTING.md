# 프론트엔드 트러블슈팅

URR 프론트엔드 개발 과정에서 실제 발생한 이슈와 해결 과정을 기록합니다.

**문서 범위**: S3 정적 배포, Next.js 16 App Router, TanStack Query, JWT 인증 조합 환경

---

## 목차

### 인증 / 세션
1. [S3 배포 환경 — OAuth 콜백 후 Access Token 유실 (403)](#1-s3-배포-환경--oauth-콜백-후-access-token-유실-403)
2. [RTR 멀티탭 충돌 — 한 탭의 reissue가 전체 세션 만료시킴](#2-rtr-멀티탭-충돌--한-탭의-reissue가-전체-세션-만료시킴)
3. [소셜 로그인 후 reissue 중복 호출](#3-소셜-로그인-후-reissue-중복-호출)
4. [로그인 상태에서 /onboarding 직접 접근 차단 미흡](#4-로그인-상태에서-onboarding-직접-접근-차단-미흡)
5. [OAuth 콜백 페이지 useSearchParams Suspense boundary 누락](#5-oauth-콜백-페이지-usesearchparams-suspense-boundary-누락)
6. [온보딩 미완료 이탈 → CORS 오류 + 무한 리다이렉트 루프](#6-온보딩-미완료-이탈--cors-오류--무한-리다이렉트-루프)

### 예매 / 결제
7. [예매하기 클릭 시 모달 깜빡이고 예매 페이지 이동 실패](#7-예매하기-클릭-시-모달-깜빡이고-예매-페이지-이동-실패)
8. [티켓 선점 API 400 오류 — X-User-Id 헤더 및 타입 누락](#8-티켓-선점-api-400-오류--x-user-id-헤더-및-타입-누락)
9. [AWS 배포 환경에서 결제 confirm 중복 호출](#9-aws-배포-환경에서-결제-confirm-중복-호출)
10. [예매 완료 후 브라우저 뒤로가기로 결제 단계 재진입](#10-예매-완료-후-브라우저-뒤로가기로-결제-단계-재진입)
11. [PaymentStatus `SUCCESS` → `PAID` enum 불일치](#11-paymentstatus-success--paid-enum-불일치)

### VWR / 좌석
12. [VWR API 403 — sessionStorage 토큰 null 반환](#12-vwr-api-403--sessionstorage-토큰-null-반환)
13. [좌석 조회 URL 중복 — /shows/{id}/shows/{id} 502 오류](#13-좌석-조회-url-중복--showsidshowsid-502-오류)

### 빌드 / CI/CD
14. [output: export 빌드 실패 — 동적 라우트 generateStaticParams 누락](#14-output-export-빌드-실패--동적-라우트-generatestaticparams-누락)
15. [CD 워크플로우 오류 — export script, OIDC, SSM 파라미터](#15-cd-워크플로우-오류--export-script-oidc-ssm-파라미터)
16. [`<img>` 태그 ESLint 오류 — Next.js Image 컴포넌트 미사용](#16-img-태그-eslint-오류--nextjs-image-컴포넌트-미사용)

### UI / 기타
17. [약관 페이지 무한 로딩](#17-약관-페이지-무한-로딩)

---

## 1. S3 배포 환경 — OAuth 콜백 후 Access Token 유실 (403)

### 현상

카카오/네이버 소셜 로그인 완료 후 본인인증 단계에서 API 요청이 `403 Forbidden` 반환.
로컬 개발 환경에서는 재현되지 않고, S3+CloudFront 배포 환경에서만 발생.

### 원인

OAuth 콜백(`/auth/callback/kakao`) 처리 후 `/onboarding?step=identity`로 이동 시 CloudFront가 새 HTML 파일을 로드하면서 **전체 페이지 리로드**가 발생. JS 메모리가 초기화되며 tokenStore에 저장한 Access Token이 사라짐.

```
콜백 처리 → accessToken 메모리 저장 → router.push("/onboarding?step=identity")
  → CloudFront: 새 HTML 로드 (full page reload)
  → <script> 재실행 → tokenStore = null
  → 본인인증 API: Authorization 헤더 없음 → 403
```

SPA는 `router.push`가 히스토리만 업데이트하고 JS 메모리를 유지하지만, S3 정적 배포에서는 경로 이동 시 CloudFront가 새 HTML을 fetch해 전체 스크립트가 재실행됨.

### 해결

`tokenStore`에 sessionStorage 백업 계층 추가. 모듈 로드 시 sessionStorage에서 복원.

```ts
// src/shared/api/tokenStore.ts
let accessToken: string | null =
  typeof window !== "undefined" ? sessionStorage.getItem("at") : null;

export const tokenStore = {
  setToken: (token: string) => {
    accessToken = token;
    sessionStorage.setItem("at", token);
    setClientCookie("is_authenticated", "1", 86400);
  },
  getToken: () => accessToken,
  clearToken: () => {
    accessToken = null;
    sessionStorage.removeItem("at");
    clearClientCookie("is_authenticated");
  },
};
```

> **보안 트레이드오프**: sessionStorage는 XSS 취약점으로 탈취 가능. Refresh Token은 httpOnly 쿠키로 보호되며, Access Token 수명은 60분. EKS(SSR) 전환 시 sessionStorage 제거 가능.

---

## 2. RTR 멀티탭 충돌 — 한 탭의 reissue가 전체 세션 만료시킴

### 현상

여러 탭이 열린 상태에서 Access Token 만료 시, 일부 탭이 강제 로그아웃되는 현상.

### 원인

RTR(Refresh Token Rotation) 구조상 Refresh Token은 1회만 유효. 여러 탭이 동시에 `POST /auth/token/reissue`를 호출하면 먼저 성공한 탭이 Refresh Token을 소진시켜 다른 탭의 reissue가 401로 실패 → 세션 전체 만료.

```
탭A: reissue 요청 → 성공 → 신규 refreshToken 발급
탭B: reissue 요청 → 이전 refreshToken 전송 → 401 (이미 rotation됨) → 로그아웃
```

### 해결

`localStorage` 락(TTL 5s)으로 탭 간 reissue 단일화 + `BroadcastChannel`로 신규 토큰 전파.

```ts
// src/shared/api/interceptor.ts
const REISSUE_LOCK_KEY = "urr:reissue_lock";

async function reissueWithLock(): Promise<string | null> {
  // 락 획득 시도
  const lockAcquired = acquireLock(REISSUE_LOCK_KEY, 5000);
  if (!lockAcquired) {
    // 다른 탭이 진행 중 → BroadcastChannel에서 결과 수신 대기
    return waitForTokenBroadcast();
  }

  try {
    const res = await fetch(".../auth/token/reissue", { method: "POST", credentials: "include" });
    if (!res.ok) return null;
    const { accessToken } = await res.json();
    tokenStore.setToken(accessToken);
    broadcastToken(accessToken); // 다른 탭에 전파
    return accessToken;
  } finally {
    releaseLock(REISSUE_LOCK_KEY);
  }
}
```

네트워크 오류·5xx는 로그아웃하지 않고 null 반환으로 처리 (일시적 장애 시 세션 유지).

---

## 3. 소셜 로그인 후 reissue 중복 호출

### 현상

소셜 로그인 직후 `AuthInitializer`가 불필요하게 reissue를 재호출.

### 원인

`AuthInitializer`가 앱 초기화 시 항상 reissue를 시도하는데, 소셜 로그인 콜백에서 이미 토큰을 저장한 직후에도 동일하게 재호출.

### 해결

토큰이 이미 존재하면 reissue 스킵.

```ts
// src/features/auth/ui/AuthInitializer.tsx
useEffect(() => {
  if (tokenStore.getToken()) return; // 이미 토큰 있으면 스킵
  reissueToken().then(/* ... */);
}, []);
```

---

## 4. 로그인 상태에서 /onboarding 직접 접근 차단 미흡

### 현상

이미 로그인한 사용자가 브라우저 주소창에 `/onboarding`을 직접 입력하면 온보딩 화면이 그대로 노출.

### 원인

`middleware.ts`가 `refresh_token` 쿠키만 인증 상태로 인식. `is_authenticated` 클라이언트 쿠키는 확인하지 않아 빈틈 존재.

### 해결

1. `OnboardingWidget` 마운트 시 `reissueToken`으로 세션 확인 → 유효하면 홈으로 리다이렉트
2. `middleware.ts`에서 `is_authenticated` 쿠키도 인증 상태로 인식
3. `tokenStore.setToken/clearToken` 시 `is_authenticated` 쿠키 자동 관리

---

## 5. OAuth 콜백 페이지 useSearchParams Suspense boundary 누락

### 현상

`/auth/callback/kakao`, `/auth/callback/naver`, `/auth/callback/google` 페이지에서 빌드 경고 및 런타임 에러 발생.

### 원인

Next.js App Router에서 `useSearchParams()`는 반드시 `<Suspense>` 경계 안에서 사용해야 함. 콜백 페이지에서 `useSearchParams()`로 `code` 파라미터를 읽었는데 Suspense boundary가 없었음.

### 해결

각 콜백 페이지를 Suspense로 래핑하고, 실제 로직은 내부 컴포넌트로 분리.

```tsx
// src/app/auth/callback/kakao/page.tsx
export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <KakaoCallbackContent />
    </Suspense>
  );
}

function KakaoCallbackContent() {
  const searchParams = useSearchParams(); // Suspense 내부에서 안전하게 사용
  // ...
}
```

---

## 6. 온보딩 미완료 이탈 → CORS 오류 + 무한 리다이렉트 루프

### 현상

소셜 로그인 콜백 처리 중 브라우저 뒤로가기로 이탈하면, 이후 모든 API 요청에서 CORS 오류 발생 및 무한 리다이렉트 루프.

### 원인

두 가지 문제가 동시에 발생.

1. **온보딩 가드 부재**: 온보딩 미완료 상태로 보호된 경로 진입 시 차단 로직 없음.
2. **오류 후 토큰 미초기화**: 유효하지 않은 토큰이 tokenStore에 잔존 → 이후 모든 `/auth/me` 요청이 동일 오류 반복.

```
콜백 처리 중단 → 유효하지 않은 세션 상태
  → tokenStore에 토큰 잔존
  → 다른 페이지에서 /auth/me 호출 → 401 → reissue 시도 → 실패 → CORS 오류
  → onAuthFailed() 미호출 → 루프
```

### 해결

1. `LayoutShell`에 `OnboardingGuard` 추가 — 온보딩 미완료 사용자 자동 리다이렉트
2. 인증 오류 발생 시 `tokenStore.clearToken()` + `queryClient.clear()` 호출 필수화
3. `OnboardingWidget` 마운트 시 세션 유효성 검증 후 이상 시 토큰 초기화

---

## 7. 예매하기 클릭 시 모달 깜빡이고 예매 페이지 이동 실패

### 현상

공연 상세 페이지에서 예매하기 버튼 클릭 후:
1. 대기열 모달이 잠깐 나타났다 사라짐
2. `/events/:id/booking`으로 이동되지 않고 공연 상세 페이지로 복귀

### 원인

이벤트 상세 페이지의 `useEffect`가 `BookingGuard`보다 먼저 sessionStorage를 읽고 소비.

```
handleQueuePassed()
  → resetBooking() 호출 → phase = "idle"
  → 이벤트 상세 페이지 useEffect 발동 (phase "idle" 변경 트리거)
  → sessionStorage.getItem("urr:booking:startPhase") 읽고 삭제
  → router.push("/events/1/booking")

BookingGuard 마운트
  → sessionStorage.getItem("urr:booking:startPhase") = null (이미 소비됨)
  → 가드 실패 → router.replace("/events/1")
```

### 해결

sessionStorage 읽기 책임을 `BookingGuard`에만 집중.

- `handleQueuePassed()`에서 `resetBooking()` 제거 — sessionStorage 쓰기 후 바로 `router.push`
- `BookingGuard` 마운트 시 sessionStorage 읽기 → 삭제 → `resetBooking()` → `transitionTo` 순서로 실행
- 이벤트 상세 페이지의 booking sessionStorage 처리 `useEffect` 제거

---

## 8. 티켓 선점 API 400 오류 — X-User-Id 헤더 및 타입 누락

### 현상

좌석 선택 후 결제 진행 시 티켓 선점 API(`POST /reservations/bulk`)가 400 반환.

### 원인

1. 백엔드가 요구하는 `X-User-Id` 커스텀 헤더 미전송
2. `seatId` 등 숫자 필드를 문자열로 전달

### 해결

```ts
// src/features/booking/api/bookTicket.ts
export async function bookTicket(params: BookTicketParams) {
  return apiRequest("/api/v1/reservations/bulk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": String(params.userId), // 추가
    },
    body: JSON.stringify({
      showId: Number(params.showId),   // 숫자 타입 명시
      seatIds: params.seatIds.map(Number),
    }),
  });
}
```

---

## 9. AWS 배포 환경에서 결제 confirm 중복 호출

### 현상

AWS 배포 환경에서 결제 완료 후 `POST /reservations/confirm`을 프론트엔드가 직접 호출해 중복 처리 오류 발생.

### 원인

AWS(urr.guru) 환경에서는 Toss Payments 웹훅 → SQS → Lambda가 예약 확정을 처리. 프론트엔드가 추가로 confirm을 직접 호출하면 중복 처리.

### 해결

`NEXT_PUBLIC_API_BASE_URL`에 `localhost` 포함 여부로 환경 판단해 분기.

```ts
// src/widgets/booking/BookingCompleteWidget.tsx
const isLocal = process.env.NEXT_PUBLIC_API_BASE_URL?.includes("localhost");

if (isLocal) {
  // 로컬: SQS 없으므로 직접 confirm 호출
  await confirmReservation(orderId);
}
// AWS: SQS → Lambda가 처리하므로 프론트엔드 직접 호출 없음
```

---

## 10. 예매 완료 후 브라우저 뒤로가기로 결제 단계 재진입

### 현상

결제 완료 후 브라우저 뒤로가기 버튼을 누르면 결제 입력 단계로 돌아가 결제가 중복 시도될 수 있음.

### 원인

`router.push`로 예매 완료 페이지로 이동하면 히스토리 스택에 결제 단계가 남아 있어 뒤로가기 가능.

### 해결

예매 완료 페이지 진입 시 `router.replace`를 사용해 히스토리 스택에서 결제 단계를 제거. 추가로 `BookingGuard`에서 완료된 예매에 대한 재진입 차단.

---

## 11. PaymentStatus `SUCCESS` → `PAID` enum 불일치

### 현상

결제 완료 후 티켓 목록에서 해당 티켓의 결제 상태가 올바르게 표시되지 않음 (결제된 티켓이 미결제로 표시).

### 원인

백엔드 `PaymentStatus` enum이 `SUCCESS`에서 `PAID`로 변경됐는데 프론트엔드 타입 정의 및 UI 비교 로직이 미반영.

### 해결

```ts
// before
type PaymentStatus = "SUCCESS" | "FAILED" | "PENDING";
// ...
if (reservation.paymentStatus === "SUCCESS") { ... }

// after
type PaymentStatus = "PAID" | "FAILED" | "PENDING";
// ...
if (reservation.paymentStatus === "PAID") { ... }
```

`src/features/reservation/api/getMyReservations.ts` 타입과 `src/widgets/ticket/TicketDetailWidget.tsx` 비교 로직 동시 수정.

---

## 12. VWR API 403 — sessionStorage 토큰 null 반환

### 현상

대기열(VWR) API 호출 시 `403 Forbidden` 반환. `Authorization` 헤더가 누락된 상태로 요청 전송.

### 원인

`queue.ts`에서 `sessionStorage.getItem("at")`으로 토큰을 읽었는데, 페이지 마운트 초기 시점에 sessionStorage가 아직 채워지지 않은 경우 `null` 반환.

```ts
// ❌ 문제 코드
const token = sessionStorage.getItem("at"); // 초기화 타이밍에 따라 null 가능
```

### 해결

`tokenStore.getToken()`으로 교체. tokenStore는 sessionStorage 초기화 여부와 무관하게 모듈 로드 시 이미 복원된 메모리 변수를 반환.

```ts
// ✅ 수정 코드
// src/features/booking/api/queue.ts
const token = tokenStore.getToken(); // 메모리 변수에서 직접 읽기
```

---

## 13. 좌석 조회 URL 중복 — /shows/{id}/shows/{id} 502 오류

### 현상

좌석 조회 API 호출 시 `502 Bad Gateway` 반환.

### 원인

`getSeatsAvailability`에서 URL을 조합할 때 `eventId`와 `showId`를 모두 경로에 포함해 `/api/v1/shows/1/shows/1/seats/availability` 형태로 요청.

### 과정 및 해결

1. **PR #63**: showId만 사용하도록 수정 → `/shows/{showId}/seats/availability`
2. **PR #65**: 백엔드 `ShowController`의 실제 경로 확인 — 백엔드가 `/shows/{eventId}/shows/{showId}/seats/availability` 구조를 실제로 사용함 → PR #63 수정 원복, `eventId` 파라미터 복원

실제 백엔드 경로 확인 전에 URL 단순화를 섣불리 수정해 두 번의 커밋이 필요했던 케이스.

> **교훈**: API URL 변경 시 백엔드 컨트롤러 경로를 먼저 확인 후 수정.

---

## 14. output: export 빌드 실패 — 동적 라우트 generateStaticParams 누락

### 현상

`npm run build` 시 `/tickets/[reservationId]` 페이지에서 빌드 오류.

```
Error: Page "/tickets/[reservationId]" is missing "generateStaticParams()"
```

### 원인

Next.js `output: 'export'` 모드는 모든 동적 라우트에 `generateStaticParams`가 필요. 예매 ID는 런타임에 생성되는 UUID라 빌드 시 열거 불가능.

### 해결 과정

1. **1차 시도**: 빈 배열 반환 → Next.js 16에서 빈 배열을 "미설정"으로 처리해 동일 오류 재발생
2. **최종 해결**: 더미 placeholder 항목 1개로 빌드 요건 충족. 실제 예매 URL은 CloudFront SPA 폴백(`/index.html`)으로 처리.

```ts
// src/app/tickets/[reservationId]/page.tsx
export function generateStaticParams() {
  // 예매 ID는 런타임 UUID — 빌드 시 열거 불가.
  // CloudFront SPA 폴백이 실제 URL 처리.
  return [{ reservationId: "placeholder" }];
}
```

---

## 15. CD 워크플로우 오류 — export script, OIDC, SSM 파라미터

### 현상

GitHub Actions CD 파이프라인 실패.

### 원인 및 해결

| 문제 | 원인 | 해결 |
|------|------|------|
| `npm run export` 명령 없음 | package.json에 `export` script 미정의 | `npm run build`로 변경 |
| AWS 인증 실패 | static access key 사용, OIDC 미설정 | `role-to-assume` OIDC 방식으로 전환 |
| SSM 파라미터 참조 오류 | SSM에 S3/CloudFront 값 미등록 | workflow에 직접 값 하드코딩 |
| 빌드 시 API URL 누락 | `NEXT_PUBLIC_API_BASE_URL` 환경변수 미주입 | workflow에 `env:` 블록 추가 |

---

## 16. `<img>` 태그 ESLint 오류 — Next.js Image 컴포넌트 미사용

### 현상

`npm run build` 시 ESLint 오류로 빌드 실패.

```
Error: Using `<img>` could result in slower LCP and higher bandwidth. Please use `<Image />` from `next/image`
```

### 원인

`EventCard`, `TicketCard`, `AppSidebar`, `Footer` 등에서 HTML `<img>` 태그 직접 사용.

### 해결

전체 컴포넌트에서 `next/image`의 `<Image>` 컴포넌트로 교체. 포스터 이미지는 `fill` prop, 로고는 명시적 `width`/`height` 지정.

```tsx
// before
<img src={event.posterUrl} alt={event.title} />

// after
import Image from "next/image";
<Image src={event.posterUrl} alt={event.title} fill className="object-cover" />
```

---

## 17. 약관 페이지 무한 로딩

### 현상

푸터의 약관 링크 클릭 시 페이지가 무한 로딩 상태로 멈춤.

### 원인

약관 HTML 파일을 현재 페이지 내 `<iframe>` 또는 Next.js `router.push`로 로드하려 했을 때 페이지 전환 사이클에서 로딩이 완료되지 않음.

### 해결

약관 링크를 새 탭으로 열도록 변경.

```tsx
// src/widgets/layout/Footer.tsx
<a href="/terms-of-service.html" target="_blank" rel="noopener noreferrer">
  이용약관
</a>
```

---

## 공통 예방 체크리스트

| 카테고리 | 체크 항목 |
|----------|-----------|
| **인증** | 인증 오류 발생 시 반드시 `tokenStore.clearToken()` + `queryClient.clear()` 호출 |
| **인증** | 토큰 읽기는 항상 `tokenStore.getToken()` 사용 (`sessionStorage.getItem("at")` 직접 사용 금지) |
| **RTR** | 멀티탭 환경에서 reissue는 localStorage 락으로 단일화 |
| **API** | URL 경로 변경 전 백엔드 컨트롤러 실제 경로 확인 |
| **API** | 커스텀 헤더(`X-User-Id` 등) 및 필드 타입 백엔드 스펙과 일치 여부 확인 |
| **빌드** | 동적 라우트 추가 시 `output: export` 모드에서 `generateStaticParams` 필요 여부 확인 |
| **배포** | AWS 환경과 로컬 환경의 비즈니스 로직 분기 필요 여부 확인 (SQS, Lambda 등) |
| **Next.js** | `useSearchParams()` 사용 시 `<Suspense>` boundary 필수 |
| **라우팅** | 결제/예약처럼 뒤로가기 재진입 위험이 있는 페이지는 `router.replace` 사용 |
