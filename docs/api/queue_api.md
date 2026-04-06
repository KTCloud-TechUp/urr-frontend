# 프론트 연동 현황

| 메서드 | 엔드포인트 | 연동 상태 |
| ------ | ---------- | --------- |
| POST | `/api/v1/queue/check/{showId}` | ✅ 완료 |
| GET | `/api/v1/queue/{showId}` | ✅ 완료 (3초 폴링) |

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
