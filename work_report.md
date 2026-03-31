# Work Report — 멤버십 등급 아이콘 통일

**작업 브랜치:** `design/landing-page`
**기준 브랜치:** `main`
**작업일:** 2026-04-01
**변경 파일 수:** 10개 (+에셋 정리, 본 보고서)

---

## 배경 및 목적

멤버십 등급 아이콘이 두 가지 방식으로 혼재하여 시각적 통일성이 없었습니다.

- **Lucide 라이브러리 아이콘**: `TierBadge` 컴포넌트에서 Zap / Cloud / CloudLightning / Haze 사용
- **이모지 문자열**: 예매·아티스트·랜딩 페이지에서 `TIER_EMOJIS[tier]` 사용

디자인팀이 제공한 PNG 에셋 4개로 전체 통일했습니다.

---

## 변경 사항

### 1. 에셋 이동 & 파일명 변경

`public/` 루트에 있던 한글 파일명을 `public/membership/` 폴더로 정리했습니다.

| 기존 경로 | 변경 후 경로 |
|-----------|-------------|
| `public/멤버쉽_라이트닝.png` | `public/membership/lightning.png` |
| `public/멤버쉽_미스트.png` | `public/membership/mist.png` |
| `public/멤버쉽_썬더.png` | `public/membership/thunder.png` |
| `public/멤버쉽_클라우드.png` | `public/membership/cloud.png` |

> 원본 한글 파일명은 삭제됨.

---

### 2. 신규 추가 — `TIER_IMAGES` 상수

**파일:** `src/shared/types/index.ts`

`TIER_EMOJIS` 바로 아래에 추가:

```ts
export const TIER_IMAGES: Record<TierLevel, string> = {
  lightning: "/membership/lightning.png",
  thunder:   "/membership/thunder.png",
  cloud:     "/membership/cloud.png",
  mist:      "/membership/mist.png",
};
```

> `TIER_EMOJIS`는 제거하지 않고 유지 (기존 호환성).

---

### 3. 파일별 변경 내역

#### `src/entities/user/ui/TierBadge.tsx`
- Lucide import 제거: `Haze`, `Cloud`, `CloudLightning`, `Zap`, `LucideIcon`
- `tierIcons` Record 제거
- `TIER_IMAGES` import 추가
- 렌더링 교체:
  ```diff
  - <Icon size={iconSizes[size]} />
  + <img src={TIER_IMAGES[tier]} width={iconSizes[size]} height={iconSizes[size]} alt="" />
  ```

#### `src/widgets/artist/ArtistHomeTab.tsx`
- import: `TIER_EMOJIS` → `TIER_IMAGES`
- 2곳 교체 (18×18px):
  ```diff
  - <span className="text-base">{TIER_EMOJIS[tier]}</span>
  + <img src={TIER_IMAGES[tier]} width={18} height={18} alt="" />
  ```

#### `src/widgets/booking/LeftPanel.tsx`
- import: `TIER_EMOJIS` → `TIER_IMAGES`
- `TierScheduleRow` 내 교체 (16×16px):
  ```diff
  - <span>{TIER_EMOJIS[tier]}</span>
  + <img src={TIER_IMAGES[tier]} width={16} height={16} alt="" />
  ```

#### `src/widgets/booking/PaymentView.tsx`
- import: `TIER_EMOJIS` → `TIER_IMAGES`
- 교체 (16×16px):
  ```diff
  - <span>{TIER_EMOJIS[userTier]}</span>
  + <img src={TIER_IMAGES[userTier]} width={16} height={16} alt="" />
  ```

#### `src/widgets/booking/ConfirmationView.tsx`
- PaymentView와 동일한 방식으로 교체

#### `src/widgets/booking/BookingSidePanel.tsx`
- PaymentView와 동일한 방식으로 교체

#### `src/widgets/landing/MembershipTierSection.tsx`
- TIERS 배열의 `emoji` 필드는 데이터로 유지 (사용 안 함으로만 변경)
- 렌더링 교체 (24×24px):
  ```diff
  - <span style={{ fontSize: "1.3rem" }}>{tier.emoji}</span>
  + <img src={`/membership/${tier.englishName.toLowerCase()}.png`} width={24} height={24} alt={tier.name} />
  ```

#### `src/widgets/landing-light/MembershipTierSection.tsx`
- landing과 동일한 방식으로 교체

---

## 주의 사항 (충돌 방지)

| 항목 | 내용 |
|------|------|
| `TIER_EMOJIS` | **제거하지 않음** — `src/shared/types/index.ts`에 유지. 향후 불필요 시 제거 가능 |
| `tierIcons` | `TierBadge.tsx`에서 **제거됨** — 외부 export 아니므로 다른 파일 영향 없음 |
| landing TIERS `emoji` 필드 | 데이터 배열에 **유지** — 렌더링에서만 img로 교체, 데이터 구조 변경 없음 |
| API / 비즈니스 로직 | **변경 없음** — 렌더링 레이어만 수정 |

---

## 동작 검증

| 확인 항목 | 결과 |
|-----------|------|
| `npm run build` | 성공 (TypeScript 오류 없음, 97개 페이지 정적 생성) |
| TierBadge (사이드바, 마이페이지 등) | PNG 아이콘으로 통일 |
| 예매 패널 등급 행 (`LeftPanel`) | PNG 아이콘으로 통일 |
| 결제/확인 화면 수수료 표시 | PNG 아이콘으로 통일 |
| 랜딩 멤버십 섹션 카드 | PNG 아이콘으로 통일 |

---
---

# Work Report — 랜딩 페이지 히어로 섹션 마무리

**작업 브랜치:** `design/design-handoff`
**기준 브랜치:** `main`
**작업일:** 2026-04-01
**변경 파일 수:** 4개

---

## 배경 및 목적

랜딩 페이지 히어로 섹션의 세 가지 마무리 작업:
1. UnicornStudio 워터마크를 자연스럽게 가리기
2. CTA 버튼 UX 라이팅을 랜딩 페이지 맥락에 맞게 수정
3. 로고를 최종 확정 에셋으로 교체
4. 그라디언트에 가려지는 스크롤 인디케이터 제거

---

## 변경 사항

### 1. UnicornStudio 워터마크 그라디언트 커버

**파일:** `src/widgets/landing/AuroraBackground.tsx`

UnicornStudio 무료 플랜은 `freePlan: true` 플래그가 프로젝트 JSON에 서버 사이드로 내장되어 있어 클라이언트에서 배지 자체를 완전히 제거하는 것이 불가능합니다.
대신 히어로 하단 그라디언트 커버를 배지의 `z-index: 99999999`보다 높은 `z-index: 100000000`으로 올려 시각적으로 자연스럽게 덮는 방식을 채택했습니다.

```tsx
// 추가된 레이어
<div
  className="absolute bottom-0 left-0 w-full pointer-events-none"
  style={{
    height: "180px",
    background: "linear-gradient(to bottom, transparent 0%, #0A0A1A 50%)",
    zIndex: 100000000,
  }}
/>
```

---

### 2. CTA 버튼 UX 라이팅 수정

**파일:** `src/widgets/landing/HeroSection.tsx`

| 위치 | 변경 전 | 변경 후 |
|------|---------|---------|
| Primary CTA | (이전 문구) | 지금 시작하기 |
| Ghost CTA | (이전 문구) | 더 알아보기 |

---

### 3. 스크롤 인디케이터 제거

**파일:** `src/widgets/landing/HeroSection.tsx`

히어로 하단 그라디언트 커버 영역과 겹쳐 애매하게 보이는 "scroll" 넛지 컴포넌트를 제거했습니다.
- 제거: `scrollIndicatorRef`, `useEffect` 스크롤 이벤트 핸들러, scroll indicator div

---

### 4. 로고 최종 에셋 교체

**파일:** `src/widgets/landing/LandingNav.tsx`, `src/widgets/landing/LandingFooter.tsx`

```diff
- src="/logos/logo5.svg"
+ src="/logo_final.svg"
```

---

## 주의 사항

| 항목 | 내용 |
|------|------|
| 워터마크 커버 방식 | CSS 그라디언트로 시각적 은폐. UnicornStudio 유료 플랜 전환 시 배지 자체가 사라지므로 그라디언트 커버도 자연스럽게 유지됨 |
| API / 비즈니스 로직 | 변경 없음 — 렌더링 레이어만 수정 |
