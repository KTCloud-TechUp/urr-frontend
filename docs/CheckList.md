# URR 전체 진행 체크리스트

## 전체 진행 현황

| 순위 | Phase | 영역                             | 상태                    |
| ---- | ----- | -------------------------------- | ----------------------- |
| —    | 1     | 패키지 + API 클라이언트          | ✅ 완료                 |
| —    | 2     | tokenStore + auth 타입           | ✅ 완료                 |
| —    | 3     | TanStack Query + AuthInitializer | ✅ 완료                 |
| —    | 4     | 라우트 보호                      | ✅ 완료                 |
| —    | 5     | 인증 API 연동 (카카오/네이버)    | ✅ 완료                 |
| —    | 7     | 예매 UI 리팩토링                 | ✅ 완료                 |
| —    | 8     | 예매 VenueMap 인터랙션 UI        | ✅ 완료                 |
| 1    | 9     | 예매 Zustand store               | 🔲 진행 예정            |
| 2    | 10    | Events API 연동                  | 🔲 대기 (9과 병행 가능) |
| 3    | 6     | 온보딩 플로우 완성               | 🔲 진행 중 (부분 완료)  |
| 4    | 11    | Ticketing + Queue 연동           | 🔲 대기                 |
| 5    | 12    | Payments 연동                    | 🔲 대기                 |
| 6    | 13    | User 추가 기능                   | 🔲 대기                 |
| 7    | 14    | Community 연동                   | 🔲 대기                 |

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

## Phase 6 — 온보딩 플로우 완성 🔲 진행 중

> 소셜/이메일 로그인 및 본인인증(IdentityStep)은 구현됨. 이하 미완성.

### 6-1. 온보딩 플로우 — UI 완료 ✅
- [x] `AgeGateStep.tsx` — 만 14세 이상/미만 분기
- [x] `IdentityStep.tsx` — 본인인증 폼 (ShieldCheck 헤더, 중복계정 다이얼로그)
- [x] `GuardianIdentityStep.tsx` — 법정대리인 본인인증 폼
- [x] `TermsStep.tsx` — 필수 2개 + 선택 1개 약관 동의 (미성년자 보호자 동의 포함)
- [x] `OnboardingWidget` flowState 6단계 확장 (auth → age-gate → identity/guardian-identity → terms → complete)
- [x] SMS API 함수 추가 — `smsSend`, `smsVerify` (`src/features/auth/api/`)

### 6-2. 본인인증 SMS API 미연동 ⚠️ 나중에 붙여야 함
- [ ] `IdentityStep.tsx` `handleSendCode` — `smsSend(phone)` 실제 호출로 교체
- [ ] `IdentityStep.tsx` `handleVerify` — `smsVerify(phone, code)` 실제 호출로 교체, `verified: false` 시 에러 표시
- [ ] `GuardianIdentityStep.tsx` `handleSendCode` — `smsSend(phone)` 실제 호출로 교체
- [ ] `GuardianIdentityStep.tsx` `handleVerify` — `smsVerify(phone, code)` 실제 호출로 교체

### 6-3. 약관 동의 API 미연동 ⚠️ 나중에 붙여야 함
- [ ] `handleTermsComplete` (`useOnboardingAuth.ts`) — 가입 성공 후 `updateConsents()` 호출 (마케팅 동의 선택값 전달)
  - TermsStep에서 `marketing` 체크 여부를 `onComplete(marketingConsent: boolean)` 으로 올려야 함

### 6-4. 가입 완료
- [x] `OnboardingWidget` `complete` 단계 → `SignupCompleteStep` 표시

### 6-5. 아티스트 선택 (ArtistSelectStep)
- [ ] 카테고리 탭 + 검색 + `GET /api/events/artists` 연동
- [ ] 1명 이상 필수 선택 검증 + 팔로우 API 호출

### 6-6. 멤버십 소개 (MembershipIntroStep)
- [ ] 등급별 혜택 비교표
- [ ] [가입 ₩30,000/년] CTA / [나중에] skip

### 6-7. 멜론 연동 (MelonLinkStep)
- [ ] [연동하기] / [나중에] — 강제 아님, 팬 신뢰 점수 계산 트리거 (Mock)

### 6-4. 아티스트 선택 (ArtistSelectStep)
- [ ] 카테고리 탭 + 검색 + `GET /api/events/artists` 연동
- [ ] 1명 이상 필수 선택 검증 + 팔로우 API 호출

### 6-5. 멤버십 소개 (MembershipIntroStep)
- [ ] 등급별 혜택 비교표
- [ ] [가입 ₩30,000/년] CTA / [나중에] skip

### 6-6. 멜론 연동 (MelonLinkStep)
- [ ] [연동하기] / [나중에] — 강제 아님, 팬 신뢰 점수 계산 트리거 (Mock)

---

## Phase 9 — 예매 Zustand store 🔲

> **선행 조건**: Phase 8 완료 ✅

- [ ] `src/features/booking/model/useBookingStore.ts`
  - [ ] `bookingState`: `idle | queue | seats-section | seats-individual | payment | confirmation | payment-failed | seats-expired`
  - [ ] `selectedSeats: Seat[]` (최대 4석), `queueInfo`, `seatTimer` (180초)
  - [ ] 액션: `enterQueue`, `selectSection`, `selectSeat`, `removeSeat`, `enterPayment`, `confirmPayment`, `failPayment`, `expireSeats`, `reset`
- [ ] `BookingContext` → Zustand store로 마이그레이션

---

## Phase 10 — Events API 연동 🔲

> **선행 조건**: Phase 3 완료 ✅  
> **엔드포인트**: `GET /api/events`, `GET /api/events/:id`, `GET /api/events/artists`, `GET /api/events/artists/:id`

- [ ] API 함수: `getEvents`, `getEvent`, `getArtists`, `getArtist`
- [ ] TanStack Query hooks: `useEvents`, `useEvent`, `useArtists`, `useArtist`
- [ ] 홈페이지 5개 섹션 연동 (배너, 인기 아티스트, 뜨는 공연, 랭킹, 선예매) + 스켈레톤/에러 처리
- [ ] `/events` 목록 페이지 — 필터/정렬 + 무한 스크롤 or 페이지네이션
- [ ] `/events/:eventId` 상세 페이지 연동
- [ ] `/artists` 목록 + `/artists/:artistId` 상세 연동
- [ ] 아티스트 상세 — 해당 아티스트 공연 목록 + 멤버십 게이트

---

## Phase 11 — Ticketing + Queue API 연동 🔲

> **선행 조건**: Phase 9, 10  
> **엔드포인트**: `GET /api/ticketing/:eventId`, `POST /api/ticketing/book`, `GET /api/ticketing/my-tickets`, `GET /api/ticketing/queue/status`

- [ ] API 함수 + 서버 응답 타입
- [ ] `idle` 상태 — 구역 정보·잔여석 연동
- [ ] Queue 연동 — WebSocket 또는 polling(`refetchInterval: 10000`), 순번 digit roll 애니메이션
- [ ] `POST /api/ticketing/book` — 좌석 선택 + 결제 완료 후 호출 → `confirmation` + QR 데이터
- [ ] 마이페이지 티켓 월렛 — `GET /api/ticketing/my-tickets` + QR 모달 (`qrcode.react`)

---

## Phase 12 — Payments API 연동 🔲

> **선행 조건**: Phase 11  
> **엔드포인트**: `POST /api/payments/create`, `POST /api/payments/confirm`, `GET /api/payments/{orderId}`, `POST /api/payments/{paymentKey}/cancel`

- [ ] API 함수 + 타입 (`createPayment`, `confirmPayment`, `getPayment`, `cancelPayment`)
- [ ] `payment` 상태 → `POST /api/payments/create` → `orderId`, `paymentKey` 수신
- [ ] Toss Payments SDK 실제 연동
- [ ] 결제 성공 → `POST /api/payments/confirm` → `confirmation` / 실패 → `payment-failed` + 60초 재시도
- [ ] 결제 취소 — 확인 다이얼로그 → `POST /api/payments/{paymentKey}/cancel`

---

## Phase 13a — 회차 선예매 정책 조회 API ✅

> **엔드포인트**: `GET /api/v1/membership/events/{eventId}/shows/{showId}/presale-policy`  
> **인증**: 불필요

- [x] API 함수: `getPresalePolicy(eventId, showId)` — `src/features/membership/api/getPresalePolicy.ts`
- [x] TanStack Query hook: `usePresalePolicy(eventId, showId)` — `src/features/membership/model/usePresalePolicy.ts`
- 타입: `PresalePolicy` (`eventId`, `showId`, `generalOpenAt`, `tiers[]`)
- `tiers[]`: `{ tier, openAt, presaleOffsetMinutes, bookingFeeWon }`

---

## Phase 13b — 아티스트 멤버십 취소 API ✅

> **엔드포인트**: `POST /api/v1/artists/memberships/cancel`  
> **인증**: 불필요

- [x] API 함수: `cancelMembership(orderId, reason?)` — `src/features/membership/api/cancelMembership.ts`
- [x] TanStack Query hook: `useCancelMembership` — `src/features/membership/model/useCancelMembership.ts`
  - `onSuccess`: `MEMBERSHIPS_QUERY_KEY` invalidate
- Body: `{ orderId: string, reason: string }` (기본값 `"PAYMENT_CANCELED"`)

---

## Phase 13 — User 추가 기능 🔲

> ⚠️ 엔드포인트 미확정 — 백엔드 스펙 확인 후 업데이트

- [ ] 비밀번호 찾기 / 변경
- [ ] 회원정보 수정 (닉네임, 마케팅 동의) → `useCurrentUser` invalidate

---

## Phase 14 — Community API 연동 🔲

> **선행 조건**: Phase 10

- [ ] `getPosts`, `createPost`, `createComment` API 함수
- [ ] 아티스트 상세 소통 탭 — 게시글 목록/작성 연동

---

## 성능 최적화

- [ ] `ConfirmationView` — `next/dynamic` → canvas-confetti + qrcode.react 초기 번들 제거
- [ ] `QRCodeModal` — `QRCodeSVG` dynamic import

### EKS 마이그레이션 후 (Post-MVP)

- [ ] `next.config.ts` — `output: "export"` 제거, `images: { unoptimized: true }` 제거
- [ ] 모든 `fill` Image에 `sizes` prop 추가 (자동 WebP 최적화)
