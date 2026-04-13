# 백엔드 요청 목록

프론트엔드에서 백엔드 팀에 요청할 API 변경·추가·수정 사항을 기록합니다.

> 형식: 요청 내용 / 이유 / 우선순위 (🔴 긴급 / 🟡 보통 / 🟢 낮음)

---

## 대기 중

### 🔴 [community-service] POST /api/v1/transfers/posts 502 — event 서비스 내부 호출 실패

**발견 일자:** 2026-04-13

**발생 현상**

양도 게시글 등록 시 502 반환:

```json
{
  "isSuccess": false,
  "statusCode": 502,
  "message": "공연 정보 조회에 실패했습니다.",
  "data": null
}
```

**원인 분석**

프론트엔드는 스펙대로 요청 전송 중:

```json
{
  "artistId": 10,
  "eventId": 15,
  "showId": 20,
  "reservationId": "res-abc123"
}
```

community-service(8082)가 게시글 등록 처리 중 event-service를 내부 호출해 공연 정보를 검증하는데, 해당 서비스 간 통신이 실패하고 있음.

**요청 사항**

1. community-service → event-service 내부 HTTP 호출 로그 확인
2. event-service URL 설정 및 네트워크 연결 상태 확인
3. `eventId`/`showId` 기반 공연 조회 로직에서 null 반환 또는 예외 처리 방식 점검

---

### 🔴 [auth-service] POST /api/v1/auth/register — onboardingRequired 반환 로직 역전

**발견 일자:** 2026-04-13

**발생 현상**
회원가입 응답의 `onboardingRequired`가 의미와 반대로 내려옴.

**원인 분석**
`AuthController.java:222`:

```java
// register (버그) — onboardingCompleted=true인데 onboardingRequired=true 반환
result.user().onboardingCompleted() == true

// login 등 다른 엔드포인트 (정상)
result.user().onboardingCompleted() == false
```

**요청 사항**
`AuthController.java:222` 조건 반전:

```java
// 수정 전
result.user().onboardingCompleted() == true
// 수정 후
result.user().onboardingCompleted() == false
```

**관련 파일**

- `urr-authService/.../presentation/api/AuthController.java` (register 메서드, 222번째 줄)

---

## 완료
