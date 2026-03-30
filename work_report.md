# 작업 보고서 — 아티스트 데이터 정책 표준화 및 콘서트 섹션 방어 코드

**브랜치**: `design/concert-image-guard`
**기준 브랜치**: `main`
**작업일**: 2026-03-30
**변경 파일 수**: 4개 (+본 보고서)

---

## 배경 및 목적

아티스트별 데이터 구조 불일치로 인한 런타임 에러·레이아웃 깨짐 위험을 해소하고,
콘서트 섹션이 아티스트 대표 이미지 없이도 렌더링되는 문제를 방어 코드로 차단한다.

---

## 변경 요약 (5가지 요구사항 대응)

| # | 요구사항 | 대응 방식 | 변경 파일 |
|---|---------|----------|----------|
| 1 | 아티스트별 폴더 구조 표준화 | ID 13~18 avatar에 `/recommend/` 이미지 할당 | `artists.ts` |
| 2 | 콘서트 섹션 대표 이미지 등록 시에만 활성화 | `hasRepresentativeImage` 플래그 전파 | `ArtistDetailWidget.tsx`, `ArtistEventsTab.tsx`, `ArtistHomeTab.tsx` |
| 3 | 이미지 경로/규격 통일 | 빈 avatar 보유 아티스트 6명 — 기존 `/recommend/` 에셋으로 통일 | `artists.ts` |
| 4 | Artist > Concert 계층 구조 명확화 | `getArtistEvents` 응답에 `artistId` 일치 여부 필터 추가 | `ArtistDetailWidget.tsx` |
| 5 | 방어 코드 기반 데이터 정책 | 대표 이미지 없으면 공연 렌더링 차단 (공연 탭 EmptyState, 홈 탭 섹션 미노출) | `ArtistEventsTab.tsx`, `ArtistHomeTab.tsx` |

---

## 파일별 상세 변경 내역

### 1. `src/shared/lib/mocks/artists.ts`

ID 13~18 아티스트의 `avatar` 빈 문자열 → `/public/recommend/` 실존 파일 경로로 교체.

| 아티스트 (ID) | 변경 전 | 변경 후 |
|---|---|---|
| 악동뮤지션 (13) | `avatar: ""` | `avatar: "/recommend/recommend_akmu.png"` |
| 권정렬 (14) | `avatar: ""` | `avatar: "/recommend/recommend_kwon-jungyeol.png"` |
| RIIZE (15) | `avatar: ""` | `avatar: "/recommend/recommend_riize.png"` |
| IU (16) | `avatar: ""` | `avatar: "/recommend/recommend_iu.png"` |
| NMIXX (17) | `avatar: ""` | `avatar: "/recommend/recommend_nmixx.png"` |
| 투어스 (18) | `avatar: ""` | `avatar: "/recommend/recommend_tours.png"` |

---

### 2. `src/widgets/artist/ArtistDetailWidget.tsx`

**변경 1 — Artist > Concert 계층 검증**

```diff
- const allEvents: Event[] = artistEventsData.map((e: EventSummary) => ({
+ const allEvents: Event[] = artistEventsData
+   .filter((e: EventSummary) => String(e.artistId) === artistId)
+   .map((e: EventSummary) => ({
```

**변경 2 — 대표 이미지 유무 플래그 생성 및 전달**

```diff
+ const hasRepresentativeImage = Boolean(artist.avatar);
```

```diff
  <ArtistHomeTab ... hasRepresentativeImage={hasRepresentativeImage} />
  <ArtistEventsTab ... hasRepresentativeImage={hasRepresentativeImage} />
```

---

### 3. `src/widgets/artist/ArtistEventsTab.tsx`

선택적 prop 추가 + 이미지 미등록 시 EmptyState 가드:

```diff
+ hasRepresentativeImage?: boolean;

+ if (hasRepresentativeImage === false) {
+   return <EmptyState icon={ImageOff} description="아티스트 대표 이미지가 등록되지 않아 공연 정보를 표시할 수 없습니다" />;
+ }
```

---

### 4. `src/widgets/artist/ArtistHomeTab.tsx`

선택적 prop 추가 + 공연 섹션 전체 조건부 렌더링:

```diff
+ hasRepresentativeImage?: boolean;

- {/* ===== 4. 공연 ===== */}
- <section className="space-y-6">
+ {/* ===== 4. 공연 — 대표 이미지 등록 시에만 활성화 ===== */}
+ {hasRepresentativeImage !== false && <section className="space-y-6">
  ...
- </section>
+ </section>}
```

---

## 변경하지 않은 영역

| 경로 | 이유 |
|------|------|
| `src/shared/types/index.ts` | 타입 구조 변경 없음 |
| `src/features/*/api/` | API 레이어 변경 없음 |
| `src/entities/` | 엔티티 컴포넌트 변경 없음 |
| `public/` | 에셋 이동/삭제/추가 없음 |

---

## 동작 검증

| 케이스 | 공연 탭 | 홈 탭 공연 섹션 |
|-------|--------|--------------|
| avatar 있는 아티스트 | 정상 렌더링 | 정상 렌더링 |
| API에서 avatar `""` 반환 | ImageOff + 안내 메시지 | 섹션 미노출 |

**빌드**: `next build` 완료 — 에러 없음 (`main` 기준 빌드 재검증됨)

---

## 머지 충돌 위험

`main` 대비 **4개 파일, +48/-26 lines** 변경. 각 파일은 독립적으로 로컬화된 변경이며,
선택적 prop(`hasRepresentativeImage?: boolean`) 추가이므로 기존 호출부 수정 불필요.
