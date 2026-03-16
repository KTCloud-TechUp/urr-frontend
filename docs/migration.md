# URR 새 페이지 추가 가이드

> **언제 꺼내는 파일**: 디자인팀이 새 페이지(URR-v2)를 완성했을 때만 참조.
> API 연동, 기능 수정 등 일반 작업 시에는 이 파일 불필요.

## 프로젝트 위치

- **원본 디자인 (디자인팀 바이브코딩)**: `C:\Users\kkaeng\Desktop\Dev\URR\URR-v2`
- **작업 프로젝트**: `C:\Users\kkaeng\Desktop\Dev\URR\urr-frontend`

---

## 작업 요청 템플릿

```
[새 페이지 추가]
페이지명:
경로:
원본 참고 파일: (URR-v2 내 경로)
FSD 위치:
  - Widget:  src/widgets/___/
  - Feature: src/features/___/  (해당 시)
  - Page:    src/app/___/page.tsx
디자인 특이사항: (애니메이션, 특수 컴포넌트, 외부 라이브러리 등)
Mock 데이터: (필요 여부 및 위치)
```

---

## FSD 구조

```
src/
├── app/          # Next.js App Router (페이지 라우트)
├── widgets/      # 페이지 단위 복합 컴포넌트
├── features/     # 기능별 슬라이스 (booking, auth, artist ...)
├── entities/     # 비즈니스 엔티티 (user, event, artist ...)
└── shared/       # 공유 리소스 (ui, lib, types, api)
```

의존성 방향: `shared → entities → features → widgets → app`

---

## 디자인 원칙 (신규 페이지 작업 시 필수)

- **원본 1:1 복사**: 작업 전 반드시 `URR-v2` 원본 파일 먼저 확인
- **Tailwind 클래스 임의 변환 금지** (예: `hover:bg-[#F3F2F0]` → `hover:bg-accent` 금지)
- **컴포넌트 임의 교체 금지**: 원본이 `<span>` 이면 `<span>` 유지
- **이미지 경로**: `src/assets/` → `public/` 복사 후 문자열 경로 사용
- **허용 변환**: React Router → Next.js `Link`/`useRouter`, `import` 이미지 → `/파일명` 문자열

---

## 추가 예정 페이지 (신규)

| 페이지 | 경로 | 상태 |
|--------|------|------|
| 랜딩 페이지 | `/landing` | ⏳ 디자인 대기 |
| 공통 대기열 화면 | `/queue` | ⏳ 디자인 대기 |
