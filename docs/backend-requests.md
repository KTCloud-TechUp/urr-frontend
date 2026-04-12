# 백엔드 요청 목록

프론트엔드에서 백엔드 팀에 요청할 API 변경·추가·수정 사항을 기록합니다.

> 형식: 요청 내용 / 이유 / 우선순위 (🔴 긴급 / 🟡 보통 / 🟢 낮음)

---

## 대기 중

### 🔴 [티켓 선점 API] POST /api/v1/ticket/reservations 400 오류 — 좌석 가격 미전달 문제

**발생 현상**
- 요청 헤더·바디 모두 정상임에도 `{"isSuccess":false,"statusCode":400,"message":"요청 값이 올바르지 않습니다."}` 반환

**원인 분석**
두 가지 문제가 중첩되어 있음.

**① 이벤트 서비스 — `show-info-path` 엔드포인트 미구현**
- 티켓 서비스 `application.yaml`의 `clients.event.show-info-path` 설정값:
  ```
  /api/v1/shows/{eventId}/shows/{showId}/seats/detail
  ```
- 이 경로에 해당하는 엔드포인트가 이벤트 서비스에 존재하지 않음
- 결과: `EventReservationContextClient`가 항상 예외를 catch → `Optional.empty()` 반환 → 가격 정보 획득 실패

**② 이벤트 서비스 — 좌석 목록 API에 `price` 필드 누락**
- fallback으로 호출되는 `GET /api/v1/shows/{eventId}/shows/{showId}/seats`의 응답 DTO `ShowSeatsResponse.Seat`에 `price` 필드 없음
- `show_section_policies` 테이블에는 가격이 정상 등록되어 있음 (VIP=165,000원 등)
- 결과: `originalPrice = null` → `totalAmount = 0` → `TicketReservationService.java:357`에서 `INVALID_REQUEST` 예외 발생

**요청 사항 (둘 중 하나 또는 둘 다)**
1. `GET /api/v1/shows/{eventId}/shows/{showId}/seats` 응답에 tier별 `price` 필드 추가
   - `show_section_policies` 테이블의 `code`(tier)와 `seatmap_json`의 `tier`를 매핑하여 각 좌석에 가격 포함
2. `/seats/detail` 엔드포인트 신규 구현 (booking windows + 가격 포함 좌석 정보를 단일 응답으로 반환)
   - 티켓 서비스 `application.yaml`의 `show-info-path`를 해당 경로로 수정 필요

**관련 파일**
- `urr-ticketService/src/main/resources/application.yaml` (58번째 줄: `show-info-path`)
- `urr-eventService/.../controller/event/ShowController.java` (`getSeatCatalog` 메서드)
- `urr-eventService/.../dto/response/show/ShowSeatsResponse.java` (`Seat` record)
- `urr-ticketService/.../service/TicketReservationService.java` (352~358번째 줄)

---

### 🔴 [좌석 포도알 미표시] GET /seats/availability — 데이터 정상 반환 여부 확인 요청

**발생 현상**
- 구역 선택 후 개별 좌석 선택 화면으로 진입해도 좌석 포도알이 렌더링되지 않음
- 프론트엔드 렌더 조건(`seats.length > 0`)이 충족되지 않아 `SeatOverlay` 자체가 그려지지 않음

**원인 분석**
프론트엔드는 아래 API를 정상적으로 호출하고 있으나, 응답 데이터가 비어 있거나 오류가 반환될 가능성이 있음.

**호출 중인 API (eventService)**
```
GET /api/v1/shows/{eventId}/shows/{showId}/seats/availability?tier={tier}&zoneNo={zoneNo}
```
- `tier`: VIP / S / R / A
- `zoneNo`: 1 이상의 정수 (구역 번호)
- 응답 예상 구조: `List<ZoneAvailabilityResponse>` (`seatId`, `section`, `row`, `number`, `status`, `price`, `sellable`, `seatVersion`)

**요청 사항**
1. 해당 엔드포인트가 실제 좌석 데이터를 반환하는지 확인
   - show의 `seatmap_json`에 seats 배열이 올바르게 등록되어 있는지
   - `tier` + `zoneNo` 조합으로 필터링했을 때 빈 배열이 나오지 않는지
2. 응답의 `row` 필드 형식 확인 및 통일
   - eventService는 원본 값 그대로 반환 (예: `"A"`, `"B"`)
   - ticketService의 `SeatResponse`는 알파벳 행을 숫자로 변환 (예: `"A"` → `"1"`)
   - 프론트엔드는 두 형식 모두 처리하고 있으나, eventService 쪽도 통일된 형식으로 반환해 줄 것을 권장

**참고: 렌더링 버그 (프론트엔드 내부 문제 — 별도 수정 예정)**
- `SeatOverlay.tsx` 96~97번줄에서 좌석 위치를 배열 인덱스 기반으로 결정하고 있어, 행별 좌석 수가 균일하지 않거나 좌석 번호에 간격이 있으면 포도알 위치가 어긋남
- 이 부분은 프론트엔드에서 `seat.row` / `seat.number` 기반으로 수정 필요

**관련 파일**
- `urr-frontend/src/features/booking/api/getSeatsAvailability.ts`
- `urr-frontend/src/widgets/booking/UnifiedSeatView.tsx` (82~88번째 줄: useQuery)
- `urr-frontend/src/features/booking/ui/SeatOverlay.tsx` (95~99번째 줄: 인덱스 배치)
- `urr-eventService/.../controller/event/ShowController.java` (`getZoneAvailability`)
- `urr-ticketService/.../dto/response/SeatResponse.java` (`normalizeRow` 메서드)

---

## 완료
