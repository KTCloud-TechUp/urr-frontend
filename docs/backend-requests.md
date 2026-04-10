# 백엔드 요청 목록

프론트엔드에서 백엔드 팀에 요청할 API 변경·추가·수정 사항을 기록합니다.

> 형식: 요청 내용 / 이유 / 우선순위 (🔴 긴급 / 🟡 보통 / 🟢 낮음)

---

## 대기 중

---

### ⑤ `/auth/me` — `memberships` 필드 빈 배열로 반환되는 버그

- **우선순위**: 🔴 긴급
- **대상**: `GET /api/v1/auth/me`

멤버십이 존재하는 유저임에도 `memberships: []`로 반환됨. `fetchMemberships()`는 구현되어 있으나 event 서비스의 `/api/v1/membership` 엔드포인트가 실제 데이터를 반환하는지 런타임 확인 필요.

- **요청**: Docker 환경에서 `/api/v1/membership` 응답 확인 및 정상 반환 여부 검증.
- **기대 응답 형식**: (기존 스펙 그대로)

```json
"memberships": [
  {
    "artistId": 2,
    "artistName": "빅뱅",
    "tier": "CLOUD",
    "endDate": "2027-04-07"
  }
]
```

---

## 완료

### ⑦ `POST /auth/sms/send`, `POST /auth/sms/verify` — 온보딩 미완료 유저 403 차단 해제 ✅

- **대상**: `UserContextFilter.blockWhenOnboardingNotCompleted()`

`/auth/sms/send`, `/auth/sms/verify`를 `blockWhenOnboardingNotCompleted` 예외 항목에 추가 완료.

---

### ⑥ `POST /auth/logout` — jti 추출 버그로 쿠키 미삭제 (자동로그인 버그) ✅

- **대상**: `SocialAuthService.java:271`

`claims.get("jti", String.class)` → `claims.getId()` 수정 완료. 코드 확인됨.

---

### ① 좌석 조회 API — `section` 쿼리 파라미터 필터 추가 ✅

- **대상**: `GET /api/v1/ticket/events/{eventId}/shows/{showId}/seats`

`TicketController.java:31`에 `@RequestParam(required = false) String section` 추가 및 서비스 레이어 필터링 구현 완료. 코드 확인됨.

---

### ② 좌석 조회 API — `section` 필드를 zone 레벨로 반환 ✅

- **대상**: `GET /api/v1/ticket/events/{eventId}/shows/{showId}/seats`

Event 서비스가 `sectionCode`(zone 레벨, `VIP1`)와 `tier`(tier 레벨, `VIP`)를 분리 반환. Ticket 서비스에서 zone 레벨 `sectionCode`를 우선 사용하도록 구현 완료. 코드 확인됨.

---

### ③ 좌석 조회 API — 응답 정렬 순서 보장 ✅

- **대상**: `GET /api/v1/ticket/events/{eventId}/shows/{showId}/seats`

`TicketReservationService.getSeats()` 두 경로 모두 `row ASC → number ASC` 숫자 정렬 적용 완료. 코드 확인됨.

---

### `GET /ticket/users/reservations` 응답에 `transferEligible` 필드 추가

- `ReservationSummary` 타입에 `transferEligible: boolean` 추가 (`src/features/reservation/api/getMyReservations.ts`)
- `useMyReservations`에서 `isTransferable`을 `r.transferEligible`로 변경 (`src/features/reservation/model/useMyReservations.ts`)

### `GET /api/v1/shows/{eventId}/shows/{showId}/seats/summary` 경로 확인

- `ShowController` 클래스 레벨 `@RequestMapping("/api/v1/shows")` + 메서드 레벨 `@GetMapping("/{eventId}/shows/{showId}/seats/summary")` 구조로 `shows`가 두 번 나오는 것이 의도된 경로임을 확인.
- 프론트 `getSeatsSummary.ts`의 경로(`/shows/{eventId}/shows/{showId}/seats/summary`)는 정확함. 변경 불필요.
