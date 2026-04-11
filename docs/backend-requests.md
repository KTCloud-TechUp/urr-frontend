# 백엔드 요청 목록

프론트엔드에서 백엔드 팀에 요청할 API 변경·추가·수정 사항을 기록합니다.

> 형식: 요청 내용 / 이유 / 우선순위 (🔴 긴급 / 🟡 보통 / 🟢 낮음)

---

## 대기 중

### 1. `/auth/me` — `memberships` 필드 빈 배열로 반환되는 버그

- **우선순위**: 🔴 긴급
- **대상**: `GET /api/v1/auth/me`

멤버십이 존재하는 유저임에도 `memberships: []`로 반환됨. `fetchMemberships()`는 구현되어 있으나 event 서비스의 `/api/v1/membership` 엔드포인트가 실제 데이터를 반환하는지 런타임 확인 필요.

- **요청**: Docker 환경에서 `/api/v1/membership` 응답 확인 및 정상 반환 여부 검증.
- **기대 응답 형식**: (기존 스펙 그대로)

```json
"memberships": [
  {
    "artistId": 2,
    "artistName": "빅뱅",
    "tier": "CLOUD",
    "endDate": "2027-04-07"
  }
]
```

---

### 2. payment-service 시작 실패 — `ObjectMapper` 빈 주입 오류 + `@ConditionalOnProperty` 빈 문자열 버그

- **우선순위**: 🔴 긴급
- **대상**: `urr-paymentService` — `PaymentSqsPublisher.java`, `application.yaml`

**에러 로그**:
```
Error creating bean with name 'paymentSqsPublisher': 
Unsatisfied dependency expressed through constructor parameter 1: 
No qualifying bean of type 'com.fasterxml.jackson.databind.ObjectMapper' available
```

**원인 (두 가지 버그가 겹침)**:

**Bug 1 — `application.yaml` 빈 문자열 기본값**

```yaml
sqs:
  payment-events-url: ${SQS_PAYMENT_EVENTS_URL:}  # 기본값이 "" (빈 문자열)
```

`SQS_PAYMENT_EVENTS_URL` 환경변수가 없으면 `sqs.payment-events-url = ""`이 됨.
Spring Boot의 `@ConditionalOnProperty`는 빈 문자열을 **"property가 존재함"으로 판단**해 조건이 통과됨.
→ SQS 미설정 상태임에도 `PaymentSqsPublisher`, `SqsClient` 빈 생성 시도.

**Bug 2 — `ObjectMapper` 주입 문제**

`PaymentSqsPublisher.java:22`에서 `@RequiredArgsConstructor`로 `ObjectMapper`를 Spring 빈으로 주입받으려 하는데, 스프링 컨텍스트에서 `ObjectMapper` 빈을 찾지 못해 실패.
커밋 `865338e`에서 직접 생성 방식으로 수정했으나, 이후 `4bb0162` 커밋에서 다시 주입 방식으로 되돌아간 것으로 보임.

**요청 (두 가지 모두 수정 필요)**:

**수정 1** — `PaymentSqsPublisher.java`: `ObjectMapper` Spring 빈 주입 제거, 직접 생성으로 변경
```java
// Before
private final ObjectMapper objectMapper;

// After
private static final ObjectMapper objectMapper = new ObjectMapper();
```

**수정 2** — `application.yaml`: 빈 문자열 기본값 제거 (또는 ConditionalOnExpression으로 조건 강화)

```yaml
# Before
sqs:
  payment-events-url: ${SQS_PAYMENT_EVENTS_URL:}

# After: sqs 섹션을 application.yaml에서 제거하고 SQS_PAYMENT_EVENTS_URL 환경변수로만 주입
```

또는 코드에서 빈 문자열 체크:
```java
// @ConditionalOnProperty 대신
@ConditionalOnExpression("!'${sqs.payment-events-url:}'.trim().isEmpty()")
```

---

## 완료
