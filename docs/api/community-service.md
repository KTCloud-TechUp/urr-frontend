# Community (양도) Service 연동 현황

> 백엔드 코드 경로: C:\Users\kkaeng\Desktop\Dev\URR\urr-backend\urr-communityService
>
> 마지막 확인: 2026-04-14

| #   | API                              | 메서드 | 엔드포인트                             | 연동 파일                                                         | 상태      | 비고 |
| --- | -------------------------------- | ------ | -------------------------------------- | ----------------------------------------------------------------- | --------- | ---- |
| 0-1 | Community Health Check           | GET    | `/api/v1/community`                    | —                                                                 | ➖ 불필요 |      |
| 0-2 | Ops Health Check                 | GET    | `/health`                              | —                                                                 | ➖ 불필요 |      |
| 1-1 | 양도 게시글 등록                 | POST   | `/api/v1/transfers/posts`              | `features/transfer/api/getTransferPosts.ts` (createTransferPost)  | ⚠️ 스펙 불일치 | Response에 `zone` 필드 추가 (`section`과 `rowInfo` 사이) |
| 1-2 | 양도 게시글 상세 조회            | GET    | `/api/v1/transfers/posts/{id}`         | `features/transfer/api/getTransferPosts.ts` (getTransferPostById) | ⚠️ 스펙 불일치 | Response에 `zone` 필드 추가 (`section`과 `rowInfo` 사이) |
| 1-3 | 양도 게시글 목록 조회            | GET    | `/api/v1/transfers/posts`              | `features/transfer/api/getTransferPosts.ts` (getTransferPosts)    | ⚠️ 스펙 불일치 | Response에 `zone` 필드 추가 (`section`과 `rowInfo` 사이) |
| 1-4 | 양도 게시글 삭제                 | DELETE | `/api/v1/transfers/posts/{id}`         | `features/transfer/api/getTransferPosts.ts` (deleteTransferPost)  | ✅ 연동됨 |      |
| 1-5 | 양도 게시글 예매(결제요청)       | POST   | `/api/v1/transfers/posts/{id}/reserve` | `features/transfer/api/getTransferPosts.ts` (reserveTransferPost) | ✅ 연동됨 |      |
| 1-6 | 양도 게시글 예매 확정(결제 확정) | POST   | `/api/v1/transfers/posts/confirm`      | `features/transfer/api/getTransferPosts.ts` (confirmTransferPost) | ✅ 연동됨 |      |
| 1-7 | 양도 게시글 수정                 | PATCH  | `/api/v1/transfers/posts/{id}`         | `features/transfer/api/getTransferPosts.ts` (updateTransferPost)  | ✅ 연동됨 |      |
| 1-8 | 나의 판매 내역 조회              | GET    | `/api/v1/transfers/me/sales`           | `features/transfer/api/getMyTransfers.ts` (getMySales)            | ⚠️ 스펙 불일치 | Response에 `zone` 필드 추가 (`section`과 `rowInfo` 사이) |
| 1-9 | 나의 구매 내역 조회              | GET    | `/api/v1/transfers/me/purchases`       | `features/transfer/api/getMyTransfers.ts` (getMyPurchases)        | ⚠️ 스펙 불일치 | Response에 `zone` 필드 추가 (`section`과 `rowInfo` 사이) |

---

## **0-1. Community Service Health Check**

### **API**

```
GET /api/v1/community
```

### **설명**

커뮤니티 서비스의 상태를 확인하는 헬스체크 API입니다.

### **요청 헤더**

없음

### **요청 예시**

```
GET /api/v1/community
```

### **응답 예시**

```json
{
  "response": "success"
}
```

---

## **0-2. Ops Health Check**

### **API**

```
GET /health
```

### **설명**

운영용 서비스 상태 확인 API입니다.

### **요청 헤더**

없음

### **요청 예시**

```
GET /health
```

### **응답 예시**

```json
{
  "service": "community-service",
  "status": "ok"
}
```

---

## **1-1. 양도 게시글 등록**

### **API**

```
POST /api/v1/transfers/posts
```

### **설명**

사용자가 보유한 예매 내역(reservationId) 기반으로 양도 게시글을 등록합니다.

### **요청 헤더**

- `X-User-Id`: (Long) 현재 로그인한 사용자 ID

### **요청 예시 (Body)**

```json
{
  "artistId": 10,
  "eventId": 15,
  "showId": 20,
  "reservationId": "res-abc123"
}
```

### **응답 예시**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "id": 1,
    "artistId": 10,
    "sellerUserId": 100,
    "showName": "G-Dragon 2026 MAMA DOME TOUR",
    "showDate": "2026-04-10T19:00:00",
    "showVenue": "고척 스카이돔",
    "section": "vip",
    "zone": "1",
    "rowInfo": "3",
    "seatNumber": "15",
    "faceValue": 150000,
    "sellingPrice": 145000,
    "status": "LISTED",
    "sellerExpectedAmount": 140000,
    "feeAmount": 5000,
    "feeRate": 5,
    "createdAt": "2026-03-26T20:00:00"
  }
}
```

---

## **1-2. 양도 게시글 상세 조회(단일 조회)**

### **API**

```
GET /api/v1/transfers/posts/{id}
```

### **설명**

특정 양도 게시글의 상세 정보를 조회합니다.

### **요청 헤더**

- `X-User-Id`: (Long) 현재 로그인한 사용자 ID

### **요청 예시**

```
GET /api/v1/transfers/posts/1
```

### **응답 예시**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "id": 1,
    "artistId": 10,
    "sellerUserId": 100,
    "showName": "G-Dragon 2026 MAMA DOME TOUR",
    "showDate": "2026-04-10T19:00:00",
    "showVenue": "고척 스카이돔",
    "section": "vip",
    "zone": "1",
    "rowInfo": "3",
    "seatNumber": "15",
    "faceValue": 150000,
    "sellingPrice": 145000,
    "sellerTier": "PLATINUM",
    "sellerTradeCount": 5,
    "status": "LISTED",
    "sellerExpectedAmount": 140000,
    "feeAmount": 5000,
    "createdAt": "2026-03-26T20:00:00"
  }
}
```

---

## **1-3. 양도 게시글 목록 조회**

### **API**

```
GET /api/v1/transfers/posts
```

### **설명**

아티스트별 판매 중인 양도 게시글 목록을 조회합니다. `showId`를 포함하면 특정 공연의 게시글만 조회할 수 있으며 페이징 기능을 지원합니다.

### **요청 헤더**

- `X-User-Id`: (Long) 현재 로그인한 사용자 ID

### **요청 파라미터(Query)**

- `artistId` (필수): 아티스트 ID
- `showId` (선택): 특정 공연 ID
- `page` (선택, 기본: 0): 페이지 번호
- `size` (선택, 기본: 10): 페이지 크기
- `sort` (선택, 기본: createdAt,desc): 정렬 조건

### **요청 예시**

```
GET /api/v1/transfers/posts?artistId=10&showId=20&page=0&size=10
```

### **응답 예시**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "content": [
      {
        "id": 1,
        "artistId": 10,
        "showId": 20,
        "showName": "G-Dragon 2026 MAMA DOME TOUR",
        "showDate": "2026-04-10T19:00:00",
        "section": "vip",
        "zone": "1",
        "rowInfo": "3",
        "faceValue": 150000,
        "sellingPrice": 145000,
        "sellerTier": "PLATINUM",
        "status": "LISTED",
        "createdAt": "2026-03-26T20:00:00"
      }
    ],
    "page": 1,
    "size": 10,
    "totalElements": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

---

## **1-4. 양도 게시글 삭제**

### **API**

```
DELETE /api/v1/transfers/posts/{id}
```

### **설명**

판매자가 본인의 양도 게시글을 취소/삭제합니다.

### **요청 헤더**

- `X-User-Id`: (Long) 현재 로그인한 사용자 ID

### **요청 예시**

```
DELETE /api/v1/transfers/posts/1
```

### **응답 예시**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": null
}
```

---

## **1-5. 양도 게시글 예매(결제요청)**

### **API**

```
POST /api/v1/transfers/posts/{id}/reserve
```

### **설명**

구매자가 특정 양도 게시글에 대해 예매(결제 요청)를 진행합니다.

### **요청 헤더**

- `X-User-Id`: (Long) 현재 로그인한 구매자 ID

### **요청 파라미터(Query)**

- `artistId` (필수): 아티스트 ID

### **요청 예시**

```
POST /api/v1/transfers/posts/1/reserve?artistId=10
```

### **응답 예시**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "postId": 1,
    "orderId": "trf_882910ab301",
    "paymentId": 9901,
    "sellingPrice": 145000
  }
}
```

---

## **1-6. 양도 게시글 예매 확정(결제 확정)**

### **API**

```
POST /api/v1/transfers/posts/confirm
```

### **설명**

결제 승인이 완료된 후 프론트엔드에서 호출하는 양도 거래 확정 API입니다. 티켓 소유권을 구매자에게 이전하고, 게시글 상태를 거래 완료(COMPLETED)로 변경합니다.

### **요청 헤더**

- `X-User-Id`: (Long) 현재 로그인한 구매자 ID

### **요청 예시 (Body)**

_(주문번호는 반드시 `trf_` 로 시작해야 하며, 영문/숫자만 허용됩니다.)_

```json
{
  "orderId": "trf_882910ab301",
  "paymentKey": "toss_abcdef1234567890"
}
```

### **응답 예시**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "postId": 1,
    "orderId": "trf_882910ab301",
    "sellerUserId": 100,
    "buyerUserId": 200,
    "faceValue": 150000,
    "feeAmount": 5000,
    "sellerExpectedAmount": 140000,
    "status": "COMPLETED",
    "completedAt": "2026-04-10T20:15:00"
  }
}
```

---

## **1-7. 양도 게시글 수정**

### **API**

```
PATCH /api/v1/transfers/posts/{id}
```

### **설명**

판매자가 본인의 양도 게시글 판매가를 수정합니다. 결제 진행 중이거나 양도 완료 상태에서는 수정이 불가능합니다.

### **요청 헤더**

- `X-User-Id`: (Long) 현재 로그인한 사용자 ID

### **요청 예시 (Body)**

```json
{
  "sellingPrice": 140000
}
```

### **응답 예시**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "id": 1,
    "sellingPrice": 140000,
    "feeRate": 5,
    "feeAmount": 7000,
    "sellerExpectedAmount": 133000,
    "status": "LISTED"
  }
}
```

---

## **1-8. 나의 판매 내역 조회**

### **API**

```
GET /api/v1/transfers/me/sales
```

### **설명**

현재 로그인한 사용자의 양도 게시글 판매 내역 전체를 조회합니다.

### **요청 헤더**

- `X-User-Id`: (Long) 현재 로그인한 사용자 ID

### **요청 예시**

```
GET /api/v1/transfers/me/sales
```

### **응답 예시**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": [
    {
      "id": 1,
      "showName": "G-Dragon 2026 MAMA DOME TOUR",
      "showDate": "2026-04-10T19:00:00",
      "section": "vip",
      "zone": "1",
      "rowInfo": "3",
      "seatNumber": "15",
      "sellingPrice": 145000,
      "feeAmount": 5000,
      "sellerExpectedAmount": 140000,
      "status": "COMPLETED",
      "createdAt": "2026-03-26T20:00:00"
    }
  ]
}
```

---

## **1-9. 나의 구매 내역 조회**

### **API**

```
GET /api/v1/transfers/me/purchases
```

### **설명**

현재 로그인한 사용자의 양도 티켓 구매 내역 전체를 조회합니다.

### **요청 헤더**

- `X-User-Id`: (Long) 현재 로그인한 사용자 ID

### **요청 예시**

```
GET /api/v1/transfers/me/purchases
```

### **응답 예시**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": [
    {
      "id": 1,
      "showName": "G-Dragon 2026 MAMA DOME TOUR",
      "showDate": "2026-04-10T19:00:00",
      "section": "vip",
      "zone": "1",
      "rowInfo": "3",
      "seatNumber": "15",
      "sellingPrice": 145000,
      "sellerUserId": 100,
      "status": "COMPLETED",
      "updatedAt": "2026-04-10T20:15:00"
    }
  ]
}
```
