# URR — 아키텍처 & API

## FSD 레이어 구조

```
app → widgets → features → entities → shared
```

| 레이어      | 역할                          | 예시                                       |
| ----------- | ----------------------------- | ------------------------------------------ |
| `app/`      | 라우트 진입점만. 로직 없음    | `app/events/[eventId]/page.tsx`            |
| `widgets/`  | 여러 feature 조합하는 UI 블록 | `BookingWidget`, `HomeWidget`              |
| `features/` | 단일 사용자 행동. 독립적      | `features/booking/`, `features/auth/`      |
| `entities/` | 도메인 타입 + UI 카드/배지    | `entities/event/`, `entities/user/`        |
| `shared/`   | 전역 공용. 도메인 개념 없음   | `shared/ui/`, `shared/lib/`, `shared/api/` |

**절대 규칙**: features끼리 import 금지. 하위 레이어가 상위 import 금지.

## feature 내부 구조

```
features/<domain>/<feature>/
├── ui/       # PascalCase.tsx
├── model/    # useXxx.ts
├── api/      # camelCase.ts
└── index.ts  # barrel export만
```

## 파일 네이밍

- 컴포넌트: `PascalCase.tsx`
- 훅/유틸/api: `camelCase.ts`
- shadcn: `lowercase.tsx`
- barrel: `index.ts`

## shadcn 경로

- shadcn 컴포넌트: `@/shared/ui/`
- cn() 유틸: `@/shared/lib/utils`
- 항상 `@/` 절대경로 사용

---

## API (Spring Boot)

**Base URL**: `NEXT_PUBLIC_API_BASE_URL` (기본 `https://urr.guru`)
**인증**: `Authorization: Bearer <accessToken>`
**401**: `/api/auth/reissue` 자동 갱신 후 재시도

```
# 인증
POST /api/auth/login
POST /api/auth/oauth/kakao
GET  /api/auth/me
POST /api/auth/logout
POST /api/auth/reissue

# 공연/아티스트
GET /api/events
GET /api/events/:id
GET /api/events/artists
GET /api/events/artists/:id

# 예매
GET  /api/ticketing/:eventId
POST /api/ticketing/book
GET  /api/ticketing/my-tickets
GET  /api/ticketing/queue/status

# 결제
POST /api/payments/create
POST /api/payments/confirm
GET  /api/payments/{orderId}
POST /api/payments/{paymentKey}/cancel

# 커뮤니티
GET  /api/community/posts
POST /api/community/posts
POST /api/community/posts/:id/comment
```

## 인프라 (AWS)

| 서비스        | 역할                       |
| ------------- | -------------------------- |
| Amplify / ECS | Frontend & Backend 배포    |
| RDS           | DB (Spring Boot 관리)      |
| S3            | 정적 파일 (이미지, 아이콘) |
| CloudFront    | CDN                        |
