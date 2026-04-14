# Payment Service 연동 현황

> 백엔드 코드 경로: C:\Users\kkaeng\Desktop\Dev\URR\urr-backend\urr-paymentService
>
> 마지막 확인: 2026-04-14 / 마지막 수정: 2026-04-14

| #   | API                                 | 메서드 | 엔드포인트                                                     | 연동 파일                                     | 상태      | 비고                                                       |
| --- | ----------------------------------- | ------ | -------------------------------------------------------------- | --------------------------------------------- | --------- | ---------------------------------------------------------- |
| 1.1 | 결제 데이터 생성                    | POST   | `/api/v1/payments/create`                                      | —                                             | ➖ 불필요 | 프론트 미사용 — 티켓 서비스 내부에서 처리                  |
| 1.2 | 결제 승인                           | POST   | `/api/v1/payments/confirm`                                     | `features/payment/api/confirmPayment.ts`      | ✅ 연동됨 | `status: string`으로 반환하며 코드에서 값 비교 없음 (무해) |
| 1.3 | 결제 단건 조회                      | GET    | `/api/v1/payments/order/{orderId}`                             | —                                             | ➖ 불필요 | 프론트 미사용                                              |
| 1.4 | 결제 취소                           | POST   | `/api/v1/payments/cancel`                                      | —                                             | ➖ 불필요 | 프론트 미사용; 경로 수정: `/{paymentKey}/cancel` → `/cancel`, Request에 `orderId` 필수 추가 |
| 2.1 | 멤버십 결제 생성 (내부)             | POST   | `/api/v1/internal/payments/membership/create`                  | —                                             | ➖ 불필요 | 서비스 내부 API                                            |
| 2.2 | 티켓 예매 결제 생성 (내부)          | POST   | `/api/v1/internal/payments/ticket/create`                      | —                                             | ➖ 불필요 | 서비스 내부 API                                            |
| 2.3 | 양도 커뮤니티 구매 결제 생성 (내부) | POST   | `/api/v1/internal/payments/transfer/create`                    | —                                             | ➖ 불필요 | 서비스 내부 API                                            |
| 2.4 | 예매 결제 금액 조회 (내부)          | GET    | `/api/v1/internal/payments/reservation/{reservationId}/amount` | —                                             | ➖ 불필요 | 서비스 내부 API (신규 추가)                                |
| 2.5 | 티켓 예매 결제 취소 (내부)          | POST   | `/api/v1/internal/payments/ticket/cancel`                      | —                                             | ➖ 불필요 | 티켓 서비스 → 결제 서비스 내부 취소 콜백                  |

> **참고**: `PaymentStatus` enum 변경 — `READY`→`PENDING`, `DONE`→`PAID`, `PARTIAL_CANCELED` 제거. status 값을 직접 비교하는 UI 로직이 있다면 확인 필요.

---

[[공유]결제 연동 가이드(프론트엔드)](https://www.notion.so/338088024298805093a3e117c7b1f148?pvs=21)

---

## **1. 외부 클라이언트 API (Public)**

### **1.1 결제 데이터 생성 (검증용)**

`POST /api/v1/payments/create`

사용자가 PG 결제창을 띄우기 전, 서버 측에 전송될 결제 요청 금액과 실제 주문 정보를 미리 기록하고 검증하기 위해 호출합니다.

**요청 헤더**

| **이름**    | **타입** | **필수** | **설명**       |
| ----------- | -------- | -------- | -------------- |
| `X-User-Id` | Long     | Y        | 현재 사용자 ID |

**요청 바디**

```json
{
  "referenceId": "res_20240403_01",
  "orderId": "ORD-123456789",
  "amount": 50000
}
```

**응답 예시**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "paymentId": 1,
    "orderId": "ORD-123456789",
    "referenceId": "res_20240403_01",
    "amount": 50000,
    "status": "PENDING"
  }
}
```

---

### **1.2 결제 승인**

`POST /api/v1/payments/confirm`

PG(토스페이먼츠) 결제창에서 결제 완료 후, 리다이렉트된 `successUrl`에서 받은 파라미터들을 서버로 전송하여 최종 승인 처리를 요청합니다.

**요청 헤더**

| **이름**    | **타입** | **필수** | **설명**       |
| ----------- | -------- | -------- | -------------- |
| `X-User-Id` | Long     | Y        | 현재 사용자 ID |

**요청 바디**

```json
{
  "paymentKey": "tgen_20240403164307M1234",
  "orderId": "ORD-123456789",
  "amount": 50000
}
```

**응답 예시**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "paymentKey": "tgen_20240403164307M1234",
    "orderId": "ORD-123456789",
    "amount": 50000,
    "method": "CARD",
    "referenceId": "res_20240403_01",
    "status": "PAID",
    "approvedAt": "2024-04-03T16:45:00"
  }
}
```

---

### **1.3 결제 단건 조회**

`GET /api/v1/payments/order/{orderId}`

주문 번호를 기반으로 결제 상세 내역을 조회합니다.

**요청 헤더**

| **이름**    | **타입** | **필수** | **설명**       |
| ----------- | -------- | -------- | -------------- |
| `X-User-Id` | Long     | Y        | 현재 사용자 ID |

**응답 필드**

| **필드**      | **타입**      | **Nullable** | **설명**                                                    |
| ------------- | ------------- | ------------ | ----------------------------------------------------------- |
| `paymentKey`  | String        | Y            | `PENDING` 상태에서는 `null`                                 |
| `orderId`     | String        | N            |                                                             |
| `amount`      | Long          | N            |                                                             |
| `method`      | String        | Y            | `PENDING` 상태에서는 `null`                                 |
| `referenceId` | String        | N            | 다중 예약의 경우 쉼표 구분 문자열 (예: `"res_001,res_002"`) |
| `status`      | String        | N            | `PENDING` / `PAID` / `FAILED` / `CANCELED`                  |
| `approvedAt`  | LocalDateTime | Y            | `PENDING` 상태에서는 `null`                                 |

**응답 예시 (PAID 상태)**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "paymentKey": "tgen_20240403164307M1234",
    "orderId": "ORD-123456789",
    "amount": 50000,
    "method": "CARD",
    "referenceId": "res_20240403_01",
    "status": "PAID",
    "approvedAt": "2024-04-03T16:45:00"
  }
}
```

**응답 예시 (PENDING 상태 — 결제 생성 직후)**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "paymentKey": null,
    "orderId": "ORD-123456789",
    "amount": 50000,
    "method": null,
    "referenceId": "res_20240403_01",
    "status": "PENDING",
    "approvedAt": null
  }
}
```

---

### **1.4 결제 취소**

`POST /api/v1/payments/cancel`

승인된 결제를 취소 요청합니다.

**요청 헤더**

| **이름**    | **타입** | **필수** | **설명**       |
| ----------- | -------- | -------- | -------------- |
| `X-User-Id` | Long     | Y        | 현재 사용자 ID |

**요청 바디**

| **필드**      | **타입** | **필수** | **설명**                                                             |
| ------------- | -------- | -------- | -------------------------------------------------------------------- |
| `orderId`     | String   | Y        | 주문 번호 (`res_`, `mem_`, `trf_` 접두어)                            |
| `referenceId` | String   | N        | 도메인 식별자 (`reservationId`, `membershipId`, `postId` alias 허용) |
| `cancelReason`| String   | N        | 취소 사유                                                            |

```json
{
  "orderId": "ORD-123456789",
  "referenceId": "res_20240403_01",
  "cancelReason": "고객 단순 변심"
}
```

**응답 예시**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "userId": 1,
    "orderId": "ORD-123456789",
    "referenceId": "res_20240403_01",
    "paymentKey": "tgen_20240403164307M1234",
    "amount": 50000,
    "status": "CANCELED",
    "cancelReason": "고객 단순 변심",
    "canceledAt": "2024-04-03T17:00:00"
  }
}
```

---

## **2. 내부 서비스 API (Internal)**

타 서비스(Ticket, Membership 등)에서 결제 정보를 생성하기 위해 호출하는 API입니다.

### **2.1 멤버십 결제 생성**

`POST /api/v1/internal/payments/membership/create`

**요청 바디**

```json
{
  "userId": 1,
  "referenceId": "membership_001",
  "orderId": "mem_123",
  "amount": 9900
}
```

**응답 예시**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "paymentId": 10
  }
}
```

### **2.2 티켓 예매 결제 생성**

`POST /api/v1/internal/payments/ticket/create`

**요청 바디**

```json
{
  "userId": 1,
  "referenceId": "reservation_001",
  "orderId": "res_123",
  "amount": 50000
}
```

**응답 예시**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "paymentId": 25
  }
}
```

### **2.3 양도 커뮤니티 구매 결제 생성**

`POST /api/v1/internal/payments/transfer/create`

**요청 바디**

```json
{
  "userId": 1,
  "referenceId": "post_001",
  "orderId": "trf_123",
  "amount": 35000
}
```

**응답 예시**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "orderId": "trf_123",
    "paymentId": 50,
    "amount": 35000
  }
}
```

### **2.4 예매 결제 금액 조회**

`GET /api/v1/internal/payments/reservation/{reservationId}/amount`

양도 커뮤니티 서비스에서 특정 예약의 결제 금액을 조회하는 내부 API입니다.

**응답 예시**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "reservationId": "reservation_001",
    "amount": 50000
  }
}
```

### **2.5 티켓 예매 결제 취소 (내부)**

`POST /api/v1/internal/payments/ticket/cancel`

티켓 서비스에서 `reservationId` 기반으로 결제 취소를 요청하는 내부 API입니다.

**요청 바디**

```json
{
  "userId": 1,
  "reservationIds": ["res_001", "res_002"],
  "cancelReason": "좌석 선점 만료"
}
```

**응답 예시**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "referenceId": "res_001,res_002",
    "userId": 1,
    "status": "CANCELED",
    "refundAt": "2024-04-03T17:00:00"
  }
}
```

---

## **공통 응답 형식**

### **성공 응답**

```json
{
	"isSuccess":true,
	"statusCode":200,
	"message":"OK",
	"data": {... }
}
```

### **실패 응답**

```json
{
  "isSuccess": false,
  "statusCode": 400,
  "message": "에러 메시지 내용",
  "data": null
}
```

---

## **상태값 (PaymentStatus)**

| **상태**   | **설명**                          |
| ---------- | --------------------------------- |
| `PENDING`  | 결제 생성 직후, 승인 전 대기 상태 |
| `PAID`     | 결제 승인 완료                    |
| `CANCELED` | 결제 취소 완료                    |
| `FAILED`   | 결제 실패                         |

---

## **referenceId 설명**

`referenceId`는 결제 서비스와 다른 비즈니스 도메인 서비스를 연결하는 **가교(Bridge) 역할**을 수행하는 식별자입니다.

- **목적**: 결제가 어떤 도메인 리소스(예: 티켓 예약, 멤버십 가입, 양도 게시글)에 의해 발생했는지 추적하기 위해 사용됩니다.
- **역할**:
  - 외부 PG(토스페이먼츠 등)와의 통신에는 시스템 고유의 `orderId`를 사용하지만, 내부 관리를 위해 실제 도메인 모델의 ID를 `referenceId`에 저장합니다.
  - 결제 성공 시 `referenceId`를 통해 해당 도메인 서비스(Ticket, Membership 등)에 결제 완료 상태를 전파할 수 있습니다.
- **분야별 데이터 예시**:
  - **티켓 서비스**: `reservationId` (예약 번호)
  - **멤버십 서비스**: `membershipId` (멤버십 가입 번호)
  - **양도 서비스**: `postId` (게시글 ID)
- **참고**: 외부 공개 API(1.1)에서는 `referenceId` 키 그대로 전송. 내부 서비스 API(2.x)에서는 `reservationId`, `membershipId`, `postId` 키도 `@JsonAlias`로 허용되므로 각 서비스가 자체 키 이름으로 전송 가능.
