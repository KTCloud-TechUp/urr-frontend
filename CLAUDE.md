# URR (우르르) — AI 작업 가이드

## 프로젝트 한 줄 요약

K-POP 찐팬을 위한 공정 티켓팅 플랫폼. 티켓팅 → 양도 → 커뮤니티를 하나의 생태계로 연결. 매크로·봇 차단, 멤버십 등급으로 팬 활동을 정량화해 티켓 우선권 부여.

---

## 기술 스택

| 분야         | 기술                       | 비고                      |
| ------------ | -------------------------- | ------------------------- |
| Framework    | Next.js 14+ (App Router)   | 서버/클라이언트 통합      |
| Language     | TypeScript (strict)        |                           |
| Styling      | Tailwind CSS v4            | utility-first             |
| UI           | shadcn/ui (Radix UI 기반)  | `src/shared/ui/`에 보관   |
| Server State | TanStack Query v5          | API 데이터 캐싱/동기화    |
| Client State | Zustand                    | 최소한만 사용             |
| Backend      | Spring Boot REST API       | JWT 인증                  |
| Base URL     | `NEXT_PUBLIC_API_BASE_URL` | 기본값 `https://urr.guru` |

```bash
npm run dev    # 개발 서버
npm run build  # 빌드 검증
```

---

## 파일 구조 — FSD (Feature-Sliced Design)

```
src/
├── app/          # Next.js App Router (라우팅 진입점만)
├── widgets/      # 페이지를 구성하는 큰 UI 블록 (여러 feature 조합)
├── features/     # 단일 사용자 행동 단위 (독립적)
├── entities/     # 도메인 모델 (User, Artist, Event, Ticket …)
└── shared/
    ├── api/      # API 클라이언트, fetch 유틸
    ├── lib/      # utils.ts, format.ts, constants.ts
    └── ui/       # shadcn 컴포넌트 (button.tsx, input.tsx …)
```

### 레이어 규칙 (상위 → 하위만 import 가능)

```
app → widgets → features → entities → shared
```

- **app**: 라우트 파일만. 로직 없음, Widget을 `<Page />`에서 렌더링만.
- **widgets**: 여러 feature/entity를 조합하는 구성 레이어. `"use client"` 가능.
- **features**: 하나의 사용자 행동 (로그인, 예매, 결제 등). 타 feature 의존 금지.
- **entities**: 도메인 타입 + 관련 UI 카드/배지. 비즈니스 로직 없음.
- **shared**: 프로젝트 전역 공용 코드. 도메인 개념 없음.

### feature 내부 구조

```
features/<domain>/<feature-name>/
├── ui/         # React 컴포넌트
├── model/      # 상태, hook (useXxx.ts)
├── api/        # fetch 함수
└── index.ts    # 외부 공개 barrel export
```

### 파일 네이밍

- 컴포넌트: `PascalCase.tsx`
- 훅/유틸/api: `camelCase.ts`
- shadcn UI 파일: `lowercase.tsx` (`button.tsx`, `input.tsx`)
- 모든 레이어 폴더의 barrel: `index.ts`

---

## React 코드 → 이 프로젝트로 변환하는 규칙

사용자가 React 컴포넌트/기능을 주면, 다음 절차를 따라 FSD 구조로 변환한다.

### 1단계: 배치 레이어 결정

| 주어진 코드의 성격                              | 배치 위치                      |
| ----------------------------------------------- | ------------------------------ |
| 단순 재사용 UI (Button, Input, Badge …)         | `shared/ui/`                   |
| 날짜·가격·전화번호 등 포맷 함수                 | `shared/lib/format.ts`         |
| 상수 (결제수단, 좌석색상 등)                    | `shared/lib/constants.ts`      |
| 도메인 엔티티 카드/뱃지 (ArtistCard, TierBadge) | `entities/<domain>/ui/`        |
| 단일 사용자 행동 (로그인, 예매, 결제)           | `features/<domain>/<feature>/` |
| 여러 feature를 묶는 섹션/패널                   | `widgets/<domain>/`            |
| 페이지 진입점                                   | `app/<route>/page.tsx`         |

### 2단계: feature 내부 분리 원칙

```
주어진 React 컴포넌트 분해:
- JSX + 스타일만 → ui/ 파일
- useState/useEffect/비즈니스 로직 → model/useXxx.ts 훅으로 분리
- fetch 호출 → api/ 함수로 분리
- 외부 공개할 것만 → index.ts에 re-export
```

### 3단계: 변환 시 체크리스트

- [ ] `"use client"` — 서버 컴포넌트로 가능하면 붙이지 않음. 이벤트 핸들러/상태가 있으면 필수.
- [ ] import 경로는 절대경로 `@/` 사용 (`@/shared/ui`, `@/features/…`)
- [ ] 중복 유틸 확인 — `shared/lib/format.ts`에 이미 있으면 재작성하지 않고 import
- [ ] 타입 정의는 같은 파일 또는 `model/types.ts`에
- [ ] shadcn 컴포넌트 사용 시 `@/shared/ui`에서 import

### 4단계: 변환 예시 (간략)

```
React 원본 (App.tsx 한 파일)
  ↓
app/onboarding/page.tsx        → <OnboardingWidget /> 렌더링만
widgets/auth/OnboardingWidget.tsx → 레이아웃 조합 (좌/우 패널)
features/auth/onboarding/
  ui/AuthStep.tsx              → 이메일/소셜 로그인 폼
  ui/IdentityStep.tsx          → 본인인증 폼
  model/useOnboardingAuth.ts   → 상태·라우팅 로직
  api/startSocialLogin.ts      → fetch 호출
  index.ts                     → barrel export
```

---

## 주요 라우트 & 페이지

| URL                  | 페이지         | 핵심 widget                            |
| -------------------- | -------------- | -------------------------------------- |
| `/`                  | HomePage       | 배너·인기아티스트·공연랭킹·선예매 섹션 |
| `/artists`           | ArtistsPage    | 아티스트 목록 그리드                   |
| `/artists/:artistId` | ArtistPage     | 홈/소통/공연/양도 탭 (멤버십 게이트)   |
| `/events`            | EventsPage     | 공연 목록                              |
| `/events/:eventId`   | BookingPage    | 예매 5단계 플로우                      |
| `/membership`        | MembershipPage | 4단계 가입 플로우                      |
| `/my-page`           | MyPage         | 티켓/멤버십/양도/설정 탭               |
| `/onboarding`        | OnboardingPage | 로그인·회원가입                        |

---

## 핵심 비즈니스 로직

### 멤버십 등급

| 등급           | 조건             | 선예매   | 예매 수수료 | 양도 수수료 |
| -------------- | ---------------- | -------- | ----------- | ----------- |
| Lv.4 다이아 🌩️ | 팬 점수 달성     | 1순위    | +1,000원    | 5%          |
| Lv.3 골드 ⚡   | 팬 점수 달성     | 2순위+1h | +2,000원    | 5%          |
| Lv.2 실버 ☁️   | 멤버십 가입 즉시 | 3순위    | +3,000원    | 10%         |
| Lv.1 브론즈 🌫️ | 회원가입         | 일반만   | 기본        | 불가        |

- 양도 가능: Lv.2 이상만
- 아티스트 상세 탭 — 홈은 누구나, 소통/공연/양도는 멤버십 회원 전용 게이트
- 가입 플로우: 아티스트 선택 → 티어 소개 → Mock 결제 → 완료

### 예매 플로우 (5단계)

1. VQA (팬 인증 — 매크로 방지 시각 질문)
2. 실시간 대기열
3. 구역 선택 → 좌석 선택
4. 결제 (Toss Payments 모킹)
5. 예매 확인

### 양도 마켓

- `listed` 상태만 수정/취소 가능 (마이페이지 양도 탭)
- 수정: 가격 변경 → 수수료 5% 자동 계산
- 취소: 확인 다이얼로그 → 상태를 `cancelled`로 변경

### 홈페이지 섹션 순서

1. 히어로 배너 캐러셀
2. 인기 아티스트 (10열 그리드)
3. 지금 뜨는 공연 (≠ "오늘의 티켓팅" — 혼동 방지)
4. 인기 공연 랭킹 (2열 8행)
5. 선예매 오픈 임박 (3열)

---

## 디자인 시스템 핵심

### 색상 토큰

| 용도           | Tailwind 클래스  | 값                 |
| -------------- | ---------------- | ------------------ |
| 주요 CTA       | `bg-primary`     | `#FF5E32` (오렌지) |
| 보조 CTA       | `bg-secondary`   | `#1F2792` (네이비) |
| 사이드바 배경  | `bg-sidebar`     | `#FBFAF8`          |
| 메인 배경      | `bg-background`  | `#FFFEFE`          |
| hover/selected | `bg-accent`      | `#F2F0E6`          |
| 에러/삭제      | `bg-destructive` | oklch(0.577 …)     |
| 성공           | `text-success`   | `#22C55E`          |
| 경고           | `text-warning`   | `#F59E0B`          |

### 티어 색상

| 등급   | 텍스트 클래스         | 배경 클래스            |
| ------ | --------------------- | ---------------------- |
| 다이아 | `text-tier-lightning` | `bg-tier-lightning-bg` |
| 골드   | `text-tier-thunder`   | `bg-tier-thunder-bg`   |
| 실버   | `text-tier-cloud`     | `bg-tier-cloud-bg`     |
| 브론즈 | `text-tier-mist`      | `bg-tier-mist-bg`      |

### 폰트

- 본문: Pretendard Variable (`font-sans`)
- 타이머/카운트다운 전용: JetBrains Mono (`font-mono`)
- Letter-spacing: `-0.015em` (전역)

### 로고

- 파일: `public/logos/logo5.svg` (146×146 정사각형)
- 사이드바: `h-10` / 푸터: `h-11` / 로그인: `h-16` / 온보딩 히어로: `h-10`

### 디자인 원칙

- **Border over Shadow**: 요소 분리는 border 우선, shadow는 hover/모달에서만
- **Selective Color**: 등급·좌석 상태·시스템 피드백에만 색상 사용. 나머지는 모노크롬
- **Light only**: 다크 모드 미지원

---

## API 엔드포인트 (주요)

```
# 인증
POST  /api/auth/login
POST  /api/auth/oauth/kakao
GET   /api/auth/me
POST  /api/auth/logout
POST  /api/auth/reissue        ← JWT 갱신

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
401 응답 시 `/api/auth/reissue`로 자동 갱신 후 재시도.

---

## 참고 문서

- [`Docs/ARCHITECTURE.md`](Docs/ARCHITECTURE.md) — FSD 구조, 백엔드 도메인, 인프라
- [`Docs/designsystem.md`](Docs/designsystem.md) — 전체 색상 토큰, 타이포그래피, 컴포넌트 스펙
- [`Docs/PRD.md`](Docs/PRD.md) — 기획 배경, 멤버십 체계, MVP 범위
