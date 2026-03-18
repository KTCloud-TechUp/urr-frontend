# URR API 연동 전체 체크리스트

## 전체 진행 현황

| Phase | 영역                   | 상태      |
| ----- | ---------------------- | --------- |
| 1     | 패키지 + API 클라이언트 | ✅ 완료   |
| 2     | tokenStore + auth 타입  | ✅ 완료   |
| 3     | TanStack Query + AuthInitializer | ✅ 완료 |
| 4     | 라우트 보호            | ✅ 완료   |
| 5     | 인증 API 연동          | ✅ 완료   |
| 6     | 온보딩 플로우 완성     | 🔲 진행 중 |
| 7     | 예매 Zustand store     | 🔲 대기    |
| 8     | Events API 연동        | 🔲 대기    |
| 9     | Ticketing + Queue 연동 | 🔲 대기    |
| 10    | Payments 연동          | 🔲 대기    |
| 11    | User 추가 기능         | 🔲 대기    |
| 12    | Community 연동         | 🔲 대기 (MVP OUT) |

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

## Phase 4 — 라우트 보호 ✅

AuthInitializer가 LayoutShell(보호된 페이지 전용)에 적용되어 라우트 보호 완료.

## Phase 5 — 인증 API 연동 ✅

- [x] `src/features/auth/model/types.ts` 보강 — `AuthResponseData` 추가
- [x] `src/features/auth/api/login.ts` — `POST /api/auth/login`
- [x] `src/features/auth/api/register.ts` — `POST /api/auth/register`
- [x] `src/features/auth/api/logout.ts` — `POST /api/auth/logout`
- [x] `src/features/auth/api/deleteAccount.ts` — `DELETE /api/auth/me`
- [x] `src/features/auth/api/kakaoLogin.ts` — `POST /api/auth/oauth/kakao`
- [x] `src/features/auth/onboarding/api/buildKakaoAuthUrl.ts` — 카카오 OAuth URL 생성
- [x] `src/features/auth/onboarding/ui/AuthStep.tsx` — email/password 기반 + 회원가입 이메일 필드
- [x] `src/features/auth/onboarding/model/useOnboardingAuth.ts` — 실제 API 호출로 교체
- [x] `OnboardingWidget` — `?code` 파라미터 감지 → `kakaoLogin()` 호출 + Suspense 래핑

---

## Phase 6 — 온보딩 플로우 완성 (8단계) ⏸ 보류

> ⚠️ **기획·디자인팀 확정 후 진행** — 각 단계의 UI/UX, 데이터 흐름, API 스펙이 확정되어야 작업 가능. 현재 착수 불가.
> **선행 조건**: Phase 5 완료 ✅ + 기획·디자인 확정

### 6-1. 본인인증 (IdentityStep 고도화)

현재 IdentityStep은 기본 폼만 있음. SMS 인증 플로우 추가 필요.

- [ ] 통신사 선택 UI (SKT / KT / LGU+ / MVNO) — 4지 선택
- [ ] 이름 + 생년월일(8자리 YYYYMMDD) + 성별 + 전화번호 입력 폼
- [ ] **SMS 인증코드 발송** — `POST /api/auth/sms/send` (백엔드 스펙 확인 필요)
- [ ] SMS 인증코드 입력 + 3분 타이머 (font-mono, 1:00→노랑, 0:30→빨강+pulse)
- [ ] 타이머 만료 시 재발송 CTA 활성화
- [ ] CI 중복 감지 → 기존 계정 안내 모달 + 가입 차단

### 6-2. 약관 동의 (TermsStep)

- [ ] `src/features/auth/onboarding/ui/TermsStep.tsx`
  - [ ] 전체 동의 마스터 체크박스 (하위 항목 연동)
  - [ ] [필수] 이용약관 — 펼침/접힘 or 별도 시트
  - [ ] [필수] 개인정보처리방침
  - [ ] [선택] 마케팅 수신 동의
  - [ ] 필수 2개 미동의 시 다음 버튼 비활성화

### 6-3. 아티스트 선택 (ArtistSelectStep)

- [ ] `src/features/auth/onboarding/ui/ArtistSelectStep.tsx`
  - [ ] `GET /api/events/artists` 호출 → 아티스트 목록 렌더
  - [ ] 카테고리 탭 (장르/그룹/솔로 등) + 검색 인풋
  - [ ] 아티스트 카드 멀티 선택 (선택 시 체크 오버레이)
  - [ ] 1명 이상 선택 시에만 다음 버튼 활성화

### 6-4. 멤버십 소개 (MembershipIntroStep)

- [ ] `src/features/auth/onboarding/ui/MembershipIntroStep.tsx`
  - [ ] 4등급 혜택 비교표 (등급별 예매창/수수료/VQA 정리)
  - [ ] [가입 ₩30,000/년] 버튼 → MembershipPage로 이동 or 인라인 결제
  - [ ] [나중에] 버튼 → 다음 단계 진행

### 6-5. 멜론 연동 (MelonLinkStep)

- [ ] `src/features/auth/onboarding/ui/MelonLinkStep.tsx`
  - [ ] "라이트닝/썬더 등급 확인" CTA (강제 아님, 스킵 가능)
  - [ ] 연동 버튼 → 멜론 OAuth mock 흐름 (MVP: mock 처리)
  - [ ] [나중에] 버튼 → 다음 단계

### 6-6. 완료 (CompleteStep)

- [ ] `src/features/auth/onboarding/ui/CompleteStep.tsx`
  - [ ] 미스트 등급 부여 안내 + 등급 배지
  - [ ] 멜론 연동 여부에 따라 현재 등급 표시
  - [ ] [홈으로 이동] → `/` 리다이렉트

### 6-7. OnboardingWidget 확장

- [ ] flowState 8단계로 확장: `auth → identity → terms → artist-select → membership-intro → melon-link → complete`
- [ ] 각 단계 컴포넌트 연결 + 단계 간 데이터 전달 (onboardingData context or prop)
- [ ] 진행 표시 스텝바 (현재 단계 / 전체 단계)

---

## Phase 7 — 예매 Zustand store 🔲

> **선행 조건**: Phase 6 완료
> **목표**: 예매 상태머신 클라이언트 상태 관리 (API 연동은 Phase 9)

- [ ] `src/features/booking/model/useBookingStore.ts`
  - [ ] `bookingState`: `idle | vqa | queue | seats-section | seats-individual | payment | confirmation | payment-failed | seats-expired`
  - [ ] `selectedSeats: Seat[]` (최대 4석)
  - [ ] `queueInfo`: `{ rank, estimatedWait, successRate }`
  - [ ] `seatTimer`: 3분 카운트다운 (180초)
  - [ ] `vqaState`: `{ attempts, currentQuestion, answers }`
  - [ ] 상태 전환 액션: `enterVqa`, `enterQueue`, `selectSection`, `selectSeat`, `removeSeat`, `enterPayment`, `confirmPayment`, `failPayment`, `expireSeats`, `reset`
- [ ] 상태머신 연결 확인 (`BookingPage` 기존 UI와 연결)

---

## Phase 8 — Events API 연동 🔲

> **선행 조건**: Phase 3 완료 (TanStack Query)
> **엔드포인트**: `GET /api/events`, `GET /api/events/:id`, `GET /api/events/artists`, `GET /api/events/artists/:id`

### 8-1. API 함수 + 타입

- [ ] `src/entities/event/api/getEvents.ts` — `GET /api/events` (목록, 페이지네이션/필터 파라미터)
- [ ] `src/entities/event/api/getEvent.ts` — `GET /api/events/:id`
- [ ] `src/entities/artist/api/getArtists.ts` — `GET /api/events/artists`
- [ ] `src/entities/artist/api/getArtist.ts` — `GET /api/events/artists/:id`
- [ ] `src/entities/event/model/types.ts` — 서버 응답 타입 정의 (백엔드 스펙 확인 후)
- [ ] `src/entities/artist/model/types.ts` — 서버 응답 타입 정의

### 8-2. TanStack Query hooks

- [ ] `src/entities/event/model/useEvents.ts` — `useQuery(['events', filters])`
- [ ] `src/entities/event/model/useEvent.ts` — `useQuery(['events', id])`
- [ ] `src/entities/artist/model/useArtists.ts` — `useQuery(['artists'])`
- [ ] `src/entities/artist/model/useArtist.ts` — `useQuery(['artists', id])`

### 8-3. 홈페이지 연동

- [ ] `HeroBannerCarousel` — 배너 이벤트 목록 API 연동 (mock → real)
- [ ] 인기 아티스트 섹션 — `GET /api/events/artists` 연동
- [ ] 지금 뜨는 공연 섹션 — `GET /api/events` (trending 파라미터)
- [ ] 인기 공연 랭킹 섹션 — `GET /api/events` (ranking 파라미터)
- [ ] 선예매 오픈 임박 섹션 — `GET /api/events` (pre-sale 파라미터)
- [ ] 각 섹션 로딩 → 스켈레톤 shimmer (1.5s loop)
- [ ] 에러 상태 → 재시도 버튼

### 8-4. 공연 목록 페이지 (`/events`) 연동

- [ ] `EventsPage` — `GET /api/events` 연동 + 필터/정렬 파라미터 연결
- [ ] 무한 스크롤 or 페이지네이션 (백엔드 방식 확인 후)
- [ ] 로딩/에러 상태 처리

### 8-5. 공연 상세 페이지 (`/events/:eventId`) 연동

- [ ] `EventDetailPage` — `GET /api/events/:id` 연동
- [ ] `EventDetailHero` — 공연 정보 실제 데이터로 교체
- [ ] 구역별 잔여석 표시 (ticketing API에서 오는 경우 Phase 9로 이관)
- [ ] 로딩/에러 상태 처리

### 8-6. 아티스트 목록 페이지 (`/artists`) 연동

- [ ] `ArtistsPage` — `GET /api/events/artists` 연동
- [ ] 로딩/에러 상태 처리

### 8-7. 아티스트 상세 페이지 (`/artists/:artistId`) 연동

- [ ] `ArtistPage` — `GET /api/events/artists/:id` 연동
- [ ] `ArtistHeader` — 실제 아티스트 데이터 렌더
- [ ] 아티스트의 공연 목록 (`GET /api/events?artistId=:id`)
- [ ] 멤버십 게이트 확인 (공연/양도 탭은 멤버십 회원 전용 — useCurrentUser 활용)
- [ ] 로딩/에러 상태 처리

---

## Phase 9 — Ticketing + Queue API 연동 🔲

> **선행 조건**: Phase 7 (Zustand store), Phase 8 (공연 상세 페이지)
> **엔드포인트**: `GET /api/ticketing/:eventId`, `POST /api/ticketing/book`, `GET /api/ticketing/my-tickets`, `GET /api/ticketing/queue/status`

### 9-1. API 함수 + 타입

- [ ] `src/features/booking/api/getTicketing.ts` — `GET /api/ticketing/:eventId` (구역/좌석 정보)
- [ ] `src/features/booking/api/bookTicket.ts` — `POST /api/ticketing/book`
- [ ] `src/features/booking/api/getMyTickets.ts` — `GET /api/ticketing/my-tickets`
- [ ] `src/features/booking/api/getQueueStatus.ts` — `GET /api/ticketing/queue/status`
- [ ] `src/features/booking/model/types.ts` — 서버 응답 타입 (백엔드 스펙 확인 후)

### 9-2. 좌석 정보 연동

- [ ] `BookingPage idle 상태` — `GET /api/ticketing/:eventId` 연동 (구역 정보, 잔여석)
- [ ] 구역별 잔여석 컬러코딩 SVG 연동
- [ ] VQA 문항 — 서버 응답에서 수신 or 클라이언트 mock 유지 (백엔드 스펙 확인)

### 9-3. 대기열 (Queue) 연동

- [ ] `useBookingStore` — queue 상태 진입 시 polling/WebSocket 시작
- [ ] `GET /api/ticketing/queue/status` — 10초 간격 폴링 (WebSocket 없을 경우 `useQuery` refetchInterval)
  - WebSocket 지원 시: `useEffect` + `ws://...` 연결 + cleanup
  - 폴링 방식 시: `useQuery({ refetchInterval: 10000 })`
- [ ] 순번 변경 → digit roll 애니메이션 (500ms)
- [ ] 대기 완료 → `seats-section` 자동 전환

### 9-4. 예매 완료 연동

- [ ] `POST /api/ticketing/book` 호출 (좌석 선택 + 결제 완료 후)
- [ ] 응답 → `confirmation` 상태 전환 + QR 코드 데이터 수신

### 9-5. 마이페이지 티켓 월렛

- [ ] `MyPage 티켓 월렛 탭` — `GET /api/ticketing/my-tickets` 연동
- [ ] 티켓 카드 실제 데이터 렌더 (mock → real)
- [ ] QR 코드 모달 — `qrcode.react` dynamic import (번들 최적화)
- [ ] 로딩/에러 상태 처리

---

## Phase 10 — Payments API 연동 🔲

> **선행 조건**: Phase 9 (예매 플로우)
> **엔드포인트**: `POST /api/payments/create`, `POST /api/payments/confirm`, `GET /api/payments/{orderId}`, `POST /api/payments/{paymentKey}/cancel`

### 10-1. API 함수 + 타입

- [ ] `src/features/payment/api/createPayment.ts` — `POST /api/payments/create`
- [ ] `src/features/payment/api/confirmPayment.ts` — `POST /api/payments/confirm`
- [ ] `src/features/payment/api/getPayment.ts` — `GET /api/payments/{orderId}`
- [ ] `src/features/payment/api/cancelPayment.ts` — `POST /api/payments/{paymentKey}/cancel`
- [ ] `src/features/payment/model/types.ts` — 결제 요청/응답 타입

### 10-2. Toss Payments 연동 (Mock → Real)

- [ ] `payment` 상태에서 `POST /api/payments/create` 호출 → `orderId`, `paymentKey` 수신
- [ ] Toss Payments SDK 연동 (현재 mock 처리 → 실제 위젯 or API 방식)
- [ ] 결제 성공 → `POST /api/payments/confirm` → `confirmation` 전환
- [ ] 결제 실패 → `payment-failed` 전환 + 60초 재시도 타이머

### 10-3. 결제 내역 조회

- [ ] `MyPage` or `마이페이지 결제 내역` — `GET /api/payments/{orderId}` 연동

### 10-4. 결제 취소

- [ ] 티켓 취소 플로우 — `POST /api/payments/{paymentKey}/cancel`
- [ ] 확인 다이얼로그 → 취소 처리 → 상태 업데이트

---

## Phase 11 — User 추가 기능 🔲

> **선행 조건**: Phase 5 완료
> **목표**: 비밀번호 찾기/변경, 회원정보 수정

> ⚠️ 아래 엔드포인트는 현재 `api.md`에 없음. **백엔드 스펙 확인 후 업데이트 필요.**

### 11-1. 비밀번호 찾기

- [ ] 백엔드 엔드포인트 확인 (예상: `POST /api/auth/password/forgot`)
- [ ] 이메일 입력 → 인증코드 발송
- [ ] 인증코드 확인 → 새 비밀번호 설정

### 11-2. 비밀번호 변경 (로그인 상태)

- [ ] 백엔드 엔드포인트 확인 (예상: `PATCH /api/auth/me/password`)
- [ ] 현재 비밀번호 + 새 비밀번호 + 확인 입력
- [ ] `MyPage 설정 탭` or 별도 페이지에서 접근

### 11-3. 회원정보 수정

- [ ] 백엔드 엔드포인트 확인 (예상: `PATCH /api/auth/me`)
- [ ] 닉네임 변경, 마케팅 수신 동의 변경
- [ ] 변경 완료 → `useCurrentUser` invalidate

---

## Phase 12 — Community API 연동 🔲 (MVP OUT)

> **PRD 기준 Community는 MVP 외 범위.** UI 쉘만 존재, 실제 API 연동은 Post-MVP.
> **엔드포인트**: `GET /api/community/posts`, `POST /api/community/posts`, `POST /api/community/posts/:id/comment`

- [ ] `src/features/community/api/getPosts.ts`
- [ ] `src/features/community/api/createPost.ts`
- [ ] `src/features/community/api/createComment.ts`
- [ ] 아티스트 상세 소통 탭 — 게시글 목록/작성 연동

---

## 성능 최적화 (번들 크기)

> S3+CloudFront `output: "export"` 기준.

- [ ] `RightMain.tsx` — `ConfirmationView` dynamic import (`next/dynamic`) → canvas-confetti + qrcode.react 초기 번들 제거
- [ ] `QRCodeModal.tsx` — `QRCodeSVG` dynamic import → 마이페이지 초기 번들 최적화

### EKS 마이그레이션 후 (Post-MVP)

- [ ] `next.config.ts` — `output: "export"` 제거, `images: { unoptimized: true }` 제거
- [ ] 모든 `fill` Image에 `sizes` prop 추가 (자동 WebP 최적화)
