# URR (우르르) — AI 작업 가이드

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

| 상황 | 사용 |
|---|---|
| API 데이터 조회 (GET) | `useQuery` |
| API 데이터 변경 (POST/PUT/DELETE) | `useMutation` |
| 모달 열림/닫힘, 탭 선택 등 UI 상태 | `useState` |
| 여러 페이지에 걸쳐 공유되는 클라이언트 상태 | `Zustand` |
| 앱 초기화 로직 (세션 복원, OAuth 콜백 등) | `useEffect` 직접 사용 허용 |

- **새 페이지 API 연동 시 반드시 TanStack Query 사용** (`useState + useEffect` 패턴 금지)
- Zustand는 전역 공유 상태가 실제로 필요할 때만 도입 (현재 미사용)
- `apiRequest()`를 직접 호출하지 말고 `features/<domain>/api/` 함수를 통해 호출

---

## 파일 구조 — FSD (Feature-Sliced Design)

```
src/
├── app/          # Next.js App Router (라우팅 진입점만)
├── widgets/      # 페이지를 구성하는 큰 UI 블록 (여러 feature 조합)
├── features/     # 단일 사용자 행동 단위 (독립적)
├── entities/     # 도메인 모델 (User, Artist, Event, Ticket …)
└── shared/
    ├── api/      # API 클라이언트, fetch 유틸
    ├── lib/      # utils.ts, format.ts, constants.ts
    └── ui/       # shadcn 컴포넌트 (button.tsx, input.tsx …)
```

### 레이어 규칙 (상위 → 하위만 import 가능)

```
app → widgets → features → entities → shared
```

- **app**: 라우트 파일만. 로직 없음, Widget을 `<Page />`에서 렌더링만.
- **widgets**: 여러 feature/entity를 조합하는 구성 레이어. `"use client"` 가능.
- **features**: 하나의 사용자 행동 (로그인, 예매, 결제 등). 타 feature 의존 금지.
- **entities**: 도메인 타입 + 관련 UI 카드/배지. 비즈니스 로직 없음.
- **shared**: 프로젝트 전역 공용 코드. 도메인 개념 없음.

### feature 내부 구조

```
features/<domain>/<feature-name>/
├── ui/         # React 컴포넌트 (PascalCase.tsx)
├── model/      # 상태, hook (useXxx.ts)
├── api/        # fetch 함수 (camelCase.ts)
└── index.ts    # 외부 공개 barrel export
```

### 파일 네이밍

- 컴포넌트: `PascalCase.tsx`
- 훅/유틸/api: `camelCase.ts`
- shadcn UI 파일: `lowercase.tsx` (`button.tsx`, `input.tsx`)
- 모든 레이어 폴더의 barrel: `index.ts`

---

## 주요 라우트 & 페이지

| URL                              | 페이지             | 핵심 widget                            |
| -------------------------------- | ------------------ | -------------------------------------- |
| `/`                              | HomePage           | 배너·인기아티스트·공연랭킹·선예매 섹션 |
| `/artists`                       | ArtistsPage        | 아티스트 목록 그리드                   |
| `/artists/:artistId`             | ArtistPage         | 홈/소통/공연/양도 탭 (멤버십 게이트)   |
| `/events`                        | EventsPage         | 공연 목록                              |
| `/events/:eventId`               | EventDetailPage    | 공연 상세                              |
| `/events/:eventId/booking`       | BookingPage        | 예매 2-Panel 플로우                    |
| `/membership`                    | MembershipPage     | 4단계 가입 플로우                      |
| `/my-page`                       | MyPage             | 멤버십/티켓 월렛/양도 내역 탭          |
| `/onboarding`                    | OnboardingPage     | 회원가입·로그인                        |
| `/search`                        | SearchPage         | 아티스트+공연 통합 검색                |
| `/notifications`                 | NotificationPage   | 알림 목록 (UI 쉘, mock 데이터)         |
| `/transfer/:artistId/:listingId` | TransferDetailPage | 양도 상세                              |

---

## 핵심 비즈니스 로직

### 멤버십 등급

| 등급            | 조건               | 예매 창       | 예매 수수료 | 양도 수수료 | VQA      |
| --------------- | ------------------ | ------------- | ----------- | ----------- | -------- |
| 🌩️ 라이트닝     | 팬 신뢰 점수 ≥ 85  | 선예매 1순위  | +₩1,000     | 5%          | **면제** |
| ⚡ 썬더          | 팬 신뢰 점수 66–84 | 2순위 (+1h)   | +₩2,000     | 5%          | **면제** |
| ☁️ 클라우드     | 멤버십 가입 즉시   | 3순위 (+1day) | +₩3,000     | 10%         | 필수     |
| 🌫️ 미스트       | 회원가입 즉시      | 일반예매만    | +₩4,000     | 양도불가    | 필수     |

- **라이트닝/썬더**: VQA 스킵 → 대기열 직행 (Fast Track)
- **클라우드/미스트**: VQA 통과 후 대기열 진입 (Standard Path)
- **양도 가능**: 클라우드 이상 (라이트닝/썬더 5%, 클라우드 10%) — 미스트는 양도게시판 접근 불가
- **양도 구매**: 해당 아티스트 멤버십 보유자만 가능
- **멤버십 게이트**: 아티스트 상세 홈 탭은 누구나, 공연/양도 탭은 멤버십 회원 전용

### 팬 신뢰 점수 (FTS) — MVP는 멜론 스트리밍만

| 요소           | 가중치 | MVP 구현 여부 |
| -------------- | ------ | ------------- |
| 티켓 활동      | 30%    | ❌ Post-MVP   |
| 스트리밍 소비  | 20%    | ✅ 멜론 연동  |
| MD 구매        | 15%    | ❌ Post-MVP   |
| 플랫폼 활동    | 15%    | ❌ Post-MVP   |
| 팬 행동 신뢰도 | 10%    | ❌ Post-MVP   |
| 멤버십 연속성  | 10%    | ❌ Post-MVP   |

- MVP: 멜론 미연동 → 미스트 유지. 멜론 연동 시에만 상위 등급 가능.
- 멜론 연동은 강제 게이트가 아닌 "상위 등급 잠금 해제" CTA 형식

### 예매 플로우 — 상태머신

```
idle → [Book Now 클릭]
  ├── 라이트닝/썬더 → queue (VQA 면제)
  └── 클라우드/미스트 → vqa
        ├── 통과 (2/3 이상) → queue
        └── 실패 (2회 소진) → 예매 불가

queue → seats-section → seats-individual → payment → confirmation
                                         ↘ payment-failed (60s 재시도)
seats-individual → seats-expired (3분 타임아웃) → seats-section 복귀
```

| 상태               | 설명                                                     |
| ------------------ | -------------------------------------------------------- |
| `idle`             | 구역 개요 + 구역별 잔여석 + [Book Now] (카운트다운/활성) |
| `vqa`              | 텍스트 질문 3개, 30초/문항, 2/3 통과, 최대 2회 재시도    |
| `queue`            | 순번 + 예상 대기 + 성공 확률(%), 10초 WebSocket 갱신     |
| `seats-section`    | 구역 선택 (SVG 클릭, 잔여석 컬러코딩)                    |
| `seats-individual` | Grape-style 좌석 선택, 최대 4석, 3분 타이머              |
| `payment`          | Toss Payments 모킹                                       |
| `confirmation`     | QR 코드 + 티켓 월렛 저장                                 |
| `payment-failed`   | 결제 실패 → 60초 내 재시도 가능                          |
| `seats-expired`    | 3분 타임아웃 → 구역 선택으로 복귀                        |

### VQA 규칙

- 클라우드/미스트 전용 (라이트닝/썬더 면제)
- 텍스트 질문만 (이미지/영상 없음 — MVP 범위)
- 질문 3개, 30초/문항, 2/3 정답 시 통과
- 최대 2회 재시도, 소진 시 세션 종료
- 오답: 빨간 flash + shake 애니메이션, 정답 표시 후 다음 문항 자동 진행

### VQA 상태

| 상태        | 설명                                                   |
| ----------- | ------------------------------------------------------ |
| `question`  | 질문 + 4지선다 + 30s 타이머 + 진행 표시 (1/3)          |
| `correct`   | 선택지 초록 flash + "정답!" → 자동 다음 문항           |
| `incorrect` | 선택지 빨간 flash + shake + 정답 강조 → 자동 다음 문항 |
| `timeout`   | 30초 초과 → 오답 처리                                  |

### 양도 마켓

- 가격 범위: 정가의 **0.5x ~ 1.5x** (암표 방지)
- 에스크로 방식: 구매자 결제 → 플랫폼 보관 → 소유권 이전 → 판매자 지급
- `listed` 상태만 수정/취소 가능
- 수정: 가격 변경 → 수수료 자동 계산
- 취소: 확인 다이얼로그 → `cancelled` 상태 변경
- 신뢰 지표: 판매자 티어 배지 + 거래 건수 표시

### 홈페이지 섹션 순서

1. 히어로 배너 캐러셀 (3~5개, 5초 자동 전환)
2. 인기 아티스트 (10열 그리드, 가로 스크롤)
3. **지금 뜨는 공연** (≠ "오늘의 티켓팅" — 혼동 방지)
4. 인기 공연 랭킹 (2열 8행)
5. 선예매 오픈 임박 (3열)

### 온보딩 플로우 (8단계)

**Phase 1 — 가입 & 본인인증**

1. 소셜 로그인 (Kakao / Naver) + 이메일 옵션
2. **본인인증** (CI 기반 1인 1계정):
   - 통신사 선택 (SKT / KT / LGU+ / MVNO)
   - 이름 + 생년월일(8자리) + 성별 + 전화번호
   - SMS 인증코드 입력 (3분 타이머)
   - CI 중복 시 기존 계정 안내 후 차단
3. **약관 동의**:
   - 전체 동의 마스터 체크박스
   - [필수] 이용약관 / [필수] 개인정보처리방침
   - [선택] 마케팅 수신 동의
4. 가입 완료 → **미스트 즉시 부여**

**Phase 2 — 개인화** 5. 아티스트 선택 (1명 이상 필수, 카테고리 탭 + 검색) 6. 멤버십 소개: 등급 혜택 비교표 + [가입 ₩30,000/년] or [나중에] 7. 멜론 연동 (선택): "라이트닝/썬더 등급 확인" CTA — 강제 아님 8. 완료 → 개인화된 홈으로 전환

---

## 디자인 시스템 핵심

### 색상 토큰 (확정값)

| 용도           | Tailwind 클래스  | 값                 |
| -------------- | ---------------- | ------------------ |
| 주요 CTA       | `bg-primary`     | `#FF5E32` (오렌지) |
| 보조 CTA       | `bg-secondary`   | `#1F2792` (네이비) |
| 사이드바 배경  | `bg-sidebar`     | `#FBFAF8`          |
| 메인 배경      | `bg-background`  | `#FFFEFE`          |
| hover/selected | `bg-accent`      | `#F2F0E6`          |
| 에러/삭제      | `bg-destructive` | oklch(0.577 …)     |
| 성공           | `text-success`   | `#22C55E`          |
| 경고           | `text-warning`   | `#F59E0B`          |

### 티어 색상

| 등급   | 텍스트 클래스         | 배경 클래스            |
| ------ | --------------------- | ---------------------- |
| 라이트닝 | `text-tier-lightning` | `bg-tier-lightning-bg` |
| 썬더     | `text-tier-thunder`   | `bg-tier-thunder-bg`   |
| 클라우드 | `text-tier-cloud`     | `bg-tier-cloud-bg`     |
| 미스트   | `text-tier-mist`      | `bg-tier-mist-bg`      |

### 좌석 상태 색상

| 상태      | 색상               |
| --------- | ------------------ |
| 선택 가능 | `#22C55E` (green)  |
| 내가 선택 | `#3B82F6` (blue)   |
| 판매 완료 | `#9CA3AF` (gray)   |
| 타인 잠금 | `#FACC15` (yellow) |

### 레이아웃 치수

| 요소             | 크기              |
| ---------------- | ----------------- |
| GNB 사이드바     | 220px (접힘 64px) |
| 좌측 패널 (예매) | 360px (접힘 48px) |
| 상단 바          | 56px              |

### 폰트

- 본문: Pretendard Variable (`font-sans`)
- 타이머/카운트다운 전용: JetBrains Mono (`font-mono`)
- Letter-spacing: `-0.015em` (전역)

### 로고

- 파일: `public/logos/logo5.svg` (146×146 정사각형)
- 사이드바: `h-10` / 푸터: `h-11` / 로그인: `h-16` / 온보딩 히어로: `h-10`

### 디자인 원칙

- **Border over Shadow**: 요소 분리는 border 우선, shadow는 hover/모달에서만
- **Selective Color**: 등급·좌석 상태·시스템 피드백에만 색상. 나머지 모노크롬
- **Light only**: 다크 모드 미지원
- **Desktop only**: 모바일 반응형 없음

### 애니메이션 스펙

| 요소                       | 애니메이션                     | 지속시간        |
| -------------------------- | ------------------------------ | --------------- |
| 사이드바 접기/펼치기       | width slide                    | 250ms ease-out  |
| 좌측 패널 접기/펼치기      | width slide                    | 200ms ease-out  |
| 페이지 전환                | fade-in                        | 150ms           |
| 모달 열림                  | fade + scale 95%→100%          | 200ms ease-out  |
| 모달 닫힘                  | fade + scale 100%→95%          | 150ms ease-in   |
| VQA 정답                   | 초록 flash                     | 300ms           |
| VQA 오답                   | 빨간 flash + shake ±3px        | 400ms           |
| 대기열 순번 변경           | digit roll 애니메이션          | 500ms           |
| 타이머 색상 (1:00)         | → 노란색 전환                  | 300ms           |
| 타이머 색상 + pulse (0:30) | → 빨간색 + scale 1.05 pulse    | 300ms + 1s loop |
| 결제 성공 confetti         | canvas-confetti burst          | 800ms           |
| 카드 hover                 | shadow 증가 + translateY(-1px) | 150ms           |
| 스켈레톤 shimmer           | gradient sweep                 | 1.5s loop       |
| Toast 등장                 | slide in from right            | 300ms           |

---

## 브랜치 전략

```
main                      # 프로덕션. 직접 push 금지.
dev                       # 통합 브랜치. PR로만 merge.
feat/<scope>              # 기능 개발. dev에서 분기.
fix/<scope>               # 버그 수정.
chore/<scope>             # 설정·의존성·문서.
review/merge-<a>-<b>      # 리뷰 에이전트 전용.
```

### 작업 완료 체크리스트

작업이 끝나면 반드시 아래 순서로 확인한다.

1. `npm run build` 실행 → 빌드 오류 없음 확인
2. GitHub Actions CI 빌드 상태 확인 (`gh run list --limit 5` 또는 PR 페이지)
3. 위 두 항목 모두 통과한 상태에서만 PR을 생성하거나 완료 보고

---

## ⚠️ 디자인 변경 금지 원칙

> **적용 범위**: 신규 페이지 추가 시 `URR-v2` 디자인 참조할 때만 해당. 일반 API 연동 작업에는 적용 안 함.

- 원본(`URR-v2`) 참조 시 디자인 1:1 유지
- Tailwind 클래스 임의 교체 금지 (예: `hover:bg-[#F3F2F0]` → `hover:bg-accent` 변환 금지)
- 원본이 `<span>`이면 `<span>`, 원본이 shadcn 컴포넌트면 그대로 사용
- 섹션 제목, 폰트 크기, 간격, 색상, 레이아웃 Claude 판단으로 변경 금지
- **예외 허용**: React Router → Next.js Link/useRouter, `import 이미지` → `/파일명` 문자열

---

## 참고 문서

- `docs/PRD.md` — 비즈니스 규칙, 멤버십 등급, 온보딩 플로우, 예매 상태머신
- `docs/ARCHITECTURE.md` — FSD 레이어 규칙, API 엔드포인트, 인프라
- `docs/designsystem.md` — 색상 토큰, 컴포넌트 스펙, 애니메이션
- `docs/api.md` — JWT 전략, API 응답 타입, 카카오 OAuth 흐름
- `docs/CheckList.md` — API 연동 진행 현황 (Phase 7 체크리스트)
- `docs/migration.md` — 신규 페이지 추가 가이드 (**디자인팀이 새 페이지 완성했을 때만 참조**)
