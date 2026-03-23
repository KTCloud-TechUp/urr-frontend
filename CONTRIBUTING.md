# URR (우르르) — 개발 가이드

솔로 개발 + AI 에이전트 병렬 작업 환경 기준.

---

## 목차

1. [브랜치 전략](#브랜치-전략)
2. [커밋 메시지 규칙](#커밋-메시지-규칙)
3. [PR 규칙](#pr-규칙)
4. [작업 완료 체크리스트](#작업-완료-체크리스트)
5. [유용한 Git 명령어](#유용한-git-명령어)

---

## 브랜치 전략

### 브랜치 구조

```
main
 └── dev
      ├── feat/<scope>              # 기능 개발
      ├── fix/<scope>               # 버그 수정
      ├── chore/<scope>             # 설정·의존성·문서 등 비기능 변경
      └── review/merge-<a>-<b>     # 리뷰 에이전트 전용. 두 feature 브랜치 병합 조율.
```

| 브랜치                 | 용도                                                         | 직접 push |
| ---------------------- | ------------------------------------------------------------ | --------- |
| `main`                 | 프로덕션 배포 상태. 안정된 코드만 유지.                      | 금지      |
| `dev`                  | 통합 브랜치. 검증된 feature만 merge.                         | 금지      |
| `feat/<scope>`         | 기능 단위 작업. dev에서 분기, PR로 dev에 합류.               | 허용      |
| `fix/<scope>`          | 버그 수정.                                                   | 허용      |
| `chore/<scope>`        | 설정, 패키지, 문서 등.                                       | 허용      |
| `review/merge-<a>-<b>` | 리뷰 에이전트 전용. 두 feature 브랜치의 충돌 없는 병합 작성. | 허용      |

### 브랜치 네이밍

```
feat/booking-flow          # 예매 플로우
feat/artist-community-tab  # 아티스트 소통 탭
feat/mypage-transfer       # 마이페이지 양도 탭
fix/auth-token-refresh     # JWT 갱신 버그
fix/sidebar-collapse       # 사이드바 축소 오류
chore/update-dependencies  # 패키지 업데이트
chore/cleanup-mock-data    # 목업 데이터 정리
```

- 소문자 + 하이픈. 특수문자 없음.
- scope는 간결하게, 작업 내용이 명확히 드러나도록.

### 플로우

```
dev
 ├── feat/booking-flow        ← 에이전트 A
 ├── feat/mypage-tabs         ← 에이전트 B
 ├── fix/auth-token           ← 직접 작업
 └── review/merge-booking-mypage  ← 리뷰 에이전트 (충돌 조율)
          │
          │ PR (Squash merge)
          ▼
         dev
          │
          │ PR (Merge commit) — 릴리즈 준비 완료 시
          ▼
         main
```

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
