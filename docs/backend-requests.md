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

### 2. payment-service 시작 실패 — `ObjectMapper` 빈 주입 오류

- **우선순위**: 🔴 긴급
- **대상**: `urr-paymentService`

**에러 로그**:
```
Error creating bean with name 'paymentSqsPublisher': 
Unsatisfied dependency expressed through constructor parameter 1: 
No qualifying bean of type 'com.fasterxml.jackson.databind.ObjectMapper' available
```

**원인**: `PaymentSqsPublisher`가 `ObjectMapper`를 생성자 주입으로 받는데, Spring Boot 4.0.2 환경에서 `JacksonAutoConfiguration`이 `ObjectMapper` 빈을 자동 등록하지 못하는 문제. `springdoc-openapi-starter-webmvc-ui:3.0.2`와의 호환성 충돌 또는 Spring Boot 4.0 breaking change로 추정.

**요청 (택1)**:

1. **즉시 해결**: `SqsConfig.java`에 `ObjectMapper` 빈 명시적 등록
```java
@Bean
public ObjectMapper objectMapper() {
    return new ObjectMapper();
}
```

2. **근본 해결**: 로컬 환경에서 `SQS_PAYMENT_EVENTS_URL`이 없으면 `PaymentSqsPublisher`를 아예 비활성화
```java
@Component
@ConditionalOnProperty(name = "sqs.payment-events-url", matchIfMissing = false)
public class PaymentSqsPublisher { ... }
```

---

## 완료
