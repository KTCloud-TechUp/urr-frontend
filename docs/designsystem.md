# URR Design System

> Light only. Desktop only. Border over Shadow. Selective Color.

---

## 색상 토큰

### Base

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

### 티어

| 등급         | 텍스트                | 배경                   |
| ------------ | --------------------- | ---------------------- |
| Diamond (🌩️) | `text-tier-lightning` | `bg-tier-lightning-bg` |
| Gold (⚡)    | `text-tier-thunder`   | `bg-tier-thunder-bg`   |
| Silver (☁️)  | `text-tier-cloud`     | `bg-tier-cloud-bg`     |
| Bronze (🌫️)  | `text-tier-mist`      | `bg-tier-mist-bg`      |

### 좌석 상태

| 상태      | 클래스              | 색   |
| --------- | ------------------- | ---- |
| 선택 가능 | `bg-seat-available` | 초록 |
| 내 선택   | `bg-seat-selected`  | 파랑 |
| 판매 완료 | `bg-seat-taken`     | 회색 |
| 타인 점유 | `bg-seat-locked`    | 노랑 |

### 좌석 등급

| 등급 | 클래스                                      |
| ---- | ------------------------------------------- |
| VIP  | `text-seat-grade-vip` / `bg-seat-grade-vip` |
| R석  | `text-seat-grade-r` / `bg-seat-grade-r`     |
| S석  | `text-seat-grade-s` / `bg-seat-grade-s`     |
| A석  | `text-seat-grade-a` / `bg-seat-grade-a`     |

### 예매/양도 상태

| 상태      | 클래스                    |
| --------- | ------------------------- |
| 예매 오픈 | `text-booking-open`       |
| 오픈 예정 | `text-booking-upcoming`   |
| 매진      | `text-booking-soldout`    |
| 등록 중   | `text-transfer-listed`    |
| 양도 완료 | `text-transfer-sold`      |
| 취소      | `text-transfer-cancelled` |

### 정가 대비 (양도)

| 범위     | 색상           |
| -------- | -------------- |
| ≤ 100%   | `text-success` |
| 101~130% | `text-warning` |
| > 130%   | `text-danger`  |

---

## 타이포그래피

**폰트**: Pretendard Variable (`font-sans`) / JetBrains Mono (`font-mono`, 타이머 전용)
**Letter-spacing**: `-0.015em` 전역

| 용도           | Tailwind                          |
| -------------- | --------------------------------- |
| 페이지 타이틀  | `text-2xl font-bold`              |
| 섹션 헤더      | `text-xl font-semibold`           |
| 카드 제목      | `text-lg font-semibold`           |
| 버튼/카드 상세 | `text-sm font-medium`             |
| 보조 텍스트    | `text-[13px]`                     |
| 배지/상태      | `text-xs font-semibold`           |
| 타이머 (좌석)  | `text-[28px] font-bold font-mono` |
| 타이머 (VQA)   | `text-xl font-semibold font-mono` |

---

## 레이아웃 치수

| 요소             | 크기                                 |
| ---------------- | ------------------------------------ |
| GNB 사이드바     | 220px (접힘: 64px)                   |
| 예매 좌측 패널   | 360px (접힘: 48px)                   |
| 상단 바          | 56px                                 |
| 콘텐츠 max-width | 1200px (예매 페이지 제외 full-width) |

**Z-index**: Content(0) → Sidebar/TopBar(10) → LeftPanel(20) → QueueOverlay(30) → Modal(40) → Toast(50)

---

## 애니메이션

| 요소                | 스펙                                      |
| ------------------- | ----------------------------------------- |
| 사이드바 접기       | width 250ms ease-out                      |
| 좌측 패널 접기      | width 200ms ease-out                      |
| 모달 열림           | fade + scale 95%→100%, 200ms ease-out     |
| 모달 닫힘           | fade + scale 100%→95%, 150ms ease-in      |
| VQA 정답            | 초록 flash 300ms                          |
| VQA 오답            | 빨간 flash + translateX(±3px) shake 400ms |
| 대기열 순번         | digit roll 500ms                          |
| 타이머 pulse (≤30s) | scale 1.05, 1s loop                       |
| 결제 성공           | canvas-confetti burst 800ms               |
| 카드 hover          | shadow-sm→md + translateY(-1px) 150ms     |
| 스켈레톤            | shimmer gradient 1.5s loop                |
| Toast               | slide-in-right 300ms, 5s 유지, fade 200ms |

---

## URR 커스텀 컴포넌트 (`src/shared/ui/urr/` 또는 `entities/*/ui/`)

### TierBadge

```tsx
<TierBadge tier="lightning" />              // 💎 다이아
<TierBadge tier="thunder" size="sm" />      // 🥇 골드 (소형)
<TierBadge tier="mist" showLabel={false} /> // 아이콘만 (aria-label 필수)
```

- `tier`: `'lightning' | 'thunder' | 'cloud' | 'mist'`
- `size`: `'sm' | 'default' | 'lg'`
- **읽기 전용** — 클릭 불가, cursor-default

### BookingStatusBadge

```tsx
<BookingStatusBadge status="open" />    // 예매 오픈
<BookingStatusBadge status="soldout" /> // 매진
```

- `status`: `'open' | 'upcoming' | 'soldout' | 'closed'`

### TransferStatusBadge

```tsx
<TransferStatusBadge status="listed" />    // ● 등록 중
<TransferStatusBadge status="completed" /> // ● 양도 완료
```

- `status`: `'listed' | 'sold' | 'completed' | 'cancelled'`

### TimerDisplay

```tsx
<TimerDisplay seconds={147} />          // 2:27 기본색
<TimerDisplay seconds={45} />           // 0:45 앰버
<TimerDisplay seconds={15} size="lg" /> // 0:15 빨강+pulse
```

- `seconds`: number / `size`: `'sm' | 'default' | 'lg'`
- 60초 이하 자동 앰버, 30초 이하 자동 빨강+pulse

### PriceDisplay

```tsx
<PriceDisplay amount={165000} />           // ₩165,000
<PriceDisplay amount={332000} size="lg" /> // 대형
```

- `Intl.NumberFormat('ko-KR')` 사용

### FaceValueBadge

```tsx
<FaceValueBadge percentage={95} />  // 정가 대비 95% (초록)
<FaceValueBadge percentage={115} /> // 115% (앰버)
<FaceValueBadge percentage={145} /> // 145% (빨강)
```

### SeatStatusLegend

```tsx
<SeatStatusLegend />         // 좌석맵 있는 모든 곳에 필수
<SeatStatusLegend compact />
```

### QueueStatusCard

```tsx
<QueueStatusCard
  position={47}
  totalInQueue={1200}
  estimatedWait="2분 15초"
  probability={92}
/>
```

- probability < 20%: "양도 마켓을 확인해보세요" 링크 표시

### EventCard / ArtistCard / TicketCard / TransferCard

- 모든 카드: hover 시 shadow-sm→md + translateY(-1px)
- 클릭 가능 카드: cursor-pointer

---

## 디자인 원칙 요약

1. **Border over Shadow** — 분리는 border 먼저, shadow는 hover/모달만
2. **Selective Color** — 티어·좌석상태·시스템 피드백에만 색상. 나머지 모노크롬
3. **Light only** — 다크 모드 클래스 추가 금지
4. **Desktop only** — 모바일 반응형 없음
5. **읽기 전용 배지** — TierBadge, BookingStatusBadge 등 배지류는 절대 클릭 불가
