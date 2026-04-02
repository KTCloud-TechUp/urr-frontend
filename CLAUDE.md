# URR (우르르) — AI 작업 가이드

## ⚠️ 절대 금지 사항

- **백엔드 코드 수정 금지**: 이 레포지토리는 프론트엔드 전용입니다. 백엔드(Spring Boot) 코드는 절대 수정하지 않습니다.
- API 스펙 변경이 필요한 경우 `docs/backend-requests.md`에 요청 사항을 추가하고, 프론트엔드에서 기존 스펙에 맞게 구현합니다.

### API 불일치 대응 원칙

| 상황 | 대응 |
| ---- | ---- |
| API 응답 구조가 디자인과 소폭 차이 | 프론트엔드에서 데이터 가공·매핑해 현재 API에 맞게 구현 |
| API 스펙 부재로 기능 일부 누락 가능 | mock 데이터로 UI 완성 후 연동 대기 |
| API 변경 없이는 **디자인 틀 자체가 바뀌어야** 하는 경우 | `docs/backend-requests.md`에 요청 추가 → 백엔드 수정 요청 |

- "디자인 틀이 바뀐다" 기준: 화면 흐름(step/flow), 핵심 데이터 구조(필드 추가/삭제), 기능 단위(엔드포인트 신규 필요)가 달라지는 경우
- 단순 필드명 차이·nullable 처리·정렬 순서 등은 프론트에서 해결

---

## 프로젝트 한 줄 요약

K-POP 찐팬을 위한 공정 티켓팅 플랫폼. 티켓팅 → 양도 → 커뮤니티를 하나의 생태계로 연결.
매크로·봇 차단, 멤버십 등급으로 팬 활동을 정량화해 티켓 우선권 부여.

---

## 기술 스택

| 분야         | 기술                       | 비고                      |
| ------------ | -------------------------- | ------------------------- |
| Framework    | Next.js 16 (App Router)    | 서버/클라이언트 통합      |
| Language     | TypeScript (strict)        |                           |
| Styling      | Tailwind CSS v4            | utility-first             |
| UI           | shadcn/ui (Radix UI 기반)  | `src/shared/ui/`에 보관   |
| Server State | TanStack Query v5          | API 데이터 캐싱/동기화    |
| Client State | Zustand                    | 최소한만 사용             |
| Backend      | Spring Boot REST API       | JWT 인증                  |
| Base URL     | `NEXT_PUBLIC_API_BASE_URL` | 기본값 `https://urr.guru` |

```bash
npm run dev    # 개발 서버
npm run build  # 빌드 검증
```

### 상태 관리 기준

| 상황                            | 사용                       |
| ------------------------------- | -------------------------- |
| API 데이터 조회 (GET)           | `useQuery`                 |
| API 데이터 변경 (POST/PUT/DELETE) | `useMutation`            |
| 모달/탭 등 UI 상태              | `useState`                 |
| 여러 페이지 공유 클라이언트 상태 | `Zustand`                 |
| 앱 초기화 (세션 복원, OAuth 콜백) | `useEffect` 직접 사용 허용 |

- **새 페이지 API 연동 시 반드시 TanStack Query 사용** (`useState + useEffect` 패턴 금지)
- Zustand는 예매 상태머신(Phase 9)에 사용 예정 — auth에는 사용하지 않는다
- `apiRequest()`를 직접 호출하지 말고 `features/<domain>/api/` 함수를 통해 호출

### API 클라이언트

| 파일                            | 역할                                                    |
| ------------------------------- | ------------------------------------------------------- |
| `src/shared/api/client.ts`      | `apiRequest()` — fetch wrapper, Bearer 토큰 자동 주입   |
| `src/shared/api/interceptor.ts` | `fetchWithAuth()` — 401 시 reissue → 재시도 (큐잉 처리) |
| `src/shared/api/tokenStore.ts`  | `accessToken` module-level 변수 관리 + 인증 쿠키 설정   |

### 인증 / JWT 흐름

- `accessToken`: module-level 변수 (메모리) + sessionStorage 백업
  - S3 정적 배포 → CloudFront full page reload 시 JS 메모리 초기화 → sessionStorage 백업 필수 (불가피한 트레이드오프)
  - EKS 전환(SSR) 시 sessionStorage 제거 가능
- `refreshToken`: httpOnly 쿠키 (`credentials: "include"` 자동 전송)
- `is_authenticated`: 클라이언트 쿠키 (24h) — 로그인 상태 힌트
- 401 → `fetchWithAuth`가 `POST /api/auth/token/reissue` 호출 → 성공 시 재시도 / 실패 시 `onAuthFailed()` → 로그아웃

---

## 파일 구조 — FSD (Feature-Sliced Design)

```
src/
├── app/       # Next.js App Router (라우팅 진입점만, 로직 없음)
├── widgets/   # 페이지를 구성하는 큰 UI 블록 (여러 feature 조합)
├── features/  # 단일 사용자 행동 단위 (독립적, 타 feature 의존 금지)
├── entities/  # 도메인 타입 + 관련 UI 카드/배지 (비즈니스 로직 없음)
└── shared/    # 전역 공용 코드 (api/, lib/, ui/)
```

**레이어 규칙**: `app → widgets → features → entities → shared` (상위→하위만 import)

**feature 내부**: `ui/` (PascalCase.tsx) / `model/` (useXxx.ts) / `api/` (camelCase.ts) / `index.ts`

**파일 네이밍**: 컴포넌트 `PascalCase.tsx` / 훅·유틸·api `camelCase.ts` / shadcn `lowercase.tsx` / barrel `index.ts`

---

## 주요 라우트 & 페이지

| URL                              | 페이지             | 비고                              |
| -------------------------------- | ------------------ | --------------------------------- |
| `/`                              | HomePage           | 배너·인기아티스트·공연랭킹·선예매 |
| `/artists` / `/artists/:id`      | ArtistPage         | 홈/소통/공연/양도 탭 (멤버십 게이트) |
| `/events` / `/events/:id`        | EventDetailPage    | 공연 목록 / 상세                  |
| `/events/:id/booking`            | BookingPage        | 예매 2-Panel, 풀스크린 레이아웃   |
| `/membership`                    | MembershipPage     | 4단계 가입 플로우                 |
| `/my-page`                       | MyPage             | 멤버십/티켓 월렛/양도 내역        |
| `/onboarding`                    | OnboardingPage     | 회원가입·로그인 (사이드바 없음)   |
| `/search`                        | SearchPage         | 아티스트+공연 통합 검색           |
| `/transfer/:artistId/:listingId` | TransferDetailPage | 양도 상세                         |

**LayoutShell 예외**: `/onboarding`, `/auth/callback` → 사이드바/TopBar 없음 / `/events/:id/booking` → 풀스크린 (Footer/스크롤 없음)

---

## 핵심 비즈니스 로직

### 멤버십 등급

| 등급        | Lv. | 조건              | 예매 창       | 예매 수수료 할인 | 양도 수수료 |
| ----------- | --- | ----------------- | ------------- | ---------------- | ----------- |
| 🌩️ 라이트닝 | 4   | 팬 신뢰 점수 ≥ 85 | 선예매 1순위  | -₩3,000          | 5%          |
| ⚡ 썬더     | 3   | 66–84점           | 2순위 (+1h)   | -₩2,000          | 5%          |
| ☁️ 클라우드 | 2   | 멤버십 가입 즉시  | 3순위 (+1day) | -₩1,000          | 10%         |
| 🌫️ 미스트   | 1   | 회원가입 즉시     | 일반예매만    | 없음             | 양도불가    |

- 양도 게시판: 클라우드 이상만 접근 / 구매: 해당 아티스트 멤버십 보유자만
- 멤버십 게이트: 아티스트 홈 탭은 누구나, 공연/양도 탭은 멤버십 전용
- 팬 신뢰 점수(FTS): MVP는 멜론 연동만. 미연동 시 미스트 유지.

### 예매 상태머신

```
idle → queue → seats-section → seats-individual → payment → confirmation
                                     ↓ (3분 타임아웃)    ↘ payment-failed (60s 재시도)
                               seats-expired → seats-section 복귀
```

### 양도 마켓

- 가격 범위: 정가의 0.5x ~ 1.5x / 에스크로 방식 / 클라우드 이상만 접근
- 소유권 이전 시 기존 QR 즉시 무효화 + 신규 QR 발급 (원자적 처리)

---

## 디자인 시스템

> 상세 스펙 → `docs/designsystem.md`

**원칙**: Border over Shadow / Selective Color / Light only / Desktop only  
**주요 색상**: `bg-primary` #FF5E32 / `bg-secondary` #1F2792 / `bg-accent` #F2F0E6  
**티어 클래스**: `text-tier-{lightning|thunder|cloud|mist}` / `bg-tier-{...}-bg`  
**폰트**: Pretendard Variable (`font-sans`) / JetBrains Mono (`font-mono`, 타이머 전용)  
**로고**: `public/logos/logo5.svg`

---

## API 연동 현황

> 상세 체크리스트 → `docs/CheckList.md`

| Phase | 영역                            | 상태       |
| ----- | ------------------------------- | ---------- |
| 1–5   | API 클라이언트, 인증 인프라     | ✅ 완료    |
| 7–8   | 예매 UI (VenueMap 인터랙션)     | ✅ 완료    |
| 6     | 온보딩 플로우 완성              | 🔲 진행 중 |
| 9     | 예매 Zustand store              | 🔲 다음    |
| 10–14 | Events/Ticketing/Payments 등    | 🔲 대기    |

**현재 mock 데이터**: 홈페이지 섹션, 공연/아티스트 목록, 예매 좌석, 마이페이지

---

## 브랜치 전략

```
main          # 프로덕션. 직접 push 금지.
dev           # 일상 작업. 직접 커밋 허용.
feat/<scope>  # 복잡하거나 격리 필요한 작업만.
design/<scope> # UI/스타일만. 머지는 오너가 직접.
infra/<scope>  # 설정/배포만. 머지는 오너가 직접.
```

- `design/` 브랜치: `src/*/api/`, `src/*/model/`, `src/app/`, `src/shared/api/lib/`, `package.json`, `.env*` 수정 금지
- `infra/` 브랜치: `src/` 하위 모든 파일 수정 금지

### 작업 완료 체크리스트

1. pre-commit 훅 통과 (ESLint + `tsc --noEmit` 자동 실행)
2. `npm run build` 빌드 오류 없음 확인
3. GitHub Actions CI 빌드 상태 확인
4. 위 항목 모두 통과 후에만 PR 생성

---

## ⚠️ 디자인 변경 금지 원칙

> 신규 페이지 추가 시 `URR-v2` 디자인 참조할 때만 해당.

- 원본(`URR-v2`) 참조 시 디자인 1:1 유지
- Tailwind 클래스 임의 교체 금지 (예: `hover:bg-[#F3F2F0]` → `hover:bg-accent` 변환 금지)
- 섹션 제목, 폰트 크기, 간격, 색상, 레이아웃 Claude 판단으로 변경 금지
- **예외 허용**: React Router → Next.js Link/useRouter, `import 이미지` → `/파일명` 문자열

---

## 참고 문서

- `docs/CheckList.md` — API 연동 진행 현황 및 세부 체크리스트
- `docs/designsystem.md` — 색상 토큰, 컴포넌트 스펙, 애니메이션
- `docs/user_flow.md` — 유저 플로우, 비즈니스 로직, 엣지 케이스
- `docs/api.md` — JWT 전략, API 응답 타입, 카카오 OAuth 흐름
- `docs/PRD.md` — 비즈니스 규칙 원본
- `docs/ARCHITECTURE.md` — FSD 레이어 규칙, 엔드포인트, 인프라
- `docs/migration.md` — 신규 페이지 추가 가이드 (디자인팀이 새 페이지 완성했을 때만 참조)
