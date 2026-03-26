# URR (우르르) — 개발 가이드

솔로 개발 + AI 에이전트 병렬 작업 환경 기준.
디자인팀 협업 포함 (design 브랜치 전용).

---

## 목차

1. [브랜치 전략](#브랜치-전략)
2. [디자인 브랜치 규칙](#디자인-브랜치-규칙)
3. [인프라 브랜치 규칙](#인프라-브랜치-규칙)
4. [커밋 메시지 규칙](#커밋-메시지-규칙)
5. [PR 규칙](#pr-규칙)
6. [작업 완료 체크리스트](#작업-완료-체크리스트)
7. [유용한 Git 명령어](#유용한-git-명령어)

---

## 브랜치 전략

### 기본 원칙

**대부분의 작업은 `dev`에서 직접 한다.** 브랜치는 격리가 실제로 필요할 때만 만든다.

| 브랜치           | 용도                                                       | 직접 push |
| ---------------- | ---------------------------------------------------------- | --------- |
| `main`           | 프로덕션. 직접 push 금지. dev → main PR로만 머지.          | 금지      |
| `dev`            | 일상 작업 브랜치. 여기서 직접 커밋.                        | 허용      |
| `feat/<scope>`   | 복잡하거나 격리해서 작업할 때만 생성. dev에서 분기·복귀.   | 허용      |
| `design/<scope>` | 디자인팀 전용. UI/스타일만. dev에서 분기, PR로 dev에 합류. | 허용      |
| `infra/<scope>`  | 인프라팀 전용. 설정·배포만. dev에서 분기, PR로 dev에 합류. | 허용      |

### 언제 브랜치를 따로 파나

브랜치를 별도로 만드는 기준:

- 작업이 크고 오래 걸려서 dev가 불안정해질 것 같을 때
- 좌석 렌더링 같이 다른 코드와 충돌 위험이 높은 독립적인 작업
- 디자인팀 협업 (`design/<scope>`)
- 인프라팀 협업 (`infra/<scope>`)

그 외 일반 기능 추가·버그 수정·API 연동 등은 dev에서 직접 작업.

### 플로우

```
dev ─────────────────────────────────────────── dev
 │                                               ▲
 └── feat/venue-rendering (필요할 때만)          │
          │                                      │
          └── Squash merge ──────────────────────┘

dev ─────────────────────────────────────────── main
          │ PR (Merge commit) — 릴리즈 준비 완료 시
          ▼
         main
```

### 브랜치 네이밍

- 소문자 + 하이픈. 특수문자 없음.
- 예: `feat/venue-rendering`, `design/onboarding-ui`, `fix/auth-token`

---

## 디자인 브랜치 규칙

**디자인팀(및 디자인팀 AI)은 `design/<scope>` 브랜치에서만 작업한다.**

### 건드려도 되는 파일

- `src/` 내 컴포넌트의 **JSX/Tailwind 클래스, 레이아웃 구조, 스타일 관련 변경**
- `src/shared/ui/` — shadcn 컴포넌트 스타일 수정
- `public/` — 이미지·아이콘·폰트 등 정적 에셋
- `tailwind.config.*`, `globals.css` — 디자인 토큰·CSS 변수

### 절대 건드리면 안 되는 파일

- `src/features/*/api/` — API 호출 로직
- `src/features/*/model/` — 상태·훅 로직
- `src/app/` — 라우팅
- `src/shared/api/` — API 클라이언트
- `src/shared/lib/` — 유틸·상수·타입
- 환경 변수, 패키지 설정 (`package.json`, `next.config.*`, `.env*`)

### 머지 규칙

- **머지는 반드시 오너가 직접 한다.** 디자인팀·AI가 PR을 열어도 머지는 하지 않는다.
- PR은 `design/<scope>` → `dev` 방향으로만 생성.
- 머지 전 오너가 변경 파일 목록을 확인해 위 금지 항목이 없는지 검토.

### AI 에이전트에게 (design 브랜치에서 실행 중인 경우)

> 너는 지금 `design/` 브랜치에서 실행 중이다.
> UI 컴포넌트의 스타일·레이아웃·에셋만 수정하고, 비즈니스 로직·API·훅·라우팅은 절대 변경하지 마라.
> 작업이 끝나면 PR을 열고 머지는 하지 마라. 머지는 오너가 직접 한다.

---

## 인프라 브랜치 규칙

**인프라팀(및 인프라팀 AI)은 `infra/<scope>` 브랜치에서만 작업한다.**

### 건드려도 되는 파일

- `next.config.*` — Next.js 설정
- `.github/` — CI/CD 워크플로우 (GitHub Actions)
- `Dockerfile`, 배포 스크립트
- `package.json` — 의존성·스크립트 한정

### 절대 건드리면 안 되는 파일

- `src/` 하위 모든 파일 (컴포넌트, 훅, API, 타입 등)

### 머지 규칙

- **머지는 반드시 오너가 직접 한다.** 인프라팀·AI가 PR을 열어도 머지는 하지 않는다.
- PR은 `infra/<scope>` → `dev` 방향으로만 생성.

### AI 에이전트에게 (infra 브랜치에서 실행 중인 경우)

> 너는 지금 `infra/` 브랜치에서 실행 중이다.
> `next.config.*`, `.github/`, `Dockerfile`, 배포 스크립트, `package.json`, `src/` 하위 파일은 절대 변경하지 마라.
> 작업이 끝나면 PR을 열고 머지는 하지 마라. 머지는 오너가 직접 한다.

---

## 커밋 메시지 규칙

### 형식

```
<type>: <subject>
```

영어 또는 한국어 모두 허용. 일관성만 유지.

### 타입

| 타입       | 의미                             | 예시                                      |
| ---------- | -------------------------------- | ----------------------------------------- |
| `feat`     | 새로운 기능 추가                 | `feat: 예매 플로우 5단계 구현`            |
| `fix`      | 버그 수정                        | `fix: JWT 만료 시 무한 루프 수정`         |
| `refactor` | 기능 변화 없는 코드 구조 개선    | `refactor: 예매 훅 useBooking으로 분리`   |
| `style`    | 포맷팅, 공백 등 기능 무관한 변경 | `style: 버튼 margin 통일`                 |
| `chore`    | 빌드, 패키지, 설정 등            | `chore: tailwind v4 마이그레이션`         |
| `docs`     | 문서 수정                        | `docs: CONTRIBUTING 브랜치 전략 업데이트` |
| `test`     | 테스트 코드 추가/수정            | `test: 결제 컴포넌트 렌더 테스트 추가`    |

### 커밋 원칙

- **atomic commit** — 한 커밋에 한 가지 목적. 빌드가 깨지는 상태로 커밋하지 않는다.
- 관련 파일만 staging. `git add .` 지양.
- subject는 명령형 동사 또는 명사형으로. "수정했음" 같은 과거형 지양.

---

## PR 규칙

### feat/\* → dev

- **Squash merge** 사용. feature 브랜치의 WIP 커밋을 정리해 히스토리를 깔끔하게 유지.
- PR 제목 = 최종 커밋 메시지로 사용됨. 타입 포함해서 명확하게.
- 예: `feat: 아티스트 소통 탭 UI 구현`

### review/merge-\* → dev

- **Squash merge** 사용.
- PR 제목 형식: `merge: feat/<a> + feat/<b> 충돌 없이 통합`

### dev → main

- **Merge commit** 사용. 릴리즈 기록 보존.
- 빌드(`npm run build`) 통과 확인 후 merge.

### 기타

- push된 브랜치에서 `--force` 금지. 필요하면 `--force-with-lease`.
- rebase는 로컬 feature 브랜치에서만.

---

## Pre-commit 훅

`git commit` 시 자동으로 실행됨. 실패하면 커밋이 차단된다.

| 단계 | 명령어         | 설명                      |
| ---- | -------------- | ------------------------- |
| 1    | `next lint`    | 전체 ESLint 검사          |
| 2    | `tsc --noEmit` | 전체 TypeScript 타입 검사 |

- 수동으로 실행하려면: `npm run lint`, `npm run type-check`

---

## 작업 완료 체크리스트

작업이 끝나면 반드시 아래 순서로 확인한다.

1. pre-commit 훅 통과 확인 (커밋 시 자동 실행)
2. `npm run build` 실행 → 빌드 오류 없음 확인
3. GitHub Actions CI 빌드 상태 확인 (`gh run list --limit 5` 또는 PR 페이지)
4. 위 항목 모두 통과한 상태에서만 PR을 생성하거나 완료 보고

---

## 유용한 Git 명령어

```bash
# 현재 브랜치 확인
git branch

# dev 최신 상태로 feature 브랜치 업데이트 (rebase 권장)
git fetch origin
git rebase origin/dev

# 변경된 파일 확인
git status

# 관련 파일만 선택해서 커밋
git add src/features/booking/ui/BookingStep.tsx
git commit -m "feat: 예매 단계 추가"

# 원격 브랜치 목록
git branch -r

# 로컬 변경사항 임시 저장
git stash
git stash pop

# 커밋 히스토리 (한 줄)
git log --oneline --graph

# PR 생성 (GitHub CLI)
gh pr create --base dev --title "feat: ..." --body "..."
```
