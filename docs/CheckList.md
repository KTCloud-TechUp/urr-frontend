# URR 프로젝트 Next.js + FSD 마이그레이션 체크리스트

## 프로젝트 개요

- **기존 스택**: React 19 + TypeScript + Vite 7 + Tailwind CSS v4 + shadcn/ui
- **목표 스택**: Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui + FSD 아키텍처
- **백엔드**: Spring Boot
- **CI/CD**: AWS
- **문서 참조**: CLAUDE.md, docs/prd.md, docs/designsystem.md, docs/ARCHITECTURE.md

### 프로젝트 위치 정보

- **React 원본 프로젝트**: `C:\Users\kkaeng\Desktop\Dev\URR\URR-v2`
  - 디자인팀 바이브코딩으로 제작됨
  - 구조/설계가 엉망일 수 있음 (리팩토링 미흡)
  - 현재 분석된 파일 구조 기준
- **Next.js 타겟 프로젝트**: `C:\Users\kkaeng\Desktop\Dev\URR\urr-frontend`
  - 새로 생성될 FSD 구조 프로젝트
  - 기존 React 코드를 Next.js 그리고 FSD로 리팩토링하여 마이그레이션

### 마이그레이션 전략

- **점진적 마이그레이션**: 기존 코드를 완전히 버리지 않고 FSD 구조로 재구성
- **품질 개선**: 바이브코딩으로 인한 구조적 문제를 FSD 적용으로 해결
- **기능 보존**: 모든 기존 기능 유지하면서 아키텍처만 개선

## 현재 파일 구조 분석 및 FSD 매핑

### 기존 구조 → FSD 구조 매핑

#### 1. Shared Layer (공유 리소스)

```
src/shared/
├── ui/                    # shadcn/ui + 커스텀 컴포넌트
│   ├── alert-dialog.tsx, avatar.tsx, badge.tsx, button.tsx, ... (shadcn/ui)
│   └── urr/              # 커스텀 URR 컴포넌트
│       ├── ArtistCard.tsx, EventCard.tsx, TierBadge.tsx, ...
│       └── index.ts
├── lib/                  # 유틸리티 및 데이터
│   ├── constants.ts      # 기존 src/lib/constants.ts
│   ├── format.ts         # 기존 src/lib/format.ts
│   ├── utils.ts          # 기존 src/lib/utils.ts
│   └── mock-data/        # 기존 src/data/ 전체
│       ├── mock-artist-page.ts, mock-events.ts, mock-home.ts, ...
├── assets/               # 기존 src/assets/ 전체
│   └── *.png, *.svg 파일들
└── config/               # 환경 설정 (신규)
    └── api.ts, env.ts 등
```

#### 2. Features Layer (기능별 슬라이스)

```
src/features/
├── booking/              # 예매 기능
│   ├── ui/              # 기존 src/components/booking/ 전체
│   │   ├── BookingLayout.tsx, SeatGrid.tsx, PaymentView.tsx, ...
│   │   └── index.ts
│   ├── lib/             # 관련 훅 및 로직
│   │   ├── useBooking.ts, useQueueSimulation.ts, useSeatTimer.ts
│   │   └── booking-utils.ts 등
│   ├── model/           # 상태 관리
│   │   └── BookingContext.tsx (기존 src/contexts/BookingContext.tsx)
│   └── api/             # API 호출 (신규)
│       └── booking-api.ts
├── membership/          # 멤버십 기능
│   ├── ui/              # 기존 src/components/membership/ 전체
│   └── lib/             # 관련 로직
├── transfer/            # 양도 기능
│   ├── ui/              # 기존 src/components/transfer/ 전체
│   └── lib/             # 관련 로직
├── artist/              # 아티스트 기능
│   ├── ui/              # 기존 src/components/artist/ 전체
│   │   ├── ArtistHomeTab.tsx, ArtistCommunityTab.tsx, ...
│   └── lib/             # 관련 로직
├── notification/        # 알림 기능 (신규)
│   ├── ui/              # 알림 관련 컴포넌트들
│   ├── lib/
│   │   └── useNotifications.ts (기존 src/hooks/useNotifications.ts)
│   └── model/
│       └── NotificationContext.tsx (기존 src/contexts/NotificationContext.tsx)
└── search/              # 검색 기능 (신규)
    └── ui/              # 검색 관련 컴포넌트들
```

#### 3. Entities Layer (비즈니스 엔티티)

```
src/entities/
├── user/                # 사용자 엔티티
│   ├── model/           # 타입 정의
│   ├── lib/             # 유틸리티
│   └── api/             # API
├── event/               # 이벤트 엔티티
├── artist/              # 아티스트 엔티티
├── booking/             # 예매 엔티티
├── membership/          # 멤버십 엔티티
└── transfer/            # 양도 엔티티
```

_기존 src/types/index.ts를 엔티티별로 분리_

#### 4. Widgets Layer (페이지 레벨 컴포넌트)

```
src/widgets/
├── layouts/             # 기존 src/layouts/ 전체
│   ├── MainLayout.tsx
│   └── OnboardingLayout.tsx
├── home/                # 기존 src/components/home/ 전체
│   ├── HeroBannerCarousel.tsx
│   ├── HomePageSkeleton.tsx
│   └── SectionHeader.tsx
└── common/              # 기존 src/components/common/ 전체
```

#### 5. App Layer (Next.js App Router)

```
src/app/
├── layout.tsx           # 글로벌 레이아웃
├── page.tsx             # 홈페이지 (기존 src/pages/HomePage.tsx)
├── artists/
│   ├── page.tsx         # 기존 src/pages/ArtistsPage.tsx
│   └── [artistId]/
│       └── page.tsx     # 기존 src/pages/ArtistPage.tsx
├── events/
│   ├── page.tsx         # 기존 src/pages/EventsPage.tsx
│   └── [eventId]/
│       ├── page.tsx     # 기존 src/pages/EventDetailPage.tsx
│       └── booking/
│           └── page.tsx # 기존 src/pages/BookingPage.tsx
├── membership/
│   └── page.tsx         # 기존 src/pages/MembershipPage.tsx
├── my-page/
│   └── page.tsx         # 기존 src/pages/MyPage.tsx
├── transfer/
│   └── [transferId]/
│       └── page.tsx     # 기존 src/pages/TransferDetailPage.tsx
├── onboarding/
│   └── page.tsx         # 기존 src/pages/OnboardingPage.tsx
├── notifications/
│   └── page.tsx         # 기존 src/pages/NotificationsPage.tsx
├── search/
│   └── page.tsx         # 기존 src/pages/SearchPage.tsx
└── style-guide/
    └── page.tsx         # 기존 src/pages/StyleGuidePage.tsx
```

### 미사용/통합 파일들

- **src/App.tsx, src/main.tsx**: Next.js에서는 src/app/layout.tsx로 통합
- **src/index.css**: src/app/global.css로 이동
- **src/components/layout/**: src/widgets/layouts/로 이동
- **src/components/event-detail/**: src/widgets/event-detail/로 이동 (또는 features로)
- **src/components/my-page/**: src/widgets/my-page/ 또는 features로
- **src/components/onboarding/**: src/widgets/onboarding/ 또는 features로
- **src/hooks/** 잔여 파일들: 각 features/\*/lib/로 분배

## FSD (Feature-Sliced Design) 구조 개요

```
src/
├── app/                    # Next.js App Router (페이지 라우트)
├── features/               # 기능별 슬라이스 (예매, 멤버십, 양도 등)
│   ├── booking/           # 예매 기능
│   ├── membership/        # 멤버십 기능
│   ├── transfer/          # 양도 기능
│   └── ...
├── entities/              # 비즈니스 엔티티 (User, Event, Artist 등)
├── shared/                # 공유 리소스
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── lib/              # 유틸리티, 상수
│   ├── assets/           # 이미지, 아이콘
│   └── config/           # 설정 파일
└── widgets/               # 복합 UI 컴포넌트 (페이지 레벨)
```

## 마이그레이션 단계별 체크리스트

### Phase 1: 프로젝트 초기화 및 기본 설정 ✅ 완료

- [x] **Next.js 프로젝트 생성**
  - `npx create-next-app@latest urr-frontend --typescript --tailwind --eslint --app`
  - 프로젝트 위치: `C:\Users\kkaeng\Desktop\Dev\URR\urr-frontend`
  - 기존 package.json의 의존성 분석 및 마이그레이션
  - shadcn/ui 초기화: `npx shadcn-ui@latest init`

- [x] **FSD 폴더 구조 생성**
  - src/ 하위에 features/, entities/, shared/, widgets/ 폴더 생성
  - 기존 components/, pages/, lib/, types/ 파일들을 FSD 구조로 재배치 계획 수립

- [x] **기본 설정 파일 마이그레이션**
  - tailwind.config.js/ts
  - components.json (shadcn/ui)
  - tsconfig.json (Next.js용으로 조정)
  - eslint.config.js

### Phase 2: 공유 리소스 (Shared Layer) 마이그레이션 ✅ 완료

- [x] **Shared/UI 컴포넌트**
  - shadcn/ui 컴포넌트 설치: button, input, checkbox, avatar, separator, tooltip, select, badge
  - 커스텀 URR 컴포넌트: `SectionHeader.tsx`, `PriceDisplay.tsx`
  - barrel export: `src/shared/ui/index.ts`

- [x] **Shared/Lib**
  - `utils.ts` — cn 유틸
  - `format.ts` — 가격, 날짜, 숫자, 전화번호, 타이머 포맷 함수
  - `constants.ts` — 전역 상수 (PAYMENT_METHODS, SECTION_COLORS 등)
  - Mock 데이터: `src/shared/lib/mocks/` (artists.ts, user.ts, home.ts, events-page.ts, event-detail.ts, seats.ts)

- [x] **Shared/Types**
  - `src/shared/types/index.ts` — 전체 도메인 타입 통합 (TierLevel, Artist, Event, User, ConfirmationData 등 + 레이블 상수)

- [ ] **Shared/Assets**
  - 이미지/아이콘은 `public/` 폴더에서 문자열 경로로 사용 중 (현재 방식 유지 가능)

- [ ] **Shared/Config**
  - `src/shared/api/` 폴더 생성됐으나 비어있음
  - 환경 변수 설정 (`NEXT_PUBLIC_API_BASE_URL`) 및 API 클라이언트 구현 필요

### Phase 3: 엔티티 (Entities Layer) 마이그레이션 ✅ 기본 완료

- [x] **user 엔티티**
  - `entities/user/ui/TierBadge.tsx` — 등급 뱃지 컴포넌트 (Lightning/Thunder/Cloud/Mist)
  - `entities/user/index.ts`

- [x] **artist 엔티티**
  - `entities/artist/ui/ArtistCard.tsx` — 아티스트 카드 컴포넌트
  - `entities/artist/model/types.ts`
  - `entities/artist/index.ts`

- [x] **event 엔티티**
  - `entities/event/ui/EventTagBadge.tsx` — 이벤트 태그 뱃지
  - `entities/event/model/types.ts`
  - `entities/event/index.ts`

- [ ] **booking / membership / transfer 엔티티**
  - 폴더 미생성 — 해당 feature 구현 시 병행 생성 필요

### Phase 4: 기능별 슬라이스 (Features Layer) 마이그레이션

- [x] **Auth Feature** (인증/온보딩)
  - `features/auth/onboarding/ui/AuthStep.tsx` — 이메일/소셜 로그인 폼 (Kakao, Naver, Email)
  - `features/auth/onboarding/ui/IdentityStep.tsx` — 본인인증 폼
  - `features/auth/onboarding/ui/OnboardingHero.tsx` — 히어로 섹션
  - `features/auth/onboarding/model/useOnboardingAuth.ts` — 상태·라우팅 로직
  - `features/auth/onboarding/api/startSocialLogin.ts` — OAuth fetch
  - `features/auth/onboarding/index.ts`

- [x] **Booking Feature** (예매 기능) ✅ 완료
  - `features/booking/model/BookingContext.tsx` — useReducer, flat API, 'queue' 직행 (VQA 없음)
  - `features/booking/model/useQueueSimulation.ts` — 대기열 시뮬레이션 (position/probability/phase)
  - `features/booking/model/useSeatTimer.ts` — 좌석 선택 타이머
  - `features/booking/model/useCountdown.ts` — ISO 타겟까지 카운트다운
  - `features/booking/model/useNavigationBlock.ts` — beforeunload 이탈 방지
  - `features/booking/model/usePaymentForm.ts` — 결제 폼 상태
  - `features/booking/ui/VenueMap.tsx` — KSPO DOME 895×698 SVG (대화형/미니어처)
  - `features/booking/ui/SeatOverlay.tsx` — SVG 의자 아이콘 좌석 그리드
  - `features/booking/ui/SeatStatusLegend.tsx` — 좌석 상태 범례
  - `features/booking/ui/SectionListTable.tsx` — 구역별 잔여석/가격 테이블
  - `features/booking/ui/TimerDisplay.tsx` — 타이머 디스플레이 (경고 색상 포함)
  - `features/booking/ui/Minimap.tsx` — 미니 도면 (사이드패널용)
  - `features/booking/index.ts`

- [ ] **Membership Feature** (멤버십 기능)
  - 기존 src/components/membership/ → src/features/membership/ui/
  - 멤버십 가입 4단계 플로우 구현 (아티스트 선택 → 티어 소개 → Mock 결제 → 완료)

- [ ] **Transfer Feature** (양도 기능)
  - 기존 src/components/transfer/ → src/features/transfer/ui/
  - 양도 목록, 수정(가격 변경), 취소(확인 다이얼로그) 기능

- [x] **Artist Feature** (아티스트 탭 기능)
  - 아티스트 상세 탭: 홈 / 소통 / 공연 / 양도 (Lv.2 이상 멤버십 게이트)
  - `widgets/artist/` 하위 탭 컴포넌트들 (ArtistHomeTab, ArtistCommunityTab, ArtistEventsTab, ArtistTransferTab, MembershipGate)

- [ ] **Notification Feature** (알림 기능)
  - useNotifications.ts → src/features/notification/lib/
  - NotificationContext.tsx → src/features/notification/model/

### Phase 5: 위젯 (Widgets Layer) 및 페이지 마이그레이션

- [x] **Layout Widget** — 전체 레이아웃 시스템
  - `widgets/layout/LayoutShell.tsx` — 루트 쉘 (`/onboarding` 사이드바 제외)
  - `widgets/layout/AppSidebar.tsx` — 고정 사이드바 (220px/64px 접기)
  - `widgets/layout/SidebarNavItem.tsx` — 활성 인디케이터 포함 네비 아이템
  - `widgets/layout/ArtistTreeItem.tsx` — CSS 그리드 애니메이션 아티스트 트리
  - `widgets/layout/TopBar.tsx` — 브레드크럼 + 검색/알림 아이콘
  - `widgets/layout/Footer.tsx` — 로고 + 링크
  - `widgets/layout/model/useLayout.tsx` — LayoutContext + useReducer

- [x] **Home Widget**
  - `widgets/home/HomeWidget.tsx` — 5개 섹션 (배너 + 아티스트 + 트렌딩 + 랭킹 + 선예매)
  - `widgets/home/HeroBannerCarousel.tsx` — 히어로 배너 캐러셀
  - `widgets/home/HomePageSkeleton.tsx` — 로딩 스켈레톤

- [x] **Auth Widget**
  - `widgets/auth/OnboardingWidget.tsx` — 온보딩 레이아웃 (좌/우 패널)

- [x] **Artists Widget** — 아티스트 목록 그리드
- [x] **Artist Detail Widget** — 아티스트 상세 (탭 포함)
- [x] **Events Widget** — 공연 목록 (popularEvents + allEventsData 통합, 필터/뷰모드)
- [x] **Event Detail Widget** — 공연 상세 (EventDetailHero, EventDetailTabs, EventBookingSidebar)
- [x] **Booking Widget** ✅ 완료
  - `widgets/booking/BookingWidget.tsx` — BookingProvider 래퍼
  - `widgets/booking/RightMain.tsx` — 상태별 뷰 라우팅
  - `widgets/booking/LeftPanel.tsx` — 확장 패널 (포스터/날짜/등급 스케줄/CTA)
  - `widgets/booking/LeftPanelCollapsed.tsx` — 접힌 패널
  - `widgets/booking/IdleView.tsx` — 도면 + 구역 테이블
  - `widgets/booking/BookingModal.tsx` — 대기열 모달 (위치/확률/진행률)
  - `widgets/booking/QueueLeaveModal.tsx` — 대기열 이탈 확인
  - `widgets/booking/UnifiedSeatView.tsx` — 구역/좌석 선택 (SVG 오버레이 + 잠금 시뮬레이션)
  - `widgets/booking/BookingSidePanel.tsx` — 우측 패널 (미니맵/타이머/선택좌석/가격)
  - `widgets/booking/TimerExpiryModal.tsx` — 시간 만료 모달
  - `widgets/booking/PaymentView.tsx` — 결제 5단계 (확인→폼→처리→실패→만료)
  - `widgets/booking/PaymentProcessingOverlay.tsx` — 결제 처리 중 오버레이
  - `widgets/booking/ConfirmationView.tsx` — 예매 완료 (confetti + QR + 티켓 정보)
- [x] **Membership Widget** — 멤버십 가입 4단계 플로우 (아티스트 선택 → 티어 소개 → Mock 결제 → 완료)
- [x] **MyPage Widget** — 마이페이지 탭 (티켓/멤버십/양도/설정)

- [x] **App Router 페이지** — `/` (홈), `/onboarding`
- [x] **App Router 페이지** — `/artists`, `/artists/[artistId]`
- [x] **App Router 페이지** — `/events`, `/events/[eventId]` ✅
- [x] **App Router 페이지** — `/events/[eventId]/booking` ✅
- [x] **App Router 페이지** — `/membership`, `/my-page`
- [x] **App Router 페이지** — `/transfer/[artistId]/[listingId]`
- [ ] **App Router 페이지** — `/notifications`, `/search` (미구현 — 낮은 우선순위)

### Phase 6: 레이아웃 및 컨텍스트 통합 ✅ 완료

- [x] **글로벌 컨텍스트 재배치**
  - `LayoutContext` → `src/widgets/layout/model/useLayout.tsx` ✅
  - `app/layout.tsx` → `<TooltipProvider><LayoutShell>{children}</LayoutShell></TooltipProvider>` ✅

- [x] **레이아웃 컴포넌트 통합**
  - App Router layout.tsx와 연동 완료
  - `/onboarding` 사이드바 자동 제외 (`NO_SHELL_ROUTES`) 완료

- [x] **라우팅 검증**
  - 모든 구현된 페이지 정상 라우팅 확인
  - `generateStaticParams` — popularEvents + allEventsData 통합(`allEventsCombined`) 완료

### Phase 7: 데이터 및 API 통합

- [x] **Mock 데이터 마이그레이션**
  - `src/shared/lib/mocks/artists.ts` — 5개 기본 아티스트 + `getArtistById` 헬퍼
  - `src/shared/lib/mocks/user.ts` — mockUser (4개 활성 멤버십)
  - `src/shared/lib/mocks/home.ts` — 홈 전체 섹션 데이터 (배너 4, 아티스트 10, 공연 20+)
  - `src/shared/lib/mocks/events-page.ts` — popularEvents + allEventsData + allEventsCombined
  - `src/shared/lib/mocks/event-detail.ts` — gdragonDetail + createFallbackDetail
  - `src/shared/lib/mocks/seats.ts` — generateSeatsForSection, getSectionLayout, MAX_SEATS_PER_TIER

- [ ] **API 클라이언트 설정**
  - `src/shared/api/` 폴더 비어있음 — Fetch 기반 클라이언트 생성 필요
  - `Authorization: Bearer <accessToken>` 헤더 설정
  - 401 → `/api/auth/reissue` 자동 갱신 후 재시도 인터셉터

- [ ] **엔티티별 API 함수**
  - 각 `entities/*/api/` 및 `features/*/api/` 구현 (Spring Boot 연동)

### Phase 8: 테스트 및 최적화

- [x] **빌드 테스트**
  - `npm run build` 성공 ✅ (92개 페이지 정상 빌드)
  - TypeScript 타입 오류 없음

- [ ] **성능 최적화**
  - 이미지 최적화 (Next.js Image 컴포넌트)
  - 코드 스플리팅
  - Bundle 분석

- [ ] **CI/CD 설정**
  - AWS CodeBuild/CodePipeline 설정
  - 배포 스크립트 작성

## 다음 작업 순서 (하나씩 진행)

> **규칙**: 한 번에 하나의 작업만 진행. 완료 후 `[x]` 체크하고 다음으로 넘어간다.

- [x] **1. `/artists` 페이지** — 아티스트 목록 그리드
- [x] **2. `/artists/[artistId]` 페이지** — 아티스트 상세 (탭: 홈/소통/공연/양도 + 멤버십 게이트)
- [x] **3. `/events` 페이지** — 공연 목록
- [x] **4. `/events/[eventId]` 페이지** — 공연 상세
- [x] **5. `/events/[eventId]/booking` 페이지** — 예매 플로우 (대기열 → 구역/좌석 → 결제 → 확인) ✅
- [x] **6. `/membership` 페이지** — 멤버십 가입 4단계 플로우
- [x] **7. `/my-page` 페이지** — 마이페이지 (티켓/멤버십/양도/설정 탭)
- [x] **8. `/transfer/[artistId]/[listingId]` 페이지** — 양도 상세
- [ ] **9. `shared/api/` 클라이언트** — Fetch 기반, Bearer 토큰, 401 자동 갱신
- [ ] **10. Spring Boot API 연동** — Mock 데이터 → 실제 API 전환

---

## 각 단계별 Claude 작업 요청 템플릿

### 작업 요청 형식

```
[Phase X: 단계명]
작업 내용: [구체적인 작업 설명]
참고 파일: [관련 기존 파일들]
예상 결과: [완료 후 기대되는 구조/기능]
특이사항: [주의할 점이나 추가 요구사항]
```

### 예시 작업 요청

```
[Phase 2: 공유 리소스 (Shared Layer) 마이그레이션]
작업 내용: shadcn/ui 컴포넌트들을 마이그레이션하세요. src/components/ui/ 폴더의 모든 파일들을 src/shared/ui/로 이동시키세요.
참고 파일: src/components/ui/ 폴더 전체 (alert-dialog.tsx, avatar.tsx, badge.tsx, button.tsx 등 16개 파일)
예상 결과: 모든 shadcn/ui 컴포넌트가 src/shared/ui/에 위치하고 import 경로가 업데이트됨
특이사항: 기존 코드 품질을 고려하여 필요한 경우 리팩토링도 함께 진행
```

## 주의사항

- Phase 1~8 중 **1~6, 8-빌드만 완료** — **Phase 7 (API 연동)이 핵심 잔여 작업**
- 매 Phase 완료 시 빌드 및 기본 기능 테스트 필수
- **FSD 원칙 준수**: 위에서 아래로 의존성 흐름 유지 (shared → entities → features → widgets → app)
- 기존 스타일과 기능 유지하면서 구조만 FSD로 변환
- 각 feature는 ui/, model/, api/ 구조 유지
- Spring Boot API 연동은 Phase 7 이후 별도 작업
- 파일 이동 시 import 경로 모두 업데이트 필수

### ⚠️ 디자인 변경 금지 원칙

- **반드시 원본 참조**: 컴포넌트 마이그레이션 시 `C:\Users\kkaeng\Desktop\Dev\URR\URR-v2` 원본 파일을 먼저 읽고 디자인을 1:1로 맞출 것
- **임의 변경 금지**: 섹션 제목, 폰트 크기, 간격, 색상, 레이아웃 등 디자인 디테일을 Claude 판단으로 바꾸지 말 것
- **클래스 교체 금지**: 원본의 Tailwind 클래스를 "더 나은" 것으로 교체하지 말 것 (예: `hover:bg-[#F3F2F0]` → `hover:bg-accent` 같은 임의 변환 금지)
- **컴포넌트 교체 금지**: 원본이 raw `<span>`을 쓰면 그대로 `<span>`, 원본이 특정 컴포넌트를 쓰면 그 컴포넌트를 사용
- **이미지 경로**: 원본 `src/assets/` 이미지는 `public/`으로 복사 후 문자열 경로로 사용. 한글 파일명 대신 원본의 영문 파일명 유지
- **예외**: React Router → Next.js Link/useRouter 변환, `import` 이미지 → `/파일명` 문자열 경로 변환은 허용

### 기존 코드 품질 고려사항

- **바이브코딩 특성**: 디자인팀이 만든 코드로 구조적 문제가 있을 수 있음
- **리팩토링 기회**: FSD 마이그레이션 시점에 코드 품질 개선 병행
- **컴포넌트 재설계**: 지나치게 큰 컴포넌트는 기능별로 분리
- **타입 안전성 강화**: 기존 any 타입이나 미흡한 타입 정의 개선
- **성능 최적화**: 불필요한 리렌더링이나 메모이제이션 부족한 부분 개선

## 완료 기준

- [x] **Phase 1 완료**: Next.js 프로젝트 생성 및 기본 설정
- [x] **Phase 2 완료**: Shared Layer (UI 컴포넌트, 유틸, Mock 데이터)
- [x] **Phase 3 완료**: Entities Layer (user/artist/event 기본 구조)
- [x] **Phase 6 완료**: 레이아웃 시스템 (사이드바, TopBar, Footer, LayoutContext)
- [x] **Phase 4 완료**: Features Layer — auth ✅, artist ✅, booking ✅ (membership/transfer/notification 제외)
- [x] **Phase 5 완료**: Widgets + App Router — 모든 주요 페이지 ✅ (notifications/search 제외)
- [x] **Phase 8 빌드**: `npm run build` 92페이지 성공 ✅
- [ ] **Phase 7**: API 클라이언트 및 Spring Boot 연동
- [ ] **Phase 8 나머지**: 성능 최적화, CI/CD
- [ ] 모든 페이지 정상 렌더링 및 라우팅 동작
- [ ] Spring Boot 실제 API 연동 완료
- [ ] FSD 구조 준수 검증 (의존성 방향성)
- [ ] 타입 안전성 유지
- [ ] 모든 import 경로 정상 동작
