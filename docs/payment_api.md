# payment api 명세

## **1. 외부 클라이언트 API (Public)**

### **1.1 결제 데이터 생성 (검증용)**

`POST /api/v1/payments/create`

사용자가 PG 결제창을 띄우기 전, 서버 측에 전송될 결제 요청 금액과 실제 주문 정보를 미리 기록하고 검증하기 위해 호출합니다.

**요청 헤더**

| **이름**    | **타입** | **필수** | **설명**       |
| ----------- | -------- | -------- | -------------- |
| `X-User-Id` | Long     | Y        | 현재 사용자 ID |

**요청 바디**

```java
{
		"referenceId":"res_20240403_01",
		"orderId":"ORD-123456789",
		"amount":50000
}
```

**응답 예시**

```java
{
	"isSuccess":true,
	"statusCode":200,
	"message":"OK",
	"data": {
			"paymentId":1,
			"orderId":"ORD-123456789",
			"referenceId":"res_20240403_01",
			"amount":50000,
			"status":"READY"
	  }
}
```

---

### **1.2 결제 승인**

`POST /api/v1/payments/confirm`

PG(토스페이먼츠) 결제창에서 결제 완료 후, 리다이렉트된 `successUrl`에서 받은 파라미터들을 서버로 전송하여 최종 승인 처리를 요청합니다.

**요청 바디**

```java
{
	"paymentKey":"tgen_20240403164307M1234",
	"orderId":"ORD-123456789",
	"amount":50000
}
```

**응답 예시**

```java
{
	"isSuccess":true,
	"statusCode":200,
	"message":"OK",
	"data": {
			"paymentKey":"tgen_20240403164307M1234",
			"orderId":"ORD-123456789",
			"amount":50000,
			"method":"CARD",
			"referenceId":"res_20240403_01",
			"status":"DONE",
			"approvedAt":"2024-04-03T16:45:00"
	  }
}
```

---

### **1.3 결제 단건 조회**

`GET /api/v1/payments/order/{orderId}`

주문 번호를 기반으로 결제 상세 내역을 조회합니다.

**응답 예시**

```java
{
	"isSuccess":true,
	"statusCode":200,
	"message":"OK",
	"data": {
			"paymentKey":"tgen_20240403164307M1234",
			"orderId":"ORD-123456789",
			"amount":50000,
			"method":"CARD",
			"referenceId":"res_20240403_01",
			"status":"DONE",
			"approvedAt":"2024-04-03T16:45:00"
	  }
}
```

---

### **1.4 결제 취소**

`POST /api/v1/payments/{paymentKey}/cancel`

승인된 결제를 취소 요청합니다.

**요청 바디**

```java
{
	"cancelReason":"고객 단순 변심"
}
```

---

## **2. 내부 서비스 API (Internal)**

타 서비스(Ticket, Membership 등)에서 결제 정보를 생성하기 위해 호출하는 API입니다.

### **2.1 멤버십 결제 생성**

`POST /api/v1/internal/payments/membership/create`

**응답 예시**

```java
{
	"isSuccess":true,
	"statusCode":200,
	"message":"OK",
	"data": {
			"paymentId":10
	  }
	}
```

### **2.2 티켓 예매 결제 생성**

`POST /api/v1/internal/payments/ticket/create`

**응답 예시**

```java
{
	"isSuccess":true,
	"statusCode":200,
	"message":"OK",
	"data": {
			"paymentId":25
	  }
}
```

### **2.3 양도 커뮤니티 구매 결제 생성**

`POST /api/v1/internal/payments/transfer/create`

**응답 예시**

```java
{
	"isSuccess":true,
	"statusCode":200,
	"message":"OK",
	"data": {
			"orderId":"trf_123",
			"paymentId":50,
			"amount":35000
	  }
}
```

---

## **공통 응답 형식**

### **성공 응답**

```java
{
	"isSuccess":true,
	"statusCode":200,
	"message":"OK",
	"data": {... }
}
```

### **실패 응답**

```java
{
	"isSuccess":false,
	"statusCode":400,
	"message":"에러 메시지 내용",
	"data":null
}
```

---

## **상태값 (PaymentStatus)**

| **상태**           | **설명**                          |
| ------------------ | --------------------------------- |
| `READY`            | 결제 생성 직후, 승인 전 대기 상태 |
| `DONE`             | 결제 승인 완료                    |
| `CANCELED`         | 결제 취소 완료                    |
| `FAILED`           | 결제 실패                         |
| `PARTIAL_CANCELED` | 부분 취소 완료                    |

---

## **referenceId 설명**

`referenceId`는 결제 서비스와 다른 비즈니스 도메인 서비스를 연결하는 **가교(Bridge) 역할**을 수행하는 식별자입니다.

- **목적**: 결제가 어떤 도메인 리소스(예: 티켓 예약, 멤버십 가입, 양도 게시글)에 의해 발생했는지 추적하기 위해 사용됩니다.
- **역할**:
  - 외부 PG(토스페이먼츠 등)와의 통신에는 시스템 고유의 `orderId`를 사용하지만, 내부 관리를 위해 실제 도메인 모델의 ID를 `referenceId`에 저장합니다.
  - 결제 성공 시 `referenceId`를 통해 해당 도메인 서비스(Ticket, Membership 등)에 결제 완료 상태를 전파할 수 있습니다.
- **분야별 데이터 예시**:
  - **티켓 서비스**: `reservationId` (예약 번호)
  - **멤버십 서비스**: `membershipId` (멤버십 가입 번호)
  - **양도 서비스**: `postId` (게시글 ID)
