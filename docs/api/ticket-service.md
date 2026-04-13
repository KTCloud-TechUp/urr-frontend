# Ticket Service 연동 현황

> 백엔드 코드 경로: C:\Users\kkaeng\Desktop\Dev\URR\urr-backend\urr-ticketService
>
> 마지막 확인: 2026-04-13

| #   | API                                      | 메서드 | 엔드포인트                                                      | 연동 파일                                       | 상태         | 비고                                                        |
| --- | ---------------------------------------- | ------ | --------------------------------------------------------------- | ----------------------------------------------- | ------------ | ----------------------------------------------------------- |
| 1   | 좌석 조회                                | GET    | `/api/v1/ticket/events/{eventId}/shows/{showId}/seats`          | —                                               | ❌ 미연동    | 코드는 event-service의 `/shows/.../seats/availability` 사용 |
| 2   | 다중 좌석 선점 + 예약 생성               | POST   | `/api/v1/ticket/reservations`                                   | `features/booking/api/bookTicket.ts`            | ⚠️ 수정 필요 | request: `seatId`→`seatIds[]`, response 구조 변경           |
| 3   | 예약 확정                                | POST   | `/api/v1/ticket/reservations/confirm`                           | `features/booking/api/confirmReservation.ts`    | ⚠️ 수정 필요 | request/response 구조 완전 변경                             |
| 4   | 결제 전 선점 상태 조회                   | GET    | `/api/v1/ticket/reservations/{reservationId}/hold-status`       | —                                               | ❌ 미연동    |                                                             |
| 5   | 예약 만료 처리                           | POST   | `/api/v1/ticket/reservations/{reservationId}/expire`            | —                                               | ➖ 불필요    | 스케줄러 처리                                               |
| 6   | 예약 취소                                | POST   | `/api/v1/ticket/reservations/cancel`                            | `features/booking/api/cancelReservation.ts`     | ✅ 연동됨    | body: `{eventId, showId, seatId}`, `X-User-Id` 헤더         |
| 7   | 환불 처리                                | POST   | `/api/v1/ticket/reservations/{reservationId}/refund`            | —                                               | ➖ 불필요    | 서버 내부 처리                                              |
| 8   | 예약티켓 목록 조회                       | GET    | `/api/v1/ticket/users/reservations`                             | `features/reservation/api/getMyReservations.ts` | ✅ 연동됨    | URL 일치 (헤더로 userId 전달)                               |
| 9   | (내부) 양도 가능 여부 조회               | GET    | `/api/v1/ticket/internal/transfers/{reservationId}/eligibility` | —                                               | ➖ 불필요    | 서비스 내부 API                                             |
| 10  | (내부) 소유권 양도 완료                  | POST   | `/api/v1/ticket/internal/transfers/{reservationId}/complete`    | —                                               | ➖ 불필요    | 서비스 내부 API                                             |
| 11  | (내부) 티켓 좌석 정보 조회 (양도용)      | GET    | `/api/v1/ticket/internal/transfer-seat-info`                    | —                                               | ⚠️ 스펙 불일치 | POST→GET 변경, body `{showId,tier,zoneNo}` → query `{eventId,showId}` + 헤더 `X-User-Id` |
| 12  | (내부) 특정 티어/구역 사용불가 좌석 조회 | POST   | `/api/v1/ticket/internal/seats/statuses`                        | —                                               | ➖ 불필요    | 서비스 내부 API                                             |
| 13  | 티켓 좌석 정보 조회                      | POST   | `/api/v1/ticket/seats/statuses`                                 | —                                               | ➖ 불필요    | 서비스 내부 API                                             |
| 14  | Health Check                             | GET    | `/health`                                                       | —                                               | ➖ 불필요    |                                                             |

---

# 1) 좌석 조회

## API

```
GET /api/v1/ticket/events/{eventId}/shows/{showId}/seats
```

## 설명

- 특정 공연(Event)과 회차(Show)의 좌석 목록 조회
- section 파라미터로 특정 구역 필터링 가능

## Headers

- 없음

## Path Parameters

- `eventId` (Long): 공연 ID
- `showId` (Long): 회차 ID

## Query Parameters

- `section` (String, optional): 구역 필터

## Request Example

```
GET /api/v1/ticket/events/10/shows/100/seats
GET /api/v1/ticket/events/10/shows/100/seats?section=VIP
```

## Response 200

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": [
    {
      "seatId": "A01",
      "status": "AVAILABLE",
      "lockedUntil": null,
      "section": "A",
      "row": "1",
      "number": "01",
      "price": 88000,
      "sellable": true,
      "seatVersion": 1
    },
    {
      "seatId": "A02",
      "status": "LOCKED",
      "lockedUntil": "2026-03-30T10:35:00",
      "section": "A",
      "row": "1",
      "number": "02",
      "price": 88000,
      "sellable": false,
      "seatVersion": 12
    }
  ]
}
```

### SeatResponse 필드

| 필드        | 타입          | 설명                                          |
| ----------- | ------------- | --------------------------------------------- |
| seatId      | String        | 좌석 ID                                       |
| status      | SeatStatus    | `AVAILABLE`, `LOCKED`, `RESERVED`             |
| lockedUntil | LocalDateTime | 선점 만료 시각 (nullable)                     |
| section     | String        | 구역 (nullable)                               |
| row         | String        | 열 (nullable)                                 |
| number      | String        | 번호 (nullable)                               |
| price       | Long          | 가격 (nullable)                               |
| sellable    | Boolean       | 판매 가능 여부 (status가 AVAILABLE일 때 true) |
| seatVersion | Long          | 좌석 버전                                     |

---

# 2) 다중 좌석 선점 + 예약 생성

## API

```
POST /api/v1/ticket/reservations
```

## 설명

- 최대 4개 좌석을 선점하고 예약(PENDING) + 결제를 생성

## Headers

- `X-User-Id` (Long, 필수): 사용자 ID

## Path Parameters

- 없음

## Query Parameters

- 없음

## Request Body

```json
{
  "eventId": 10,
  "showId": 100,
  "artistId": 777,
  "seatIds": ["A01", "A02"],
  "holdSeconds": 180
}
```

| 필드        | 타입           | 필수 | 설명                                |
| ----------- | -------------- | ---- | ----------------------------------- |
| eventId     | Long           | Y    | 공연 ID                             |
| showId      | Long           | Y    | 회차 ID                             |
| artistId    | Long           | Y    | 아티스트 ID                         |
| seatIds     | List\<String\> | Y    | 좌석 ID 목록 (1개 이상, blank 불가) |
| holdSeconds | long           | Y    | 선점 유지 시간 (최소 30초)          |

## Response 200

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "reservationIds": [
      "8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d",
      "1a2b3c4d-5e6f-7890-abcd-ef1234567890"
    ],
    "seatIds": ["A01", "A02"],
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "paymentId": 5001,
    "totalAmount": 176000,
    "expiresAt": "2026-03-31T09:00:00"
  }
}
```

### CreateReservationResponse 필드

| 필드           | 타입              | 설명                |
| -------------- | ----------------- | ------------------- |
| reservationIds | List\<String\>    | 예약 ID 목록 (UUID) |
| seatIds        | List\<String\>    | 선점된 좌석 ID 목록 |
| status         | ReservationStatus | `PENDING`           |
| paymentStatus  | PaymentStatus     | `PENDING`           |
| paymentId      | Long              | 생성된 결제 ID      |
| totalAmount    | Long              | 총 결제 금액        |
| expiresAt      | LocalDateTime     | 선점 만료 시각      |

---

# 3) 예약 확정

## API

```
POST /api/v1/ticket/reservations/confirm
```

## 설명

- 결제 완료 후 예약을 최종 확정
- reservationIds 리스트로 다중 예약을 일괄 확정

## Headers

- `X-User-Id` (Long, 필수): 사용자 ID

## Path Parameters

- 없음

## Query Parameters

- 없음

## Request Body

```json
{
  "reservationIds": [
    "8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d",
    "1a2b3c4d-5e6f-7890-abcd-ef1234567890"
  ]
}
```

| 필드           | 타입           | 필수 | 설명                           |
| -------------- | -------------- | ---- | ------------------------------ |
| reservationIds | List\<String\> | Y    | 확정할 예약 ID 목록 (1개 이상) |

## Response 200

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "paymentId": 5001,
    "reservations": [
      {
        "reservationId": "8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d",
        "eventId": 10,
        "showId": 100,
        "seatId": "A01",
        "userId": 101,
        "status": "CONFIRMED",
        "paymentStatus": "SUCCESS",
        "paidAt": "2026-03-30T10:10:00",
        "refundStatus": "NONE",
        "expiresAt": "2026-03-31T09:00:00",
        "refundedAt": null,
        "updatedAt": "2026-03-30T10:10:00"
      },
      {
        "reservationId": "1a2b3c4d-5e6f-7890-abcd-ef1234567890",
        "eventId": 10,
        "showId": 100,
        "seatId": "A02",
        "userId": 101,
        "status": "CONFIRMED",
        "paymentStatus": "SUCCESS",
        "paidAt": "2026-03-30T10:10:00",
        "refundStatus": "NONE",
        "expiresAt": "2026-03-31T09:00:00",
        "refundedAt": null,
        "updatedAt": "2026-03-30T10:10:00"
      }
    ]
  }
}
```

### ConfirmReservationsResponse 필드

| 필드         | 타입                        | 설명             |
| ------------ | --------------------------- | ---------------- |
| paymentId    | Long                        | 결제 ID          |
| reservations | List\<ReservationResponse\> | 확정된 예약 목록 |

#### ReservationResponse 필드

| 필드          | 타입              | 설명                 |
| ------------- | ----------------- | -------------------- |
| reservationId | String            | 예약 ID (UUID)       |
| eventId       | Long              | 공연 ID              |
| showId        | Long              | 회차 ID              |
| seatId        | String            | 좌석 ID              |
| userId        | Long              | 사용자 ID            |
| status        | ReservationStatus | 예약 상태            |
| paymentStatus | PaymentStatus     | 결제 상태            |
| paidAt        | LocalDateTime     | 결제 시각 (nullable) |
| refundStatus  | RefundStatus      | 환불 상태            |
| expiresAt     | LocalDateTime     | 만료 시각            |
| refundedAt    | LocalDateTime     | 환불 시각 (nullable) |
| updatedAt     | LocalDateTime     | 수정 시각            |

---

# 4) 결제 전 선점 상태 조회

## API

```
GET /api/v1/ticket/reservations/{reservationId}/hold-status
```

## 설명

- 예약된 좌석의 선점 유효 여부와 TTL 확인

## Headers

- `X-User-Id` (Long, 필수): 사용자 ID

## Path Parameters

- `reservationId` (String): 예약 ID

## Query Parameters

- 없음

## Request

- 없음

## Response 200

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "reservationId": "8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d",
    "holdValid": true,
    "holdTtlSeconds": 97
  }
}
```

### ReservationHoldStatusResponse 필드

| 필드           | 타입    | 설명           |
| -------------- | ------- | -------------- |
| reservationId  | String  | 예약 ID        |
| holdValid      | boolean | 선점 유효 여부 |
| holdTtlSeconds | long    | 남은 TTL (초)  |

---

# 5) 예약 만료 처리

## API

```
POST /api/v1/ticket/reservations/{reservationId}/expire
```

## 설명

- 선점 시간이 지나 결제가 완료되지 않은 예약 만료 처리

## Headers

- 없음

## Path Parameters

- `reservationId` (String): 예약 ID

## Query Parameters

- 없음

## Request

- 없음

## Response 200

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "reservationId": "8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d",
    "eventId": 10,
    "showId": 100,
    "seatId": "A01",
    "userId": 101,
    "status": "EXPIRED",
    "paymentStatus": "FAILED",
    "paidAt": null,
    "refundStatus": "NONE",
    "expiresAt": "2026-03-30T10:00:00",
    "refundedAt": null,
    "updatedAt": "2026-03-30T10:01:00"
  }
}
```

---

# 6) 예약 취소

## API

```
POST /api/v1/ticket/reservations/cancel
```

## 설명

- 예약 취소 처리
- 취소 이후 환불 상태는 `REQUESTED`로 반영
- reservationId가 아닌 eventId + showId + seatId 조합으로 예약을 조회

## Headers

- `X-User-Id` (Long, 필수): 사용자 ID

## Path Parameters

- 없음

## Query Parameters

- 없음

## Request Body

```json
{
  "eventId": 10,
  "showId": 100,
  "seatId": "A01"
}
```

| 필드    | 타입   | 필수 | 설명                 |
| ------- | ------ | ---- | -------------------- |
| eventId | Long   | Y    | 공연 ID              |
| showId  | Long   | Y    | 회차 ID              |
| seatId  | String | Y    | 좌석 ID (blank 불가) |

## Response 200

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "reservationId": "8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d",
    "eventId": 10,
    "showId": 100,
    "seatId": "A01",
    "userId": 101,
    "status": "CANCELLED",
    "paymentStatus": "SUCCESS",
    "paidAt": "2026-03-30T10:10:00",
    "refundStatus": "REQUESTED",
    "expiresAt": "2026-03-31T09:00:00",
    "refundedAt": null,
    "updatedAt": "2026-03-30T10:15:00"
  }
}
```

---

# 7) 환불 처리

## API

```
POST /api/v1/ticket/reservations/{reservationId}/refund
```

## 설명

- 취소된 예약에 대해 환불 완료 처리

## Headers

- 없음

## Path Parameters

- `reservationId` (String): 예약 ID

## Query Parameters

- 없음

## Request Body

```json
{
  "success": true
}
```

| 필드    | 타입    | 필수 | 설명           |
| ------- | ------- | ---- | -------------- |
| success | Boolean | Y    | 환불 성공 여부 |

## Response 200

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "reservationId": "8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d",
    "eventId": 10,
    "showId": 100,
    "seatId": "A01",
    "userId": 101,
    "status": "CANCELLED",
    "paymentStatus": "SUCCESS",
    "paidAt": "2026-03-30T10:10:00",
    "refundStatus": "COMPLETED",
    "expiresAt": "2026-03-31T09:00:00",
    "refundedAt": "2026-03-30T10:20:00",
    "updatedAt": "2026-03-30T10:20:00"
  }
}
```

---

# 8) 예약티켓 목록 조회

## API

```
GET /api/v1/ticket/users/reservations
```

## 설명

- 현재 사용자의 예약 목록 조회
- 상태값으로 필터링 가능
- userId는 `X-User-Id` 헤더에서 가져옴 (path parameter 아님)

## Headers

- `X-User-Id` (Long, 필수): 사용자 ID

## Path Parameters

- 없음

## Query Parameters

- `status` (ReservationStatus, optional): `PENDING`, `CONFIRMED`, `CANCELLED`, `EXPIRED`, `FAILED`

## Request Example

```
GET /api/v1/ticket/users/reservations?status=CONFIRMED
```

## Response 200

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": [
    {
      "reservationId": "rsv-001",
      "eventId": 10,
      "showId": 100,
      "seatId": "A01",
      "userId": 101,
      "status": "CONFIRMED",
      "paymentStatus": "SUCCESS",
      "paidAt": "2026-03-29T10:10:00",
      "refundStatus": "NONE",
      "transferEligible": true,
      "expiresAt": "2026-03-31T09:00:00",
      "refundedAt": null,
      "updatedAt": "2026-03-29T10:10:00"
    },
    {
      "reservationId": "rsv-002",
      "eventId": 10,
      "showId": 101,
      "seatId": "B03",
      "userId": 101,
      "status": "PENDING",
      "paymentStatus": "PENDING",
      "paidAt": null,
      "refundStatus": "NONE",
      "transferEligible": false,
      "expiresAt": "2026-03-31T11:00:00",
      "refundedAt": null,
      "updatedAt": "2026-03-30T09:55:00"
    }
  ]
}
```

### MyReservationResponse 필드

| 필드             | 타입              | 설명                                                   |
| ---------------- | ----------------- | ------------------------------------------------------ |
| reservationId    | String            | 예약 ID                                                |
| eventId          | Long              | 공연 ID                                                |
| showId           | Long              | 회차 ID                                                |
| seatId           | String            | 좌석 ID                                                |
| userId           | Long              | 사용자 ID                                              |
| status           | ReservationStatus | 예약 상태                                              |
| paymentStatus    | PaymentStatus     | 결제 상태                                              |
| paidAt           | LocalDateTime     | 결제 시각 (nullable)                                   |
| refundStatus     | RefundStatus      | 환불 상태                                              |
| transferEligible | boolean           | 양도 가능 여부 (CONFIRMED + SUCCESS + NONE 일 때 true) |
| expiresAt        | LocalDateTime     | 만료 시각                                              |
| refundedAt       | LocalDateTime     | 환불 시각 (nullable)                                   |
| updatedAt        | LocalDateTime     | 수정 시각                                              |

---

# 9) (내부) 양도 가능 여부 조회

## API

```
GET /api/v1/ticket/internal/transfers/{reservationId}/eligibility
```

## 설명

- 양도 서비스에서 사용
- 특정 예약이 양도 가능한 상태인지 확인

## Headers

- 없음

## Path Parameters

- `reservationId` (String): 예약 ID

## Query Parameters

- 없음

## Request

- 없음

## Response 200

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "reservationId": "8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d",
    "ownerUserId": 101,
    "eligible": true,
    "reason": "OK"
  }
}
```

### TransferEligibilityResponse 필드

| 필드          | 타입    | 설명           |
| ------------- | ------- | -------------- |
| reservationId | String  | 예약 ID        |
| ownerUserId   | Long    | 현재 소유자 ID |
| eligible      | boolean | 양도 가능 여부 |
| reason        | String  | 사유           |

---

# 10) (내부) 소유권 양도 완료

## API

```
POST /api/v1/ticket/internal/transfers/{reservationId}/complete
```

## 설명

- 양도 완료 후 예약 소유권을 새로운 사용자에게 이전

## Headers

- 없음

## Path Parameters

- `reservationId` (String): 예약 ID

## Query Parameters

- 없음

## Request Body

```json
{
  "userId": 202
}
```

| 필드   | 타입 | 필수 | 설명             |
| ------ | ---- | ---- | ---------------- |
| userId | Long | Y    | 양수인 사용자 ID |

## Response 200

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "reservationId": "8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d",
    "eventId": 10,
    "showId": 100,
    "seatId": "A01",
    "userId": 202,
    "status": "CONFIRMED",
    "paymentStatus": "SUCCESS",
    "paidAt": "2026-03-30T10:10:00",
    "refundStatus": "NONE",
    "expiresAt": "2026-03-31T09:00:00",
    "refundedAt": null,
    "updatedAt": "2026-03-30T10:40:00"
  }
}
```

---

# 11) (내부) 티켓 좌석 정보 조회 (양도용)

## API

```
GET /api/v1/ticket/internal/transfer-seat-info
```

> ⚠️ **스펙 불일치**: 문서 원본은 `POST` + body `{showId, tier, zoneNo}` 였으나, 실제 백엔드는 `GET` + query params로 변경됨

## 설명

- Community(양도) 서비스가 특정 사용자/이벤트/회차 기준으로 양도 대상 좌석 정보를 조회

## Headers

- `X-User-Id` (Long, 필수): 사용자 ID

## Path Parameters

- 없음

## Query Parameters

- `eventId` (Long, 필수): 공연 ID
- `showId` (Long, 필수): 회차 ID

## Request Body

없음 (GET 메서드)

## Response 200

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "seats": [
      {
        "seatId": "VIP1-A-01",
        "status": "LOCKED"
      },
      {
        "seatId": "VIP1-A-02",
        "status": "RESERVED"
      }
    ]
  }
}
```

### InternalUnavailableSeatsResponse 필드

| 필드  | 타입                   | 설명               |
| ----- | ---------------------- | ------------------ |
| seats | List\<SeatStatusItem\> | 사용불가 좌석 목록 |

#### SeatStatusItem

| 필드   | 타입       | 설명                              |
| ------ | ---------- | --------------------------------- |
| seatId | String     | 좌석 ID                           |
| status | SeatStatus | `AVAILABLE`, `LOCKED`, `RESERVED` |

---

# 12) (내부) 특정 티어/구역 내 사용불가 좌석 조회

## API

```
POST /api/v1/ticket/internal/seats/statuses
```

## 설명

- Event 서비스가 tier/zone 기준으로 사용불가(LOCKED/RESERVED) 좌석을 조회

## Headers

- 없음

## Path Parameters

- 없음

## Query Parameters

- 없음

## Request Body

```json
{
  "showId": 100,
  "tier": "VIP",
  "zoneNo": 1
}
```

| 필드   | 타입    | 필수 | 설명              |
| ------ | ------- | ---- | ----------------- |
| showId | Long    | Y    | 회차 ID (양수)    |
| tier   | String  | Y    | 티어 (blank 불가) |
| zoneNo | Integer | Y    | 구역 번호 (양수)  |

## Response 200

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "seats": [
      {
        "seatId": "VIP1-A-01",
        "status": "LOCKED"
      },
      {
        "seatId": "VIP1-A-02",
        "status": "RESERVED"
      }
    ]
  }
}
```

---

# 13) 티켓 좌석 정보 조회

## API

```
POST /api/v1/ticket/seats/statuses
```

## 설명

- Event 서비스가 특정 user, show, status=confirmed 목록의 Ticket 상태를 일괄 조회

## Headers

- 없음

## Path Parameters

- 없음

## Query Parameters

- 없음

## Request Body

```json
{
  "eventId": 10,
  "showId": 100,
  "userId": 101
}
```

| 필드    | 타입 | 필수 | 설명           |
| ------- | ---- | ---- | -------------- |
| eventId | Long | Y    | 공연 ID        |
| showId  | Long | Y    | 회차 ID (양수) |
| userId  | Long | Y    | 사용자 ID      |

## Response 200

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "seats": [
      {
        "seatIds": "A01",
        "price": 88000
      },
      {
        "seatIds": "A02",
        "price": 88000
      }
    ]
  }
}
```

### InternalTicketInfoResponse 필드

| 필드  | 타입               | 설명           |
| ----- | ------------------ | -------------- |
| seats | List\<ticketSeat\> | 티켓 좌석 목록 |

#### ticketSeat

| 필드    | 타입   | 설명    |
| ------- | ------ | ------- |
| seatIds | String | 좌석 ID |
| price   | Long   | 가격    |

---

# 14) Health Check

## API

```
GET /health
```

## 설명

- 서비스 상태 확인용 헬스체크 엔드포인트

## Headers

- 없음

## Path Parameters

- 없음

## Query Parameters

- 없음

## Request

- 없음

## Response 200

```json
{
  "service": "ticket-service",
  "status": "ok"
}
```

---

# Enum 참조

## ReservationStatus

| 값        | 설명      |
| --------- | --------- |
| PENDING   | 예약 대기 |
| CONFIRMED | 예약 확정 |
| EXPIRED   | 만료      |
| FAILED    | 실패      |
| CANCELLED | 취소      |

## PaymentStatus

| 값      | 설명      |
| ------- | --------- |
| PENDING | 결제 대기 |
| SUCCESS | 결제 성공 |
| FAILED  | 결제 실패 |

## RefundStatus

| 값        | 설명      |
| --------- | --------- |
| NONE      | 환불 없음 |
| REQUESTED | 환불 요청 |
| COMPLETED | 환불 완료 |
| FAILED    | 환불 실패 |

## SeatStatus

| 값        | 설명      |
| --------- | --------- |
| AVAILABLE | 사용 가능 |
| LOCKED    | 선점 중   |
| RESERVED  | 예약 완료 |

---

# 공통 응답 구조 (ApiResponse)

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": { ... }
}
```

| 필드       | 타입    | 설명                   |
| ---------- | ------- | ---------------------- |
| isSuccess  | boolean | 성공 여부              |
| statusCode | int     | HTTP 상태 코드         |
| message    | String  | 메시지                 |
| data       | T       | 응답 데이터 (nullable) |
