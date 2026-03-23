# URR (우르르)

> K-POP 찐팬을 위한 공정 티켓팅 플랫폼

매크로·봇을 차단하고 팬 활동을 정량화한 멤버십 등급 시스템을 통해
찐팬에게 티켓 우선권을 제공하는 공정 티켓팅 플랫폼입니다.

URR은 티켓 예매 → 양도 → 팬 커뮤니티를 하나의 생태계로 통합합니다.

---

## 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [팀 구성](#팀-구성)
3. [기술 스택](#기술-스택)
4. [아키텍처](#아키텍처)
5. [인증 전략 — JWT + httpOnly 쿠키](#인증-전략--jwt--httponly-쿠키)
6. [프로토타입 → Next.js 마이그레이션](#프로토타입--nextjs-마이그레이션)
7. [핵심 기능](#핵심-기능)
8. [화면 구성](#화면-구성)
9. [개발 방식 — AI 에이전트 협업](#개발-방식--ai-에이전트-협업)
10. [로컬 실행](#로컬-실행)
11. [트러블슈팅](#트러블슈팅)
12. [관련 문서](#관련-문서)

---

## 프로젝트 개요

### 해결하는 문제

| 기존 문제                 | URR의 접근                                          |
| ------------------------- | --------------------------------------------------- |
| 매크로·봇이 대기열 점령   | 멤버십 등급 기반 대기열 우선순위로 자동화 접근 차단 |
| 찐팬도 티켓 구하기 어려움 | 멤버십 등급 기반 선예매 시스템                      |
| 암표·외부 양도 난무       | 플랫폼 내부 공식 양도 마켓 제공                     |
| 티켓팅·양도·커뮤니티 분산 | 단일 플랫폼 통합                                    |

### 멤버십 등급 체계

팬 활동 점수를 기반으로 등급이 상승하며 등급이 높을수록 예매 혜택이 증가합니다.

| 등급             | 조건         |   선예매 순서   | 양도 수수료 |
| ---------------- | ------------ | :-------------: | :---------: |
| Lv.4 라이트닝 🌩️ | 팬 점수 달성 |    **1순위**    |     5%      |
| Lv.3 썬더 ⚡     | 팬 점수 달성 | **2순위** (+1h) |     5%      |
| Lv.2 클라우드 ☁️ | 멤버십 가입  |    **3순위**    |     10%     |
| Lv.1 미스트 🌫️   | 회원가입     |    일반 예매    |  양도 불가  |

---

## 팀 구성

총 15명이 협업하여 개발한 프로젝트입니다.

| 역할                  | 인원 |
| --------------------- | :--: |
| 프로덕트 매니지먼트   |  1명 |
| 프로덕트 디자인       |  3명 |
| 풀스택 (프론트엔드)   |  1명 |
| 백엔드                |  2명 |
| 생성형 AI             |  2명 |
| 클라우드 네이티브     |  3명 |
| 사이버보안            |  3명 |

---

## 기술 스택

### Frontend

| 분야         | 기술                    | 선택 이유                             |
| ------------ | ----------------------- | ------------------------------------- |
| Framework    | Next.js 16 (App Router) | 서버 컴포넌트 기반 초기 렌더링 최적화 |
| Language     | TypeScript (strict)     | 도메인 타입 안전성 확보               |
| Styling      | Tailwind CSS v4         | 디자인 토큰 기반 스타일링             |
| UI           | shadcn/ui (Radix UI)    | 접근성 준수 + 커스터마이징 자유도     |
| Server State | TanStack Query v5       | API 캐싱 / 동기화 / 낙관적 업데이트   |
| Client State | Zustand                 | 최소한의 전역 상태 관리               |

### Backend

| 분야      | 기술                               |
| --------- | ---------------------------------- |
| Framework | Spring Boot                        |
| 인증      | JWT / OAuth (카카오·네이버·이메일) |
| API       | REST API                           |

### Infra

| 분야       | 기술                                              |
| ---------- | ------------------------------------------------- |
| Hosting    | S3 정적 배포 (현재) → EKS 전환 예정 (SSR 적용 후) |
| CloudFront | CDN · Lambda@Edge · WAF · 통합 라우팅             |
| DB         | RDS                                               |
| Storage    | S3                                                |

> **현재**: SSR 미적용 상태로 Next.js를 정적 빌드(Static Export)하여 S3에 배포.
> **전환 계획**: 백엔드 API 연동 완료 후 이벤트 상세·아티스트 페이지 등에 SSR을 적용하며 EKS 컨테이너 배포로 전환.

---

## 아키텍처

### Feature-Sliced Design (FSD)

도메인 중심 구조로 기능 단위의 독립성을 높이고,
대규모 프론트엔드에서 발생하는 의존성 복잡도를 줄이기 위해 채택했습니다.

```
src/
├── app/        # Next.js 라우팅 진입점
├── widgets/    # 페이지 단위 UI 블록
├── features/   # 사용자 행동 단위 기능
├── entities/   # 도메인 모델
└── shared/
    ├── api/    # fetch 클라이언트, 공통 에러 핸들링
    ├── lib/    # format.ts, constants.ts, utils.ts
    └── ui/     # shadcn 컴포넌트 (button, input, dialog …)
```

**레이어 규칙**: `app → widgets → features → entities → shared` 방향만 import 허용.

### feature 내부 구조

```
features/<domain>/<feature-name>/
├── ui/       # React 컴포넌트 (JSX + 스타일)
├── model/    # 상태 / 로직 (custom hooks)
├── api/      # API 요청 함수
└── index.ts
```

---

## 인증 전략 — JWT + httpOnly 쿠키

### 설계 원칙

티켓팅 플랫폼 특성상 결제·개인정보가 포함된 API를 다루기 때문에,
XSS 공격으로부터 토큰을 보호하는 것을 최우선 기준으로 삼았습니다.

| 방식                       | XSS 내성 |   새로고침 복원   | 선택 여부 |
| -------------------------- | :------: | :---------------: | :-------: |
| localStorage               | ❌ 취약  |      ✅ 즉시      |  미채택   |
| sessionStorage             | ❌ 취약  | ❌ 탭 닫으면 소멸 |  미채택   |
| **메모리 + httpOnly 쿠키** | ✅ 안전  | ✅ reissue로 복원 | **채택**  |

### 토큰 구조

```
Access Token  — JavaScript 메모리 (tokenStore)에만 보관
                → XSS로 탈취 불가
                → 만료: 60분 (이후 자동 재발급)

Refresh Token — httpOnly 쿠키 (백엔드가 Set-Cookie로 내려줌)
                → JS에서 접근 불가 (브라우저만 관리)
                → 만료: 7일 (이후 재로그인 필요)
                → 브라우저가 자동으로 API 요청에 첨부
```

### 세션 복원 흐름

새로고침하면 메모리의 Access Token은 사라지지만, httpOnly 쿠키의 Refresh Token은 유지됩니다.
`AuthInitializer` 컴포넌트가 앱 마운트 시 이를 자동 복원합니다.

```
브라우저 새로고침
  └─ AuthInitializer 마운트
       ├─ 1. onAuthFailed 핸들러 등록 (401 시 /onboarding 리다이렉트)
       ├─ 2. POST /api/auth/token/reissue (httpOnly 쿠키 자동 첨부)
       │     ├─ 성공 → Access Token 메모리에 저장 → 앱 렌더링
       │     └─ 실패 → ready=true (비로그인 상태로 앱 렌더링)
       └─ 3. 이후 API 401 → 자동 reissue → 원본 요청 재시도
```

### API 요청 인터셉터

모든 API 요청은 `src/shared/api/client.ts`를 통해 처리됩니다.

```
API 요청
  └─ Authorization: Bearer <Access Token> 헤더 자동 주입
       ├─ 200 → 정상 응답 반환
       └─ 401 → POST /api/auth/token/reissue
                 ├─ 성공 → 새 Access Token 저장 → 원본 요청 재시도
                 └─ 실패 → onAuthFailed() → /onboarding 리다이렉트
```

### 소셜 OAuth 플로우

```
/onboarding
  └─ [카카오/네이버 버튼 클릭]
       └─ 소셜 인가 페이지로 리다이렉트
            └─ /auth/callback/kakao (또는 /naver)
                 └─ POST /api/auth/oauth/kakao { code }
                      ├─ onboardingRequired: false → Access Token 저장 → /
                      └─ onboardingRequired: true  → /onboarding?step=identity
                                                       └─ 본인인증 완료 후
                                                            POST /api/auth/onboarding/social
```

### 관련 파일

| 파일                                       | 역할                                                        |
| ------------------------------------------ | ----------------------------------------------------------- |
| `src/shared/api/tokenStore.ts`             | 메모리 토큰 저장소 (get/set/clear)                          |
| `src/shared/api/client.ts`                 | fetch 래퍼 + 401 자동 재시도 인터셉터                       |
| `src/features/auth/ui/AuthInitializer.tsx` | 앱 마운트 시 세션 복원                                      |
| `src/features/auth/api/reissue.ts`         | `POST /api/auth/token/reissue` 호출                         |
| `src/widgets/layout/LayoutShell.tsx`       | `/onboarding`, `/auth/callback` 경로는 AuthInitializer 제외 |

---

## 프로토타입 → Next.js 마이그레이션

디자인팀이 제작한 React 프로토타입을 기반으로
프로덕션 수준의 확장성과 성능을 위해 Next.js + FSD 아키텍처로 마이그레이션했습니다.

### 전환 배경

| 항목         | Prototype       | Migration                  |
| ------------ | --------------- | -------------------------- |
| Framework    | React (Vite)    | Next.js 16                 |
| Router       | React Router v6 | App Router                 |
| Rendering    | CSR             | Server + Client Components |
| State        | useState 중심   | TanStack Query + Zustand   |
| Architecture | Flat 구조       | FSD                        |

### 주요 마이그레이션 작업

| 영역              | Before                           | After                                               |
| ----------------- | -------------------------------- | --------------------------------------------------- |
| **라우팅**        | `<Route path>` · `useNavigate()` | App Router 파일 기반 · `useRouter()` · `layout.tsx` |
| **컴포넌트 분류** | 단일 플랫 구조                   | FSD 레이어 (`entities` / `features` / `widgets`)    |
| **feature 내부**  | 없음                             | `ui/` · `model/` · `api/` 레이어 적용               |
| **이미지·에셋**   | `import img from './assets/...'` | `public/` 정적 파일 + Next.js `<Image>` 자동 최적화 |

---

## 핵심 기능

### 예매 플로우

```
실시간 대기열 → 구역 선택 → 좌석 선택 → 결제 → 예매 확인
```

- **실시간 대기열**: 폴링 기반 순번 대기. 등급별 입장 시각 차등 적용.
- **좌석 선택**: SVG 기반 인터랙티브 좌석도. 등급·가격·잔여 상태 색상 표시.
- **결제**: Toss Payments 모킹.

### 양도 마켓

- `listed` 상태만 수정·취소 가능 (마이페이지 양도 탭)
- 수정: 가격 변경 → 수수료 5% 자동 계산 표시
- 취소: 확인 다이얼로그 → 상태 `cancelled` 전환

### 멤버십 가입 플로우 (4단계)

```
아티스트 선택 → 티어 소개 → 결제 → 완료
```

---

## 화면 구성

| URL                   | 페이지          | 설명                                                     |
| --------------------- | --------------- | -------------------------------------------------------- |
| `/`                   | 홈              | 히어로 · 인기 아티스트 · 공연                            |
| `/artists`            | 아티스트 목록   | 그리드 + 검색                                            |
| `/artists/:id`        | 아티스트 상세   | 홈 / 소통 / 공연 / 양도 탭 (멤버십 게이트)               |
| `/events`             | 공연 목록       | 필터·정렬                                                |
| `/events/:id`         | 공연 상세       | 공연 정보 + 예매 진입                                    |
| `/events/:id/booking` | 예매 플로우     | 실시간 대기열 → 구역 선택 → 좌석 선택 → 결제 → 예매 확인 |
| `/membership`         | 멤버십 가입     | 4단계 플로우                                             |
| `/my-page`            | 마이페이지      | 티켓 / 멤버십 / 양도 / 설정 탭                           |
| `/onboarding`         | 로그인·회원가입 | 소셜 OAuth + 이메일                                      |
| `/search`             | 검색            | 아티스트·공연 통합 검색                                  |

---

## 개발 방식 — AI 에이전트 협업

프론트엔드 개발은 **1인 개발**로 진행되었으며, AI 에이전트를 활용해 병렬 개발 워크플로우를 구성했습니다.

### 브랜치 전략

에이전트마다 독립 브랜치를 할당해 병렬 작업 후 PR로 통합합니다.

```
dev
 ├── feat/<scope>              ← 에이전트 A
 ├── feat/<scope>              ← 에이전트 B
 └── review/merge-<a>-<b>     ← 리뷰 에이전트 (충돌 조율)
          ↓ PR (Squash merge)
         dev
          ↓ PR (Merge commit)
         main
```

- **에이전트 1개 = 브랜치 1개**: 태스크 간 코드 의존 방지
- **리뷰 에이전트**: 두 feature 브랜치의 diff를 분석해 충돌 없는 병합 코드 자동 작성
- 자세한 규칙: [`CONTRIBUTING.md`](CONTRIBUTING.md)

---

## 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 (http://localhost:3000)
npm run dev

# 빌드 검증
npm run build
```

환경변수:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL = http://localhost:8081 #https://urr.guru

#네이버 OAuth
NEXT_PUBLIC_NAVER_CLIENT_ID=
NEXT_PUBLIC_NAVER_REDIRECT_URI=http://localhost:3000/auth/callback/naver

#카카오 OAuth
NEXT_PUBLIC_KAKAO_CLIENT_ID=
NEXT_PUBLIC_KAKAO_REDIRECT_URI=http://localhost:3000/auth/callback/kakao
```

---

## 트러블슈팅

### 1. 로그인 상태에서 `/onboarding` 직접 접근 가능

**현상**

소셜 로그인으로 인증을 완료한 상태에서 브라우저 주소창에 `/onboarding`을 직접 입력하면 로그인 화면이 그대로 노출됐습니다.

**원인 분석**

이 프로젝트는 XSS 보호를 위해 Access Token을 JavaScript 메모리(`tokenStore`)에만 보관하고, Refresh Token은 httpOnly 쿠키로 백엔드가 관리합니다.

문제는 **두 계층이 서로 다른 곳에서 인증 상태를 확인**했기 때문입니다.

| 계층               | 확인 방법                                   | 문제                                                                   |
| ------------------ | ------------------------------------------- | ---------------------------------------------------------------------- |
| Next.js middleware | 서버에서 쿠키 확인                          | httpOnly `refresh_token` 쿠키가 있어야만 인식 — 없으면 비인증으로 판단 |
| OnboardingWidget   | 클라이언트에서 `tokenStore.getToken()` 확인 | 새로고침 시 메모리 초기화 → 항상 비인증으로 보임                       |

**1차 시도: `middleware.ts` 이중 쿠키 확인**

`refresh_token` (httpOnly) 또는 `is_authenticated` (일반) 중 하나라도 있으면 인증 상태로 판단해 `/onboarding` 접근을 차단하도록 구현했습니다.

```ts
const isAuthenticated =
  hasRefreshToken || request.cookies.has("is_authenticated");

if (pathname.startsWith("/onboarding") && isAuthenticated) {
  return NextResponse.redirect(new URL("/", request.url));
}
```

→ **CI/CD 빌드에서 오류가 발생해 `middleware.ts` 자체를 제거**

Next.js middleware는 Edge Runtime 환경에서 동작하기 때문에 Node.js API 사용에 제약이 있고, 로컬과 배포 환경 간 동작 차이가 발생할 수 있습니다. 빌드 오류를 해결하는 것보다 middleware 없이 클라이언트 레벨에서 방어하는 방향으로 전환했습니다.

**최종 해결: 클라이언트 이중 가드**

**1. `tokenStore` — `is_authenticated` 쿠키 동기화**

Access Token 저장/삭제 시 일반 쿠키를 함께 관리해 클라이언트에서 인증 상태를 읽을 수 있도록 합니다.

```ts
// src/shared/api/tokenStore.ts
setToken: (token: string): void => {
  accessToken = token;
  setClientCookie("is_authenticated", "1", 60 * 60 * 24); // 24h
},
clearToken: (): void => {
  accessToken = null;
  setClientCookie("is_authenticated", "", 0); // 즉시 만료
},
```

**2. `OnboardingWidget` — 마운트 시 세션 재확인**

메모리 토큰이 있으면 즉시 홈으로 리다이렉트하고, 없으면 `reissueToken()`으로 실제 세션 유효 여부를 확인합니다.

```ts
useEffect(() => {
  if (tokenStore.getToken()) {
    router.replace("/");
    return;
  }

  reissueToken().then((token) => {
    if (token) {
      tokenStore.setToken(token);
      router.replace("/");
    } else {
      setAuthChecked(true); // 비로그인 확정 → 로그인 화면 렌더링
    }
  });
}, []);
```

**결과**

| 시나리오                               | 수정 전          | 수정 후                        |
| -------------------------------------- | ---------------- | ------------------------------ |
| 로그인 후 `/onboarding` 주소 직접 입력 | 로그인 화면 노출 | 홈(`/`)으로 리다이렉트         |
| 새로고침 후 `/onboarding` 접근         | 로그인 화면 노출 | 세션 복원 후 홈으로 리다이렉트 |
| 로그아웃 후 `/onboarding` 접근         | 정상             | 정상 (쿠키 만료로 차단 안 함)  |

> **교훈**: Next.js middleware는 Edge Runtime 제약으로 인해 로컬/배포 환경 간 동작 차이가 생길 수 있습니다. 인증 가드는 서버(middleware)에만 의존하지 않고 클라이언트 컴포넌트 레벨에서도 방어 로직을 갖추는 것이 안전합니다.

---

### 2. AI 에이전트 컨텍스트 관리 — 대형 마이그레이션 세션에서의 토큰 한도 대응

**현상**

React 프로토타입을 Next.js + FSD 구조로 마이그레이션하는 과정에서, AI 에이전트를 활용해 여러 페이지를 병렬로 전환하던 중 이틀 연속으로 Claude의 일일 사용량 한도(rate limit)에 도달해 에이전트가 작업 도중 강제 중단됐습니다. 특히 컨텍스트가 긴 세션(좌석 선택 SVG 구현, 예매 플로우 마이그레이션 등)에서 반복적으로 발생했습니다.

**원인 분석**

- 큰 기능을 하나의 세션에서 처음부터 끝까지 구현하려다 보니 단일 세션의 토큰 소비가 과도하게 컸습니다.
- 작업 단위를 사전에 분리하지 않아 중단 시 재시작 비용(컨텍스트 복구)도 컸습니다.
- 여러 에이전트를 동시에 실행하면서 한도 소진 속도가 가속됐습니다.

**해결 방법**

| 변경 전                          | 변경 후                                              |
| -------------------------------- | ---------------------------------------------------- |
| 기능 전체를 하나의 세션에서 구현 | UI / 로직(hook) / API 레이어를 세션 단위로 분리      |
| 에이전트 무제한 병렬 실행        | 하루 최대 2개 에이전트 동시 실행으로 제한            |
| 컨텍스트 누적 방치               | `/compact` 명령으로 주기적 컨텍스트 압축             |
| 작업 도중 설계 변경              | 에이전트 시작 전 CLAUDE.md 기준으로 태스크 명세 완성 |

FSD 아키텍처의 레이어 분리 원칙이 이 문제 해결에 직접적으로 도움이 됐습니다. `ui/` → `model/` → `api/` 순으로 세션을 나눠도 각 레이어가 독립적이라 중단·재개가 자연스러웠습니다.

**재발 방지**

에이전트에게 태스크를 줄 때 아래 형식을 고정으로 사용합니다.

```
브랜치: feat/<scope>
기준: dev
작업 범위: [단일 레이어 또는 단일 컴포넌트로 한정]
완료 조건: npm run build 통과, PR 생성
```

범위가 불명확한 태스크는 에이전트를 시작하기 전에 직접 분해합니다.

---

## 관련 문서

| 문서                                 | 내용                                          |
| ------------------------------------ | --------------------------------------------- |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | 브랜치 전략, 커밋 규칙, AI 에이전트 작업 규칙 |
| [`CLAUDE.md`](CLAUDE.md)             | AI 에이전트용 프로젝트 컨텍스트 가이드        |
