# URR — 아키텍처 & API

### Frontend 스택

| 분야             | 기술            | 역할                      |
| ---------------- | --------------- | ------------------------- |
| **Framework**    | Next.js         | 서버/클라이언트 통합      |
| **Language**     | TypeScript      | 타입 안정성               |
| **Styling**      | Tailwind CSS v4 | 빠른 UI 개발              |
| **UI Library**   | Shadcn/ui       | 재사용 가능한 UI 컴포넌트 |
| **Server State** | TanStack Query  | API 데이터 캐싱/동기화    |
| **Client State** | Zustand         | UI 상태 및 전역 상태 관리 |

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
**401**: `/api/auth/token/reissue` 자동 갱신 후 재시도

```
# 인증 — 소셜
POST /api/auth/oauth/kakao          # 카카오 OAuth 로그인 (인가코드 → 토큰 발급)
POST /api/auth/onboarding/social    # 소셜 로그인 온보딩 완료 처리

# 인증 — ID 기반
POST /api/auth/register             # 회원가입 + 토큰 발급
POST /api/auth/login                # 로그인 + 토큰 발급

# 토큰 / 세션
POST /api/auth/token/reissue        # Access/Refresh 토큰 재발급
POST /api/auth/logout               # 로그아웃 (Refresh 토큰 무효화)

# 사용자
GET    /api/auth/me                 # 현재 로그인 유저 정보 조회
DELETE /api/auth/me                 # 회원 탈퇴

# 비고: GET /auth/kakao/callback (KakaoAuthFlowController)은 현재 비활성 (주석 처리)

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

| 서비스     | 역할                                  |
| ---------- | ------------------------------------- |
| S3         | Next.js 정적 빌드 결과물 배포         |
| CloudFront | 프론트엔드 CDN (S3 오리진)            |
| ECR        | Docker 이미지 레지스트리              |
| EKS        | 프론트·백엔드 컨테이너 오케스트레이션 |
| ArgoCD     | GitOps 기반 EKS 배포 자동화           |
| RDS        | DB (Spring Boot 관리)                 |

## CI/CD 파이프라인

```
Git push (feat/* → dev → main)
  │
  └─ GitHub Actions
        ├─ [Frontend] Next.js 빌드 → S3 업로드 → CloudFront 캐시 무효화
        └─ [Backend]  Docker 빌드 → ECR push → ArgoCD → EKS 배포
```

- **프론트엔드**: GitHub Actions에서 `npm run build` → S3 sync → CloudFront invalidation
- **백엔드**: GitHub Actions에서 Docker 이미지 빌드 → ECR push → ArgoCD가 변경 감지 → EKS rollout
- **ArgoCD**: EKS 클러스터 내 설치, GitOps 방식으로 매니페스트 레포 변경 감지 후 자동 sync
