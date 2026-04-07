# 백엔드 요청 목록

프론트엔드에서 백엔드 팀에 요청할 API 변경·추가·수정 사항을 기록합니다.

> 형식: 요청 내용 / 이유 / 우선순위 (🔴 긴급 / 🟡 보통 / 🟢 낮음)

---

## 대기 중

### ① 좌석 조회 API — `section` 쿼리 파라미터 필터 추가

- **우선순위**: 🔴 긴급
- **대상**: `GET /api/v1/ticket/events/{eventId}/shows/{showId}/seats`

```
GET /api/v1/ticket/events/{eventId}/shows/{showId}/seats?section=VIP1
```

- **요청**: `section` 쿼리 파라미터 추가. 해당 구역에 속하는 좌석만 반환.
- **이유**: 공연장 규모 15,000석 기준 전체 조회 시 응답이 ~1.5MB. 구역 클릭 시 해당 section만 요청하도록 프론트 변경 완료 — 백엔드 필터 지원 필요.
- **필터 값**: 구역 코드(`VIP1`, `VIP2`, `S1`, `R1`, `A1` 등). 파라미터 없으면 전체 반환 (기존 동작 유지).

---

### ② 좌석 조회 API — `section` 필드를 zone 레벨로 반환

- **우선순위**: 🔴 긴급
- **대상**: `GET /api/v1/ticket/events/{eventId}/shows/{showId}/seats`

```json
// 현재 (tier 레벨) ❌
{ "section": "A" }

// 필요 (zone 레벨) ✅
{ "section": "A1" }
```

- **요청**: 응답의 `section` 필드를 tier 레벨(`A`)이 아닌 zone 레벨(`A1`)로 반환.
- **이유**: SVG 공연장 지도에서 VIP1/VIP2/VIP3을 각각 별도 구역으로 렌더링함. tier 레벨로 오면 VIP1 클릭 시 VIP2·VIP3 좌석까지 섞여서 표시됨.

---

### ③ 좌석 조회 API — 응답 정렬 순서 보장

- **우선순위**: 🔴 긴급
- **대상**: `GET /api/v1/ticket/events/{eventId}/shows/{showId}/seats`

- **요청**: 응답 배열을 `row ASC → number ASC` 순으로 정렬해서 반환.
- **이유**: 프론트는 배열 인덱스로 좌석의 SVG 좌표를 계산함. 정렬이 보장되지 않으면 좌석이 뒤죽박죽으로 렌더링됨.

```sql
-- 쿼리 정렬 기준
ORDER BY CAST(row AS INT) ASC, CAST(number AS INT) ASC
```

즉 row 1의 1번석 → row 1의 마지막 석 → row 2의 1번석 → ... 순서.

---

### ④ 홈 선예매 오픈 임박 — 추가 필드 요청

- **우선순위**: 🟡 보통
- **대상**: `GET /events/home` 응답의 `presaleOpeningSoon[]` 배열 및 `trendingEvents[]`, `popularEventRanking[]`

현재 `presaleOpeningSoon` 항목은 `HomeTrendingEvent` 타입과 동일한 필드를 반환해 아래 정보를 프론트에서 표시할 수 없습니다.

#### 요청 필드

```json
{
  "eventId": 1,
  "eventTitle": "IVE THE 1ST WORLD TOUR",
  "artistId": 5,
  "artistName": "IVE",
  "posterImageUrl": "https://...", // 현재 null로 오고 있음 — 유효한 URL 반환 필요
  "venueAddress": "KSPO DOME",
  "openDate": "2026-03-03T20:00:00", // ★ LocalDate → LocalDateTime으로 변경 요청 (공연 시작 시간 포함)
  "endDate": "2026-03-04",

  // ↓ presaleOpeningSoon 전용 신규 요청 필드
  "presaleOpenAt": "2026-02-20T20:00:00", // 선예매 오픈 일시 (없으면 null) — "02.20(목) 20:00" 표시용
  "saleType": "PRESALE", // "PRESALE" | "GENERAL" — 선예매/일반예매 구분
  "isHot": true, // HOT 뱃지
  "isSeatAdvantage": false, // 좌석 우위 뱃지
  "isExclusive": true // 단독판매 뱃지
}
```

#### 각 필드 필요 이유

| 필드                                        | 이유                                                                                                                                                           |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `posterImageUrl` (수정)                     | home API에서 null로 와서 이미지 미표시. `/events` API에서 폴백 중이나 홈에서 직접 주는 게 맞음                                                                 |
| `openDate` → datetime                       | 현재 날짜만 오고 시간이 없어 "03.03(화)" 만 표시됨. "03.03(화) 20:00" 표시를 위해 시간 포함 필요. `trendingEvents`, `popularEventRanking`도 동일하게 변경 요청 |
| `presaleOpenAt`                             | 선예매 오픈 일시를 카드에 별도 표시 ("선예매 D-3" 등 추후 확장 가능)                                                                                           |
| `saleType`                                  | 선예매/일반예매 구분 텍스트 표시                                                                                                                               |
| `isHot` / `isSeatAdvantage` / `isExclusive` | 디자인에 명시된 뱃지 표시                                                                                                                                      |

---

## 완료

### `GET /ticket/users/reservations` 응답에 `transferEligible` 필드 추가

- `ReservationSummary` 타입에 `transferEligible: boolean` 추가 (`src/features/reservation/api/getMyReservations.ts`)
- `useMyReservations`에서 `isTransferable`을 `r.transferEligible`로 변경 (`src/features/reservation/model/useMyReservations.ts`)

### `GET /api/v1/shows/{eventId}/shows/{showId}/seats/summary` 경로 확인

- `ShowController` 클래스 레벨 `@RequestMapping("/api/v1/shows")` + 메서드 레벨 `@GetMapping("/{eventId}/shows/{showId}/seats/summary")` 구조로 `shows`가 두 번 나오는 것이 의도된 경로임을 확인.
- 프론트 `getSeatsSummary.ts`의 경로(`/shows/{eventId}/shows/{showId}/seats/summary`)는 정확함. 변경 불필요.
