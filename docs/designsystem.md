# URR Design System

> Light only. Desktop only. Border over Shadow. Selective Color.

---

## 색상 토큰

**Base**

| Tailwind 클래스         | 값                     | 용도                |
| ----------------------- | ---------------------- | ------------------- |
| `bg-primary`            | `#FF5E32`              | 주요 CTA (오렌지)   |
| `bg-secondary`          | `#1F2792`              | 보조 CTA (네이비)   |
| `bg-background`         | `#FFFEFE`              | 메인 배경           |
| `bg-sidebar`            | `#FBFAF8`              | 사이드바 배경       |
| `bg-accent`             | `#F2F0E6`              | hover/selected 배경 |
| `bg-destructive`        | oklch(0.577 0.245 27)  | 에러/삭제           |
| `text-muted-foreground` | oklch(0.556 0 0)       | 보조 텍스트         |
| `border-border`         | oklch(0.922 0.004 264) | 기본 border         |
| `text-success`          | `#22C55E`              | 성공                |
| `text-warning`          | `#F59E0B`              | 경고 (타이머 1분)   |
| `text-danger`           | `#E7000B`              | 에러 (타이머 30초)  |

**티어**: `text-tier-{lightning|thunder|cloud|mist}` / `bg-tier-{...}-bg`

**좌석 상태**: `bg-seat-{available(초록)|selected(파랑)|taken(회색)|locked(노랑)}`

**좌석 등급**: `text-seat-grade-{vip|r|s|a}` / `bg-seat-grade-{vip|r|s|a}`

**예매/양도 상태**: `text-booking-{open|upcoming|soldout}` / `text-transfer-{listed|sold|cancelled}`

**정가 대비 (양도)**: ≤100% → `text-success` / 101~130% → `text-warning` / >130% → `text-danger`

---

## 타이포그래피

**폰트**: Pretendard Variable (`font-sans`) / JetBrains Mono (`font-mono`, 타이머 전용)  
**Letter-spacing**: `-0.015em` 전역

| 용도          | Tailwind                          |
| ------------- | --------------------------------- |
| 페이지 타이틀 | `text-2xl font-bold`              |
| 섹션 헤더     | `text-xl font-semibold`           |
| 카드 제목     | `text-lg font-semibold`           |
| 버튼/상세     | `text-sm font-medium`             |
| 보조 텍스트   | `text-[13px]`                     |
| 배지/상태     | `text-xs font-semibold`           |
| 타이머        | `text-[28px] font-bold font-mono` |

---

## 레이아웃 치수

| 요소           | 크기                                 |
| -------------- | ------------------------------------ |
| GNB 사이드바   | 220px (접힘: 64px)                   |
| 예매 좌측 패널 | 360px (접힘: 48px)                   |
| 상단 바        | 56px                                 |
| 콘텐츠 max-w   | 1200px (예매 페이지 제외 full-width) |

**Z-index**: Content(0) → Sidebar/TopBar(10) → LeftPanel(20) → QueueOverlay(30) → Modal(40) → Toast(50)

---

## 애니메이션

| 요소                | 스펙                                      |
| ------------------- | ----------------------------------------- |
| 사이드바 접기       | width 250ms ease-out                      |
| 좌측 패널 접기      | width 200ms ease-out                      |
| 모달 열림/닫힘      | fade + scale 95%↔100%, 200/150ms          |
| 대기열 순번         | digit roll 500ms                          |
| 타이머 pulse (≤30s) | scale 1.05, 1s loop                       |
| 결제 성공           | canvas-confetti burst 800ms               |
| 카드 hover          | shadow-sm→md + translateY(-1px) 150ms     |
| 스켈레톤            | shimmer gradient 1.5s loop                |
| Toast               | slide-in-right 300ms, 5s 유지, fade 200ms |

---

## 커스텀 컴포넌트 (`src/shared/ui/` 또는 `entities/*/ui/`)

| 컴포넌트           | Props 핵심                                                                 | 비고                                    |
| ------------------ | -------------------------------------------------------------------------- | --------------------------------------- |
| `TierBadge`        | `tier: lightning\|thunder\|cloud\|mist` / `size: sm\|default\|lg`         | 읽기 전용, 클릭 불가                    |
| `BookingStatusBadge` | `status: open\|upcoming\|soldout\|closed`                                | 색상 자동 매핑                          |
| `TransferStatusBadge` | `status: listed\|sold\|completed\|cancelled`                            | 색상 자동 매핑                          |
| `TimerDisplay`     | `seconds: number` / `size: sm\|default\|lg`                               | 60s→앰버, 30s→빨강+pulse 자동 전환     |
| `PriceDisplay`     | `amount: number` / `size: sm\|default\|lg`                                | `Intl.NumberFormat('ko-KR')` 사용       |
| `FaceValueBadge`   | `percentage: number`                                                       | 정가 대비 비율, 색상 자동 매핑          |
| `SeatStatusLegend` | `compact?: boolean`                                                        | 좌석맵 있는 모든 화면에 필수            |
| `QueueStatusCard`  | `position` / `totalInQueue` / `estimatedWait` / `probability`             | probability < 20% → 양도 마켓 링크 표시 |
| 카드류             | `EventCard` / `ArtistCard` / `TicketCard` / `TransferCard`                | hover: shadow-sm→md + translateY(-1px)  |

---

## 디자인 원칙

1. **Border over Shadow** — 분리는 border 먼저, shadow는 hover/모달만
2. **Selective Color** — 티어·좌석 상태·시스템 피드백에만 색상, 나머지 모노크롬
3. **Light only** — 다크 모드 클래스 추가 금지
4. **Desktop only** — 모바일 반응형 없음
5. **배지 읽기 전용** — TierBadge 등 배지류는 절대 클릭 불가
