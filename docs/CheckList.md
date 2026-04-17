# URR 프론트엔드 — API 연동 진행 현황

> 마지막 갱신: 2026-04-17  
> 범례: ✅ 완료 / 🔄 부분 연동 (일부 mock) / 🔲 미연동 (전체 mock)

---

## 인증 (Auth)

| 기능                | 메서드 | 엔드포인트                        | 상태 | 비고                                      |
| ------------------- | ------ | --------------------------------- | ---- | ----------------------------------------- |
| 카카오 OAuth 로그인 | POST   | `/api/v1/auth/oauth/kakao`        | ✅   |                                           |
| 카카오 재가입 확정  | POST   | `/api/v1/auth/oauth/kakao/rejoin` | ✅   |                                           |
| 일반 회원가입       | POST   | `/api/v1/auth/register`           | ✅   |                                           |
| 일반 로그인         | POST   | `/api/v1/auth/login`              | ✅   |                                           |
| 소셜 온보딩 완료    | POST   | `/api/v1/auth/onboarding/social`  | ✅   |                                           |
| 이메일 인증 발송    | POST   | `/api/v1/auth/sms/send`           | ✅   | 필드명: `email` (phoneNumber 아님)        |
| 이메일 인증 확인    | POST   | `/api/v1/auth/sms/verify`         | ✅   | 필드명: `email`, `code`                   |
| 내 정보 조회        | GET    | `/api/v1/auth/me`                 | ✅   |                                           |
| 이름 변경           | PATCH  | `/api/v1/auth/me/name`            | ✅   |                                           |
| 동의 설정 변경      | PATCH  | `/api/v1/auth/me/consents`        | ✅   |                                           |
| 로그아웃            | POST   | `/api/v1/auth/logout`             | ✅   |                                           |
| 회원 탈퇴           | DELETE | `/api/v1/auth/me`                 | ✅   |                                           |
| 토큰 재발급         | POST   | `/api/v1/auth/token/reissue`      | ✅   | 401 → 자동 retry (멀티탭 RTR 동기화 포함) |

---

## 홈 (Home)

| 기능        | 메서드 | 엔드포인트            | 상태 | 비고                             |
| ----------- | ------ | --------------------- | ---- | -------------------------------- |
| 홈 큐레이션 | GET    | `/api/v1/events/home` | ✅   | 인기 아티스트·트렌딩·랭킹·선예매 |

---

## 아티스트 (Artist)

| 기능                  | 메서드 | 엔드포인트                          | 상태 | 비고                                                 |
| --------------------- | ------ | ----------------------------------- | ---- | ---------------------------------------------------- |
| 아티스트 목록 조회    | GET    | `/api/v1/artists`                   | ✅   |                                                      |
| 아티스트 상세 조회    | GET    | `/api/v1/artists/{artistId}`        | ✅   |                                                      |
| 아티스트 팔로우       | POST   | `/api/v1/artists/{artistId}/follow` | ✅   |                                                      |
| 아티스트 언팔로우     | DELETE | `/api/v1/artists/{artistId}/follow` | ✅   |                                                      |
| 아티스트 소개 (홈탭)  | GET    | `/api/v1/artists/{artistId}`        | 🔄   | `debutDate`·`agency`·`genres` API 미제공 → mock 유지 |
| 아티스트 커뮤니티 탭  | —      | —                                   | 🔲   | `getCommunityPostsByArtistId()` mock                 |
| 아티스트 공연 목록 탭 | GET    | `/api/v1/artists/{artistId}/events` | ✅   |                                                      |
| 아티스트 양도 목록 탭 | GET    | `/api/v1/transfers/posts?artistId=` | ✅   |                                                      |

---

## 공연 (Event)

| 기능                       | 메서드 | 엔드포인트                                                  | 상태 | 비고                                     |
| -------------------------- | ------ | ----------------------------------------------------------- | ---- | ---------------------------------------- |
| 전체 공연 목록 조회        | GET    | `/api/v1/events`                                            | ✅   |                                          |
| 아티스트 공연 목록 조회    | GET    | `/api/v1/artists/{artistId}/events`                         | ✅   |                                          |
| 공연 상세 조회             | GET    | `/api/v1/artists/{artistId}/events/{eventId}`               | ✅   |                                          |
| 공연 상세 — 공연정보 탭    | —      | —                                                           | 🔲   | `notices`·`performanceDescription` mock  |
| 공연 회차 목록 조회        | GET    | `/api/v1/shows/{eventId}/shows`                             | ✅   |                                          |
| 공연 회차 상세 조회        | GET    | `/api/v1/shows/{eventId}/shows/{showId}`                    | ✅   |                                          |
| 회차별 구역/가격 정책 조회 | GET    | `/api/v1/shows/{showId}/sections`                           | ✅   |                                          |
| 좌석 카탈로그 조회         | GET    | `/api/v1/shows/{eventId}/shows/{showId}/seats`              | ✅   | `section` query param으로 구역 필터 가능 |
| 잔여석 전체 요약 조회      | GET    | `/api/v1/shows/{eventId}/shows/{showId}/seats/summary`      | ✅   |                                          |
| 예매 가능 좌석 조회        | GET    | `/api/v1/shows/{eventId}/shows/{showId}/seats/availability` | ✅   |                                          |
| 예매 오픈 시간표 조회      | GET    | `/api/v1/shows/{eventId}/shows/{showId}/booking-windows`    | ✅   |                                          |

---

## 예매 — 대기열 (Queue)

| 기능             | 메서드 | 엔드포인트                     | 상태 | 비고                            |
| ---------------- | ------ | ------------------------------ | ---- | ------------------------------- |
| 대기열 진입      | POST   | `/api/v1/queue/check/{showId}` | ✅   |                                 |
| 대기열 상태 폴링 | GET    | `/api/v1/queue/{showId}`       | ✅   |                                 |
| 대기열 퇴장      | DELETE | `/api/v1/queue/{showId}`       | 🔲   | 결제 완료 후 호출 필요 — 미연동 |

---

## 예매 — 좌석·예약 (Ticket)

| 기능                  | 메서드 | 엔드포인트                            | 상태 | 비고                                            |
| --------------------- | ------ | ------------------------------------- | ---- | ----------------------------------------------- |
| 좌석 선점 + 예약 생성 | POST   | `/api/v1/ticket/reservations`         | ✅   | response에 `orderId` 포함 (Toss 결제용)         |
| 예약 확정             | POST   | `/api/v1/ticket/reservations/confirm` | ✅   |                                                 |
| 예약 취소             | POST   | `/api/v1/ticket/reservations/cancel`  | ✅   |                                                 |
| 선점 해제             | POST   | `/api/v1/ticket/reservations/release` | ✅   | `resetBooking()` 호출 시 자동 (fire-and-forget) |
| 내 예매 목록 조회     | GET    | `/api/v1/ticket/users/reservations`   | ✅   |                                                 |

---

## 결제 (Payment)

| 기능      | 메서드 | 엔드포인트                 | 상태 | 비고              |
| --------- | ------ | -------------------------- | ---- | ----------------- |
| 결제 승인 | POST   | `/api/v1/payments/confirm` | ✅   | Toss 콜백 후 호출 |

---

## 멤버십 (Membership)

| 기능                | 메서드 | 엔드포인트                                                          | 상태 | 비고                                 |
| ------------------- | ------ | ------------------------------------------------------------------- | ---- | ------------------------------------ |
| 내 멤버십 목록 조회 | GET    | `/api/v1/membership`                                                | ✅   |                                      |
| 멤버십 구독         | POST   | `/api/v1/artists/{artistId}/membership`                             | ✅   |                                      |
| 멤버십 취소         | POST   | `/api/v1/artists/memberships/cancel`                                | ✅   |                                      |
| 멤버십 닉네임 수정  | PATCH  | `/api/v1/membership/{membershipId}/nickname`                        | ✅   |                                      |
| 멤버십 정책 조회    | GET    | `/api/v1/membership/artists/{artistId}/membership-policies`         | ✅   | `bookingType`·`transferFeeRate` 반영 |
| 선예매 정책 조회    | GET    | `/api/v1/membership/events/{eventId}/shows/{showId}/presale-policy` | ✅   |                                      |

---

## 양도 (Transfer / Community)

| 기능                       | 메서드 | 엔드포인트                             | 상태 | 비고                         |
| -------------------------- | ------ | -------------------------------------- | ---- | ---------------------------- |
| 양도 게시글 목록 조회      | GET    | `/api/v1/transfers/posts`              | ✅   | `sellerTradeCount` 필드 포함 |
| 양도 게시글 상세 조회      | GET    | `/api/v1/transfers/posts/{id}`         | ✅   |                              |
| 양도 게시글 등록           | POST   | `/api/v1/transfers/posts`              | ✅   |                              |
| 양도 게시글 수정           | PATCH  | `/api/v1/transfers/posts/{id}`         | ✅   |                              |
| 양도 게시글 삭제           | DELETE | `/api/v1/transfers/posts/{id}`         | ✅   |                              |
| 양도 예매 (결제 요청)      | POST   | `/api/v1/transfers/posts/{id}/reserve` | ✅   | response에 `orderId` 포함    |
| 양도 예매 확정 (결제 확정) | POST   | `/api/v1/transfers/posts/confirm`      | ✅   |                              |
| 나의 판매 내역 조회        | GET    | `/api/v1/transfers/me/sales`           | ✅   |                              |
| 나의 구매 내역 조회        | GET    | `/api/v1/transfers/me/purchases`       | ✅   |                              |

---

## 검색 (Search)

| 기능                      | 메서드 | 엔드포인트 | 상태 | 비고                                                      |
| ------------------------- | ------ | ---------- | ---- | --------------------------------------------------------- |
| 아티스트 + 공연 통합 검색 | —      | —          | 🔄   | `getArtists`/`getEvents` API 기반. 전용 엔드포인트 미연동 |

---

## 알림 (Notification)

| 기능           | 메서드 | 엔드포인트 | 상태 | 비고                                 |
| -------------- | ------ | ---------- | ---- | ------------------------------------ |
| 알림 목록 조회 | —      | —          | 🔲   | `NotificationContext` 내부 mock 상태 |
| 알림 읽음 처리 | —      | —          | 🔲   | mock                                 |

---

## 에러 처리

| 기능                              | 상태 | 비고                                        |
| --------------------------------- | ---- | ------------------------------------------- |
| 전역 에러 페이지 (`error.tsx`)    | ✅   | `ErrorView` variant=`runtime`               |
| 전역 404 페이지 (`not-found.tsx`) | ✅   | `ErrorView` variant=`not-found`             |
| 429 → 대기열 리다이렉트           | ✅   | `interceptor.ts` `redirectToQueue()`        |
| 401 자동 토큰 재발급 + 재시도     | ✅   | `fetchWithAuth()` + 멀티탭 BroadcastChannel |

---

## 미구현 / 향후 작업

| 항목                                  | 우선순위 | 비고                                                                                                     |
| ------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| 대기열 퇴장 API 연동                  | 🔴 높음  | `DELETE /api/v1/queue/{showId}` — 결제 완료(`/payments/confirm` 성공) 후 호출 필요                       |
| 알림 API 연동                         | 🟢 낮음  | SSE 또는 폴링 방식 결정 필요                                                                             |
| 공연정보 탭 실제 API 연동             | 🟡 보통  | `PerformanceInfoTab` — `notices`·`identityVerification`·`performanceDescription` 백엔드 추가 필요 가능성 |
| 아티스트 홈탭 debutDate·agency·genres | 🟢 낮음  | API 미제공 필드. 백엔드 추가 시 `ArtistDetail` 타입 업데이트 후 mock 제거 가능                           |
| 아티스트 커뮤니티 탭 API 연동         | 🟢 낮음  | 게시판 API 미정 (`getCommunityPostsByArtistId()` mock)                                                   |

---

## 리팩토링 태스크

> 기능 추가 없이 코드 품질 개선만 목적인 작업. 범례: ✅ 완료 / 🔲 미완료

### High Priority

| 항목 | 상태 | 비고 |
| ---- | ---- | ---- |
| `usePaymentForm` 중복 훅 통합 | ✅ | `shared/lib/` 버전을 features 버전으로 업그레이드 후 `features/booking/model/usePaymentForm.ts` 삭제 |
| `PaymentView.tsx` 페이즈 분리 (651줄) | ✅ | `ConfirmSeatsPhase`, `PaymentFormPhase`, 에러 페이즈 컴포넌트 분리 |
| `MyPageWidget.tsx` handleUpdateUser TODO 정리 | ✅ | SettingsTab이 TanStack Query 캐시 직접 업데이트하므로 콜백 불필요 → 제거 |

### Medium Priority

| 항목 | 상태 | 비고 |
| ---- | ---- | ---- |
| `IdentityStep.tsx` 검증 유틸 추출 | 🔲 | 이름/생년월일/전화번호 검증 로직을 `features/auth/onboarding/lib/validators.ts`로 분리 |
| `SearchWidget.tsx` 분리 (596줄) | 🔲 | `TrendingSection`, `SearchResults` 컴포넌트 분리 + `useSearchFilters()` 훅 추출 |
| sessionStorage 직접 호출 훅으로 추출 | 🔲 | `PaymentView.tsx` 내 분산된 `sessionStorage` 호출을 `useBookingSession.ts`로 통합 |

### Low Priority

| 항목 | 상태 | 비고 |
| ---- | ---- | ---- |
| 날짜 포매터 통합 검토 | 🔲 | 7가지 포매터 중복 여부 점검 및 인라인 `Intl.DateTimeFormat` 제거 |
| `ArtistHomeTab.tsx` 섹션 분리 (447줄) | 🔲 | 섹션별 서브컴포넌트 분리 |
| Mock 데이터 환경 조건부 처리 | 🔲 | `MyPageWidget.tsx`, `BookingContext.tsx` 내 mock 데이터 → API 연동 or 개발환경 전용 처리 |
