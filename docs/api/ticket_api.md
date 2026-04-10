# 1) 좌석 조회

## API

```
GET /api/v1/ticket/events/{eventId}/shows/{showId}/seats
```

## 설명

- 특정 공연(Event)과 회차(Show)의 좌석 목록 조회

## Headers

- 없음

## Path Parameters

- `eventId` (Long): 공연 ID
- `showId` (Long): 회차 ID

## Query Parameters

- 없음

## Request Example

```
GET /api/v1/ticket/events/10/shows/100/seats
```

## Response 200

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": [
    {
      "seatId":"A01",
      "status":"AVAILABLE",
      "lockedUntil":null,
      "section":"A",
      "row":"1",
      "number":"01",
      "price":120000,
      "sellable":true,
      "seatVersion":11
    },
    {
      "seatId":"A02",
      "status":"LOCKED",
      "lockedUntil":"2026-03-30T10:35:00",
      "section":"A",
      "row":"1",
      "number":"02",
      "price":120000,
      "sellable":true,
      "seatVersion":12
    }
  ]
}
```

---

# 2) 단일 좌석 선점 + 예약 생성

## API

```
POST /api/v1/ticket/reservations
```

## 설명

- 단일 좌석을 선점하고 예약을 생성

## Headers

- `X-User-Id: 101`
- `Authorization: Bearer <queue-entry-jwt>` (권장)

## Path Parameters

- 없음

## Query Parameters

- 없음

## Request Body

```
{
  "eventId":10,
  "showId":100,
  "artistId":777,
  "seatId":"A01",
  "holdSeconds":180
}
```

## Response 200

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "reservationId":"8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d",
    "status":"PENDING",
    "paymentStatus":"PENDING",
    "expiresAt":"2026-03-31T09:00:00"
  }
}
```

## 실패 응답 예시 (좌석 없음)

```
{
  "isSuccess":false,
  "statusCode":404,
  "message":"좌석을 찾을 수 없습니다.",
  "data":null
}
```

---

# 3) 다중 좌석 원자 선점 + 예약 생성 (Lua) - 미완

## API

```
POST /api/v1/ticket/reservations/bulk
```

## 설명

- 여러 좌석을 원자적으로 선점하고 예약 생성
- 일부 좌석 선점 실패 시 실패 좌석 목록 반환

## Headers

- `X-User-Id: 101`
- `Authorization: Bearer <queue-entry-jwt>`

## Path Parameters

- 없음

## Query Parameters

- 없음

## Request Body

```
{
  "eventId":10,
  "showId":100,
  "artistId":777,
  "seatIds": ["A01","A02"],
  "holdSeconds":180
}
```

## Response 200 (전체 성공)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "reservations": [
      {
        "reservationId":"d89c9f41-1408-41fd-ba4a-c79cd8b97d5e",
        "status":"PENDING",
        "paymentStatus":"PENDING",
        "expiresAt":"2026-03-31T09:00:00"
      },
      {
        "reservationId":"77d15b16-c15d-43cb-a7e3-4ef8f8f1f152",
        "status":"PENDING",
        "paymentStatus":"PENDING",
        "expiresAt":"2026-03-31T09:00:00"
      }
    ],
    "failedSeatIds": []
  }
}
```

## Response 200 (실패 좌석 존재)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "reservations": [],
    "failedSeatIds": ["A02","A100"]
  }
}
```

---

# 4) 예약 확정

## API

```
POST /api/v1/ticket/reservations/{reservationId}/confirm
```

## 설명

- 결제 완료 후 예약을 최종 확정

## Headers

- 없음

## Path Parameters

- `reservationId` (UUID/String): 예약 ID

## Query Parameters

- 없음

## Request Example

```
POST /api/v1/ticket/reservations/8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d/confirm
```

## Response 200

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "reservationId":"8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d",
    "eventId":10,
    "showId":100,
    "seatId":"A01",
    "userId":101,
    "status":"CONFIRMED",
    "paymentStatus":"SUCCESS",
    "paidAt":"2026-03-30T10:10:00",
    "refundStatus":"NONE",
    "expiresAt":"2026-03-31T09:00:00",
    "refundedAt":null,
    "updatedAt":"2026-03-30T10:10:00"
  }
}
```

---

# 5) 예약 만료 처리 - 추후 스케줄러 돌리기

## API

```
POST /api/v1/ticket/reservations/{reservationId}/expire
```

## 설명

- 선점 시간이 지나 결제가 완료되지 않은 예약 만료 처리

## Headers

- 없음

## Path Parameters

- `reservationId` (UUID/String): 예약 ID

## Query Parameters

- 없음

## Request

- 없음

## Response 200

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "reservationId":"8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d",
    "eventId":10,
    "showId":100,
    "seatId":"A01",
    "userId":101,
    "status":"EXPIRED",
    "paymentStatus":"FAILED",
    "paidAt":null,
    "refundStatus":"NONE",
    "expiresAt":"2026-03-30T10:00:00",
    "refundedAt":null,
    "updatedAt":"2026-03-30T10:01:00"
  }
}
```

---

# 6) 결제 전 선점 상태 조회

## API

```
GET /api/v1/ticket/reservations/{reservationId}/hold-status
```

## 설명

- 예약된 좌석의 선점 유효 여부와 TTL 확인

## Headers

- `X-User-Id: 101`

## Path Parameters

- `reservationId` (UUID/String): 예약 ID

## Query Parameters

- 없음

## Request

- 없음

## Response 200

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "reservationId": "8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d",
    "holdValid": true,
    "holdTtlSeconds":97
  }
}
```

---

# 7) 예약 취소

## API

```
POST /api/v1/ticket/reservations/{reservationId}/cancel
```

## 설명

- 예약 취소 처리
- 취소 이후 환불 상태는 `REQUESTED` 로 반영

## Headers

- `X-User-Id: 101`

## Path Parameters

- `reservationId` (UUID/String): 예약 ID

## Query Parameters

- 없음

## Request

- 없음

## Response 200

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "reservationId":"8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d",
    "eventId":10,
    "showId":100,
    "seatId":"A01",
    "userId":101,
    "status":"CANCELLED",
    "paymentStatus":"SUCCESS",
    "paidAt":"2026-03-30T10:10:00",
    "refundStatus":"REQUESTED",
    "expiresAt":"2026-03-31T09:00:00",
    "refundedAt":null,
    "updatedAt":"2026-03-30T10:15:00"
  }
}
```

---

# 8) 환불 처리

## API

```
POST /api/v1/ticket/reservations/{reservationId}/refund
```

## 설명

- 취소된 예약에 대해 환불 완료 처리

## Headers

- 없음

## Path Parameters

- `reservationId` (UUID/String): 예약 ID

## Query Parameters

- 없음

## Request Body

```
{
  "success":true
}
```

## Response 200

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "reservationId":"8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d",
    "eventId":10,
    "showId":100,
    "seatId":"A01",
    "userId":101,
    "status":"CANCELLED",
    "paymentStatus":"SUCCESS",
    "paidAt":"2026-03-30T10:10:00",
    "refundStatus":"COMPLETED",
    "expiresAt":"2026-03-31T09:00:00",
    "refundedAt":"2026-03-30T10:20:00",
    "updatedAt":"2026-03-30T10:20:00"
  }
}
```

---

# 9) 예약티켓 목록 조회 - 수정필요

## API

```
GET /api/v1/ticket/users/{userId}/reservations?status={optional}
```

## 설명

- 특정 사용자의 예약 목록 조회
- 상태값으로 필터링 가능

## Headers

- `X-User-Id: 101`

## Path Parameters

- `userId` (Long): 사용자 ID

## Query Parameters

- `status` (optional): `PENDING`, `CONFIRMED`, `CANCELLED`, `EXPIRED` 등

## Request Example

```
GET /api/v1/ticket/users/101/reservations?status=CONFIRMED
```

## Response 200

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": [
    {
      "reservationId":"rsv-001",
      "eventId":10,
      "showId":100,
      "seatId":"A01",
      "userId":101,
      "status":"CONFIRMED",
      "paymentStatus":"SUCCESS",
      "paidAt":"2026-03-29T10:10:00",
      "refundStatus":"NONE",
      "expiresAt":"2026-03-31T09:00:00",
      "refundedAt":null,
      "updatedAt":"2026-03-29T10:10:00"
    },
    {
      "reservationId":"rsv-002",
      "eventId":10,
      "showId":101,
      "seatId":"B03",
      "userId":101,
      "status":"PENDING",
      "paymentStatus":"PENDING",
      "paidAt":null,
      "refundStatus":"NONE",
      "expiresAt":"2026-03-31T11:00:00",
      "refundedAt":null,
      "updatedAt":"2026-03-30T09:55:00"
    }
  ]
}
```

---

# 10) (내부) 양도 가능 여부 조회

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

- `reservationId` (UUID/String): 예약 ID

## Query Parameters

- 없음

## Request

- 없음

## Response 200

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "reservationId":"8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d",
    "ownerUserId":101,
    "eligible":true,
    "reason":"OK"
  }
}
```

---

# 11) (내부) 소유권 양도 완료

## API

```
POST /api/v1/ticket/internal/transfers/{reservationId}/complete
```

## 설명

- 양도 완료 후 예약 소유권을 새로운 사용자에게 이전

## Headers

- 없음

## Path Parameters

- `reservationId` (UUID/String): 예약 ID

## Query Parameters

- 없음

## Request Body

```
{
  "userId":202
}
```

## Response 200

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "reservationId":"8f7184cb-95a5-4de1-9fa6-3f5ab8d2c16d",
    "eventId":10,
    "showId":100,
    "seatId":"A01",
    "userId":202,
    "status":"CONFIRMED",
    "paymentStatus":"SUCCESS",
    "paidAt":"2026-03-30T10:10:00",
    "refundStatus":"NONE",
    "expiresAt":"2026-03-31T09:00:00",
    "refundedAt":null,
    "updatedAt":"2026-03-30T10:40:00"
  }
}
```
