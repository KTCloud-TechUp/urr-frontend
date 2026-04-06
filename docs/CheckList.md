# URR 전체 진행 체크리스트

## 권장 작업 순서 (2026-04-06 기준)

| 순서 | 작업 | 이유 |
| ---- | ---- | ---- |
| ✅ | **Phase 11 Ticketing + Queue** | 완료 |
| ✅ | **Phase 12 Payments** | 완료 |
| 1 | **Phase 6 온보딩 완성** | SMS 인증 + 약관 동의 + 소셜 온보딩 완료 API 연동 — 유저 유입 첫 관문 |
| 2 | **Phase 13 User 설정** | 동의 수정(`/api/v1/auth/me/consents`) + 회원탈퇴(`DELETE /api/v1/auth/me`) — 작은 작업들 |
| 3 | **Phase 14 소통탭** | UI 완성, API만 연결. 의존성 없어 나중에 처리 가능 |

---

## 전체 진행 현황

| 순위 | Phase | 영역                             | 상태                                  |
| ---- | ----- | -------------------------------- | ------------------------------------- |
| —    | 1     | 패키지 + API 클라이언트          | ✅ 완료                               |
| —    | 2     | tokenStore + auth 타입           | ✅ 완료                               |
| —    | 3     | TanStack Query + AuthInitializer | ✅ 완료                               |
| —    | 4     | 라우트 보호                      | ✅ 완료                               |
| —    | 5     | 인증 API 연동 (카카오/네이버)    | ✅ 완료                               |
| —    | 7     | 예매 UI 리팩토링                 | ✅ 완료                               |
| —    | 8     | 예매 VenueMap 인터랙션 UI        | ✅ 완료                               |
| —    | 13a   | 선예매 정책 조회 API             | ✅ 완료                               |
| —    | 13b   | 아티스트 멤버십 취소 API         | ✅ 완료                               |
| —    | 9     | 예매 Zustand store               | ✅ 완료                               |
| —    | 10    | Events/Artists API 연동          | ✅ 완료                               |
| —    | 11    | Ticketing + Queue 연동           | ✅ 완료                               |
| —    | 12    | Payments 연동                    | ✅ 완료                               |
| 1    | 6     | 온보딩 플로우 완성               | 🔶 부분 완료                          |
| 2    | 13    | User 추가 기능                   | 🔶 부분 완료 (닉네임만)               |
| 3    | 14    | Community 연동                   | 🔶 부분 완료 (양도 완료, 소통 미착수) |

---

## 역할 분리 원칙

| 상태          | 저장소                                     | 이유                                  |
| ------------- | ------------------------------------------ | ------------------------------------- |
| `accessToken` | module-level 변수 (`tokenStore.ts`)        | 반응형 불필요, XSS 방어               |
| `user` 데이터 | TanStack Query `['auth', 'me']`            | 서버 데이터, 캐시 관리                |
| `isLoggedIn`  | Query 결과에서 파생 (`data !== undefined`) | 별도 상태 불필요                      |
| 예매 상태머신 | Zustand                                    | 복잡한 클라이언트 전용 상태 (Phase 9) |
| 사이드바 상태 | Context + useReducer                       | 이미 구현됨                           |

> **Zustand는 auth에 사용하지 않는다.** 예매 플로우 상태머신에 아껴둔다.

---

## Phase 6 — 온보딩 플로우 완성 🔶 부분 완료

> UI 전체 완성. SMS·약관 API 연동 및 후속 스텝 미구현.

### 6-1. 온보딩 플로우 — UI ✅

- [x] `AgeGateStep.tsx` — 만 14세 이상/미만 분기
- [x] `IdentityStep.tsx` — 본인인증 폼
- [x] `GuardianIdentityStep.tsx` — 법정대리인 본인인증 폼
- [x] `TermsStep.tsx` — 필수 2개 + 선택 1개 약관 동의
- [x] `SignupCompleteStep.tsx` — 가입 완료
- [x] `OnboardingWidget` flowState 6단계 확장
- [x] SMS API 함수: `smsSend`, `smsVerify` (`src/features/auth/api/`)
- [x] `updateConsents` API 함수 존재

### 6-2. 본인인증 SMS API 미연동 🔲

> 엔드포인트: `POST /api/v1/auth/sms/send` (body: `{ phoneNumber }`), `POST /api/v1/auth/sms/verify` (body: `{ phoneNumber, code }` → `{ verified: boolean }`)

- [ ] `IdentityStep.tsx` `handleSendCode` → `smsSend(phone)` 실제 호출
- [ ] `IdentityStep.tsx` `handleVerify` → `smsVerify(phone, code)` 실제 호출, `verified: false` 시 에러 표시
- [ ] `GuardianIdentityStep.tsx` `handleSendCode` → `smsSend(phone)` 실제 호출
- [ ] `GuardianIdentityStep.tsx` `handleVerify` → `smsVerify(phone, code)` 실제 호출

### 6-3. 약관 동의 API 미연동 🔲

> 엔드포인트: `PATCH /api/v1/auth/me/consents` (body: `{ marketingConsent, pushConsent, smsConsent }`)

- [ ] `handleTermsComplete` (`useOnboardingAuth.ts`) — `updateConsents()` 호출 (마케팅 동의 선택값 전달)
  - TermsStep에서 `marketing` 체크 여부를 `onComplete(marketingConsent: boolean)` 으로 올려야 함

### 6-5b. 소셜 온보딩 완료 API 미연동 🔲

> 엔드포인트: `POST /api/v1/auth/onboarding/social` (body: `{ nickname, birthDate, phone, gender }`)  
> 소셜 로그인 후 추가 정보 입력 완료 시 호출 — 온보딩 마지막 스텝에서 연동 필요

- [ ] `useOnboardingAuth.ts` — 온보딩 완료 시 `POST /api/v1/auth/onboarding/social` 호출 후 홈으로 리다이렉트

### 6-4. 아티스트 선택 (ArtistSelectStep) ✅

- [x] `ArtistSelectStep.tsx` UI 존재 (`src/features/membership/ui/`)
- [x] `GET /api/events/artists` 실제 연동 — `MembershipWidget`에서 `useArtists()` 사용 중
- [x] 1명 이상 필수 선택 검증 — 단일 선택 UI 구조상 클릭 자체가 강제
- [x] 팔로우 API 호출 — `handleSelectArtist`에서 `followArtist()` fire-and-forget 호출

### 6-5. 멤버십 소개 (MembershipIntroStep) 🔶

- [x] `MembershipIntroStep.tsx` UI 존재 (`src/features/membership/ui/`)
- [ ] 온보딩 플로우 스텝에 연결 확인

### 6-6. 멜론 연동 (MelonLinkStep) 🔲

- [ ] UI 미구현
- [ ] [연동하기] / [나중에] — 팬 신뢰 점수 계산 트리거 (Mock)

---

## Phase 9 — 예매 Zustand store ✅

> **선행 조건**: Phase 8 완료 ✅

- [x] `src/features/booking/model/useBookingStore.ts`
  - [x] `bookingState`: `idle | queue | seats-section | seats-individual | payment | confirmation | payment-failed | seats-expired`
  - [x] `selectedSeatIds: string[]` (최대 maxSeats), `seatTimerSecondsLeft`, `queueToken`
  - [x] `reservationIds: string[]` + `orderId: string | null` — confirmReservation 체인에 사용
  - [x] 액션: `transitionTo`, `selectSection`, `toggleSeat`, `setReservations`, `reset` 등
- [x] `BookingContext` → `useReducer` 제거, Zustand store 사용으로 마이그레이션
- [x] `src/features/booking/api/confirmReservation.ts` — `POST /api/v1/ticket/reservations/{id}/confirm`
- [x] `PaymentView.tsx` — `bookTicket()` 완료 후 `setReservations()` 호출 + sessionStorage 백업
- [x] `BookingContext` Toss 콜백 — `confirmPayment` 성공 후 `confirmReservation()` 체인 호출
- [x] `shared/types/index.ts` — `BookingState`에 `payment-failed`, `seats-expired` 추가

---

## Phase 10 — Events/Artists API 연동 🔶 부분 완료

> **선행 조건**: Phase 3 완료 ✅

### 10-1. API 함수 + 훅 ✅

- [x] `getEvents()` — `src/features/event/api/getEvents.ts`
- [x] `getEventDetail(artistId, eventId)` — `src/features/event/api/getEventDetail.ts`
- [x] `getArtistEvents(artistId)` — `src/features/event/api/getArtistEvents.ts`
- [x] `getVenues()`, `getVenueDetail()` — `src/features/event/api/getVenues.ts`
- [x] `getArtists()` — `src/features/artist/api/getArtists.ts`
- [x] `getArtist(artistId, userId?)` — `src/features/artist/api/getArtist.ts`
- [x] `useArtists()` hook — `src/features/artist/model/useArtists.ts`

### 10-2. 페이지 연동 ✅

- [x] `/events` 목록 — `EventsWidget`: `getEvents` 실제 연동, 카테고리 필터 + 그리드/리스트 뷰
- [x] `/events/:eventId` 상세 — `EventDetailWidget`: `getEvents` + `getShows` + `getPresalePolicy` 연동
- [x] `/artists` 목록 — `ArtistsWidget`: `useArtists` 실제 연동
- [x] `/artists/:artistId` 상세 — `ArtistDetailWidget`: `getArtist` + `getArtistEvents` + follow/unfollow 연동

### 10-3. 홈페이지 섹션 연동 ✅

- [x] `HomeWidget` — 지금 뜨는 공연 → `getHome().trendingEvents` 연동
- [x] `HomeWidget` — 인기 공연 랭킹 → `getHome().popularEventRanking` 연동
- [x] `HomeWidget` — 선예매 오픈 임박 → `getHome().presaleOpeningSoon` 연동 (빈 배열이면 섹션 숨김)
- [x] `HomeWidget` — 인기 아티스트 → `getHome().popularArtists` 사용
- [x] 스켈레톤 교체: `useState + useEffect` 타이머 → `useQuery` `isLoading` 기반으로 교체
- ⚠️ 배너 섹션(`HeroBannerCarousel`)은 API 미지원 → `homeBannerEvents` mock 유지

---

## Phase 11 — Ticketing + Queue API 연동 ✅ 완료

> **선행 조건**: Phase 9, 10

### 11-1. Queue API ✅

- [x] `POST /queue/check/{showId}` → `checkQueue(showId)` — `src/features/booking/api/queue.ts`
- [x] `GET /queue/{showId}` → `pollQueue(showId)` — 3초 interval 폴링
- [x] `useQueue(showId, sectionsForDate, onActive)` hook — `src/features/booking/model/useQueue.ts`
  - WAIT → 폴링, ACTIVE → `onActive(token, remainMs)` 콜백, NOT_WAIT → 자동 재진입
  - `queueToken` 상태 → `BookingContext.setQueueToken()` 연결

### 11-2. 회차 목록 + 좌석 요약 API ✅

- [x] `GET /shows/{eventId}/shows` → `getShows(eventId)` — `src/features/show/api/getShows.ts`
- [x] `GET /shows/{eventId}/shows/{showId}/seats/summary` → `getSeatsSummary(eventId, showId)` — `src/features/booking/api/getSeatsSummary.ts`
- [x] `GET /shows/{eventId}/shows/{showId}/seats/availability?tier=&zoneNo=` → `getSeatsAvailability(eventId, showId, tier, zoneNo)` — `src/features/booking/api/getSeatsAvailability.ts`

### 11-3. 예매 확정 + 마이티켓 ✅

> **실제 티켓 API 엔드포인트** (ticket_api.md 확인):
> - 좌석 목록: `GET /api/v1/ticket/events/{eventId}/shows/{showId}/seats`
> - 단일 좌석 선점+예약: `POST /api/v1/ticket/reservations`
> - 다중 좌석 원자 선점: `POST /api/v1/ticket/reservations/bulk` (미완성)
> - 예약 확정: `POST /api/v1/ticket/reservations/{reservationId}/confirm`
> - 선점 상태 조회: `GET /api/v1/ticket/reservations/{reservationId}/hold-status`
> - 예약 취소: `POST /api/v1/ticket/reservations/{reservationId}/cancel`

- [x] `bookTicket()` 함수 — `POST /api/v1/ticket/reservations` 연동 완료
      Request: `{ eventId, showId, artistId, seatId, holdSeconds: 180 }`
      Response: `{ reservationId, status, paymentStatus, expiresAt }`
      ⚠️ 다중 좌석은 각각 개별 호출 (bulk API 미완성 대기 중)
- [x] 예약 확정 API 함수 — `POST /api/v1/ticket/reservations/{reservationId}/confirm`
  - `src/features/booking/api/confirmReservation.ts` 생성 완료
  - `BookingContext` Toss 결제 성공 콜백에서 `Promise.allSettled(restoredIds.map(confirmReservation))` 호출
- [x] 마이페이지 티켓 월렛 — `GET /api/v1/ticket/users/{userId}/reservations?status=CONFIRMED` 연동
  - `getMyReservations(userId, status?)` — `src/features/reservation/api/getMyReservations.ts`
  - `useMyReservations(userId)` — `src/features/reservation/model/useMyReservations.ts`
  - `MyPageWidget`에서 `useMyReservations` 사용 → `TicketWalletTab`에 실제 데이터 전달
  - ⚠️ `seatId` 파싱 제한: API 응답의 `seatId` 필드만으로 section/row/number 분리 불가 → 현재 seatId 그대로 표시 (좌석 API 추가 호출 시 개선 가능)

---

## Phase 12 — Payments API 연동 ✅ 완료

> **프론트 직접 호출 엔드포인트**: `POST /api/v1/payments/confirm`, `GET /api/v1/payments/order/{orderId}`, `POST /api/v1/payments/{paymentKey}/cancel`  
> **서버 내부 자동 처리 (프론트 직접 호출 X)**: `POST /api/v1/payments/create`  
> — 각 서비스(양도 reserve, 멤버십 구독, 티켓 예약) 구매 API 호출 시 내부에서 자동 생성

- [x] API 함수 + 타입 — `src/features/payment/api/confirmPayment.ts`, `getPayment.ts`
- [x] `PaymentView` — `bookTicket()` + `confirmPayment()` 실제 연동 (mock setTimeout 제거)
  - 성공 → `confirmation` / 실패(catch) → `payment-failed` + 60초 재시도
- [x] `MembershipPaymentStep` — `subscribeMembership()` → `confirmPayment()` → `activateMembership()` 연동
- [x] Toss Payments SDK 연동 (`src/features/payment/lib/toss.ts`)
  - 예매: `PaymentView` → Toss 리다이렉트 → `BookingContext` 콜백 처리
  - 양도: `TransferPurchaseSidebar` → Toss 리다이렉트 → 사이드바 콜백 처리
  - 멤버십: `MembershipPaymentStep` → Toss 리다이렉트 → `MembershipWidget` 콜백 처리
- [x] 결제 취소 — `POST /api/v1/payments/{paymentKey}/cancel` (body: `{ cancelReason: string }`)
  - `cancelPayment(paymentKey, cancelReason)` — `src/features/payment/api/cancelPayment.ts`
  - `CancelBookingDialog` — `src/widgets/my-page/CancelBookingDialog.tsx` (취소 사유 셀렉트 + AlertDialog)
  - `TicketWalletTab` — `useMutation(cancelPayment)` 연결, 성공 시 `my-reservations` 쿼리 invalidate
  - ⚠️ `paymentKey` 제한: 예약 목록 API(`GET /ticket/users/{userId}/reservations`)가 `paymentKey`를 미반환 → `Ticket.paymentKey`가 undefined인 경우 alert 표시 후 중단. 백엔드에서 paymentKey 필드 추가 시 자동 활성화

---

## Phase 13a — 회차 선예매 정책 조회 API ✅

- [x] `getPresalePolicy(eventId, showId)` — `src/features/membership/api/getPresalePolicy.ts`
- [x] `usePresalePolicy(eventId, showId)` — `src/features/membership/model/usePresalePolicy.ts`

---

## Phase 13b — 아티스트 멤버십 취소 API ✅

- [x] `cancelMembership(orderId, reason?)` — `src/features/membership/api/cancelMembership.ts`
- [x] `useCancelMembership` — `onSuccess`: `MEMBERSHIPS_QUERY_KEY` invalidate

---

## Phase 13 — User 추가 기능 🔶 부분 완료

- [x] 닉네임 변경 — `PATCH /api/v1/auth/me/name` (body: `{ name }`) → `updateNickname` + `useUpdateNickname` 연동 완료 (`MyPageWidget`)
- [ ] 비밀번호 찾기 / 변경 — 엔드포인트 미확정
- [ ] 회원정보 수정 (마케팅/푸시/SMS 동의) — `PATCH /api/v1/auth/me/consents` (body: `{ marketingConsent, pushConsent, smsConsent }`)
  - `SettingsTab`의 `handleUpdateUser` 현재 TODO 상태 → `useCurrentUser` invalidate 필요
- [ ] 회원 탈퇴 — `DELETE /api/v1/auth/me` (UI 없음)

---

## Phase 14 — Community API 연동 🔶 부분 완료

> **서비스**: `NEXT_PUBLIC_COMMUNITY_API_URL` (port 8082)

### 14-1. 양도 게시글 CRUD ✅

- [x] `POST /api/v1/transfers/posts` → `createTransferPost` — `TransferListingModal` 연결
- [x] `DELETE /api/v1/transfers/posts/{id}` → `deleteTransferPost` — `TransferHistoryTab` 연결
- [x] `PATCH /api/v1/transfers/posts/{id}` → `updateTransferPost` — `TransferHistoryTab` 연결

### 14-2. 양도 예매·결제 ✅

- [x] `POST /api/v1/transfers/posts/{id}/reserve?artistId=` → `reserveTransferPost` — `TransferPurchaseSidebar` 연결
- [x] `POST /api/v1/transfers/posts/confirm` → `confirmTransferPost` — `PaymentDialog.onComplete` 후 호출  
      ⚠️ `paymentKey`는 Toss 실결제 연동 전까지 `mock_${timestamp}` 사용 중

### 14-3. 마이페이지 양도 내역 ✅

- [x] `GET /api/v1/transfers/me/sales` → `getMySales(userId)` — `MyPageWidget` 연동
- [x] `GET /api/v1/transfers/me/purchases` → `getMyPurchases(userId)` — `MyPageWidget` 연동

### 14-4. 소통 탭 게시글 🔲

> UI(`ArtistCommunityTab`, `PostCard`) 완성. 현재 `getCommunityPostsByArtistId()` mock 사용 중.

- [ ] `getPosts(artistId)`, `createPost`, `createComment` API 함수 (`src/features/community/api/`)
- [ ] `ArtistDetailWidget` — `getCommunityPostsByArtistId()` mock → 실제 API 교체
- [ ] 게시글 작성 UI 연동 (현재 없음)

---

## 성능 최적화

- [ ] `ConfirmationView` — `next/dynamic` → canvas-confetti + qrcode.react 초기 번들 제거
- [ ] `QRCodeModal` — `QRCodeSVG` dynamic import

### EKS 마이그레이션 후 (Post-MVP)

- [ ] `next.config.ts` — `output: "export"` 제거, `images: { unoptimized: true }` 제거
- [ ] 모든 `fill` Image에 `sizes` prop 추가 (자동 WebP 최적화)
