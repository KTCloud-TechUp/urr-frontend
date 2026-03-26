# Event / Show API — 누락 필드 및 미연동 현황

이번 연동에서 구현된 내용과, API 응답에 없거나 아직 UI에 연결되지 않은 항목을 정리합니다.

---

## 연동 완료 현황

| 엔드포인트                                        | 연결된 위치                                      |
| ------------------------------------------------- | ------------------------------------------------ |
| `GET /api/v1/events`                              | `EventsWidget` — 전체 공연 보기 섹션             |
| `GET /api/v1/artists/{artistId}/events`           | `ArtistDetailWidget` — 공연 탭                   |
| `GET /api/v1/artists/{artistId}/events/{eventId}` | API 함수 생성 완료, UI 미사용 (하단 참고)        |
| `GET /api/v1/shows/{eventId}/shows`               | `EventDetailWidget` — 회차 날짜 목록             |
| `GET /api/v1/shows/{eventId}/shows/{showId}`      | API 함수 생성 완료, UI 미연결 (예매 페이지 예정) |

---

## GET /api/v1/events — 누락 필드

| 필드                  | 현재 처리                         | 사용 위치                       | 영향                                          |
| --------------------- | --------------------------------- | ------------------------------- | --------------------------------------------- |
| `poster` (이미지 URL) | `""` → 텍스트 플레이스홀더로 대체 | `EventGridCard`, `EventListRow` | 포스터 이미지 미표시                          |
| `artistName`          | `""` → `· {venue}` 앞 빈칸        | `EventListRow` 아티스트명       | 아티스트명 미표시                             |
| `category`            | `"concert"` 하드코딩              | `EventsWidget` 카테고리 필터    | 콘서트 외 필터(팬미팅·페스티벌 등) 동작 안 함 |
| `tags`                | `[]`                              | `EventGridCard` 태그 뱃지       | 태그 미표시                                   |
| `dateRange`           | `openDate` 단일 날짜 그대로 사용  | `EventGridCard`, `EventListRow` | 기간 범위 아닌 단순 날짜 표시                 |

## GET /api/v1/artists/{artistId}/events — 누락 필드

Artist API와 동일한 `EventSummary` 구조를 반환하므로 위 누락 필드와 동일합니다.

추가로:

| 항목             | 현재 처리                        | 영향                                           |
| ---------------- | -------------------------------- | ---------------------------------------------- |
| 회차별 잔여석    | `remainingSeats: 0` (알 수 없음) | `ArtistEventsTab` EventCard에 잔여석 정보 없음 |
| `bookingWindows` | `[]`                             | EventCard 티어별 예매 창 없음                  |

## GET /api/v1/shows/{eventId}/shows — 누락 필드

| 필드                                     | 현재 처리                                     | 영향                                                |
| ---------------------------------------- | --------------------------------------------- | --------------------------------------------------- |
| 잔여석                                   | `remainingSeats: capacity` (총 좌석으로 대체) | `EventBookingSidebar` 잔여석 표시 부정확            |
| `bookingWindows` (티어별 예매 오픈 시간) | `[]`                                          | `EventBookingSidebar` 티어별 예매 오픈 섹션 빈 상태 |
| 구역 가격 (`sections`)                   | `[]` → "미정" 표시                            | `EventBookingSidebar` 가격 범위 미표시              |

---

## EventDetailWidget — 현재 mock/기본값으로 채워진 필드

API 응답만으로 채울 수 없어 기본값으로 처리 중인 항목입니다.

| 필드                      | 현재 값                         | 원래 데이터 출처             |
| ------------------------- | ------------------------------- | ---------------------------- |
| `poster`                  | `""` → 제목 텍스트 플레이스홀더 | 이미지 서버 or 별도 API 필요 |
| `runtime`                 | `"미정"`                        | 공연 상세 API 미제공         |
| `ageRating`               | `"전체 이용가"`                 | 공연 상세 API 미제공         |
| `subtitle`                | `""`                            | 공연 상세 API 미제공         |
| `venueAddress`            | `""`                            | 공연 상세 API 미제공         |
| `notices`                 | `[]`                            | 공연 상세 API 미제공         |
| `membershipPreSaleNotice` | `[]`                            | 공연 상세 API 미제공         |
| `identityVerification`    | `[]`                            | 공연 상세 API 미제공         |
| `castInfo`                | `""`                            | 공연 상세 API 미제공         |
| `organizer`               | 빈 값                           | 공연 상세 API 미제공         |
| `sections` (구역 가격)    | `[]`                            | 공연 상세 API 미제공         |
| `cancellationPolicy`      | `[]`                            | 공연 상세 API 미제공         |
| `ticketDelivery`          | `[]`                            | 공연 상세 API 미제공         |
| `mobileTicketInfo`        | `[]`                            | 공연 상세 API 미제공         |
| `precautions`             | `[]`                            | 공연 상세 API 미제공         |
| `sellerInfo`              | `{ name: "URR", ... }`          | 공연 상세 API 미제공         |
| `escrowInfo`              | `""`                            | 공연 상세 API 미제공         |

> **공연정보/판매정보 탭**은 현재 `description`만 표시되며 나머지 섹션은 비어 있습니다.

---

## 미연결 API 함수

| 함수                                | 파일                                   | 연결 예정 위치                                                                      |
| ----------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------- |
| `getEventDetail(artistId, eventId)` | `features/event/api/getEventDetail.ts` | artistId가 URL에 포함되는 구조로 변경 시, 또는 아티스트 페이지 내 공연 상세 접근 시 |
| `getShowDetail(eventId, showId)`    | `features/show/api/getShowDetail.ts`   | Phase 9 예매 Zustand store — 좌석 선택 단계에서 `seatmapJson` 파싱에 사용 예정      |

---

## 여전히 mock 데이터를 사용하는 영역

| 영역                                          | mock 파일                                             | 교체 조건                                       |
| --------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------- |
| `EventsWidget` 인기 공연 캐러셀               | `mocks/events-page.ts` `popularEvents`                | featured/인기 공연 API 엔드포인트 제공 시       |
| `EventsWidget` 카테고리 필터 목록             | `mocks/events-page.ts` `eventCategoryFilters`         | 항목 자체는 UI 상수이므로 교체 불필요           |
| `ArtistDetailWidget` 커뮤니티 탭              | `mocks/community.ts`                                  | Phase 14 Community API 연동 시                  |
| `ArtistDetailWidget` 양도 탭                  | `mocks/artist-page.ts` `getTransferListingsWithEvent` | Transfer API 연동 시                            |
| `ArtistDetailWidget` 홈 탭 (extendedInfo)     | `mocks/artist-page.ts` `getArtistExtendedInfo`        | 데뷔일·소속사 등 아티스트 상세 API 확장 시      |
| `EventDetailWidget` 공연정보·판매정보 탭 상세 | 기본값으로 대체 중                                    | 공연 상세 전용 API(runtime, notices 등) 제공 시 |
| `ArtistHomeTab` 다음 공연 섹션                | API 매핑값 사용하나 잔여석 없음                       | shows API 연동 후 capacity 개선 가능            |

---

## 백엔드 요청 사항

이하 항목이 API 응답에 추가되면 mock 의존성을 완전히 제거할 수 있습니다.

### Event 엔드포인트 추가 요청

```
GET /api/v1/events
GET /api/v1/artists/{artistId}/events
```

| 추가 요청 필드   | 타입                                                            | 용도                           |
| ---------------- | --------------------------------------------------------------- | ------------------------------ |
| `posterImageUrl` | `string`                                                        | 공연 포스터 이미지             |
| `artistName`     | `string`                                                        | 아티스트명 (목록 표시용)       |
| `category`       | `"concert" \| "fanmeeting" \| "festival" \| "musical" \| "etc"` | 카테고리 필터                  |
| `tags`           | `string[]`                                                      | 단독판매 등 뱃지 표시          |
| `endDate`        | `string`                                                        | 공연 종료일 (dateRange 표시용) |

### Event 상세 엔드포인트 추가 요청

```
GET /api/v1/artists/{artistId}/events/{eventId}
```

| 추가 요청 필드         | 타입                                                                | 용도                         |
| ---------------------- | ------------------------------------------------------------------- | ---------------------------- |
| `posterImageUrl`       | `string`                                                            | 상세 페이지 포스터           |
| `runtime`              | `string`                                                            | 공연 시간 (예: "2시간 30분") |
| `ageRating`            | `string`                                                            | 관람 연령                    |
| `venueAddress`         | `string`                                                            | 공연장 주소                  |
| `subtitle`             | `string`                                                            | 부제목                       |
| `notices`              | `string[]`                                                          | 공지사항                     |
| `identityVerification` | `string[]`                                                          | 본인확인 안내                |
| `castInfo`             | `string`                                                            | 출연진                       |
| `cancellationPolicy`   | `{ period: string; fee: string }[]`                                 | 취소 수수료 정책             |
| `ticketDelivery`       | `string[]`                                                          | 티켓 수령 방법               |
| `sections`             | `{ name: string; price: number; totalSeats: number }[]`             | 구역별 가격                  |
| `organizer`            | `{ host: string; manager: string; contact: string; email: string }` | 기획사 정보                  |

### Show 엔드포인트 추가 요청

```
GET /api/v1/shows/{eventId}/shows
```

| 추가 요청 필드   | 타입                                               | 용도                                  |
| ---------------- | -------------------------------------------------- | ------------------------------------- |
| `remainingSeats` | `number`                                           | 잔여석 표시 (현재 capacity로 대체 중) |
| `bookingWindows` | `{ tier: string; opensAt: string; fee: number }[]` | 티어별 예매 오픈 일정                 |

### 응답 구조 확인 요청

- `GET /api/v1/artists/{artistId}/events` — 200 응답이 단일 객체인지 배열인지 명확화 요청
  (Swagger 200 예시는 단일 객체, 404 예시는 배열로 불일치)
