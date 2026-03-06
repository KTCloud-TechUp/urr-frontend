# 🛠️ URR 프로젝트 기술스택

**Frontend는 Next.js + TypeScript + FSD 구조로 구축하고, Spring Boot REST API와 AWS를 통해 연결.**

---

## 🎯 필수 이해사항

### Frontend 스택

| 분야             | 기술           | 버전/설정        | 역할                      |
| ---------------- | -------------- | ---------------- | ------------------------- |
| **Framework**    | Next.js        | 14+ (App Router) | 서버/클라이언트 통합      |
| **Language**     | TypeScript     | Strict Mode      | 타입 안정성               |
| **Styling**      | Tailwind CSS   | Utility-first    | 빠른 UI 개발              |
| **UI Library**   | Shadcn/ui      | Radix + Tailwind | 재사용 가능한 UI 컴포넌트 |
| **Server State** | TanStack Query | v5               | API 데이터 캐싱/동기화    |
| **Client State** | Zustand        | 최소한만 사용    | UI 상태 및 전역 상태 관리 |

### Backend & 인프라

| 분야               | 기술        | 설명             |
| ------------------ | ----------- | ---------------- |
| **Backend**        | Spring Boot | RESTful API 제공 |
| **API 방식**       | REST API    | Frontend와 통신  |
| **Hosting**        | AWS         | 프로덕션 배포    |
| **Authentication** | JWT         | 사용자 인증/인가 |

---

## 🏗️ 파일 구조

프로젝트는 **Feature-Sliced Design(FSD)** 구조를 따르며

Next.js App Router 특성상 다음 레이어로 구성됨

app → widgets → features → entities → shared

### FSD Layer 구조

| 폴더          | 역할                                   | 예시                                                               |
| ------------- | -------------------------------------- | ------------------------------------------------------------------ |
| **app/**      | Next.js 라우팅 및 페이지 엔트리        | `/events`, `/events/[eventId]`, `/ticketing/[eventId]`, `/login`   |
| **widgets/**  | 페이지를 구성하는 큰 UI 블록           | `EventListSection`, `EventDetailSection`, `BookingPanel`, `Header` |
| **features/** | 하나의 사용자 행동 기능                | 로그인, 티켓 예매, 결제, 양도                                      |
| **entities/** | 도메인 모델 및 데이터 구조             | `User`, `Artist`, `Event`, `Ticket`, `Membership`                  |
| **shared/**   | 모든 레이어에서 공통으로 사용하는 코드 | 공통 UI 컴포넌트, API 클라이언트, 유틸 함수                        |

**핵심 원칙**: 각 Feature는 독립적이어야 함 (다른 Feature에 의존하면 안 됨)

---

## 🔧 Backend

### Backend 도메인 구조 (Spring Boot)

| 도메인        | 주요 역할                        |
| ------------- | -------------------------------- |
| **Users**     | 사용자 정보, 프로필, 회원 관리   |
| **Event**     | 공연/이벤트 정보, 아티스트       |
| **Ticketing** | 티켓 예매, 좌석 관리, VQA/대기열 |
| **Payments**  | 결제 처리 (카카오페이 등)        |
| **Community** | 팬 커뮤니티, 게시물, 댓글        |
| **Queue**     | 대기열 시스템, 트래픽 제어       |

### REST API 엔드포인트 (주요)

#### 👤 Users (인증/회원)

```
POST   /api/auth/login                 → 로그인
POST   /api/auth/oauth/kakao           → 카카오 OAuth 로그인
GET    /api/auth/me                    → 현재 사용자 정보
POST   /api/auth/logout                → 로그아웃
POST   /api/auth/reissue               → 토큰 재발급 (갱신)
DELETE /api/auth/me/withdraw           → 회원 탈퇴
```

#### 🎪 Event (공연/아티스트)

```
GET    /api/events                     → 전체 공연 목록
GET    /api/events/:id                 → 공연 상세 정보
GET    /api/events/artists             → 아티스트 목록
GET    /api/events/artists/:id         → 아티스트 상세 정보
```

#### 🎫 Ticketing (예매)

```
GET    /api/ticketing/:eventId         → 공연별 티켓 정보
POST   /api/ticketing/book             → 티켓 예매
GET    /api/ticketing/my-tickets       → 내 티켓 조회
GET    /api/ticketing/queue/status     → 대기열 상태 확인
```

#### 💳 Payments (결제)

```
POST   /api/payments/create             → 결제 생성
POST   /api/payments/confirm            → 결제 확인/승인
GET    /api/payments/{orderId}          → 결제 상세 조회
POST   /api/payments/{paymentKey}/cancel → 결제 취소
```

#### 💬 Community (커뮤니티)

```
GET    /api/community/posts            → 게시물 목록
POST   /api/community/posts            → 게시물 작성
POST   /api/community/posts/:id/comment → 댓글 작성
```

### Frontend ↔ Backend 통신

- **Protocol**: HTTP/REST
- **Base URL**: `https://urr.guru` (또는 환경변수)
- **Format**: JSON
- **Authentication**: JWT 토큰
  - Header: `Authorization: Bearer <accessToken>`
  - Refresh: `POST /api/auth/reissue`로 토큰 갱신

### API 에러 핸들링

```typescript
// 예시: shared/api/client.ts에서 JWT 만료 시 자동 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      const { data } = await apiClient.post("/api/auth/reissue");

      apiClient.defaults.headers.Authorization = `Bearer ${data.accessToken}`;

      return apiClient(error.config);
    }
  },
);
```

---

## ☁️ Infrastructure (AWS)

| 서비스            | 역할                                |
| ----------------- | ----------------------------------- |
| **Amplify / ECS** | Frontend & Backend 배포             |
| **RDS**           | 데이터베이스 (Spring Boot에서 관리) |
| **S3**            | 정적 파일 저장 (이미지, 아이콘)     |
| **CloudFront**    | CDN (빠른 배포)                     |
