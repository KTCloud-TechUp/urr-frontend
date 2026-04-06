# URR 전체 진행 체크리스트

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
| 1    | 9     | 예매 Zustand store               | 🔲 미착수                             |
| —    | 10    | Events/Artists API 연동          | ✅ 완료                               |
| 3    | 6     | 온보딩 플로우 완성               | 🔶 부분 완료                          |
| 4    | 11    | Ticketing + Queue 연동           | 🔶 부분 완료                          |
| 5    | 12    | Payments 연동                    | 🔲 미착수                             |
| 6    | 13    | User 추가 기능                   | 🔶 부분 완료 (닉네임만)               |
| 7    | 14    | Community 연동                   | 🔶 부분 완료 (양도 완료, 소통 미착수) |

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

- [ ] `IdentityStep.tsx` `handleSendCode` → `smsSend(phone)` 실제 호출
- [ ] `IdentityStep.tsx` `handleVerify` → `smsVerify(phone, code)` 실제 호출, `verified: false` 시 에러 표시
- [ ] `GuardianIdentityStep.tsx` `handleSendCode` → `smsSend(phone)` 실제 호출
- [ ] `GuardianIdentityStep.tsx` `handleVerify` → `smsVerify(phone, code)` 실제 호출

### 6-3. 약관 동의 API 미연동 🔲

- [ ] `handleTermsComplete` (`useOnboardingAuth.ts`) — `updateConsents()` 호출 (마케팅 동의 선택값 전달)
  - TermsStep에서 `marketing` 체크 여부를 `onComplete(marketingConsent: boolean)` 으로 올려야 함

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

## Phase 9 — 예매 Zustand store 🔲

> **선행 조건**: Phase 8 완료 ✅

- [ ] `src/features/booking/model/useBookingStore.ts`
  - [ ] `bookingState`: `idle | queue | seats-section | seats-individual | payment | confirmation | payment-failed | seats-expired`
  - [ ] `selectedSeats: Seat[]` (최대 4석), `queueInfo`, `seatTimer` (180초)
  - [ ] 액션: `enterQueue`, `selectSection`, `selectSeat`, `removeSeat`, `enterPayment`, `confirmPayment`, `failPayment`, `expireSeats`, `reset`
- [ ] `BookingContext` → Zustand store로 마이그레이션

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

## Phase 11 — Ticketing + Queue API 연동 🔶 부분 완료

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

### 11-3. 예매 확정 + 마이티켓 🔶

- [x] `POST /api/ticketing/book` → `bookTicket()` — `src/features/booking/api/bookTicket.ts`
      ⚠️ 요청/응답 타입 가정 기반 — 백엔드 실제 스펙 수신 후 타입 조정 필요
- [ ] 마이페이지 티켓 월렛 — `GET /api/ticketing/my-tickets` 연동
  - 현재 `TicketWalletTab`이 `getMyTickets()` mock 사용 중 → 실제 데이터로 교체

---

## Phase 12 — Payments API 연동 🔶

> **엔드포인트**: `POST /api/payments/confirm`, `GET /api/payments/order/{orderId}`  
> (`POST /api/payments/create`, `POST /api/payments/{paymentKey}/cancel` 는 서버 내부 자동 처리 — 프론트 직접 호출 없음)

- [x] API 함수 + 타입 — `src/features/payment/api/confirmPayment.ts`, `getPayment.ts`
- [x] `PaymentView` — `bookTicket()` + `confirmPayment()` 실제 연동 (mock setTimeout 제거)
  - 성공 → `confirmation` / 실패(catch) → `payment-failed` + 60초 재시도
- [x] `MembershipPaymentStep` — `subscribeMembership()` → `confirmPayment()` → `activateMembership()` 연동
- [x] Toss Payments SDK 연동 (`src/features/payment/lib/toss.ts`)
  - 예매: `PaymentView` → Toss 리다이렉트 → `BookingContext` 콜백 처리
  - 양도: `TransferPurchaseSidebar` → Toss 리다이렉트 → 사이드바 콜백 처리
  - 멤버십: `MembershipPaymentStep` → Toss 리다이렉트 → `MembershipWidget` 콜백 처리
- [ ] 결제 취소 — 확인 다이얼로그 → `POST /api/payments/{paymentKey}/cancel`

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

- [x] 닉네임 변경 — `updateNickname` + `useUpdateNickname` 연동 완료 (`MyPageWidget`)
- [ ] 비밀번호 찾기 / 변경 — 엔드포인트 미확정
- [ ] 회원정보 수정 (마케팅 동의) → `useCurrentUser` invalidate
  - `SettingsTab`의 `handleUpdateUser` 현재 TODO 상태

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
