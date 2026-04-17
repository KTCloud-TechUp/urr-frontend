---

# Queue Service 연동 현황

> 백엔드 코드 경로: C:\Users\kkaeng\Desktop\Dev\URR\urr-backend\urr-queueService
>
> 마지막 확인: 2026-04-17 / 마지막 수정: 2026-04-17

| # | API | 메서드 | 엔드포인트 | 연동 파일 | 상태 | 비고 |
|---|-----|--------|-----------|----------|------|------|
| 1 | 대기열 진입 및 확인 | POST | `/api/v1/queue/check/{showId}` | `features/booking/api/queue.ts` (checkQueue) | ✅ 연동됨 | |
| 2 | 대기열 상태 폴링 | GET | `/api/v1/queue/{showId}` | `features/booking/api/queue.ts` (pollQueue) | ✅ 연동됨 | |
| 3 | 대기열 퇴장 | DELETE | `/api/v1/queue/{showId}` | — | ➖ 불필요 | 결제 완료 시 Lambda가 자동 처리 — 프론트 연동 불필요 |
| 4 | Health Check | GET | `/health` | — | ➖ 불필요 | |

---

## **1. 대기열 진입 및 확인**

### **API**

```
POST /api/v1/queue/check/{showId}
```

### **설명**

사용자가 공연 대기열에 진입하거나, 이미 진입한 경우 현재 대기 상태를 반환합니다. 최초 호출 시 대기열에 등록되며, 이후 폴링 API를 통해 상태를 주기적으로 확인합니다.

### **Path Variable**

| 이름     | 타입 | 설명    |
| -------- | ---- | ------- |
| `showId` | Long | 공연 ID |

### **요청 헤더**

| 이름             | 타입 | 필수 | 설명                                  |
| ---------------- | ---- | ---- | ------------------------------------- |
| `X-User-Id`      | Long | Y    | 현재 로그인한 사용자 ID               |
| `X-Vwr-Position` | Long | N    | 뷰어 위치 힌트 (우선순위 배정에 활용) |

### **응답 예시 - 대기열 진입 (WAIT)**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "userId": 1,
    "showId": 101,
    "status": "WAIT",
    "rank": 250,
    "total": 1500,
    "waitTime": 30
  }
}
```

### **응답 예시 - 즉시 입장 (ACTIVE)**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "userId": 1,
    "showId": 101,
    "status": "ACTIVE",
    "rank": null,
    "total": null,
    "waitTime": null
  }
}
```

### **응답 필드 설명**

| 필드       | 타입   | 설명                                       |
| ---------- | ------ | ------------------------------------------ |
| `userId`   | Long   | 사용자 ID                                  |
| `showId`   | Long   | 공연 ID                                    |
| `status`   | String | 상태 (`ACTIVE` / `WAIT`)                   |
| `rank`     | Long   | 대기 순위 (WAIT일 때만 반환)               |
| `total`    | Long   | 전체 대기 인원 수 (WAIT일 때만 반환)       |
| `waitTime` | Long   | 예상 대기 시간 (초 단위, WAIT일 때만 반환) |

---

## **2. 대기열 상태 폴링**

### **API**

```
GET /api/v1/queue/{showId}
```

### **설명**

대기열에 진입한 사용자가 주기적으로 호출하여 현재 대기 순위 및 입장 여부를 확인합니다. 입장이 확인되면 JWT 토큰이 발급됩니다.

### **Path Variable**

| 이름     | 타입 | 설명    |
| -------- | ---- | ------- |
| `showId` | Long | 공연 ID |

### **요청 헤더**

| 이름        | 타입 | 필수 | 설명                    |
| ----------- | ---- | ---- | ----------------------- |
| `X-User-Id` | Long | Y    | 현재 로그인한 사용자 ID |

### **응답 예시 - 대기 중 (WAIT)**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "userId": 1,
    "showId": 101,
    "status": "WAIT",
    "rank": 120,
    "total": 1200,
    "waitTime": 20,
    "token": null,
    "remainMs": null
  }
}
```

### **응답 예시 - 입장 가능 (ACTIVE)**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "userId": 1,
    "showId": 101,
    "status": "ACTIVE",
    "rank": null,
    "total": null,
    "waitTime": null,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "remainMs": 1800000
  }
}
```

### **응답 예시 - 대기열 미등록 (NOT_WAIT)**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "userId": null,
    "showId": null,
    "status": "NOT_WAIT",
    "rank": null,
    "total": null,
    "waitTime": null,
    "token": null,
    "remainMs": null
  }
}
```

### **응답 필드 설명**

| 필드       | 타입   | 설명                                              |
| ---------- | ------ | ------------------------------------------------- |
| `userId`   | Long   | 사용자 ID                                         |
| `showId`   | Long   | 공연 ID                                           |
| `status`   | String | 상태 (`ACTIVE` / `WAIT` / `NOT_WAIT`)             |
| `rank`     | Long   | 대기 순위 (WAIT일 때만 반환)                      |
| `total`    | Long   | 전체 대기 인원 수 (WAIT일 때만 반환)              |
| `waitTime` | Long   | 예상 대기 시간 (초 단위, WAIT일 때만 반환)        |
| `token`    | String | JWT 입장 토큰 (ACTIVE일 때만 반환)                |
| `remainMs` | Long   | 토큰 잔여 유효 시간 (ms 단위, ACTIVE일 때만 반환) |

---

## **3. 대기열 퇴장**

### **API**

```
DELETE /api/v1/queue/{showId}
```

### **설명**

결제 완료 후 유저를 active 대기열에서 제거합니다. **결제 시 Lambda가 자동으로 처리하므로 프론트엔드에서 별도 호출 불필요.**

### **Path Variable**

| 이름     | 타입 | 설명    |
| -------- | ---- | ------- |
| `showId` | Long | 공연 ID |

### **요청 헤더**

| 이름        | 타입 | 필수 | 설명                    |
| ----------- | ---- | ---- | ----------------------- |
| `X-User-Id` | Long | Y    | 현재 로그인한 사용자 ID |

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

## **4. 헬스 체크**

### **API**

```
GET /health
```

### **설명**

서비스 상태를 확인하는 헬스 체크 엔드포인트입니다. 로드밸런서 또는 모니터링 시스템에서 서비스 가용성을 확인할 때 사용합니다.

### **요청 헤더**

없음

### **응답 예시**

```json
{
  "service": "queue-service",
  "status": "ok"
}
```

### **응답 필드 설명**

| 필드      | 타입   | 설명               |
| --------- | ------ | ------------------ |
| `service` | String | 서비스 이름        |
| `status`  | String | 서비스 상태 (`ok`) |

> **참고**: 이 엔드포인트는 공통 응답 형식(`ApiResponse`)을 사용하지 않고, 위 JSON 형식을 직접 반환합니다.

---

## **공통 응답 형식**

### **성공**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": { ... }
}
```

### **오류 응답**

```json
{
  "isSuccess": false,
  "statusCode": 400,
  "message": "오류 메시지",
  "data": null
}
```

---

## **상태값(QueueStatus) 정의**

| 값         | 설명                                              |
| ---------- | ------------------------------------------------- |
| `ACTIVE`   | 활성 대기열 진입 완료. JWT 토큰 발급됨            |
| `WAIT`     | 대기열에서 순서를 기다리는 중                     |
| `NOT_WAIT` | 대기열에 등록되지 않은 상태. `/check` 재호출 필요 |
