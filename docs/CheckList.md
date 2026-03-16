# URR API 연동 진행 현황

## 현재 상태

- **Phase 1~6**: ✅ 완료 — UI 전체 구현 (92페이지 빌드 성공)
- **Phase 7**: 🔄 진행 중 — Spring Boot API 연동
- **Phase 8**: ⏳ 대기 — 성능 최적화, CI/CD

---

## Phase 7: API 연동

### 7-1. 공통 인프라

- [x] `src/shared/lib/tokenStore.ts` — 토큰 저장소 (accessToken, refreshToken)
- [x] `src/shared/api/client.ts` — Fetch 기반 API 클라이언트
  - BASE_URL: `process.env.NEXT_PUBLIC_API_BASE_URL` (기본 `https://urr.guru`)
  - `Authorization: Bearer <accessToken>` 자동 첨부
  - 401 → `POST /api/auth/token/reissue` → 원래 요청 재시도
  - 에러 응답 통일 형태로 throw

### 7-1.5. Auth 리팩토링 (TanStack Query + Zustand 도입)

> **목표**: 서버 상태는 TanStack Query, 클라이언트 UI 상태는 Zustand(최소). auth Zustand store는 불필요 — TQ 캐시로 충분.

#### 인프라 설정
- [x] `src/shared/lib/tokenStore.ts` — 토큰 저장소 (기존 유지)
- [x] `src/shared/api/client.ts` — 401 자동 갱신 fetch 클라이언트 (기존 유지)
- [x] **패키지 설치** — `@tanstack/react-query@^5`, `zustand`, `@tanstack/react-query-devtools`
- [x] `src/shared/lib/ReactQueryProvider.tsx` — `"use client"` QueryClient 인스턴스 + Provider + Devtools
- [x] `src/app/layout.tsx` — `ReactQueryProvider` 최외곽 감싸기

#### entities/user/model — 훅 신규 생성
- [x] `src/entities/user/api/auth.ts` — login, register, logout, getMe, deleteAccount, completeSocialOnboarding (기존 완료)
- [x] `src/entities/user/model/types.ts` — AuthResponse, LoginRequest 등 타입 (기존 완료)
- [x] `src/entities/user/model/useCurrentUser.ts` — `useQuery(['me'], getMe)`, `enabled: !!token`
- [x] `src/entities/user/model/useLogin.ts` — `useMutation`, onSuccess → `setQueryData(['me'], user)` 캐시 seed
- [x] `src/entities/user/model/useRegister.ts` — `useMutation`, onSuccess → `setQueryData(['me'], user)`
- [x] `src/entities/user/model/useLogout.ts` — `useMutation`, onSuccess → `queryClient.clear()`
- [x] `src/entities/user/model/useDeleteAccount.ts` — `useMutation`, onSuccess → `queryClient.clear()`
- [x] `src/entities/user/model/index.ts` — 훅 + 타입 barrel export

#### features/auth/onboarding — 훅 리팩토링
- [x] `src/features/auth/onboarding/model/useSocialOnboarding.ts` — `useMutation(completeSocialOnboarding)`, onSuccess → `setQueryData(['me'], user)`
- [x] `src/features/auth/onboarding/model/useOnboardingAuth.ts` — 직접 API 호출 → `useLogin`, `useRegister` mutation 사용으로 교체, `isPending` + `authError` 반환 추가

#### 소비자 컴포넌트 업데이트
- [x] `src/widgets/layout/AppSidebar.tsx` — `mockUser` import 제거, `useCurrentUser()` 로 교체 (user == null 시 로그인 링크 표시)
- [x] `src/entities/user/index.ts` — 새 훅 re-export 추가

---

### 7-2. 인증 (API 연동)

- [x] `entities/user/api/auth.ts` — login, me, logout, reissue
- [x] `entities/user/model/` — User 타입 (types.ts)
- [ ] `features/auth/onboarding/` — 실제 소셜 로그인 연동 (Kakao OAuth)
- [ ] 401 자동 갱신 인터셉터 검증

### 7-3. 공연 / 아티스트

- [ ] `entities/event/api/` — fetchEvents, fetchEventById
- [ ] `entities/artist/api/` — fetchArtists, fetchArtistById
- [ ] `widgets/home/` — mock 데이터 → TanStack Query 전환
- [ ] `widgets/events/` — mock 데이터 → TanStack Query 전환

### 7-4. 예매

- [ ] `entities/booking/api/` — fetchTicketingInfo, bookTicket
- [ ] `features/booking/` — 대기열 상태 실시간 연동 (`GET /api/ticketing/queue/status`)
- [ ] 결제: `POST /api/payments/create`, `POST /api/payments/confirm`

### 7-5. 마이페이지 / 멤버십 / 양도

- [ ] `GET /api/ticketing/my-tickets` — 내 티켓 목록
- [ ] 멤버십 API 연동
- [ ] 양도 API 연동

---

## Phase 8: 최적화 및 배포

- [ ] `next/image` 컴포넌트 전환 (현재 `<img>` 태그 사용 중)
- [ ] Bundle 분석 및 코드 스플리팅
- [ ] GitHub Actions CI/CD (S3 + CloudFront)

---

## Mock 데이터 위치

현재 mock 데이터는 API 연동 완료 전까지 유지:

| 파일 | 내용 |
|------|------|
| `src/shared/lib/mocks/artists.ts` | 5개 아티스트 + `getArtistById` |
| `src/shared/lib/mocks/user.ts` | mockUser (4개 활성 멤버십) |
| `src/shared/lib/mocks/home.ts` | 홈 전체 섹션 데이터 |
| `src/shared/lib/mocks/events-page.ts` | popularEvents + allEventsData |
| `src/shared/lib/mocks/event-detail.ts` | gdragonDetail + createFallbackDetail |
| `src/shared/lib/mocks/seats.ts` | generateSeatsForSection |
