# 백엔드 요청 목록

프론트엔드에서 백엔드 팀에 요청할 API 변경·추가·수정 사항을 기록합니다.

> 형식: 요청 내용 / 이유 / 우선순위 (🔴 긴급 / 🟡 보통 / 🟢 낮음)

---

## 대기 중

### 예매 테스트용 좌석 배치도 데이터 세팅 요청

- **요청**: `eventId=1` 기준으로 예매 전체 플로우(구역 선택 → 좌석 선택 → 결제)를 테스트할 수 있도록 좌석 배치도 및 회차(showId) 데이터 세팅
- **이유**: `GET /shows/{eventId}/shows/{showId}/seats/summary` 호출 시 대부분 공연에서 `"좌석 배치도 형식이 올바르지 않습니다."` (400) 반환. 프론트엔드 예매·결제 E2E 테스트를 `eventId=1` 단일 공연으로 고정해 진행하기로 결정.
- **우선순위**: 🔴 긴급

#### 프론트엔드가 기대하는 데이터 구조

**① `GET /ticket/events/1/shows/{showId}/seats` 응답**

포도알(좌석) 렌더링에 사용. `section` 필드가 아래 구역 코드와 **정확히 일치**해야 SVG 위에 올바르게 표시됨.

```json
[
  {
    "seatId": "seat-vip1-1-1",
    "section": "VIP1",
    "row": "1",
    "number": "1",
    "status": "AVAILABLE",
    "price": 165000,
    "lockedUntil": null,
    "sellable": true,
    "seatVersion": 1
  }
]
```

- `section`: 아래 구역 코드 중 하나 (대소문자 정확히 일치)
- `row`, `number`: **숫자형 문자열** (`"1"`, `"2"`, ...) — 그리드 계산에 사용
- `status`: `"AVAILABLE"` | `"LOCKED"` | `"RESERVED"` | `"SOLD"`

**② 구역 코드 목록 (총 38개)**

| 티어 | 구역 코드 |
|------|-----------|
| VIP  | `VIP1`, `VIP2`, `VIP3` |
| S    | `S1`, `S2`, `S3`, `S4`, `S5`, `S6`, `S7`, `S8` |
| R    | `R1`, `R2`, `R3`, `R4`, `R5`, `R6`, `R7` |
| A    | `A1`~`A20` |

**③ 최소 세팅 권장 (테스트 목적)**

전체 38개 구역 불필요. 아래 3~4개 구역만 세팅해도 플로우 검증 가능:
- `VIP1`: 3행 × 10석 (row 1~3, number 1~10)
- `S1`: 5행 × 8석 (row 1~5, number 1~8)
- `R1`: 4행 × 8석 (row 1~4, number 1~8)
- `A1`: 6행 × 10석 (row 1~6, number 1~10)

---

### `GET /ticket/users/reservations` 응답에 `transferEligible` 필드 추가 요청

- **요청**: 예약 목록 응답의 각 항목에 `transferEligible: boolean` 필드 추가
- **이유**: 티켓 월렛에서 "양도 등록" 버튼 노출 조건을 판단하려면 양도 가능 여부가 필요함. 현재 `GET /ticket/internal/transfers/{reservationId}/eligibility`가 별도 존재하나, `internal` 경로라 프론트에서 직접 호출하기 부적절하고, N개 티켓마다 N번 추가 호출이 발생하는 N+1 문제가 생김. 목록 응답에 포함하면 한 번에 해결 가능.
- **우선순위**: 🟡 보통

---

## 보류 (프론트에서 해결)

### [해결됨] 홈 히어로 배너 API 추가

`GET /events/home`에 배너 전용 필드가 없어 요청 예정이었으나,  
`trendingEvents` 상위 4개 + `GET /artists`의 `bannerImageUrl` 매핑으로 프론트에서 해결.  
별도 API 요청 불필요.

---

## 완료

_없음_
