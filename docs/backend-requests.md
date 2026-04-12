# 백엔드 요청 목록

프론트엔드에서 백엔드 팀에 요청할 API 변경·추가·수정 사항을 기록합니다.

> 형식: 요청 내용 / 이유 / 우선순위 (🔴 긴급 / 🟡 보통 / 🟢 낮음)

---

## 대기 중

### 🔴 [티켓 선점 API] POST /api/v1/ticket/reservations 400 오류 — show_section_policies 데이터 누락

**발생 현상**
- 요청 헤더·바디 모두 정상임에도 `{"isSuccess":false,"statusCode":400,"message":"요청 값이 올바르지 않습니다."}` 반환

**원인 분석 (최종 확정)**

`/seats/detail` 엔드포인트는 `ShowController.java:176`에 이미 구현되어 있음. 실제 원인은 **테스트 데이터 누락**:

- `show_section_policies` 테이블에 show 1~3 (G-Dragon) 데이터만 있고, show 4~35는 가격 데이터가 없음
- `getActiveSectionPrices(showId)` → 빈 Map 반환 → 모든 좌석 price=0
- `totalAmount = 0` → `TicketReservationService.java:357`에서 `INVALID_REQUEST` 예외 발생 → 400

**해결 방법**
`docs/event.sql`에 show 4~35에 대한 `show_section_policies` INSERT 추가 완료 (id 13~140).
해당 SQL을 DB에 실행하면 해결됨.

| 이벤트 | shows | VIP | R | S | A |
|---|---|---|---|---|---|
| BTS YET TO COME (2) | 4~6 | 165,000 | 143,000 | 121,000 | 99,000 |
| BTS ARIRANG (3) | 7~10 | 165,000 | 143,000 | 121,000 | 99,000 |
| IVE SHOW WHAT I AM (5) | 11~13 | 154,000 | 132,000 | 110,000 | 88,000 |
| IVE 1ST WORLD TOUR (6) | 14~15 | 154,000 | 132,000 | 110,000 | 88,000 |
| BLACKPINK BORN PINK (7) | 16~17 | 165,000 | 143,000 | 121,000 | 99,000 |
| Stray Kids DOMINANCE (8) | 18~19 | 165,000 | 143,000 | 121,000 | 99,000 |
| SEVENTEEN WORLD TOUR (9) | 20~21 | 165,000 | 143,000 | 121,000 | 99,000 |
| SEVENTEEN FOLLOW AGAIN (10) | 22~24 | 165,000 | 143,000 | 121,000 | 99,000 |
| NewJeans × COMPLEXCON (11) | 25~26 | 220,000 | 150,000 | 110,000 | 77,000 |
| NewJeans Fan Meeting (12) | 27~28 | 110,000 | 88,000 | 66,000 | 55,000 |
| (G)I-DLE iDOL (13) | 29~30 | 154,000 | 132,000 | 110,000 | 88,000 |
| TXT ACT : PROMISE (14) | 31~33 | 154,000 | 132,000 | 110,000 | 88,000 |
| DAY6 10th Anniversary (15) | 34~35 | 110,000 | 88,000 | 66,000 | 55,000 |

**관련 파일**
- `urr-eventService/.../service/show/ShowService.java` (`getActiveSectionPrices`, line 338)
- `urr-ticketService/.../service/TicketReservationService.java` (352~358번째 줄)
- `docs/event.sql` (show_section_policies 섹션, id 13~140 추가됨)

---

### 🔴 [좌석 포도알 미표시] GET /seats/availability — 데이터 정상 반환 여부 확인 요청

**발생 현상**
- 구역 선택 후 개별 좌석 선택 화면으로 진입해도 좌석 포도알이 렌더링되지 않음
- 프론트엔드 렌더 조건(`seats.length > 0`)이 충족되지 않아 `SeatOverlay` 자체가 그려지지 않음

**원인 분석 (확인됨)**
`data.sql`의 `venue_template id=1`에 등록된 구역이 5개뿐이라, 나머지 구역 클릭 시 `/seats/availability`가 빈 배열 `[]`을 반환함 → `seats.length === 0` → `SeatOverlay` 미렌더링.

| 데이터 있음 (정상) | 데이터 없음 (빈 배열 반환) |
|---|---|
| VIP1, VIP2 | VIP3 |
| S1 | S2 ~ S8 |
| R1 | R2 ~ R7 |
| A1 | A2 ~ A20 |

프론트엔드는 아래 API를 정상적으로 호출하고 있으나, 응답 데이터가 비어 있거나 오류가 반환될 가능성이 있음.

**호출 중인 API (eventService)**
```
GET /api/v1/shows/{eventId}/shows/{showId}/seats/availability?tier={tier}&zoneNo={zoneNo}
```
- `tier`: VIP / S / R / A
- `zoneNo`: 1 이상의 정수 (구역 번호)
- 응답 예상 구조: `List<ZoneAvailabilityResponse>` (`seatId`, `section`, `row`, `number`, `status`, `price`, `sellable`, `seatVersion`)

**요청 사항**
1. **`venue_templates` 테스트 데이터에 누락된 구역 추가** (`data.sql` 또는 DB 직접 삽입)
   - VIP3, S2~S8, R2~R7, A2~A20 구역의 좌석 데이터 (`sections` 배열 항목) 추가 필요
   - 각 구역은 `name`, `tier`, `zoneNo`, `seats` 배열 구조로 작성 (기존 VIP1 항목 참고)
   - `shows` 테이블은 `venue_templates.seatmap_json`을 복사하므로, template 수정 후 show 재생성 또는 `shows.seatmap_json` 직접 업데이트 필요
2. 응답의 `row` 필드 형식 확인 및 통일
   - eventService는 원본 값 그대로 반환 (예: `"A"`, `"B"`)
   - ticketService의 `SeatResponse`는 알파벳 행을 숫자로 변환 (예: `"A"` → `"1"`)
   - 프론트엔드는 두 형식 모두 처리하고 있으나, eventService 쪽도 통일된 형식으로 반환해 줄 것을 권장

**참고: 렌더링 버그 (프론트엔드 내부 문제 — ✅ 수정 완료)**
- `SeatOverlay.tsx`에서 좌석 위치를 배열 인덱스 기반(`Math.floor(i / seatsPerRow)`, `i % seatsPerRow`)으로 결정하던 버그 수정
- `seat.row` → `rowIndexMap`(행 레이블 기반 Map) 조회, `seat.number - 1` → 열 인덱스로 변경
- 행별 좌석 수가 균일하지 않거나 좌석 번호에 간격이 있어도 포도알이 정확한 위치에 렌더링됨

**관련 파일**
- `urr-frontend/src/features/booking/api/getSeatsAvailability.ts`
- `urr-frontend/src/widgets/booking/UnifiedSeatView.tsx` (82~88번째 줄: useQuery)
- `urr-frontend/src/features/booking/ui/SeatOverlay.tsx` (95~99번째 줄: 인덱스 배치)
- `urr-eventService/.../controller/event/ShowController.java` (`getZoneAvailability`)
- `urr-ticketService/.../dto/response/SeatResponse.java` (`normalizeRow` 메서드)

---

## 완료
