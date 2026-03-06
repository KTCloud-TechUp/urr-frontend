# URR Design System v1.1

> Single Source of Truth for URR UI development.
> All components, tokens, and patterns documented here must be referenced during every build phase.
>
> **v1.1 변경사항**: Primary(#FF5E32 오렌지) / Secondary(#1F2792 네이비) 컬러 적용, 사이드바 White Pattern 전환 (220px)

---

## 1. Design Principles

| Principle                      | Description                                                                                        |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| **Immersive Ticketing**        | 예매 플로우에서 단계적으로 몰입도를 높임. 사이드바 축소, 좌석맵 확대, 타이머 긴장감                |
| **Trust Through Transparency** | 등급 배지, 대기열 순번, 정가 대비 %, 수수료 구조 등 모든 정보를 명시적으로 노출                    |
| **Time-Pressure Ready**        | 타이머, 카운트다운, 실시간 업데이트 등 시간 압박 상황에서도 명확한 UI                              |
| **Fan-Positive Tone**          | VQA는 "팬 인증", 등급은 "리워드". 처벌이 아닌 축하의 톤 유지                                       |
| **Selective Color**            | 색상은 **등급(Tier)**, **좌석 상태(Seat)**, **시스템 피드백(Status)** 에만 사용. 나머지는 모노크롬 |
| **Border over Shadow**         | 요소 분리는 border 우선. Shadow는 hover 승격, 모달 등 깊이감 필요 시에만 사용                      |

**Font**: Pretendard Variable (영문/한글 통합)
**Timer Font**: JetBrains Mono (카운트다운 전용 — 자릿수 고정폭 방지)
**Letter-spacing**: -0.015em (전역)
**Color Format**: oklch (Primary/Secondary만 hex)
**Mode**: Light only (다크 모드 미지원)

---

## 2. Color Tokens

### 2.1 Semantic (Base)

| CSS Variable             | Light Value              | Tailwind Class              | Usage                         |
| ------------------------ | ------------------------ | --------------------------- | ----------------------------- |
| `--background`           | `oklch(1 0 0)`           | `bg-background`             | 메인 콘텐츠 배경              |
| `--foreground`           | `oklch(0.145 0 0)`       | `text-foreground`           | 기본 텍스트                   |
| `--card`                 | `oklch(1 0 0)`           | `bg-card`                   | 카드/패널 배경                |
| `--card-foreground`      | `oklch(0.145 0 0)`       | `text-card-foreground`      | 카드 텍스트                   |
| `--popover`              | `oklch(1 0 0)`           | `bg-popover`                | 팝오버/드롭다운 배경          |
| `--popover-foreground`   | `oklch(0.145 0 0)`       | `text-popover-foreground`   | 팝오버 텍스트                 |
| `--primary`              | `#FF5E32`                | `bg-primary`                | CTA, 활성 상태, 링크 (오렌지) |
| `--primary-foreground`   | `oklch(0.985 0 0)`       | `text-primary-foreground`   | Primary 위 텍스트             |
| `--secondary`            | `#1F2792`                | `bg-secondary`              | 보조 CTA, 네이비 버튼         |
| `--secondary-foreground` | `#FFFFFF`                | `text-secondary-foreground` | Secondary 위 텍스트           |
| `--muted`                | `oklch(0.968 0.003 264)` | `bg-muted`                  | 비활성/배경 레이어            |
| `--muted-foreground`     | `oklch(0.556 0 0)`       | `text-muted-foreground`     | 보조 텍스트, 힌트             |
| `--accent`               | `oklch(0.955 0.005 264)` | `bg-accent`                 | hover/selected 배경           |
| `--accent-foreground`    | `oklch(0.205 0 0)`       | `text-accent-foreground`    | accent 위 텍스트              |
| `--destructive`          | `oklch(0.577 0.245 27)`  | `bg-destructive`            | 에러, 삭제, VQA 오답          |
| `--border`               | `oklch(0.922 0.004 264)` | `border-border`             | 기본 border                   |
| `--input`                | `oklch(0.922 0.004 264)` | `border-input`              | Input border                  |
| `--ring`                 | `#FF5E32`                | `ring-ring`                 | Focus ring (primary와 동일)   |

> **Two-Tone CTA**: Primary(오렌지 #FF5E32) + Secondary(네이비 #1F2792) 2색 CTA 체계. 오렌지는 주요 액션, 네이비는 보조 액션에 사용.

### 2.2 Sidebar (White Pattern — 220px)

| CSS Variable                   | Light Value              | Tailwind Class                    | Usage                      |
| ------------------------------ | ------------------------ | --------------------------------- | -------------------------- |
| `--sidebar`                    | `#FFFFFF`                | `bg-sidebar`                      | GNB Sidebar 배경 (화이트)  |
| `--sidebar-foreground`         | `oklch(0.145 0 0)`       | `text-sidebar-foreground`         | 사이드바 텍스트            |
| `--sidebar-primary`            | `#FF5E32`                | `bg-sidebar-primary`              | 활성 메뉴 / CTA 버튼       |
| `--sidebar-primary-foreground` | `oklch(0.985 0 0)`       | `text-sidebar-primary-foreground` | 활성 메뉴 텍스트           |
| `--sidebar-accent`             | `oklch(0.955 0.005 264)` | `bg-sidebar-accent`               | hover/active 아이템 배경   |
| `--sidebar-accent-foreground`  | `oklch(0.205 0 0)`       | `text-sidebar-accent-foreground`  | hover/active 아이템 텍스트 |
| `--sidebar-border`             | `oklch(0.922 0.004 264)` | `border-sidebar-border`           | 사이드바 내 구분선         |
| `--sidebar-ring`               | `#FF5E32`                | `ring-sidebar-ring`               | 사이드바 내 focus ring     |
| `--sidebar-muted-foreground`   | `oklch(0.556 0 0)`       | `text-sidebar-muted-foreground`   | 사이드바 보조 텍스트       |

> **White Sidebar**: 화이트(`#FFFFFF`) 배경 사이드바, `border-r`로 콘텐츠 영역과 구분. 기본 폭 220px, 접힘 시 64px.

### 2.3 Tier (등급)

| CSS Variable        | Light Value             | Tailwind Class       | Emoji | Usage                   |
| ------------------- | ----------------------- | -------------------- | ----- | ----------------------- |
| `--tier-diamond`    | `oklch(0.65 0.18 295)`  | `text-tier-diamond`  | 💎    | Diamond 등급 (바이올렛) |
| `--tier-diamond-bg` | `oklch(0.94 0.04 295)`  | `bg-tier-diamond-bg` | —     | Diamond 배지 배경       |
| `--tier-gold`       | `oklch(0.75 0.15 85)`   | `text-tier-gold`     | 🥇    | Gold 등급 (앰버)        |
| `--tier-gold-bg`    | `oklch(0.95 0.04 85)`   | `bg-tier-gold-bg`    | —     | Gold 배지 배경          |
| `--tier-silver`     | `oklch(0.55 0.02 264)`  | `text-tier-silver`   | 🥈    | Silver 등급 (쿨 그레이) |
| `--tier-silver-bg`  | `oklch(0.95 0.005 264)` | `bg-tier-silver-bg`  | —     | Silver 배지 배경        |
| `--tier-bronze`     | `oklch(0.60 0.12 55)`   | `text-tier-bronze`   | 🥉    | Bronze 등급 (코퍼)      |
| `--tier-bronze-bg`  | `oklch(0.95 0.03 55)`   | `bg-tier-bronze-bg`  | —     | Bronze 배지 배경        |

### 2.4 Seat (좌석 상태)

| CSS Variable       | Light Value            | Tailwind Class        | Usage            |
| ------------------ | ---------------------- | --------------------- | ---------------- |
| `--seat-available` | `oklch(0.60 0.17 152)` | `text-seat-available` | 선택 가능 (초록) |
| `--seat-selected`  | `oklch(0.55 0.2 260)`  | `text-seat-selected`  | 내 선택 (파랑)   |
| `--seat-taken`     | `oklch(0.65 0.02 264)` | `text-seat-taken`     | 판매 완료 (회색) |
| `--seat-locked`    | `oklch(0.80 0.15 85)`  | `text-seat-locked`    | 타인 점유 (노랑) |

배경 사용 시: `bg-seat-available`, `bg-seat-selected`, `bg-seat-taken`, `bg-seat-locked`

### 2.5 Booking Status (예매 상태)

| CSS Variable         | Light Value           | Tailwind Class          | Usage                      |
| -------------------- | --------------------- | ----------------------- | -------------------------- |
| `--booking-open`     | `#FF5E32`             | `text-booking-open`     | 예매 오픈 (primary 오렌지) |
| `--booking-upcoming` | `oklch(0.55 0.2 260)` | `text-booking-upcoming` | 오픈 예정 (블루)           |
| `--booking-soldout`  | `oklch(0.556 0 0)`    | `text-booking-soldout`  | 매진 (회색)                |
| `--booking-closed`   | `oklch(0.708 0 0)`    | `text-booking-closed`   | 종료 (연회색)              |

### 2.6 Transfer Status (양도 상태)

| CSS Variable           | Light Value            | Tailwind Class            | Usage                 |
| ---------------------- | ---------------------- | ------------------------- | --------------------- |
| `--transfer-listed`    | `oklch(0.55 0.2 260)`  | `text-transfer-listed`    | 등록 중 (블루)        |
| `--transfer-sold`      | `oklch(0.55 0.17 152)` | `text-transfer-sold`      | 판매/양도 완료 (그린) |
| `--transfer-cancelled` | `oklch(0.556 0 0)`     | `text-transfer-cancelled` | 취소됨 (회색)         |

### 2.7 System Feedback

| CSS Variable | Light Value             | Tailwind Class | Usage                  |
| ------------ | ----------------------- | -------------- | ---------------------- |
| `--success`  | `oklch(0.55 0.17 152)`  | `text-success` | 성공 피드백, VQA 정답  |
| `--warning`  | `oklch(0.75 0.15 85)`   | `text-warning` | 경고, 타이머 1분 남음  |
| `--danger`   | `oklch(0.577 0.245 27)` | `text-danger`  | 에러, 타이머 30초 남음 |
| `--info`     | `oklch(0.55 0.2 260)`   | `text-info`    | 안내 메시지            |

### 2.8 Face Value Comparison (정가 대비)

| Range       | Color Token | Usage                            |
| ----------- | ----------- | -------------------------------- |
| ≤ 100%      | `--success` | 정가 이하 (초록)                 |
| 101% ~ 130% | `--warning` | 정가 초과 주의 (앰버)            |
| > 130%      | `--danger`  | 정가 대비 과도 (빨강, 검토 대상) |

---

## 3. Typography Scale

**Font Family**: `'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif`
**Timer Font**: `'JetBrains Mono', 'SF Mono', 'Fira Code', monospace`
**Letter Spacing**: `-0.015em` (전역, body에 적용)

### Title (leading-tight)

| Token | Size | Weight         | Tailwind                  | Usage                    |
| ----- | ---- | -------------- | ------------------------- | ------------------------ |
| T1    | 24px | Bold (700)     | `text-2xl font-bold`      | 페이지 타이틀, 가격 총합 |
| T2    | 20px | SemiBold (600) | `text-xl font-semibold`   | 섹션 헤더, 이벤트 제목   |
| T3    | 18px | SemiBold (600) | `text-lg font-semibold`   | 카드 제목, 아티스트명    |
| T4    | 16px | SemiBold (600) | `text-base font-semibold` | 사이드바 섹션 라벨       |

### Body (leading-normal)

| Token | Size | Weight        | Tailwind              | Usage                  |
| ----- | ---- | ------------- | --------------------- | ---------------------- |
| B1    | 16px | Regular (400) | `text-base`           | 본문 텍스트, VQA 질문  |
| B2    | 14px | Medium (500)  | `text-sm font-medium` | Button, 카드 상세 정보 |
| B3    | 14px | Regular (400) | `text-sm`             | Input, 필드 값         |
| B4    | 13px | Regular (400) | `text-[13px]`         | 보조 텍스트, 설명      |

### Caption (leading-tight)

| Token | Size | Weight         | Tailwind                  | Usage                          |
| ----- | ---- | -------------- | ------------------------- | ------------------------------ |
| C1    | 12px | SemiBold (600) | `text-xs font-semibold`   | Badge 라벨, 상태 텍스트        |
| C2    | 12px | Medium (500)   | `text-xs font-medium`     | 타임스탬프, 메타데이터, 잔여석 |
| C3    | 11px | Regular (400)  | `text-[11px]`             | 캡션, 힌트, 범례 텍스트        |
| C4    | 10px | Medium (500)   | `text-[10px] font-medium` | 키보드 힌트, 마이크로 라벨     |

### Timer (monospace)

| Token    | Size | Weight         | Tailwind                          | Usage                               |
| -------- | ---- | -------------- | --------------------------------- | ----------------------------------- |
| Timer-lg | 28px | Bold (700)     | `text-[28px] font-bold font-mono` | 좌석 선택 타이머 (MM:SS)            |
| Timer-md | 20px | SemiBold (600) | `text-xl font-semibold font-mono` | VQA 질문 타이머                     |
| Timer-sm | 14px | Medium (500)   | `text-sm font-medium font-mono`   | 버튼 내 카운트다운, 인증코드 타이머 |

---

## 4. Spacing, Radius & Shadows

### Border Radius

| Token | Value                       | Tailwind       | Usage                         |
| ----- | --------------------------- | -------------- | ----------------------------- |
| sm    | `calc(var(--radius) - 4px)` | `rounded-sm`   | 뱃지 내부, 작은 요소          |
| md    | `calc(var(--radius) - 2px)` | `rounded-md`   | 버튼, 인풋                    |
| lg    | `var(--radius)`             | `rounded-lg`   | 카드, 패널                    |
| xl    | `calc(var(--radius) + 4px)` | `rounded-xl`   | 모달, 좌석맵 영역             |
| 2xl   | `calc(var(--radius) + 8px)` | `rounded-2xl`  | 히어로 배너, 큰 카드          |
| full  | 9999px                      | `rounded-full` | 아바타, pill badge, 좌석 원형 |

### Shadows

> **원칙: Border 기반 분리를 우선하고, 깊이감이 필요한 경우에만 shadow 사용.**

| Token   | Tailwind    | Usage                 |
| ------- | ----------- | --------------------- |
| xs      | `shadow-xs` | 미세한 구분 (버튼)    |
| sm      | `shadow-sm` | 카드 기본             |
| default | `shadow`    | 드롭다운, 큐 오버레이 |
| md      | `shadow-md` | 호버 시 카드 승격     |
| lg      | `shadow-lg` | 모달, 사이드바        |
| xl      | `shadow-xl` | 큐 상태 카드 오버레이 |

### Z-Index Layers

| Z-Index | Tailwind | Usage                             |
| ------- | -------- | --------------------------------- |
| 0       | `z-0`    | Content Area                      |
| 10      | `z-10`   | GNB Sidebar / Top Bar             |
| 20      | `z-20`   | Booking Left Panel                |
| 30      | `z-30`   | Queue Overlay Card                |
| 40      | `z-40`   | Modal / VQA Modal / Payment Modal |
| 50      | `z-50`   | Toast Notification                |

---

## 5. Component Catalog

### 5.1 TierBadge

**File**: `src/components/urr/TierBadge.tsx`

| Prop        | Type                        | Default     | Description                                        |
| ----------- | --------------------------- | ----------- | -------------------------------------------------- |
| `tier`      | `TierLevel`                 | required    | `'diamond' \| 'gold' \| 'silver' \| 'bronze'`      |
| `size`      | `'default' \| 'sm' \| 'lg'` | `'default'` | 뱃지 크기                                          |
| `showLabel` | `boolean`                   | `true`      | `false`: 이모지만 표시 (접근성 주의: tooltip 필요) |
| `className` | `string`                    | —           | 추가 클래스                                        |

**Display**:

- default: Emoji + text label in pill (`bg-tier-*-bg text-tier-*`)
- sm: 작은 pill, 12px 텍스트
- lg: 큰 pill, 16px 텍스트, 사이드바 프로필 영역

**Accessibility Rule**: 이모지만 표시할 때는 반드시 `aria-label` 또는 tooltip 제공. TierBadge는 **읽기 전용** — 절대 클릭 불가.

```tsx
<TierBadge tier="diamond" />              // 💎 Diamond
<TierBadge tier="gold" size="sm" />       // 🥇 Gold (작은 크기)
<TierBadge tier="bronze" showLabel={false} /> // 🥉 (이모지만, tooltip)
```

### 5.2 BookingStatusBadge

**File**: `src/components/urr/BookingStatusBadge.tsx`

| Prop        | Type            | Default  | Description                                     |
| ----------- | --------------- | -------- | ----------------------------------------------- |
| `status`    | `BookingStatus` | required | `'open' \| 'upcoming' \| 'soldout' \| 'closed'` |
| `className` | `string`        | —        | 추가 클래스                                     |

**스타일**:

- open: `bg-booking-open/10 text-booking-open` filled pill
- upcoming: `bg-booking-upcoming/10 text-booking-upcoming` outline pill
- soldout: `bg-muted text-muted-foreground` muted pill
- closed: `bg-muted text-muted-foreground` muted pill (더 연한 톤)

**Labels**: `{ open: '예매 오픈', upcoming: '오픈 예정', soldout: '매진', closed: '종료' }`

```tsx
<BookingStatusBadge status="open" />     // 예매 오픈 (primary pill)
<BookingStatusBadge status="soldout" />  // 매진 (회색 pill)
```

### 5.3 TransferStatusBadge

**File**: `src/components/urr/TransferStatusBadge.tsx`

| Prop        | Type             | Default  | Description                                        |
| ----------- | ---------------- | -------- | -------------------------------------------------- |
| `status`    | `TransferStatus` | required | `'listed' \| 'sold' \| 'completed' \| 'cancelled'` |
| `className` | `string`         | —        | 추가 클래스                                        |

**스타일**:

- listed: `bg-transfer-listed/10 text-transfer-listed` + dot
- sold: `bg-transfer-sold/10 text-transfer-sold` + dot
- completed: `bg-transfer-sold/10 text-transfer-sold` + dot (sold과 동일 색상)
- cancelled: `bg-muted text-muted-foreground` + dot

**Labels**: `{ listed: '등록 중', sold: '판매 완료', completed: '양도 완료', cancelled: '취소됨' }`

```tsx
<TransferStatusBadge status="listed" />     // ● 등록 중
<TransferStatusBadge status="completed" />  // ● 양도 완료
```

### 5.4 SeatStatusLegend

**File**: `src/components/urr/SeatStatusLegend.tsx`

| Prop        | Type      | Default | Description                     |
| ----------- | --------- | ------- | ------------------------------- |
| `className` | `string`  | —       | 추가 클래스                     |
| `compact`   | `boolean` | `false` | true: 축소 형태 (아이콘+라벨만) |

4개 상태를 수평 나열: 원형 dot + 라벨

- 🟢 선택 가능 (`bg-seat-available`)
- 🔵 내 선택 (`bg-seat-selected`)
- ⚫ 판매 완료 (`bg-seat-taken`)
- 🟡 타인 점유 (`bg-seat-locked`)

**Usage Rule**: 좌석맵이 표시되는 모든 상태에서 SeatStatusLegend 포함 필수 (색상만으로 정보 전달 금지).

```tsx
<SeatStatusLegend />
<SeatStatusLegend compact />  // 접힘 가능한 범례
```

### 5.5 TimerDisplay

**File**: `src/components/urr/TimerDisplay.tsx`

| Prop        | Type                        | Default     | Description      |
| ----------- | --------------------------- | ----------- | ---------------- |
| `seconds`   | `number`                    | required    | 남은 초          |
| `size`      | `'default' \| 'sm' \| 'lg'` | `'default'` | 크기             |
| `showIcon`  | `boolean`                   | `true`      | 시계 아이콘 표시 |
| `className` | `string`                    | —           | 추가 클래스      |

**Color Logic** (자동 적용):

- `> 60s`: `text-foreground` (기본)
- `≤ 60s`: `text-warning` (앰버, 300ms transition)
- `≤ 30s`: `text-danger` (빨강, 300ms transition + 1s scale pulse)

**Format**: `MM:SS` (monospace font, JetBrains Mono)

**Pulse Animation** (30초 이하):

```css
@keyframes pulse-timer {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
```

```tsx
<TimerDisplay seconds={147} />          // 2:27 (기본 색상)
<TimerDisplay seconds={45} />           // 0:45 (앰버)
<TimerDisplay seconds={15} size="lg" /> // 0:15 (빨강 + 펄스)
```

### 5.6 PriceDisplay

**File**: `src/components/urr/PriceDisplay.tsx`

| Prop           | Type                        | Default     | Description |
| -------------- | --------------------------- | ----------- | ----------- |
| `amount`       | `number`                    | required    | 금액 (원)   |
| `size`         | `'default' \| 'sm' \| 'lg'` | `'default'` | 크기        |
| `showCurrency` | `boolean`                   | `true`      | ₩ 기호 표시 |
| `className`    | `string`                    | —           | 추가 클래스 |

**Format**: `₩{comma-separated}` — e.g., `₩165,000`

- `Intl.NumberFormat('ko-KR').format(amount)` 사용
- lg: 24px bold, default: 16px semibold, sm: 14px medium

```tsx
<PriceDisplay amount={165000} />             // ₩165,000
<PriceDisplay amount={332000} size="lg" />   // ₩332,000 (대형)
```

### 5.7 FaceValueBadge

**File**: `src/components/urr/FaceValueBadge.tsx`

| Prop         | Type     | Default  | Description             |
| ------------ | -------- | -------- | ----------------------- |
| `percentage` | `number` | required | 정가 대비 % (e.g., 105) |
| `className`  | `string` | —        | 추가 클래스             |

**Color Logic**:

- `≤ 100`: `text-success` + `bg-success/10` — "정가 대비 95%"
- `101 ~ 130`: `text-warning` + `bg-warning/10` — "정가 대비 115%"
- `> 130`: `text-danger` + `bg-danger/10` — "정가 대비 145%"

```tsx
<FaceValueBadge percentage={95} />   // 정가 대비 95% (초록)
<FaceValueBadge percentage={115} />  // 정가 대비 115% (앰버)
<FaceValueBadge percentage={145} />  // 정가 대비 145% (빨강)
```

### 5.8 EventCard

**File**: `src/components/urr/EventCard.tsx`

| Prop        | Type                     | Default     | Description   |
| ----------- | ------------------------ | ----------- | ------------- |
| `event`     | `Event`                  | required    | 이벤트 데이터 |
| `variant`   | `'default' \| 'compact'` | `'default'` | 카드 변형     |
| `className` | `string`                 | —           | 추가 클래스   |

**Layout (default)**:

- 가로 배치: 포스터 썸네일 (100px, rounded-lg) | 텍스트 영역
- 텍스트: 이벤트 제목 (T3) + 아티스트명 (B4, muted) + 날짜 + 장소 (B3)
- 우측 상단: BookingStatusBadge
- hover: `shadow-sm → shadow-md` + `translateY(-1px)` (150ms)
- Click: 이벤트 페이지로 이동

**Layout (compact)**: 세로 배치 — 포스터 상단 + 텍스트 하단 (카드 그리드용)

```tsx
<EventCard event={sampleEvent} />
<EventCard event={sampleEvent} variant="compact" />
```

### 5.9 ArtistCard

**File**: `src/components/urr/ArtistCard.tsx`

| Prop        | Type                     | Default     | Description                        |
| ----------- | ------------------------ | ----------- | ---------------------------------- |
| `artist`    | `Artist`                 | required    | 아티스트 데이터                    |
| `selected`  | `boolean`                | `false`     | 선택 상태 (온보딩 아티스트 선택용) |
| `variant`   | `'default' \| 'compact'` | `'default'` | 카드 변형                          |
| `onClick`   | `() => void`             | —           | 클릭 핸들러                        |
| `className` | `string`                 | —           | 추가 클래스                        |

**Layout (default)**: 세로 — 아바타 (80px circle) + 이름 (B2 medium) + 팔로워수 (C2 muted)
**Layout (compact)**: 가로 — 아바타 (48px) + 이름 + 팔로워수
**Selected**: accent border + accent bg tint + 체크마크 오버레이 on avatar

```tsx
<ArtistCard artist={gdragon} />
<ArtistCard artist={gdragon} selected onClick={handleToggle} />
```

### 5.10 TicketCard

**File**: `src/components/urr/TicketCard.tsx`

| Prop         | Type                        | Default      | Description          |
| ------------ | --------------------------- | ------------ | -------------------- |
| `ticket`     | `Ticket & { event: Event }` | required     | 티켓 + 이벤트 데이터 |
| `variant`    | `'upcoming' \| 'past'`      | `'upcoming'` | 카드 스타일          |
| `onViewQR`   | `() => void`                | —            | QR 보기 클릭         |
| `onTransfer` | `() => void`                | —            | 양도 등록 클릭       |
| `className`  | `string`                    | —            | 추가 클래스          |

**Layout**: 가로 — 포스터 썸네일 | 이벤트 정보 + 좌석 정보 | 액션 버튼

- 이벤트: 제목 (T4) + 날짜 + 장소 (B4)
- 좌석: "A구역 3열 15번" (B2, medium)
- 버튼 (upcoming): [QR 보기] primary + [양도 등록] secondary
- past variant: 전체 opacity-60, 버튼 없음

```tsx
<TicketCard ticket={myTicket} onViewQR={openQR} onTransfer={openTransfer} />
<TicketCard ticket={pastTicket} variant="past" />
```

### 5.11 TransferCard

**File**: `src/components/urr/TransferCard.tsx`

| Prop        | Type                                 | Default  | Description        |
| ----------- | ------------------------------------ | -------- | ------------------ |
| `listing`   | `TransferListing & { event: Event }` | required | 양도 리스팅 데이터 |
| `onClick`   | `() => void`                         | —        | 클릭 핸들러        |
| `className` | `string`                             | —        | 추가 클래스        |

**Layout**: 카드 그리드 아이템

- 포스터 썸네일 (작은 크기, 좌상단)
- 콘서트명 + 날짜 (B3)
- 구역 + 좌석 (B2, medium)
- 가격 (T4, bold) + FaceValueBadge
- 판매자: TierBadge (sm) + "거래 N회" (C2)
- hover: `shadow-sm → shadow-md`, accent border subtle

```tsx
<TransferCard listing={sampleListing} onClick={openDetail} />
```

### 5.12 NotificationCard

**File**: `src/components/urr/NotificationCard.tsx`

| Prop           | Type           | Default  | Description    |
| -------------- | -------------- | -------- | -------------- |
| `notification` | `Notification` | required | 알림 데이터    |
| `isUnread`     | `boolean`      | `false`  | 읽지 않음 표시 |
| `onClick`      | `() => void`   | —        | 클릭 핸들러    |
| `className`    | `string`       | —        | 추가 클래스    |

**Layout**: 가로 — 타입 아이콘 (40px) | 제목 (B2 bold) + 설명 (B4 muted) | 타임스탬프 (C2)

- Unread: 좌측 blue dot (8px) + 제목 bold 처리
- hover: `bg-accent/50`

**Type Icons**: 🎫 예매, 🔄 양도, ⬆️ 등급, ✅ 결제, ⚠️ 만료

```tsx
<NotificationCard notification={sample} isUnread />
```

### 5.13 QueueStatusCard

**File**: `src/components/urr/QueueStatusCard.tsx`

| Prop            | Type     | Default  | Description           |
| --------------- | -------- | -------- | --------------------- |
| `position`      | `number` | required | 대기 순번             |
| `totalInQueue`  | `number` | required | 전체 대기자           |
| `estimatedWait` | `string` | required | 예상 대기 시간 텍스트 |
| `probability`   | `number` | required | 성공 확률 (0-100)     |
| `className`     | `string` | —        | 추가 클래스           |

**Layout**: 반투명 카드 (`bg-white/90 backdrop-blur`, `shadow-xl`, `rounded-xl`)

- "대기 중" 헤더 (B2)
- 순번: `#47` (T1 36px bold, primary color) + `/ 1,200명` (B3 muted)
- 예상 대기: Clock 아이콘 + 시간 (B2)
- 성공 확률: 퍼센트 + 컬러 인디케이터
  - `≥ 60%`: `text-success`
  - `20% ~ 59%`: `text-warning`
  - `< 20%`: `text-danger` + "양도 마켓을 확인해보세요" 링크

```tsx
<QueueStatusCard
  position={47}
  totalInQueue={1200}
  estimatedWait="2분 15초"
  probability={92}
/>
```

---

## 6. Layout Patterns

### 6.1 App Shell (GNB Sidebar + Content)

```
┌────────────┬──────────────────────────────────────┐
│ GNB Sidebar│  Top Bar (56px)                      │
│ (220px)    ├──────────────────────────────────────┤
│ White BG   │                                      │
│            │  Content Area                        │
│ [URR Logo] │  (flex-1, overflow-y-auto)           │
│ [멤버십]   │  max-width: 1200px (일반 페이지)      │
│            │  full-width (예매 페이지)             │
│ 홈         │                                      │
│ 공연       │                                      │
│ 아티스트   │                                      │
│ ──────── │                                      │
│ MY ARTISTS │                                      │
│  ▾ GDragon │                                      │
│    홈      │                                      │
│    공연    │                                      │
│    양도    │                                      │
│  ▸ BTS     │                                      │
│  ▸ aespa   │                                      │
│ ──────── │                                      │
│ 👤 Profile │                                      │
└────────────┴──────────────────────────────────────┘
```

**구조 원칙:**

- **GNB Sidebar**: full viewport height, white 배경 (`bg-sidebar`), 220px 기본 / 64px 접힘, `border-r` 구분
- **Top Bar**: Content Area 상단 고정 (`h-14`, `border-b`), 브레드크럼 + 검색/알림 아이콘
- **Content Area**: flex-1, scrollable, 페이지별 max-width 제어
- **Onboarding**: Sidebar/TopBar 없이 풀스크린
- **Booking**: Sidebar 자동 접힘 (64px), Left Panel + Right Main 2-Panel 레이아웃

### 6.2 Booking Page (2-Panel)

```
┌──────┬──────────────────┬──────────────────────────┐
│ Side │ Left Panel       │ Right Main               │
│ bar  │ (360px,          │ (flex-1)                 │
│ 64px │  collapsible     │                          │
│      │  → 48px)         │  Seat Map Area (~65%)    │
│      │                  │                          │
│      │ [Poster]         │                          │
│      │ Event Info       ├──────────────────────────┤
│      │ Date Dropdown    │                          │
│      │ Price Table      │  Section List / Info     │
│      │ Tier Schedule    │  Panel (~35%)            │
│      │ My Tier          │                          │
│      │ [Book Now]       │                          │
│      │                  │                          │
└──────┴──────────────────┴──────────────────────────┘
```

**Left Panel**: sticky, scrollable, collapse toggle (`«/»`)
**Right Main**: state machine (idle → vqa → queue → seats → payment → confirmation)
**Immersive Mode**: Sidebar=64px, Left Panel=collapsible, 좌석맵 최대화

### 6.3 Routing Structure

```
/                         → Home
/search                   → Search
/events                   → Global Events
/artists                  → Artist Directory
/artists/:artistId        → Artist Page (tabs: home/events/transfer)
/events/:eventId          → Booking Page (2-Panel)
/my-page                  → My Page (tabs: membership/wallet/transfers)
/notifications            → Notifications
/onboarding               → Onboarding (full-screen, no sidebar)
```

네비게이션 active 상태는 React Router `useLocation()` URL 기반 판단.

### 6.4 Animation Patterns

> **원칙: CSS/Tailwind transition만 사용. Framer Motion은 필요 시 허용하되 최소 사용.**

| 인터랙션             | 방법                                       | Duration       |
| -------------------- | ------------------------------------------ | -------------- |
| 사이드바 접기/펼기   | `transition-[width] duration-250 ease-out` | 250ms          |
| Left Panel 접기/펼기 | `transition-[width] duration-200 ease-out` | 200ms          |
| 페이지 전환          | `fade-in opacity transition`               | 150ms          |
| 모달 열기            | `fade + scale(0.95→1)`                     | 200ms ease-out |
| 모달 닫기            | `fade + scale(1→0.95)`                     | 150ms ease-in  |
| 카드 호버            | `shadow + translateY(-1px)`                | 150ms          |
| 탭 전환              | `fade crossfade`                           | 150ms          |
| 아티스트 서브메뉴    | `grid-rows-[0fr]/[1fr]` transition         | 200ms          |
| Chevron 회전         | `transition-transform rotate-90`           | 200ms          |
| VQA 정답             | Green background flash                     | 300ms          |
| VQA 오답             | Red flash + shake (±3px, 3회)              | 400ms          |
| 큐 순번 업데이트     | Number counter roll                        | 500ms          |
| 좌석 호버            | Border highlight + tooltip fade            | 100ms          |
| 좌석 선택            | Fill color transition (green→blue)         | 150ms          |
| 타이머 색상 변경     | Smooth color transition                    | 300ms          |
| 타이머 펄스 (30초↓)  | Scale 1→1.05→1 loop                        | 1s loop        |
| 결제 성공 컨페티     | Particle burst (canvas-confetti)           | 800ms          |
| 토스트 진입          | Slide from right                           | 300ms ease-out |
| 토스트 퇴장          | Fade out                                   | 200ms ease-in  |
| 토스트 자동 해제     | —                                          | 5s visible     |
| 히어로 배너 전환     | Crossfade                                  | 500ms          |
| 온보딩 스텝 전환     | Slide left/right                           | 300ms          |
| 스켈레톤 시머        | Gradient sweep L→R                         | 1.5s loop      |
| 툴팁 표시            | Fade-in (300ms delay 후)                   | 150ms          |
| 툴팁 숨김            | Fade-out                                   | 100ms          |

### 6.5 State Management

**Booking State Machine** (React Context + useReducer):

```typescript
type BookingState =
  | "idle"
  | "vqa"
  | "queue"
  | "seats-section"
  | "seats-individual"
  | "payment"
  | "confirmation";

interface BookingContext {
  state: BookingState;
  selectedDate: string | null;
  selectedSeats: Seat[];
  timerSeconds: number;
  queuePosition: number | null;
  vqaAttempts: number;
}
```

**Layout State** (React Context):

```typescript
interface LayoutState {
  sidebarState: "expanded" | "collapsed";
  leftPanelState: "expanded" | "collapsed"; // Booking only
  expandedArtistIds: Set<string>;
}
```

---

## 7. Icon System

### Domain Icons (Lucide)

| Context   | Icon                           | Usage                          |
| --------- | ------------------------------ | ------------------------------ |
| 홈        | `Home`                         | 사이드바 홈 메뉴               |
| 공연      | `Calendar`                     | 사이드바 공연 메뉴             |
| 아티스트  | `Users`                        | 사이드바 아티스트 메뉴         |
| 검색      | `Search`                       | Top Bar 검색 아이콘, 검색 인풋 |
| 알림      | `Bell`                         | Top Bar 알림 아이콘            |
| 좌석      | `MapPin`                       | 좌석/장소 정보                 |
| 타이머    | `Clock`                        | 카운트다운 아이콘              |
| QR        | `QrCode`                       | QR 코드 버튼                   |
| 양도      | `ArrowLeftRight`               | 양도 마켓 아이콘               |
| 멤버십    | `Crown`                        | 멤버십 상태                    |
| 멜론 연동 | `Music`                        | 멜론 연동 버튼                 |
| 설정      | `Settings`                     | 설정/관리                      |
| 체크      | `Check`                        | 선택 완료, 약관 동의           |
| 닫기      | `X`                            | 모달 닫기, 해제                |
| 접기/펼기 | `ChevronLeft` / `ChevronRight` | 사이드바/패널 토글             |
| 서브메뉴  | `ChevronDown` / `ChevronRight` | 아코디언                       |
| 팔로우    | `Heart` / `HeartOff`           | 아티스트 팔로우                |
| 결제      | `CreditCard`                   | 결제 관련                      |
| 성공      | `CheckCircle`                  | 성공 피드백                    |
| 에러      | `AlertCircle`                  | 에러 피드백                    |
| 경고      | `AlertTriangle`                | 경고 피드백                    |

### Tier Emojis

| Tier    | Emoji | Usage                         |
| ------- | ----- | ----------------------------- |
| Diamond | 💎    | TierBadge, 프로필, 큐, 수수료 |
| Gold    | 🥇    | TierBadge, 프로필, 큐, 수수료 |
| Silver  | 🥈    | TierBadge, 프로필, 큐, 수수료 |
| Bronze  | 🥉    | TierBadge, 프로필, 큐, 수수료 |

**Rule**: Tier emoji는 항상 text label과 함께 사용 (접근성). emoji 단독 사용 금지.

---

## 8. Type System

### 8.1 Domain Types

**File**: `src/types/index.ts`

```typescript
// === Enums & Literals ===

type TierLevel = "diamond" | "gold" | "silver" | "bronze";
type BookingStatus = "open" | "upcoming" | "soldout" | "closed";
type TransferStatus = "listed" | "sold" | "completed" | "cancelled";
type SeatStatus = "available" | "selected" | "taken" | "locked";
type BookingState =
  | "idle"
  | "vqa"
  | "queue"
  | "seats-section"
  | "seats-individual"
  | "payment"
  | "confirmation";
type NotificationType =
  | "booking"
  | "transfer"
  | "tier"
  | "payment"
  | "membership";

// === Domain Entities ===

interface Artist {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  bio: string;
  followerCount: number;
  category: "boygroup" | "girlgroup" | "solo" | "band";
}

interface Event {
  id: string;
  artistId: string;
  title: string;
  venue: string;
  dates: EventDate[];
  poster: string;
  status: BookingStatus;
}

interface EventDate {
  id: string;
  date: string; // ISO
  bookingWindows: TierWindow[];
  totalSeats: number;
  remainingSeats: number;
}

interface TierWindow {
  tier: TierLevel;
  opensAt: string; // ISO
  fee: number; // ₩
}

interface Section {
  id: string;
  name: string;
  price: number;
  totalSeats: number;
  remainingSeats: number;
}

interface Seat {
  id: string;
  sectionId: string;
  row: string;
  number: string;
  status: SeatStatus;
}

interface Ticket {
  id: string;
  eventId: string;
  section: string;
  row: string;
  seatNumber: string;
  price: number;
  tierFee: number;
  qrCode: string;
  isTransferable: boolean;
  isUpcoming: boolean;
}

interface TransferListing {
  id: string;
  ticketId: string;
  eventId: string;
  sellerId: string;
  sellerTier: TierLevel;
  sellerTransactionCount: number;
  price: number;
  faceValue: number;
  section: string;
  seatInfo: string;
  status: TransferStatus;
  createdAt: string;
}

interface Membership {
  id: string;
  artistId: string;
  artistName: string;
  tier: TierLevel;
  expiresAt: string;
  isActive: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: TierLevel;
  memberships: Membership[];
  followedArtistIds: string[];
}

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  link: string;
}

interface VQAQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}
```

### 8.2 Label Constants

```typescript
const TIER_LABELS: Record<TierLevel, string> = {
  diamond: "Diamond",
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
};

const TIER_EMOJIS: Record<TierLevel, string> = {
  diamond: "💎",
  gold: "🥇",
  silver: "🥈",
  bronze: "🥉",
};

const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  open: "예매 오픈",
  upcoming: "오픈 예정",
  soldout: "매진",
  closed: "종료",
};

const TRANSFER_STATUS_LABELS: Record<TransferStatus, string> = {
  listed: "등록 중",
  sold: "판매 완료",
  completed: "양도 완료",
  cancelled: "취소됨",
};

const SEAT_STATUS_LABELS: Record<SeatStatus, string> = {
  available: "선택 가능",
  selected: "내 선택",
  taken: "판매 완료",
  locked: "타인 점유",
};
```

---

## 9. shadcn/ui Base Components

현재 설치: `button`, `badge`, `card`, `input`, `tabs`, `avatar`, `separator`, `tooltip`, `skeleton`, `progress`

### 추가 필요 컴포넌트

| Component     | shadcn name     | Key Usage                                       |
| ------------- | --------------- | ----------------------------------------------- |
| Badge         | `badge`         | BookingStatusBadge, TransferStatusBadge 베이스  |
| Card          | `card`          | EventCard, ArtistCard, TicketCard, TransferCard |
| Dialog        | `dialog`        | VQA 모달, 에러 모달, QR 오버레이                |
| Dropdown Menu | `dropdown-menu` | 날짜 선택, 필터                                 |
| Input         | `input`         | 검색, 가격 입력, 인증코드                       |
| Checkbox      | `checkbox`      | 약관 동의                                       |
| Select        | `select`        | 통신사 선택, 날짜 선택                          |
| Tabs          | `tabs`          | 아티스트 페이지, My Page, 온보딩 카테고리       |
| Tooltip       | `tooltip`       | 좌석 호버, 정보 팁                              |
| Separator     | `separator`     | 사이드바 구분선                                 |
| Avatar        | `avatar`        | 아티스트, 유저 프로필                           |
| Sonner        | `sonner`        | Toast 알림 (shadcn toast 대신 sonner 사용)      |
| Skeleton      | `skeleton`      | 로딩 상태                                       |
| Progress      | `progress`      | VQA 진행, 온보딩 진행                           |
| Sheet         | `sheet`         | 모바일 미지원이지만 사이드 패널 대안            |
| Popover       | `popover`       | 필터 드롭다운                                   |

설치 명령: `npx shadcn@latest add <component-name>`

---

## 10. Rules (Do's & Don'ts)

### Do

- CSS 변수 토큰만 사용 (`bg-primary`, `text-tier-diamond`, `bg-seat-available` 등)
- 컴포넌트 variant는 CVA (class-variance-authority)로 정의
- 클래스 병합은 `cn()` (`src/lib/utils.ts`)
- 도메인 컴포넌트는 `src/components/urr/`에 생성하고 `index.ts` barrel export
- 레이아웃 컴포넌트는 `src/components/layout/`에 생성하고 `index.ts` barrel export
- shadcn/ui 기존 컴포넌트 우선 활용 → 커스텀은 최후 수단
- 모든 가격은 `₩{comma}` 형식 사용 (`Intl.NumberFormat`)
- TierBadge는 항상 emoji + text label 함께 사용 (접근성)
- 타이머는 반드시 monospace 폰트 (JetBrains Mono)
- 좌석맵에는 반드시 SeatStatusLegend 포함 (색상만으로 정보 전달 금지)
- 에러 메시지는 한국어, 인간적, 복구 액션 포함
- 애니메이션은 CSS transition 우선, `will-change` 활용
- `prefers-reduced-motion` 미디어 쿼리 지원

### Don't

- 하드코딩 색상값 사용 금지 (e.g., `bg-violet-500`, `#7C3AED`)
- 등급/좌석/상태 외 장식적 색상 사용 금지
- TierBadge를 클릭 가능하게 만들기 금지 (읽기 전용)
- 모바일 반응형 구현 금지 (데스크톱 전용)
- 다크 모드 구현 금지 (라이트 모드 전용)
- Framer Motion 대규모 사용 금지 → CSS transition 우선
- flex gap으로 메타데이터 정렬 금지 → grid 고정 열 사용
- Lucide 외 아이콘 라이브러리 추가 금지
- 사이드바 위에 수평 헤더 행 배치 금지
- 하나의 state에 여러 primary CTA 배치 금지 (1 state = 1 primary action)

---

## Source References

- **PRD**: `Docs/prd.md` v1.1
- **UX Spec**: `Docs/prd-ux-spec.md` (6-pass)
- **UX Brainstorming**: `Docs/ux-brainstorming.md`
- **Build Prompts**: `Docs/building-order-prompts.md` (17 prompts)
- **Design Reference**: Suno AI (layout) + shadcn/ui (components)
- **Constraints**: Tailwind v4 + shadcn/ui (New York)
