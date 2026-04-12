# URR 전체 진행 체크리스트

> 마지막 업데이트: 2026-04-11 (2차)

---

## 전체 API 연동 요약

| 서비스                             |  전체  | ✅ 연동됨 | ❌ 미연동 | ⚠️ 불일치 | ➖ 불필요 |
| ---------------------------------- | :----: | :-------: | :-------: | :-------: | :-------: |
| Auth                               |   13   |    13     |     0     |     0     |     0     |
| Event / Artist / Membership / Show |   33   |    21     |     0     |     0     |    12     |
| Ticket                             |   14   |     4     |     2     |     0     |     8     |
| Queue                              |   3    |     2     |     0     |     0     |     1     |
| Payment                            |   8    |     4     |     0     |     0     |     4     |
| Community (양도)                   |   11   |     9     |     0     |     0     |     2     |
| **합계**                           | **82** |  **53**   |   **2**   |   **0**   |  **27**   |

> **범례**: ✅ 연동됨 / ❌ 미연동(필요) / ⚠️ 연동됐으나 스펙 불일치 / ➖ 내부·관리자 전용 또는 불필요

---

## ⚠️ 현재 알려진 이슈

| 우선순위 | 항목                           | 설명                                                                                                                                                             |
| -------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🟡       | hold-status 미연동             | `GET /api/v1/ticket/reservations/{id}/hold-status` — 결제 전 선점 잔여 TTL 표시에 필요                                                                           |
| 🟡       | ticket seats 엔드포인트 불일치 | 코드는 event-service의 `/shows/.../seats/availability`를 사용 중 — ticket-service의 `/api/v1/ticket/events/{eventId}/shows/{showId}/seats`와 역할 중복 확인 필요 |

---

## 페이지별 API 연동 현황

| 페이지          | URL                              | UI  | API 연동 | 비고                                                               |
| --------------- | -------------------------------- | --- | -------- | ------------------------------------------------------------------ |
| 홈              | `/`                              | ✅  | ✅       | `getHome`                                                          |
| 아티스트 목록   | `/artists`                       | ✅  | ✅       | `getArtists`                                                       |
| 아티스트 상세   | `/artists/:id`                   | ✅  | ✅       | `getArtist`, `getArtistEvents`, follow/unfollow, 양도 목록         |
| 공연 목록       | `/events`                        | ✅  | ✅       | `getEvents`                                                        |
| 공연 상세       | `/events/:id`                    | ✅  | ✅       | `getEventDetail`, `getShows`, `getShowDetail`                      |
| 예매            | `/events/:id/booking`            | ✅  | ✅       | 대기열·구역·좌석·결제·취소 전 연동                                 |
| 멤버십 가입     | `/membership`                    | ✅  | ✅       | `getMembershipPolicies`, `subscribeMembership`, `getPresalePolicy` |
| 마이페이지      | `/my-page`                       | ✅  | ✅       | `getMyReservations`, `getMemberships`, 판매/구매 내역              |
| 온보딩 / 로그인 | `/onboarding`                    | ✅  | ⚠️       | 이메일 인증 (`smsSend`, `smsVerify`) 스펙 불일치                   |
| 검색            | `/search`                        | ✅  | ➖       | 전용 검색 API 스펙 없음 — mock 또는 `getArtists`·`getEvents` 조합  |
| 양도 상세       | `/transfer/:artistId/:listingId` | ✅  | ✅       | `getTransferPostById`                                              |

---

## 서비스별 상세

### Auth Service

> 파일 위치: `src/features/auth/api/`

| #   | API                      | 메서드 | 엔드포인트                        | 연동 파일                       | 상태 | 비고                                   |
| --- | ------------------------ | ------ | --------------------------------- | ------------------------------- | :--: | -------------------------------------- |
| 1   | 카카오 OAuth 로그인      | POST   | `/api/v1/auth/oauth/kakao`        | `kakaoLogin.ts`                 |  ✅  | 409 → `/rejoin` 처리                   |
| 2   | 카카오 OAuth 재가입 확정 | POST   | `/api/v1/auth/oauth/kakao/rejoin` | `kakaoRejoin.ts`                |  ✅  |                                        |
| 3   | 내 정보 조회             | GET    | `/api/v1/auth/me`                 | `me.ts`                         |  ✅  |                                        |
| 4   | 내 이름 변경             | PATCH  | `/api/v1/auth/me/name`            | `updateName.ts`                 |  ✅  |                                        |
| 5   | 동의 설정 변경           | PATCH  | `/api/v1/auth/me/consents`        | `updateConsents.ts`             |  ✅  |                                        |
| 6   | 로그아웃                 | POST   | `/api/v1/auth/logout`             | `logout.ts`                     |  ✅  |                                        |
| 7   | 토큰 재발급              | POST   | `/api/v1/auth/token/reissue`      | `reissue.ts` + `interceptor.ts` |  ✅  |                                        |
| 8   | 회원 탈퇴                | DELETE | `/api/v1/auth/me`                 | `deleteAccount.ts`              |  ✅  |                                        |
| 9   | 일반 회원가입            | POST   | `/api/v1/auth/register`           | `register.ts`                   |  ✅  | 응답 HTTP 201, 2xx 허용으로 무해       |
| 10  | 일반 로그인              | POST   | `/api/v1/auth/login`              | `login.ts`                      |  ✅  |                                        |
| 11  | 소셜 온보딩 완료         | POST   | `/api/v1/auth/onboarding/social`  | `socialOnboarding.ts`           |  ✅  |                                        |
| 12  | 이메일 인증번호 발송     | POST   | `/api/v1/auth/sms/send`           | `smsSend.ts`                    |  ✅  | `{phoneNumber}` 필드로 확정 사용       |
| 13  | 이메일 인증번호 검증     | POST   | `/api/v1/auth/sms/verify`         | `smsVerify.ts`                  |  ✅  | `{phoneNumber, code}` 필드로 확정 사용 |

---

### Event / Artist / Membership / Show Service

> 파일 위치: `src/features/{artist,event,membership,show}/api/`

| #   | API                            | 메서드 | 엔드포인트                                                          | 연동 파일                                 | 상태 | 비고                                   |
| --- | ------------------------------ | ------ | ------------------------------------------------------------------- | ----------------------------------------- | :--: | -------------------------------------- |
| 2   | 아티스트 생성                  | POST   | `/api/v1/artists`                                                   | —                                         |  ➖  | ADMIN 전용                             |
| 3   | 아티스트 목록 조회             | GET    | `/api/v1/artists`                                                   | `artist/api/getArtists.ts`                |  ✅  |                                        |
| 4   | 아티스트 상세 조회             | GET    | `/api/v1/artists/{artistId}`                                        | `artist/api/getArtist.ts`                 |  ✅  |                                        |
| 5   | 아티스트 멤버십 구독           | POST   | `/api/v1/artists/{artistId}/membership`                             | `membership/api/subscribeMembership.ts`   |  ✅  |                                        |
| 6   | 아티스트 멤버십 활성화         | POST   | `/api/v1/artists/memberships/activate`                              | —                                         |  ➖  | 서비스 내부                            |
| 7   | 아티스트 멤버십 취소           | POST   | `/api/v1/artists/memberships/cancel`                                | `membership/api/cancelMembership.ts`      |  ✅  |                                        |
| 8   | 아티스트 팔로우                | POST   | `/api/v1/artists/{artistId}/follow`                                 | `artist/api/followArtist.ts`              |  ✅  |                                        |
| 9   | 아티스트 언팔로우              | DELETE | `/api/v1/artists/{artistId}/follow`                                 | `artist/api/unfollowArtist.ts`            |  ✅  |                                        |
| 10  | 팔로우한 아티스트 목록         | GET    | `/api/v1/artists/followings`                                        | —                                         |  ➖  | UI 없음                                |
| 11  | 아티스트 멤버십 정책 조회      | GET    | `/api/v1/membership/artists/{artistId}/membership-policies`         | `membership/api/getMembershipPolicies.ts` |  ✅  |                                        |
| 12  | 회차 선예매 정책 조회          | GET    | `/api/v1/membership/events/{eventId}/shows/{showId}/presale-policy` | `membership/api/getPresalePolicy.ts`      |  ✅  |                                        |
| 13  | 내 멤버십 목록 조회            | GET    | `/api/v1/membership`                                                | `membership/api/getMemberships.ts`        |  ✅  |                                        |
| 14  | 내 멤버십 상세 조회            | GET    | `/api/v1/membership/{membershipId}`                                 | —                                         |  ➖  | UI 없음                                |
| 15  | 내 멤버십 닉네임 수정          | PATCH  | `/api/v1/membership/{membershipId}/nickname`                        | `membership/api/updateNickname.ts`        |  ✅  |                                        |
| 16  | 유저 멤버십 레벨 조회          | GET    | `/api/v1/membership/level`                                          | —                                         |  ➖  | 서비스 내부                            |
| 17  | 유저 멤버십 조회               | GET    | `/api/v1/membership/internal/membership-info`                       | —                                         |  ➖  | 서비스 내부                            |
| 18  | 공연 생성                      | POST   | `/api/v1/artists/{artistId}/events`                                 | —                                         |  ➖  | ADMIN 전용                             |
| 19  | 아티스트 공연 목록 조회        | GET    | `/api/v1/artists/{artistId}/events`                                 | `event/api/getArtistEvents.ts`            |  ✅  |                                        |
| 20  | 공연 상세 조회                 | GET    | `/api/v1/artists/{artistId}/events/{eventId}`                       | `event/api/getEventDetail.ts`             |  ✅  |                                        |
| 21  | 전체 공연 목록 조회            | GET    | `/api/v1/events`                                                    | `event/api/getEvents.ts`                  |  ✅  | `subtitle`, `venueAddress` 추가        |
| 22  | 공연장 템플릿 생성             | POST   | `/api/v1/events/venues`                                             | —                                         |  ➖  | ADMIN 전용                             |
| 23  | 공연장 템플릿 목록 조회        | GET    | `/api/v1/events/venues`                                             | —                                         |  ➖  | 서비스 내부                            |
| 24  | 공연장 템플릿 상세 조회        | GET    | `/api/v1/events/venues/{venueTemplateId}`                           | —                                         |  ➖  | 서비스 내부                            |
| 25  | Home 큐레이션 조회             | GET    | `/api/v1/events/home`                                               | `home/api/getHome.ts`                     |  ✅  |                                        |
| 26  | 공연 회차 생성                 | POST   | `/api/v1/shows/{eventId}/shows`                                     | —                                         |  ➖  | ADMIN 전용                             |
| 27  | 공연 회차 목록 조회            | GET    | `/api/v1/shows/{eventId}/shows`                                     | `show/api/getShows.ts`                    |  ✅  |                                        |
| 28  | 공연 회차 상세 조회            | GET    | `/api/v1/shows/{eventId}/shows/{showId}`                            | `show/api/getShowDetail.ts`               |  ✅  |                                        |
| 29  | 공연 회차 좌석 메타데이터 조회 | GET    | `/api/v1/shows/{eventId}/shows/{showId}/seatmap`                    | —                                         |  ➖  | VenueMap SVG 하드코딩                  |
| 30  | 회차별 가격/구역 정책 조회     | GET    | `/api/v1/shows/{showId}/sections`                                   | `show/api/getSections.ts`                 |  ✅  |                                        |
| 31  | 공연 회차 좌석 카탈로그 조회   | GET    | `/api/v1/shows/{eventId}/shows/{showId}/seats`                      | `show/api/getShowSeats.ts`                |  ✅  | seatId 형식 `{section}-{row}-{number}` |
| 32  | 잔여석 전체 요약 조회          | GET    | `/api/v1/shows/{eventId}/shows/{showId}/seats/summary`              | `booking/api/getSeatsSummary.ts`          |  ✅  |                                        |
| 33  | 예매 가능 좌석 조회            | GET    | `/api/v1/shows/{eventId}/shows/{showId}/seats/availability`         | `booking/api/getSeatsAvailability.ts`     |  ✅  |                                        |
| 34  | 멤버십 예매 오픈 시간표 조회   | GET    | `/api/v1/shows/{eventId}/shows/{showId}/booking-windows`            | `booking/api/getBookingWindows.ts`        |  ✅  |                                        |

---

### Ticket Service

> 파일 위치: `src/features/booking/api/`, `src/features/reservation/api/`

| #   | API                        | 메서드 | 엔드포인트                                                      | 연동 파일                              | 상태 | 비고                                            |
| --- | -------------------------- | ------ | --------------------------------------------------------------- | -------------------------------------- | :--: | ----------------------------------------------- |
| 1   | 좌석 조회                  | GET    | `/api/v1/ticket/events/{eventId}/shows/{showId}/seats`          | —                                      |  ❌  | event-service의 `/seats/availability`로 대체 중 |
| 2   | 단일 좌석 선점 + 예약 생성 | POST   | `/api/v1/ticket/reservations`                                   | `booking/api/bookTicket.ts`            |  ✅  |                                                 |
| 3   | 예약 확정                  | POST   | `/api/v1/ticket/reservations/confirm`                           | `booking/api/confirmReservation.ts`    |  ✅  |                                                 |
| 4   | 결제 전 선점 상태 조회     | GET    | `/api/v1/ticket/reservations/{reservationId}/hold-status`       | —                                      |  ❌  | 결제 화면 TTL 표시에 필요                       |
| 5   | 예약 만료 처리             | POST   | `/api/v1/ticket/reservations/{reservationId}/expire`            | —                                      |  ➖  | 스케줄러 자동 처리                              |
| 6   | 예약 취소                  | POST   | `/api/v1/ticket/reservations/cancel`                            | `booking/api/cancelReservation.ts`     |  ✅  | body: `{eventId, showId, seatId}`               |
| 7   | 환불 처리                  | POST   | `/api/v1/ticket/reservations/{reservationId}/refund`            | —                                      |  ➖  | 서버 내부 처리                                  |
| 8   | 예약티켓 목록 조회         | GET    | `/api/v1/ticket/users/reservations`                             | `reservation/api/getMyReservations.ts` |  ✅  |                                                 |
| 9   | (내부) 양도 가능 여부 조회 | GET    | `/api/v1/ticket/internal/transfers/{reservationId}/eligibility` | —                                      |  ➖  | 서비스 내부                                     |
| 10  | (내부) 소유권 양도 완료    | POST   | `/api/v1/ticket/internal/transfers/{reservationId}/complete`    | —                                      |  ➖  | 서비스 내부                                     |
| 11  | (내부) 티켓 좌석 정보 조회 | POST   | `/api/v1/ticket/internal/transfer-seat-info`                    | —                                      |  ➖  | 서비스 내부                                     |
| 12  | (내부) 사용불가 좌석 조회  | POST   | `/api/v1/ticket/internal/seats/statuses`                        | —                                      |  ➖  | 서비스 내부                                     |
| 13  | 티켓 좌석 정보 조회        | POST   | `/api/v1/ticket/seats/statuses`                                 | —                                      |  ➖  | 서비스 내부                                     |
| 14  | Health Check               | GET    | `/health`                                                       | —                                      |  ➖  |                                                 |

---

### Queue Service

> 파일 위치: `src/features/booking/api/queue.ts`

| #   | API                 | 메서드 | 엔드포인트                     | 연동 파일                           | 상태 | 비고 |
| --- | ------------------- | ------ | ------------------------------ | ----------------------------------- | :--: | ---- |
| 1   | 대기열 진입 및 확인 | POST   | `/api/v1/queue/check/{showId}` | `booking/api/queue.ts` (checkQueue) |  ✅  |      |
| 2   | 대기열 상태 폴링    | GET    | `/api/v1/queue/{showId}`       | `booking/api/queue.ts` (pollQueue)  |  ✅  |      |
| 3   | Health Check        | GET    | `/health`                      | —                                   |  ➖  |      |

---

### Payment Service

> 파일 위치: `src/features/payment/api/`

| #   | API                        | 메서드 | 엔드포인트                                                     | 연동 파일                            | 상태 | 비고                       |
| --- | -------------------------- | ------ | -------------------------------------------------------------- | ------------------------------------ | :--: | -------------------------- |
| 1.1 | 결제 데이터 생성           | POST   | `/api/v1/payments/create`                                      | `payment/api/createPaymentRecord.ts` |  ✅  | status 값 비교 없음 — 무해 |
| 1.2 | 결제 승인                  | POST   | `/api/v1/payments/confirm`                                     | `payment/api/confirmPayment.ts`      |  ✅  |                            |
| 1.3 | 결제 단건 조회             | GET    | `/api/v1/payments/order/{orderId}`                             | `payment/api/getPayment.ts`          |  ✅  |                            |
| 1.4 | 결제 취소                  | POST   | `/api/v1/payments/{paymentKey}/cancel`                         | `payment/api/cancelPayment.ts`       |  ✅  | void 반환 — 무해           |
| 2.1 | 멤버십 결제 생성 (내부)    | POST   | `/api/v1/internal/payments/membership/create`                  | —                                    |  ➖  | 서비스 내부                |
| 2.2 | 티켓 예매 결제 생성 (내부) | POST   | `/api/v1/internal/payments/ticket/create`                      | —                                    |  ➖  | 서비스 내부                |
| 2.3 | 양도 구매 결제 생성 (내부) | POST   | `/api/v1/internal/payments/transfer/create`                    | —                                    |  ➖  | 서비스 내부                |
| 2.4 | 예매 결제 금액 조회 (내부) | GET    | `/api/v1/internal/payments/reservation/{reservationId}/amount` | —                                    |  ➖  | 서비스 내부                |

> **참고**: `PaymentStatus` enum — `READY`→`PENDING`, `DONE`→`PAID`, `PARTIAL_CANCELED` 제거됨. status 값을 직접 비교하는 UI 로직이 있다면 확인 필요.

---

### Community (양도) Service

> 파일 위치: `src/features/transfer/api/`

| #   | API                         | 메서드 | 엔드포인트                             | 연동 파일                                                | 상태 | 비고 |
| --- | --------------------------- | ------ | -------------------------------------- | -------------------------------------------------------- | :--: | ---- |
| 0-1 | Community Health Check      | GET    | `/api/v1/community`                    | —                                                        |  ➖  |      |
| 0-2 | Ops Health Check            | GET    | `/health`                              | —                                                        |  ➖  |      |
| 1-1 | 양도 게시글 등록            | POST   | `/api/v1/transfers/posts`              | `transfer/api/getTransferPosts.ts` (createTransferPost)  |  ✅  |      |
| 1-2 | 양도 게시글 상세 조회       | GET    | `/api/v1/transfers/posts/{id}`         | `transfer/api/getTransferPosts.ts` (getTransferPostById) |  ✅  |      |
| 1-3 | 양도 게시글 목록 조회       | GET    | `/api/v1/transfers/posts`              | `transfer/api/getTransferPosts.ts` (getTransferPosts)    |  ✅  |      |
| 1-4 | 양도 게시글 삭제            | DELETE | `/api/v1/transfers/posts/{id}`         | `transfer/api/getTransferPosts.ts` (deleteTransferPost)  |  ✅  |      |
| 1-5 | 양도 게시글 예매 (결제요청) | POST   | `/api/v1/transfers/posts/{id}/reserve` | `transfer/api/getTransferPosts.ts` (reserveTransferPost) |  ✅  |      |
| 1-6 | 양도 게시글 예매 확정       | POST   | `/api/v1/transfers/posts/confirm`      | `transfer/api/getTransferPosts.ts` (confirmTransferPost) |  ✅  |      |
| 1-7 | 양도 게시글 수정            | PATCH  | `/api/v1/transfers/posts/{id}`         | `transfer/api/getTransferPosts.ts` (updateTransferPost)  |  ✅  |      |
| 1-8 | 나의 판매 내역 조회         | GET    | `/api/v1/transfers/me/sales`           | `transfer/api/getMyTransfers.ts` (getMySales)            |  ✅  |      |
| 1-9 | 나의 구매 내역 조회         | GET    | `/api/v1/transfers/me/purchases`       | `transfer/api/getMyTransfers.ts` (getMyPurchases)        |  ✅  |      |

---

## 비API 작업 체크리스트

> 기능 구현·버그 수정·정리 항목. API 연동과 별개로 남은 개발 작업.

### 🔴 긴급

| 완료 | 항목                 | 설명                                                                                                    |
| :--: | -------------------- | ------------------------------------------------------------------------------------------------------- |
|  ☐   | `/queue` 페이지 복구 | `src/app/queue/page.tsx` 현재 삭제 상태 — 예매 대기열 플로우에서 사용하는 범용 라우트이므로 재생성 필요 |

### 🟡 기능 미완성

| 완료 | 항목                           | 설명                                                                                                                               | 관련 파일                                             |
| :--: | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
|  ☐   | 결제 화면 hold-status TTL 표시 | 결제 중 좌석 선점 잔여 시간 카운트다운 없음                                                                                        | `booking/api/` + 결제 UI                              |
|  ☐   | 마이페이지 닉네임 수정 연동    | `handleUpdateUser`가 TODO 처리됨 — `PATCH /api/v1/auth/me/name` API는 이미 구현됨                                                  | `widgets/my-page/MyPageWidget.tsx`                    |
|  ☐   | 마이티켓 QR 코드 표시          | 예약 목록 연동됐으나 QR 표시 없음 — QR 발급 API 스펙 확인 필요                                                                     | `widgets/my-page/TicketWalletTab`                     |
|  ☐   | 검색 페이지 실 API 연동        | `SearchWidget`이 mock 데이터만 사용 중 — 전용 검색 API 없음, 백엔드 요청 또는 `getArtists`·`getEvents` 쿼리 파라미터 조합으로 대체 | `widgets/search/SearchWidget.tsx`                     |
|  ☐   | 알림 페이지 실 API 연동        | `NotificationContext`가 `mockNotifications` 하드코딩 — 알림 API 스펙 없음, 백엔드 요청 필요                                        | `features/notification/model/NotificationContext.tsx` |

### 🟢 정리·안정화

| 완료 | 항목                           | 설명                                                                             | 관련 파일                          |
| :--: | ------------------------------ | -------------------------------------------------------------------------------- | ---------------------------------- |
|  ☐   | BookingGuard 동작 검증         | 예매 페이지 직접 URL 접근 차단 로직 신규 추가 — 정상 동작 확인 필요              | `widgets/booking/BookingGuard.tsx` |
|  ☐   | `/landing` 페이지 역할 정리    | CLAUDE.md 라우트 목록에 없는 미문서 페이지 — 유지 여부 결정 필요                 | `src/app/landing/page.tsx`         |
|  ☐   | `npm run build` 빌드 통과 확인 | 현재 변경된 파일 다수 (booking, auth, shared/api) — pre-commit 훅 + CI 빌드 검증 |

### 백엔드 요청 필요

| 항목             | 이유                               |
| ---------------- | ---------------------------------- |
| 통합 검색 API    | 아티스트·공연 단일 엔드포인트 없음 |
| 알림 API         | 스펙 자체 없음                     |
| QR 발급·조회 API | 마이티켓 QR 표시에 필요            |
