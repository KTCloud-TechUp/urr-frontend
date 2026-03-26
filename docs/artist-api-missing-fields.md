# Artist API — 누락 필드 현황

API 응답에 없어서 현재 mock 데이터로 대체 중인 필드 목록입니다.

## GET /api/artists (목록)

| 필드            | mock 타입                                       | 현재 처리               | 사용 위치                                          |
| --------------- | ----------------------------------------------- | ----------------------- | -------------------------------------------------- |
| `followerCount` | `number`                                        | `undefined` (숨김 처리) | `ArtistCard`, `ArtistHeader`, `ArtistsWidget` 랭킹 |
| `bio`           | `string`                                        | `""`                    | `ArtistHeader`, `ArtistsWidget` 랭킹               |
| `banner`        | `string` (이미지 URL)                           | `""` (배너 미표시)      | `ArtistHeader` 배경 이미지                         |
| `category`      | `"boygroup" \| "girlgroup" \| "solo" \| "band"` | `"solo"` (기본값)       | `ArtistsWidget` 카테고리 필터                      |

## GET /api/artists/{artistId} (상세)

| 필드            | mock 타입                                       | 현재 처리               | 사용 위치                       |
| --------------- | ----------------------------------------------- | ----------------------- | ------------------------------- |
| `followerCount` | `number`                                        | `undefined` (숨김 처리) | `ArtistHeader`                  |
| `banner`        | `string` (이미지 URL)                           | `""` (배너 미표시)      | `ArtistHeader` 배경 이미지      |
| `category`      | `"boygroup" \| "girlgroup" \| "solo" \| "band"` | `"solo"` (기본값)       | 상세 페이지에서 직접 사용 안 함 |

## 영향받는 UI

- **ArtistHeader 배경**: `banner`가 없으면 아티스트별 그라디언트(`artistGradients`)로 대체 표시됨
- **팔로워 수**: `followerCount`가 없으면 표시 자체를 생략 처리
- **ArtistsWidget 카테고리 필터**: "그룹/솔로" 탭 필터링이 동작하려면 `category` 필드 필요. API 연동 후 해당 섹션도 연결 시 백엔드 추가 요청 필요.
- **ArtistsWidget 팔로워 랭킹순**: `followerCount` 기반 정렬이므로 해당 섹션은 아직 mock 데이터 유지 중.

## 백엔드 요청 사항

아래 필드를 API 응답에 추가해 주시면 mock 의존성을 완전히 제거할 수 있습니다:

- `followerCount: number`
- `bio: string`
- `bannerImageUrl: string`
- `category: "boygroup" | "girlgroup" | "solo" | "band"`
