# URR 프론트엔드 — API 연동 진행 현황

> 마지막 갱신: 2026-04-14  
> 범례: ✅ 완료 / 🔄 부분 연동 (일부 mock) / 🔲 미연동 (전체 mock)

---

## 인증 (Auth)

| 기능 | 엔드포인트 | 상태 | 비고 |
|---|---|---|---|
| 카카오 소셜 로그인 | `POST /auth/kakao/login` | ✅ | |
| 네이버 소셜 로그인 | `POST /auth/naver/login` | ✅ | |
| 소셜 온보딩 완료 | `POST /auth/social-onboarding` | ✅ | |
| 카카오 재가입 | `POST /auth/kakao/rejoin` | ✅ | |
| 로그아웃 | `POST /auth/logout` | ✅ | |
| 회원 탈퇴 | `DELETE /auth/delete` | ✅ | |
| 내 정보 조회 | `GET /auth/me` | ✅ | |
| SMS 인증 발송 | `POST /auth/sms/send` | ✅ | |
| SMS 인증 확인 | `POST /auth/sms/verify` | ✅ | |
| 동의 항목 업데이트 | `PATCH /auth/consents` | ✅ | |
| 닉네임 변경 | `PATCH /auth/name` | ✅ | |
| 토큰 재발급 | `POST /auth/token/reissue` | ✅ | 401 → 자동 retry (멀티탭 RTR 동기화 포함) |

---

## 홈 (Home)

| 기능 | 엔드포인트 | 상태 | 비고 |
|---|---|---|---|
| 홈 데이터 조회 | `GET /events/home` | ✅ | 인기 아티스트·트렌딩·랭킹·선예매 |
| 팔로우 아티스트 확인 | — | 🔲 | `mockUser.followedArtistIds` 하드코딩 |

---

## 아티스트 (Artist)

| 기능 | 엔드포인트 | 상태 | 비고 |
|---|---|---|---|
| 아티스트 목록 조회 | `GET /artists` | ✅ | |
| 아티스트 단건 조회 | `GET /artists/{artistId}` | ✅ | |
| 아티스트 팔로우 | `POST /artists/{artistId}/follow` | ✅ | |
| 아티스트 언팔로우 | `DELETE /artists/{artistId}/follow` | ✅ | |
| 아티스트 소개 (홈탭) | `GET /artists/{artistId}` | 🔄 | `description` → `artist.bio` 연동. `debutDate`·`agency`·`genres` API 미제공 → mock 유지 |
| 아티스트 커뮤니티 탭 | — | 🔲 | `getCommunityPostsByArtistId()` mock |
| 아티스트 공연 목록 탭 | `GET /events?artistId=` | ✅ | `getArtistEvents()` 연동 |
| 아티스트 양도 목록 탭 | `GET /transfer/listings?artistId=` | ✅ | `getTransferPosts()` 연동 |

---

## 공연 (Event)

| 기능 | 엔드포인트 | 상태 | 비고 |
|---|---|---|---|
| 공연 목록 조회 | `GET /events` | ✅ | |
| 공연 상세 조회 | `GET /events/{eventId}` | ✅ | |
| 공연 상세 — 판매 정보 탭 | `GET /events/{eventId}` | ✅ | 가격·좌석·예매창 정보 |
| 공연 상세 — 공연정보 탭 | — | 🔲 | `EventDetail` mock 타입 사용 (`src/shared/lib/mocks/event-detail.ts`) |
| 공연별 회차(Show) 목록 | `GET /shows?eventId=` | ✅ | |
| 공연별 구역(Section) 조회 | `GET /shows/{showId}/sections` | ✅ | |
| 공연별 좌석 조회 | `GET /shows/{showId}/seats` | ✅ | |
| 예매 창 조회 | `GET /events/{eventId}/booking-windows` | ✅ | |

---

## 예매 (Booking)

| 기능 | 엔드포인트 | 상태 | 비고 |
|---|---|---|---|
| 대기열 진입 | `POST /queue/join` | ✅ | |
| 대기열 상태 폴링 | `GET /queue/status` | ✅ | |
| 좌석 가용성 조회 | `GET /shows/{showId}/seats/availability` | ✅ | |
| 좌석 잠금(임시 확보) | `POST /ticket/reservations/reserve` | ✅ | |
| 예매 확정 | `POST /ticket/reservations/confirm` | ✅ | |
| 예매 취소 | `DELETE /ticket/reservations` | ✅ | |
| 좌석 요약 조회 | `GET /shows/{showId}/seats/summary` | ✅ | |
| 선점 해제 | `POST /ticket/reservations/release` | ✅ | `resetBooking()` 호출 시 자동 (fire-and-forget) |

---

## 결제 (Payment)

| 기능 | 엔드포인트 | 상태 | 비고 |
|---|---|---|---|
| 결제 레코드 생성 (Toss 요청 전) | `POST /payment/records` | ✅ | |
| 결제 확인 (Toss 콜백 후) | `POST /payment/confirm` | ✅ | |
| 결제 완료 화면 | `/booking/complete` | ✅ | QR·좌석·금액 표시 |

---

## 티켓 월렛 (My Reservations)

| 기능 | 엔드포인트 | 상태 | 비고 |
|---|---|---|---|
| 내 예매 목록 조회 | `GET /ticket/users/reservations` | ✅ | 상태 필터(`CONFIRMED`) 지원 |
| 티켓 상세 (`/tickets/:id`) | `GET /ticket/users/reservations` + event/show 조합 | ✅ | QR 코드 표시 |
| 예매 취소 (티켓 월렛) | `DELETE /ticket/reservations` | ✅ | |

---

## 멤버십 (Membership)

| 기능 | 엔드포인트 | 상태 | 비고 |
|---|---|---|---|
| 내 멤버십 목록 조회 | `GET /membership/my` | ✅ | |
| 멤버십 구독 | `POST /membership/artists/{artistId}/subscribe` | ✅ | |
| 멤버십 해지 | `DELETE /membership/artists/{artistId}/cancel` | ✅ | |
| 닉네임 변경 | `PATCH /membership/nickname` | ✅ | |
| 멤버십 정책 조회 | `GET /membership/artists/{artistId}/membership-policies` | 🔄 | 가입 화면 연동. `bookingType`·`transferFeeRate` 필드 백엔드 추가 대기 (→ `backend-requests.md`) |
| 선예매 정책 조회 | `GET /membership/artists/{artistId}/presale-policy` | ✅ | |

---

## 양도 (Transfer)

| 기능 | 엔드포인트 | 상태 | 비고 |
|---|---|---|---|
| 양도 게시글 목록 조회 | `GET /transfer/listings` | ✅ | 아티스트 탭 연동 |
| 양도 게시글 상세 조회 | `GET /transfer/listings/{listingId}` | ✅ | `TransferDetailWidget` |
| 내 양도 판매 내역 | `GET /transfer/sales` | ✅ | MyPage 양도 탭 |
| 내 양도 구매 내역 | `GET /transfer/purchases` | ✅ | MyPage 양도 탭 |
| 양도 등록 | `POST /transfer/listings` | 🔄 | `TransferListingModal` UI 있음 — API 연동 확인 필요 |
| 양도 구매 | `POST /transfer/listings/{listingId}/purchase` | 🔄 | `TransferPurchaseSidebar` UI 있음 — API 연동 확인 필요 |

---

## 검색 (Search)

| 기능 | 엔드포인트 | 상태 | 비고 |
|---|---|---|---|
| 아티스트 + 공연 통합 검색 | — | 🔲 | 전체 mock (`src/shared/lib/mocks/search.ts`) |

---

## 알림 (Notification)

| 기능 | 엔드포인트 | 상태 | 비고 |
|---|---|---|---|
| 알림 목록 조회 | — | 🔲 | `NotificationContext` 내부 mock 상태 |
| 알림 읽음 처리 | — | 🔲 | mock |

---

## 에러 처리

| 기능 | 상태 | 비고 |
|---|---|---|
| 전역 에러 페이지 (`error.tsx`) | ✅ | `ErrorView` variant=`runtime` |
| 전역 404 페이지 (`not-found.tsx`) | ✅ | `ErrorView` variant=`not-found` |
| 429 → 대기열 리다이렉트 | ✅ | `interceptor.ts` `redirectToQueue()` |
| 401 자동 토큰 재발급 + 재시도 | ✅ | `fetchWithAuth()` + 멀티탭 BroadcastChannel |

---

## 미구현 / 향후 작업

| 항목 | 우선순위 | 비고 |
|---|---|---|
| 검색 API 연동 | 🟡 보통 | 아티스트·공연 통합 검색 엔드포인트 필요 |
| 알림 API 연동 | 🟢 낮음 | SSE 또는 폴링 방식 결정 필요 |
| 공연정보 탭 실제 API 연동 | 🟡 보통 | `PerformanceInfoTab` — 현재 mock `EventDetail` 타입 사용. 백엔드에 `notices`·`identityVerification`·`performanceDescription` 필드 추가 필요 가능성 있음 |
| 아티스트 홈탭 debutDate·agency·genres | 🟢 낮음 | API 미제공 필드. 백엔드 추가 시 `ArtistDetail` 타입 업데이트 후 `extendedInfo` mock 제거 가능 |
| 커뮤니티 탭 API 연동 | 🟢 낮음 | 게시판 API 미정 (`getCommunityPostsByArtistId()` mock) |
| 양도 등록·구매 API 연동 확인 | 🟡 보통 | UI 있으나 실제 호출 경로 검증 필요 |
| 팔로우 아티스트 홈 표시 | 🟢 낮음 | `mockUser.followedArtistIds` → 실제 팔로우 데이터로 교체 |

---

## 리팩토링 / 기술 부채

| 항목 | 우선순위 | 파일 | 내용 |
|---|---|---|---|
| ~~`ErrorView` 홈 경로 버그~~ | ~~🔴 긴급~~ | ~~`src/features/error/ui/ErrorView.tsx:45`~~ | ~~`router.push("/home")` → `router.push("/")`~~ **완료** |
| ~~`MyPageWidget` `mockUser` spread 정리~~ | ~~🟡 보통~~ | ~~`src/widgets/my-page/MyPageWidget.tsx:44`~~ | ~~`displayUser`에 `...mockUser` spread로 `tier`·`followedArtistIds`가 mock에서 옴.~~ `tier`는 active 멤버십 중 최고 tier 파생으로 **완료**. `followedArtistIds`는 여전히 mock. |
| `TransferPurchaseSidebar` mock import 제거 | 🟡 보통 | `src/widgets/transfer/TransferPurchaseSidebar.tsx:14` | `updateTransferListingStatus`(mock) import 잔존. 상태 갱신은 TanStack Query invalidation으로 처리하면 제거 가능 |
| `useMyReservations` `tierFee` 하드코딩 | 🟢 낮음 | `src/features/reservation/model/useMyReservations.ts:104` | `tierFee: 0` 고정. 멤버십 tier → fee rate 역산 로직 필요 (또는 결제 API 응답에 fee 필드 추가) |
| `getMyReservations` `userId` 헤더 중복 검토 | 🟢 낮음 | `src/features/reservation/api/getMyReservations.ts:38` | Bearer 토큰으로 userId를 백엔드가 파싱한다면 `X-User-Id` 헤더 불필요. API 스펙 확인 후 제거 가능 |
