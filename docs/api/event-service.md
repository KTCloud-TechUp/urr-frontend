# Event / Artist / Membership / Show Service 연동 현황

> 백엔드 코드 경로: C:\Users\kkaeng\Desktop\Dev\URR\urr-backend\urr-eventService
>
> 마지막 확인: 2026-04-17 / 마지막 수정: 2026-04-17

| #   | API                                 | 메서드 | 엔드포인트                                                          | 연동 파일                                          | 상태      | 비고                                                                      |
| --- | ----------------------------------- | ------ | ------------------------------------------------------------------- | -------------------------------------------------- | --------- | ------------------------------------------------------------------------- |
| 1   | —                                   | —      | —                                                                   | —                                                  | —         | 항목 없음                                                                 |
| 2   | 아티스트 생성                       | POST   | `/api/v1/artists`                                                   | —                                                  | ➖ 불필요 | ADMIN 전용                                                                |
| 3   | 아티스트 목록 조회                  | GET    | `/api/v1/artists`                                                   | `features/artist/api/getArtists.ts`                | ✅ 연동됨 |                                                                           |
| 4   | 아티스트 상세 조회                  | GET    | `/api/v1/artists/{artistId}`                                        | `features/artist/api/getArtist.ts`                 | ✅ 연동됨 |                                                                           |
| 5   | 아티스트 멤버십 구독                | POST   | `/api/v1/artists/{artistId}/membership`                             | `features/membership/api/subscribeMembership.ts`   | ✅ 연동됨 |                                                                           |
| 6   | 아티스트 멤버십 활성화              | POST   | `/api/v1/artists/memberships/activate`                              | —                                                  | ➖ 불필요 | 서비스 내부 API                                                           |
| 7   | 아티스트 멤버십 취소                | POST   | `/api/v1/artists/memberships/cancel`                                | `features/membership/api/cancelMembership.ts`      | ✅ 연동됨 |                                                                           |
| 8   | 아티스트 팔로우                     | POST   | `/api/v1/artists/{artistId}/follow`                                 | `features/artist/api/followArtist.ts`              | ✅ 연동됨 |                                                                           |
| 9   | 아티스트 언팔로우                   | DELETE | `/api/v1/artists/{artistId}/follow`                                 | `features/artist/api/unfollowArtist.ts`            | ✅ 연동됨 |                                                                           |
| 10  | 팔로우한 아티스트 목록 조회         | GET    | `/api/v1/artists/followings`                                        | —                                                  | ➖ 불필요 | UI 없음                                                                   |
| 11  | 아티스트 멤버십 정책 조회           | GET    | `/api/v1/membership/artists/{artistId}/membership-policies`         | `features/membership/api/getMembershipPolicies.ts` | ✅ 연동됨 |                                                                           |
| 12  | 회차 선예매 정책 조회               | GET    | `/api/v1/membership/events/{eventId}/shows/{showId}/presale-policy` | `features/membership/api/getPresalePolicy.ts`      | ✅ 연동됨 |                                                                           |
| 13  | 내 멤버십 목록 조회                 | GET    | `/api/v1/membership`                                                | `features/membership/api/getMemberships.ts`        | ✅ 연동됨 | 응답 `data.details` 구조 코드와 일치                                      |
| 14  | 내 멤버십 상세 조회                 | GET    | `/api/v1/membership/{membershipId}`                                 | —                                                  | ➖ 불필요 | 상세하게 조회할 UI 없음                                                   |
| 15  | 내 멤버십 닉네임 수정               | PATCH  | `/api/v1/membership/{membershipId}/nickname`                        | `features/membership/api/updateNickname.ts`        | ✅ 연동됨 |                                                                           |
| 16  | 유저 멤버십 레벨 조회 (내부)        | GET    | `/api/v1/membership/level`                                          | —                                                  | ➖ 불필요 | 서비스 내부 API                                                           |
| 17  | 유저 멤버십 조회 (내부)             | GET    | `/api/v1/membership/internal/membership-info`                       | —                                                  | ➖ 불필요 | 서비스 내부 API                                                           |
| 18  | 공연 생성                           | POST   | `/api/v1/artists/{artistId}/events`                                 | —                                                  | ➖ 불필요 | ADMIN 전용 / UI 없음                                                      |
| 19  | 아티스트 공연 목록 조회             | GET    | `/api/v1/artists/{artistId}/events`                                 | `features/event/api/getArtistEvents.ts`            | ✅ 연동됨 |                                                                           |
| 20  | 공연 상세 조회                      | GET    | `/api/v1/artists/{artistId}/events/{eventId}`                       | `features/event/api/getEventDetail.ts`             | ✅ 연동됨 |                                                                           |
| 21  | 전체 공연 목록 조회                 | GET    | `/api/v1/events`                                                    | `features/event/api/getEvents.ts`                  | ✅ 연동됨 | `EventSummary`에 `subtitle`, `venueAddress` 추가                          |
| 22  | 공연장 템플릿 생성                  | POST   | `/api/v1/events/venues`                                             | —                                                  | ➖ 불필요 | ADMIN 전용 / UI 없음                                                      |
| 23  | 공연장 템플릿 목록 조회             | GET    | `/api/v1/events/venues`                                             | —                                                  | ➖ 불필요 | 서비스 내부 API / 연동 제거                                               |
| 24  | 공연장 템플릿 상세 조회             | GET    | `/api/v1/events/venues/{venueTemplateId}`                           | —                                                  | ➖ 불필요 | 서비스 내부 API / 연동 제거                                               |
| 25  | Home 큐레이션 조회                  | GET    | `/api/v1/events/home`                                               | `features/home/api/getHome.ts`                     | ✅ 연동됨 |                                                                           |
| 26  | 공연 회차 생성                      | POST   | `/api/v1/shows/{eventId}/shows`                                     | —                                                  | ➖ 불필요 | ADMIN 전용 / UI 없음                                                      |
| 27  | 공연 회차 목록 조회                 | GET    | `/api/v1/shows/{eventId}/shows`                                     | `features/show/api/getShows.ts`                    | ✅ 연동됨 |                                                                           |
| 28  | 공연 회차 상세 조회                 | GET    | `/api/v1/shows/{eventId}/shows/{showId}`                            | `features/show/api/getShowDetail.ts`               | ✅ 연동됨 |                                                                           |
| 29  | 공연 회차 좌석 메타데이터 조회      | GET    | `/api/v1/shows/{eventId}/shows/{showId}/seatmap`                    | —                                                  | ➖ 불필요 | VenueMap이 하드코딩 SVG — UI 연결점 없음                                  |
| 30  | 회차별 가격/구역 정책 조회          | GET    | `/api/v1/shows/{showId}/sections`                                   | `features/show/api/getSections.ts`                 | ✅ 연동됨 | BookingContext에서 구역별 실제 가격 사용 (기존 TIER_PRICES 하드코딩 대체) |
| 31  | 공연 회차 좌석 카탈로그 조회        | GET    | `/api/v1/shows/{eventId}/shows/{showId}/seats`                      | `features/show/api/getShowSeats.ts`                | ✅ 연동됨 | seatId 형식: `{tier}-{zoneNo}-{row}-{number}` (예: `VIP-1-3-1`); `section` query param 추가 |
| 32  | 잔여석 전체 요약 조회               | GET    | `/api/v1/shows/{eventId}/shows/{showId}/seats/summary`              | `features/booking/api/getSeatsSummary.ts`          | ✅ 연동됨 |                                                                           |
| 33  | 특정 티어/구역 예매 가능 좌석 조회  | GET    | `/api/v1/shows/{eventId}/shows/{showId}/seats/availability`         | `features/booking/api/getSeatsAvailability.ts`     | ✅ 연동됨 |                                                                           |
| 34  | 회차별 멤버십 예매 오픈 시간표 조회 | GET    | `/api/v1/shows/{eventId}/shows/{showId}/booking-windows`            | `features/booking/api/getBookingWindows.ts`        | ✅ 연동됨 |                                                                           |
| 35  | 공연 상세 + booking windows 통합 조회 | GET    | `/api/v1/events/{eventId}/detail-with-booking-windows`              | —                                                  | ➖ 불필요 | 신규 엔드포인트 — UI 연결 없음                                            |
| 36  | 회차별 좌석 목록(가격/수수료 포함) 조회 | GET    | `/api/v1/shows/{eventId}/shows/{showId}/seats/detail`               | —                                                  | ➖ 불필요 | 신규 엔드포인트 — 티켓 서비스 내부 연동용, query `seatIds`(선택) 지원    |
| 37  | 공연 단순 상세 조회                     | GET    | `/api/v1/events/{eventId}`                                          | —                                                  | ➖ 불필요 | artistId 없이 eventId만으로 조회 (EventQueryController) — UI 연결 없음 |
| 38  | (내부) 티켓 확인용 공연/좌석 정보 조회 | GET    | `/api/v1/shows/internal/tickets/info`                               | —                                                  | ➖ 불필요 | query: `eventId`, `showId`; `X-User-Id` 헤더 — 티켓 서비스 내부용     |

---

# 1. 없음

# 2. 아티스트 생성 (ADMIN)

## API

`POST /api/v1/artists`

## 설명

관리자가 신규 아티스트를 생성합니다.

## 인증

필요

- `X-User-Role: ADMIN`

## Request

### Header 예시

```
X-User-Role: ADMIN
```

### Body

```
{
  "name":"BIGBANG",
  "profileImageUrl":"https://cdn.example.com/artists/bigbang.png",
  "description":"2010년대를 빛낸 인기 K-POP 그룹",
  "bio":"전 세계 팬들과 소통하는 아티스트",
  "bannerImageUrl":"https://cdn.example.com/artists/bigbang-banner.png",
  "category":"BOYGROUP"
}
```

### 필드 설명

- `name`: 아티스트 이름
- `profileImageUrl`: 프로필 이미지 URL
- `description`: 아티스트 소개
- `bio`: 상세 소개
- `bannerImageUrl`: 배너 이미지 URL
- `category`: 아티스트 카테고리 (`BOYGROUP`, `GIRLGROUP`, `SOLO`, `BAND`, `COEDGROUP`, `ETC`)

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "id":1,
    "name":"BIGBANG",
    "profileImageUrl":"https://cdn.example.com/artists/bigbang.png",
    "description":"2010년대를 빛낸 인기 K-POP 그룹",
    "followerCount":0,
    "bio":"전 세계 팬들과 소통하는 아티스트",
    "bannerImageUrl":"https://cdn.example.com/artists/bigbang-banner.png",
    "category":"boygroup",
    "isFollowing":false
  }
}
```

---

# 3. 아티스트 목록 조회

## API

`GET /api/v1/artists`

## 설명

아티스트 목록을 조회합니다.

아티스트 탭,멤버십가입 등의 페이에서 아티스트목록을 반환

## 인증

불필요

## Request

### Query 예시

```
GET /api/v1/artists?category=BOYGROUP
```

### Query 파라미터 설명

- `category` (optional): 아티스트 카테고리 (`BOYGROUP`, `GIRLGROUP`, `SOLO`, `BAND`, `COEDGROUP`, `ETC`)

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": [
    {
      "id":1,
      "name":"BIGBANG",
      "profileImageUrl":"https://cdn.example.com/artists/bigbang.png",
      "followerCount":12500,
      "bio":"전 세계 팬들과 소통하는 아티스트",
      "bannerImageUrl":"https://cdn.example.com/artists/bigbang-banner.png",
      "category":"boygroup"
    },
    {
      "id":2,
      "name":"NewJeans",
      "profileImageUrl":"https://cdn.example.com/artists/newjeans.png",
      "followerCount":21000,
      "bio":"트렌디한 퍼포먼스",
      "bannerImageUrl":"https://cdn.example.com/artists/newjeans-banner.png",
      "category":"girlgroup"
    }
  ]
}
```

---

# 4. 아티스트 상세 조회

## API

`GET /api/v1/artists/{artistId}`

## 설명

특정 아티스트의 상세 정보를 조회합니다.

특정아티스트를 확인할때 사용(아티스트 사진,아티스트 상세페이지)

## 인증

불필요

## Request

### Header (optional)

- `X-User-Id`: 사용자 ID (팔로우 여부 확인용, optional)

### Path Variable

- `artistId`: 아티스트 ID

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "id":1,
    "name":"BIGBANG",
    "profileImageUrl":"https://cdn.example.com/artists/bigbang.png",
    "description":"2010년대를 빛낸 인기 K-POP 그룹",
    "followerCount":12500,
    "bio":"전 세계 팬들과 소통하는 아티스트",
    "bannerImageUrl":"https://cdn.example.com/artists/bigbang-banner.png",
    "category":"boygroup",
    "isFollowing":true
  }
}
```

---

# 5. 아티스트 멤버십 구독

## API

`POST /api/v1/artists/{artistId}/membership`

## 설명

특정 아티스트의 멤버십을 구독합니다.

멤버십 페이지에서 주문자정보기입후 ~원 결제하기 버튼 클릭시 호출

## 인증

필요

- `X-User-Id` 헤더 필요

## Request

### Header 예시

```
X-User-Id: 101
```

### Path Variable

- `artistId`: 아티스트 ID

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "membershipId":999,
    "orderId":"mem_7f2a68c2f0b743a4af57cb10",
    "paymentId":"pay_01J8X9...",
    "pendingExpiresAt":"2026-04-01T12:00:00"
  }
}
```

---

# 6. 아티스트 멤버십 활성화

## API

`POST /api/v1/artists/memberships/activate`

## 설명

결제 완료 후 멤버십을 활성화합니다.

토스 qr을 통해 결제를 진행하면 자동 호출

## 인증

불필요

## Request

### Body

```
{
  "orderId":"mem_7f2a68c2f0b743a4af57cb10",
  "paymentId":"pay_01J8X9..."
}
```

### 필드 설명

- `orderId`: 멤버십 주문 ID (필수, @NotBlank)
- `paymentId`: 결제 ID (필수, @NotBlank). `paymentKey`를 키 이름으로 보내도 동일하게 매핑됨 (`@JsonAlias("paymentKey")`)

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data":null
}
```

---

# 7. 아티스트 멤버십 취소

## API

`POST /api/v1/artists/memberships/cancel`

## 설명

멤버십 결제 취소 또는 구독 취소 처리

마이페이지 멤버십에서 해지버튼을 통해 호출

## 인증

불필요

## Request

### Body

```
{
  "orderId":"mem_7f2a68c2f0b743a4af57cb10",
  "reason":"PAYMENT_CANCELED"
}
```

### 필드 설명

- `orderId`: 멤버십 주문 ID (필수, @NotBlank)
- `reason`: 취소 사유 (선택)

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data":null
}
```

---

# 8. 아티스트 팔로우

## API

`POST /api/v1/artists/{artistId}/follow`

## 설명

특정 아티스트를 팔로우합니다.

아티스트 상세페이지에서 아티스트 팔로우 클릭시 호출

## 인증

필요

- `X-User-Id` 헤더 필요

## Request

### Header 예시

```
X-User-Id: 101
```

### Path Variable

- `artistId`: 아티스트 ID

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data":null
}
```

---

# 9. 아티스트 언팔로우

## API

`DELETE /api/v1/artists/{artistId}/follow`

## 설명

특정 아티스트 팔로우를 해제합니다.

아티스트 상세페이지에서 아티스트 팔로우 클릭시 호출

## 인증

불필요

## Request

### Path Variable

- `artistId`: 아티스트 ID

### Query 예시

```
DELETE /api/v1/artists/{artistId}/follow?userId=101
```

### Query 파라미터 설명

- `userId`: 사용자 ID

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data":null
}
```

---

# 10. 내가 팔로우한 아티스트 목록 조회

## API

`GET /api/v1/artists/followings`

## 설명

사용자가 팔로우한 아티스트 목록을 조회합니다.

사이드바용 로그인 직후 호출

아티스트 팔로우/언팔로우 직후 재호출

## 인증

불필요

## Request

### Query 예시

```
GET /api/v1/artists/followings?userId=101
```

### Query 파라미터 설명

- `userId`: 사용자 ID

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": [
    {
      "id":1,
      "name":"BIGBANG",
      "profileImageUrl":"https://cdn.example.com/artists/bigbang.png",
      "followerCount":12500,
      "bio":"전 세계 팬들과 소통하는 아티스트",
      "bannerImageUrl":"https://cdn.example.com/artists/bigbang-banner.png",
      "category":"boygroup"
    },
    {
      "id":3,
      "name":"IU",
      "profileImageUrl":"https://cdn.example.com/artists/iu.png",
      "followerCount":18000,
      "bio":"싱어송라이터",
      "bannerImageUrl":"https://cdn.example.com/artists/iu-banner.png",
      "category":"solo"
    }
  ]
}
```

---

# 11. 아티스트 멤버십 정책 조회

## API

`GET /api/v1/membership/artists/{artistId}/membership-policies`

## 설명

아티스트별 멤버십 티어 정책을 조회합니다.

공연상세페이지에서 예매, 가격정책을 위해 호출

## 인증

불필요

## Request

### Path Variable

- `artistId`: 아티스트 ID

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "artistId":1,
    "tiers": [
      {
        "tier":"MIST",
        "presaleOffsetMinutes":30,
        "bookingFeeWon":1000,
        "bookingType":"GENERAL",
        "transferFeeRate":null
      },
      {
        "tier":"THUNDER",
        "presaleOffsetMinutes":120,
        "bookingFeeWon":500,
        "bookingType":"PRESALE",
        "transferFeeRate":5
      }
    ]
  }
}
```

# 12. 회차 선예매 정책 조회

## API

`GET /api/v1/membership/events/{eventId}/shows/{showId}/presale-policy`

## 설명

특정 공연 회차의 선예매 정책을 조회합니다.

공연상세페이지에서 예매, 가격정책을 위해 호출

## 인증

불필요

## Request

### Path Variable

- `eventId`: 공연 ID
- `showId`: 회차 ID

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "eventId":100,
    "showId":1001,
    "generalOpenAt":"2026-05-20T20:00:00",
    "tiers": [
      {
        "tier":"MIST",
        "openAt":"2026-05-20T19:30:00",
        "presaleOffsetMinutes":30,
        "bookingFeeWon":1000
      },
      {
        "tier":"THUNDER",
        "openAt":"2026-05-20T18:00:00",
        "presaleOffsetMinutes":120,
        "bookingFeeWon":500
      }
    ]
  }
}
```

---

# 13. 내 멤버십 목록 조회

## API

`GET /api/v1/membership`

## 설명

사용자의 멤버십 목록을 조회합니다.

auth서비스 /me에서 유저 멤버십 조회를 위해 사용

## 인증

필요

- `X-User-Id` 헤더 필요

## Request

### Header 예시

```
X-User-Id: 101
```

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "details": [
      {
        "membershipId":9001,
        "artistId":1,
        "artistName":"BIGBANG",
        "nickname":"VIP_팬",
        "tier":"LIGHTNING",
        "tierLevel":4,
        "tierProgressPercent":100,
        "status":"ACTIVE",
        "orderId":"mem_7f2a68c2f0b743a4af57cb10",
        "startDate":"2026-03-01",
        "endDate":"2027-02-28",
        "active":true
      }
    ],
    "memberships": [
      {
        "artistId":1,
        "artistName":"BIGBANG",
        "tier":"LIGHTNING",
        "endDate":"2027-02-28"
      }
    ]
  }
}
```

---

# 14. 내 멤버십 상세 조회

## API

`GET /api/v1/membership/{membershipId}`

## 설명

특정 멤버십의 상세 정보를 조회합니다.

mypage 멤버십용이었지만 "내 멤버십 목록 조회"에서 동일 내용을 반환하게 되면서 사용x

## 인증

필요

- `X-User-Id` 헤더 필요

## Request

### Header 예시

```
X-User-Id: 101
```

### Path Variable

- `membershipId`: 멤버십 ID

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "membershipId":9001,
    "userId":101,
    "artistId":1,
    "artistName":"BIGBANG",
    "nickname":"VIP_팬",
    "tier":"LIGHTNING",
    "tierLevel":4,
    "tierProgressPercent":100,
    "status":"ACTIVE",
    "orderId":"mem_7f2a68c2f0b743a4af57cb10",
    "paymentId":"pay_01J8X9...",
    "startDate":"2026-03-01",
    "endDate":"2027-02-28",
    "pendingExpiresAt":null,
    "active":true
  }
}
```

---

# 15. 내 멤버십 닉네임 수정

## API

`PATCH /api/v1/membership/{membershipId}/nickname`

## 설명

멤버십 닉네임을 수정합니다.

마이페이지 멤버십에서 특정 멤버십 이름 변경시 호출

## 인증

필요

- `X-User-Id` 헤더 필요

## Request

### Header 예시

```
X-User-Id: 101
```

### Path Variable

- `membershipId`: 멤버십 ID

### Body

```
{
  "nickname":"내최애멤버십"
}
```

### 필드 설명

- `nickname`: 변경할 닉네임 (필수, 최대 40자)

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "membershipId":9001,
    "userId":101,
    "artistId":1,
    "artistName":"BIGBANG",
    "nickname":"내최애멤버십",
    "tier":"LIGHTNING",
    "tierLevel":4,
    "tierProgressPercent":100,
    "status":"ACTIVE",
    "orderId":"mem_7f2a68c2f0b743a4af57cb10",
    "paymentId":"pay_01J8X9...",
    "startDate":"2026-03-01",
    "endDate":"2027-02-28",
    "pendingExpiresAt":null,
    "active":true
  }
}
```

---

# 16. 유저 멤버십 레벨 조회 (내부 연동)

## API

`GET /api/v1/membership/level`

## 설명

Ticket 서비스가 userId/artistId 기준으로 멤버십 레벨을 조회합니다.

내부 서비스 간 통신용 엔드포인트입니다.

## 인증

불필요

## Request

### Query 예시

```
GET /api/v1/membership/level?userId=101&artistId=1
```

### Query 파라미터 설명

- `userId`: 사용자 ID (필수)
- `artistId`: 아티스트 ID (필수)

### Body

없음

## Response

### 성공 응답 (200)

ApiResponse로 감싸지 않고 직접 반환합니다.

```
{
  "membershipLevel":"LIGHTNING"
}
```

---

# 17. 유저 멤버십 조회 (내부 연동)

## API

`GET /api/v1/membership/internal/membership-info`

## 설명

X-User-Id와 artistId 기준으로 멤버십 정보를 조회합니다.

양도 서비스 내부 통신용 엔드포인트입니다.

## 인증

필요

- `X-User-Id` 헤더 필요

## Request

### Header 예시

```
X-User-Id: 101
```

### Query 예시

```
GET /api/v1/membership/internal/membership-info?artistId=1
```

### Query 파라미터 설명

- `artistId`: 아티스트 ID (필수)

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "userId":101,
    "artistId":1,
    "membershipLevel":"LIGHTNING"
  }
}
```

---

# 18. 공연 생성 (ADMIN)

## API

`POST /api/v1/artists/{artistId}/events`

## 설명

관리자가 특정 아티스트의 공연을 생성합니다.

## 인증

필요

- `X-User-Role: ADMIN`

## Request

### Header 예시

```
X-User-Role: ADMIN
```

### Path Variable

- `artistId`: 아티스트 ID

### Body

```
{
  "title":"G-Dragon 2026 MAMA DOME TOUR",
  "description":"단독 공연 DOME TOUR",
  "venueTemplateId":10,
  "openDate":"2026-05-20",
  "endDate":"2026-06-20",
  "active":true,
  "posterImageUrl":"https://cdn.example.com/posters/gd-2026.png",
  "category":"concert",
  "tags": ["HOT","NEW"],
  "runtime":"약 120분",
  "ageRating":"12세 이상",
  "venueAddress":"서울특별시 송파구 올림픽로 424",
  "subtitle":"WORLD TOUR IN SEOUL",
  "notices": ["티켓은 1인 2매","입장 30분 전 오픈"],
  "identityVerification": ["실물 신분증 필수","본인 명의 예매만 가능"],
  "castInfo":"G-Dragon",
  "cancellationPolicy": [
    { "period":"공연 10일 전", "fee":"수수료 없음" },
    { "period":"공연 3일 전", "fee":"티켓금액의 10%" }
  ],
  "ticketDelivery": ["모바일 티켓","현장 수령"],
  "sections": [
    { "name":"VIP", "price":220000, "totalSeats":1000 },
    { "name":"R", "price":165000, "totalSeats":3000 }
  ],
  "organizer": {
    "host":"URR Entertainment",
    "manager":"URR Live",
    "contact":"1588-0000",
    "email":"help@urr.com"
  }
}
```

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "eventId":100,
    "artistId":1,
    "artistName":"BIGBANG",
    "title":"G-Dragon 2026 MAMA DOME TOUR",
    "subtitle":"WORLD TOUR IN SEOUL",
    "description":"단독 공연 DOME TOUR",
    "venueTemplateId":10,
    "venueTemplateName":"잠실주경기장 기본 템플릿",
    "venueAddress":"서울특별시 송파구 올림픽로 424",
    "posterImageUrl":"https://cdn.example.com/posters/gd-2026.png",
    "category":"concert",
    "tags": ["HOT","NEW"],
    "openDate":"2026-05-20",
    "endDate":"2026-06-20",
    "active":true,
    "runtime":"약 120분",
    "ageRating":"12세 이상",
    "notices": ["티켓은 1인 2매","입장 30분 전 오픈"],
    "identityVerification": ["실물 신분증 필수","본인 명의 예매만 가능"],
    "castInfo":"G-Dragon",
    "cancellationPolicy": [
      { "period":"공연 10일 전", "fee":"수수료 없음" },
      { "period":"공연 3일 전", "fee":"티켓금액의 10%" }
    ],
    "ticketDelivery": ["모바일 티켓","현장 수령"],
    "sections": [
      { "name":"VIP", "price":220000, "totalSeats":1000 },
      { "name":"R", "price":165000, "totalSeats":3000 }
    ],
    "organizer": {
      "host":"URR Entertainment",
      "manager":"URR Live",
      "contact":"1588-0000",
      "email":"help@urr.com"
    }
  }
}
```

---

# 19. 아티스트 공연 목록 조회

## API

`GET /api/v1/artists/{artistId}/events`

## 설명

특정 아티스트의 공연 목록을 조회합니다.

아티스트 상세페이지에서 공연탭 클릭시 호출

## 인증

불필요

## Request

### Path Variable

- `artistId`: 아티스트 ID

### Query 예시

```
GET /api/v1/artists/{artistId}/events?active=true&fromOpenDate=2026-05-01&toOpenDate=2026-06-30
```

### Query 파라미터 설명

- `active` (optional): 활성화 여부
- `fromOpenDate` (optional): 조회 시작 오픈일
- `toOpenDate` (optional): 조회 종료 오픈일

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": [
    {
      "eventId":100,
      "artistId":1,
      "artistName":"BIGBANG",
      "title":"G-Dragon 2026 MAMA DOME TOUR",
      "subtitle":"WORLD TOUR IN SEOUL",
      "description":"단독 공연 DOME TOUR",
      "venueTemplateId":10,
      "venueTemplateName":"잠실주경기장 기본 템플릿",
      "venueAddress":"서울특별시 송파구 올림픽로 424",
      "posterImageUrl":"https://cdn.example.com/posters/gd-2026.png",
      "category":"concert",
      "tags": ["HOT","NEW"],
      "openDate":"2026-05-20",
      "endDate":"2026-06-20",
      "active":true,
      "runtime":"약 120분",
      "ageRating":"12세 이상",
      "notices": ["티켓은 1인 2매","입장 30분 전 오픈"],
      "identityVerification": ["실물 신분증 필수","본인 명의 예매만 가능"],
      "castInfo":"G-Dragon",
      "cancellationPolicy": [
        { "period":"공연 10일 전", "fee":"수수료 없음" },
        { "period":"공연 3일 전", "fee":"티켓금액의 10%" }
      ],
      "ticketDelivery": ["모바일 티켓","현장 수령"],
      "sections": [
        { "name":"VIP", "price":220000, "totalSeats":1000 },
        { "name":"R", "price":165000, "totalSeats":3000 }
      ],
      "organizer": {
        "host":"URR Entertainment",
        "manager":"URR Live",
        "contact":"1588-0000",
        "email":"help@urr.com"
      }
    }
  ]
}
```

---

# 20. 공연 상세 조회

## API

`GET /api/v1/artists/{artistId}/events/{eventId}`

## 설명

특정 공연의 상세 정보를 조회합니다.

## 인증

불필요

## Request

### Path Variable

- `artistId`: 아티스트 ID (URL상 존재하나 코드에서는 미사용)
- `eventId`: 공연 ID

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "eventId":100,
    "artistId":1,
    "artistName":"BIGBANG",
    "title":"G-Dragon 2026 MAMA DOME TOUR",
    "subtitle":"WORLD TOUR IN SEOUL",
    "description":"단독 공연 DOME TOUR",
    "venueTemplateId":10,
    "venueTemplateName":"잠실주경기장 기본 템플릿",
    "venueAddress":"서울특별시 송파구 올림픽로 424",
    "posterImageUrl":"https://cdn.example.com/posters/gd-2026.png",
    "category":"concert",
    "tags": ["HOT","NEW"],
    "openDate":"2026-05-20",
    "endDate":"2026-06-20",
    "active":true,
    "runtime":"약 120분",
    "ageRating":"12세 이상",
    "notices": ["티켓은 1인 2매","입장 30분 전 오픈"],
    "identityVerification": ["실물 신분증 필수","본인 명의 예매만 가능"],
    "castInfo":"G-Dragon",
    "cancellationPolicy": [
      { "period":"공연 10일 전", "fee":"수수료 없음" },
      { "period":"공연 3일 전", "fee":"티켓금액의 10%" }
    ],
    "ticketDelivery": ["모바일 티켓","현장 수령"],
    "sections": [
      { "name":"VIP", "price":220000, "totalSeats":1000 },
      { "name":"R", "price":165000, "totalSeats":3000 }
    ],
    "organizer": {
      "host":"URR Entertainment",
      "manager":"URR Live",
      "contact":"1588-0000",
      "email":"help@urr.com"
    }
  }
}
```

---

# 21. 전체 공연 목록 조회

## API

`GET /api/v1/events`

## 설명

전체 공연 목록을 조회합니다.

사이드바에서 공연을 누를시 호출

## 인증

불필요

## Request

### Query 예시

```
GET /api/v1/events?artistId=1&active=true&fromOpenDate=2026-05-01&toOpenDate=2026-07-01
```

### Query 파라미터 설명

- `artistId` (optional): 아티스트 ID
- `active` (optional): 활성화 여부
- `fromOpenDate` (optional): 조회 시작 오픈일
- `toOpenDate` (optional): 조회 종료 오픈일

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": [
    {
      "eventId":100,
      "artistId":1,
      "artistName":"BIGBANG",
      "title":"G-Dragon 2026 MAMA DOME TOUR",
      "subtitle":"WORLD TOUR IN SEOUL",
      "description":"단독 공연 DOME TOUR",
      "venueTemplateId":10,
      "venueTemplateName":"잠실주경기장 기본 템플릿",
      "venueAddress":"서울특별시 송파구 올림픽로 424",
      "posterImageUrl":"https://cdn.example.com/posters/gd-2026.png",
      "category":"concert",
      "tags": ["HOT","NEW"],
      "openDate":"2026-05-20",
      "endDate":"2026-06-20",
      "active":true,
      "runtime":"약 120분",
      "ageRating":"12세 이상",
      "notices": ["티켓은 1인 2매","입장 30분 전 오픈"],
      "identityVerification": ["실물 신분증 필수","본인 명의 예매만 가능"],
      "castInfo":"G-Dragon",
      "cancellationPolicy": [
        { "period":"공연 10일 전", "fee":"수수료 없음" },
        { "period":"공연 3일 전", "fee":"티켓금액의 10%" }
      ],
      "ticketDelivery": ["모바일 티켓","현장 수령"],
      "sections": [
        { "name":"VIP", "price":220000, "totalSeats":1000 },
        { "name":"R", "price":165000, "totalSeats":3000 }
      ],
      "organizer": {
        "host":"URR Entertainment",
        "manager":"URR Live",
        "contact":"1588-0000",
        "email":"help@urr.com"
      }
    }
  ]
}
```

---

# 22. 공연장 템플릿 생성 (ADMIN)

## API

`POST /api/v1/events/venues`

## 설명

관리자가 공연장 좌석 템플릿을 생성합니다.

## 인증

필요

- `X-User-Role: ADMIN`

## Request

### Header 예시

```
X-User-Role: ADMIN
```

### Body

```
{
  "name": "KSPO_DOME_A",
  "active": true,
  "seatmapJson": {
    "version": 1,
    "sections": [
      {
        "name": "VIP",
        "seats": [
          { "row": "A", "number": 1 },
          { "row": "A", "number": 2 },
          { "row": "A", "number": 3 }
        ]
      },
      {
        "name": "R",
        "seats": [
          { "row": "B", "number": 1 },
          { "row": "B", "number": 2 },
          { "row": "B", "number": 3 }
        ]
      },
      {
        "name": "S",
        "seats": [
          { "row": "C", "number": 1 },
          { "row": "C", "number": 2 }
        ]
      }
    ]
  },
  "tiers": [
    {
      "tierCode": "VIP",
      "zones": [
        { "zoneNo": 1, "rowStart": "A", "rowEnd": "W", "colStart": 1, "colEnd": 8 }
      ]
    },
    {
      "tierCode": "S",
      "zones": [
        { "zoneNo": 1, "rowStart": "A", "rowEnd": "L", "colStart": 1, "colEnd": 18 }
      ]
    }
  ]
}
```

### 필드 설명

- `name`: 템플릿 이름 (필수, 최대 120자)
- `seatmapJson`: 좌석맵 JSON
- `tiers`: 티어/구역 정보 목록
  - `tierCode`: 티어 코드 (예: VIP, S, R, A)
  - `zones`: 구역 목록
    - `zoneNo`: 구역 번호
    - `rowStart`: 시작 행
    - `rowEnd`: 종료 행
    - `colStart`: 시작 열
    - `colEnd`: 종료 열
- `active`: 활성화 여부

## Response

### 성공 응답 (200)

```
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "venueTemplateId": 1,
    "name": "KSPO_DOME_A",
    "baseCapacity": 8,
    "active": true,
    "seatmapJson": "{\"version\":1,\"sections\":[...]}"
  }
}
```

---

# 23. 공연장 템플릿 목록 조회 (no use)

## API

`GET /api/v1/events/venues`

## 설명

공연장 템플릿 목록을 조회합니다.

백엔드 내부에서 테스트할떄 호출

## 인증

불필요

## Request

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": [
    {
      "venueTemplateId":10,
      "name":"잠실주경기장 기본 템플릿",
      "baseCapacity":4000,
      "active":true,
      "seatmapJson":"{...}"
    },
    {
      "venueTemplateId":11,
      "name":"KSPO 돔 템플릿",
      "baseCapacity":3500,
      "active":true,
      "seatmapJson":"{...}"
    }
  ]
}
```

---

# 24. 공연장 템플릿 상세 조회 (no use)

## API

`GET /api/v1/events/venues/{venueTemplateId}`

## 설명

특정 공연장 템플릿의 상세 정보를 조회합니다.

백엔드 내부에서 테스트할때 호출

## 인증

불필요

## Request

### Path Variable

- `venueTemplateId`: 공연장 템플릿 ID

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "venueTemplateId":10,
    "name":"잠실주경기장 기본 템플릿",
    "baseCapacity":4000,
    "active":true,
    "seatmapJson":"{\"sections\":[{\"code\":\"VIP\",\"name\":\"VIP\"},{\"code\":\"R\",\"name\":\"R\"}]}"
  }
}
```

---

# 25. Home 큐레이션 조회

## API

`GET /api/v1/events/home`

## 설명

인기 공연 랭킹, 인기 아티스트, 지금 뜨는 공연, 선예매 오픈 임박, NEW 아티스트를 통합 조회합니다.

## 인증

불필요

## Request

### Query 예시

```
GET /api/v1/events/home?limit=5
```

### Query 파라미터 설명

- `limit` (optional): 각 섹션별 최대 개수

### Body

없음

## Response

### 성공 응답 (200)

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "popularEventRanking": [
      {
        "rank": 1,
        "eventId": 14,
        "eventTitle": "POSTMAN TEST CONCERT 2026",
        "artistId": 2,
        "artistName": "빅뱅",
        "posterImageUrl": null,
        "openDate": "2026-04-10",
        "endDate": null
      }
    ],
    "popularArtists": [
      {
        "artistId": 2,
        "artistName": "빅뱅",
        "profileImageUrl": "https://cdn.example.com/artists/bigbang.png",
        "followerCount": 3,
        "category": "boygroup"
      }
    ],
    "trendingEvents": [
      {
        "eventId": 14,
        "eventTitle": "POSTMAN TEST CONCERT 2026",
        "artistId": 2,
        "artistName": "빅뱅",
        "posterImageUrl": null,
        "venueAddress": null,
        "openDate": "2026-04-10",
        "endDate": null
      }
    ],
    "presaleOpeningSoon": [
      {
        "showId": 1,
        "eventId": 14,
        "eventTitle": "POSTMAN TEST CONCERT 2026",
        "artistId": 2,
        "artistName": "빅뱅",
        "saleOpenAt": "2026-04-15T10:00:00",
        "venueAddress": "KSPO DOME"
      }
    ],
    "newArtists": [
      {
        "artistId": 4,
        "artistName": "악동뮤지션",
        "profileImageUrl": "https://cdn.example.com/artists/bts.png",
        "followerCount": 0,
        "category": "coedgroup"
      }
    ]
  }
}
```

---

# 26. 공연 회차 생성 (ADMIN)

## API

`POST /api/v1/shows/{eventId}/shows`

## 설명

관리자가 특정 공연의 회차를 생성합니다.

## 인증

필요

- `X-User-Role: ADMIN`

## Request

### Header 예시

```
X-User-Role: ADMIN
```

### Path Variable

- `eventId`: 공연 ID

### Body

```
{
  "sessionNo":1,
  "startAt":"2026-06-01T19:00:00",
  "endAt":"2026-06-01T21:00:00",
  "capacity":4000,
  "saleOpenAt":"2026-05-20T20:00:00",
  "saleCloseAt":"2026-06-01T20:00:00",
  "blockedSeats": [
    { "section":"VIP1", "tier":"VIP", "zoneNo":1, "row":"A", "number":1 },
    { "section":"R1", "tier":"R", "zoneNo":1, "row":"B", "number":10 }
  ],
  "sectionPolicies": [
    { "code":"VIP1", "tier":"VIP", "zoneNo":1, "price":220000, "color":"#FF4D4F", "active":true },
    { "code":"R1", "tier":"R", "zoneNo":1, "price":165000, "color":"#1890FF", "active":true }
  ]
}
```

### 필드 설명

- `sessionNo`: 회차 번호 (필수)
- `startAt`: 공연 시작 일시 (필수)
- `endAt`: 공연 종료 일시 (필수)
- `capacity`: 전체 좌석 수 (선택)
- `saleOpenAt`: 판매 시작 일시 (필수)
- `saleCloseAt`: 판매 종료 일시 (선택)
- `blockedSeats`: 판매 제외 좌석 목록 (선택)
  - `section`: 구역코드 (레거시, 선택)
  - `tier`: 좌석 등급 (선택)
  - `zoneNo`: 구역 번호 (선택)
  - `row`: 행 (필수)
  - `number`: 좌석 번호 (필수)
- `sectionPolicies`: 구역별 가격 정책 목록 (선택)
  - `code`: 구역코드 (선택, 미입력 시 tier+zoneNo로 자동 생성)
  - `tier`: 가격 등급 (예: VIP, S, R, A)
  - `zoneNo`: 등급 내 구역 번호 (null이면 tier 전체 정책)
  - `price`: 해당 구역 가격(원) (필수)
  - `color`: 색상 코드 (선택)
  - `active`: 활성화 여부 (필수)

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "showId":1001,
    "eventId":100,
    "sessionNo":1,
    "status":"ON_SALE",
    "seatmapVersion":1
  }
}
```

---

# 27. 공연 회차 목록 조회

## API

`GET /api/v1/shows/{eventId}/shows`

## 설명

특정 공연의 회차 목록을 조회합니다.

## 인증

불필요

## Request

### Path Variable

- `eventId`: 공연 ID

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": [
    {
      "showId":1001,
      "sessionNo":1,
      "startAt":"2026-06-01T19:00:00",
      "endAt":"2026-06-01T21:00:00",
      "capacity":4000,
      "remainingSeats":3500,
      "saleOpenAt":"2026-05-20T20:00:00",
      "saleCloseAt":"2026-06-01T20:00:00",
      "bookingWindows": [
        { "tier":"LIGHTNING", "opensAt":"2026-05-20T18:00:00", "fee":500 },
        { "tier":"THUNDER", "opensAt":"2026-05-20T18:30:00", "fee":1000 },
        { "tier":"CLOUD", "opensAt":"2026-05-20T19:00:00", "fee":1500 },
        { "tier":"MIST", "opensAt":"2026-05-20T19:30:00", "fee":2000 }
      ],
      "status":"ON_SALE",
      "active":true,
      "seatmapVersion":1
    },
    {
      "showId":1002,
      "sessionNo":2,
      "startAt":"2026-06-02T19:00:00",
      "endAt":"2026-06-02T21:00:00",
      "capacity":4000,
      "remainingSeats":4000,
      "saleOpenAt":"2026-05-21T20:00:00",
      "saleCloseAt":"2026-06-02T20:00:00",
      "bookingWindows": [
        { "tier":"LIGHTNING", "opensAt":"2026-05-21T18:00:00", "fee":500 },
        { "tier":"MIST", "opensAt":"2026-05-21T19:30:00", "fee":1000 }
      ],
      "status":"ON_SALE",
      "active":true,
      "seatmapVersion":1
    }
  ]
}
```

---

# 28. 공연 회차 상세 조회

## API

`GET /api/v1/shows/{eventId}/shows/{showId}`

## 설명

특정 공연 회차의 상세 정보를 조회합니다.

## 인증

불필요

## Request

### Path Variable

- `eventId`: 공연 ID
- `showId`: 회차 ID

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "showId":1001,
    "eventId":100,
    "sessionNo":1,
    "startAt":"2026-06-01T19:00:00",
    "endAt":"2026-06-01T21:00:00",
    "capacity":4000,
    "saleOpenAt":"2026-05-20T20:00:00",
    "saleCloseAt":"2026-06-01T20:00:00",
    "status":"ON_SALE",
    "active":true,
    "seatmapVersion":1,
    "seatmapJson":"{\"sections\":[{\"code\":\"VIP\"},{\"code\":\"R\"}]}"
  }
}
```

---

# 29. 공연 회차 좌석 메타데이터 조회

## API

`GET /api/v1/shows/{eventId}/shows/{showId}/seatmap`

## 설명

특정 회차의 좌석 메타데이터를 조회합니다.

## 인증

불필요

## Request

### Path Variable

- `eventId`: 공연 ID
- `showId`: 회차 ID

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "eventId":100,
    "showId":1001,
    "seatmapVersion":1,
    "seatmap": {
      "sections": [
        { "code":"VIP", "name":"VIP", "color":"#FF4D4F" },
        { "code":"R", "name":"R", "color":"#1890FF" }
      ]
    }
  }
}
```

---

# 30. 회차별 가격/구역 정책 조회

## API

`GET /api/v1/shows/{showId}/sections`

## 설명

특정 회차의 가격 및 구역 정책을 조회합니다.

## 인증

불필요

## Request

### Path Variable

- `showId`: 회차 ID

### Body

없음

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "showId":1001,
    "sections": [
      {
        "code":"VIP1",
        "grade":"VIP",
        "zoneNo":1,
        "price":220000,
        "color":"#FF4D4F"
      },
      {
        "code":"R1",
        "grade":"R",
        "zoneNo":1,
        "price":165000,
        "color":"#1890FF"
      }
    ]
  }
}
```

---

# 31. 공연 회차 좌석 카탈로그 조회

## API

`GET /api/v1/shows/{eventId}/shows/{showId}/seats`

## 설명

회차별 seatId/구역/행/번호/sellable 정보를 조회합니다.

## 인증

불필요

## Request

### Path Variable

- `eventId`: 공연 ID
- `showId`: 회차 ID

### Query 파라미터

- `section` (optional): 구역 코드로 필터링 (예: `VIP`, `S`). 대소문자 무관 (백엔드에서 toUpperCase 처리)

### Body

없음

## Response

### 성공 응답 (200)

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "eventId": 100,
    "showId": 1001,
    "seats": [
      {
        "seatId": "VIP-1-3-1",
        "sectionCode": "VIP1",
        "tier": "VIP",
        "zoneNo": 1,
        "row": "3",
        "number": 1,
        "sellable": true
      },
      {
        "seatId": "VIP-1-3-2",
        "sectionCode": "VIP1",
        "tier": "VIP",
        "zoneNo": 1,
        "row": "3",
        "number": 2,
        "sellable": false
      }
    ]
  }
}
```

---

# 32. 특정회차 잔여석 전체 요약 조회

GET /api/v1/shows/{eventId}/shows/{showId}/seats/summary

## 설명

공연 상세페이지에서 예매하기 버튼 클릭시(대기열서비스->예매페이지=이때 호출?) 해당 eventId와 showId기반으로 포도알이랑 좌석선택 페이지(구역별 잔여석,가격) 불러옴

-멤버십검증 필요

### Path Parameter

| 파라미터명 | 타입   | 필수 여부 | 설명         |
| ---------- | ------ | --------- | ------------ |
| eventId    | number | 필수      | 공연 ID      |
| showId     | number | 필수      | 공연 회차 ID |

Response Body

tier: 석(VIP,A,S,R)

zoneNo: 구역(1,2,3,4,5...) / (행렬구분이 아님)

sellableSeats/bookableSeats: 정책으로 막히지 않은/예약가능 구역

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "eventId": 14,
    "showId": 2,
    "tiers": [
      {
        "tier": "VIP",
        "totalSeats": 410,
        "sellableSeats": 409,
        "bookableSeats": 409,
        "zones": [
          {
            "sectionCode": "VIP1",
            "zoneNo": 1,
            "totalSeats": 184,
            "sellableSeats": 183,
            "bookableSeats": 183
          },
          {
            "sectionCode": "VIP2",
            "zoneNo": 2,
            "totalSeats": 96,
            "sellableSeats": 96,
            "bookableSeats": 96
          },
          {
            "sectionCode": "VIP3",
            "zoneNo": 3,
            "totalSeats": 130,
            "sellableSeats": 130,
            "bookableSeats": 130
          }
        ]
      },
      {
        "tier": "S",
        "totalSeats": 1440,
        "sellableSeats": 1440,
        "bookableSeats": 1440,
        "zones": [
          {
            "sectionCode": "S1",
            "zoneNo": 1,
            "totalSeats": 216,
            "sellableSeats": 216,
            "bookableSeats": 216
          }
        ]
      }
    ]
  }
}
```

---

# 33. 특정 티어/구역 예매 가능 좌석 조회

### API 주소 + 이름

```
GET /api/v1/shows/{eventId}/shows/{showId}/seats/availability
```

### Path Parameter

| 파라미터명 | 타입   | 필수 여부 | 설명         |
| ---------- | ------ | --------- | ------------ |
| eventId    | number | 필수      | 공연 ID      |
| showId     | number | 필수      | 공연 회차 ID |

### Query Parameter

| 파라미터명 | 타입   | 필수 여부 | 설명             |
| ---------- | ------ | --------- | ---------------- |
| tier       | string | 필수      | 조회할 티어      |
| zoneNo     | number | 필수      | 조회할 구역 번호 |

### Response Body

`data`는 배열로 반환됩니다 (객체로 감싸지 않음).

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": [
    {
      "seatId": "VIP-1-3-1",
      "section": "VIP1",
      "row": "3",
      "number": "1",
      "status": "AVAILABLE",
      "price": 220000,
      "lockedUntil": null,
      "sellable": true,
      "seatVersion": 1
    },
    {
      "seatId": "VIP-1-3-2",
      "section": "VIP1",
      "row": "3",
      "number": "2",
      "status": "AVAILABLE",
      "price": 220000,
      "lockedUntil": null,
      "sellable": true,
      "seatVersion": 1
    },
    {
      "seatId": "VIP-1-4-2",
      "section": "VIP1",
      "row": "4",
      "number": "2",
      "status": "AVAILABLE",
      "price": 220000,
      "lockedUntil": "2026-05-20T20:05:00",
      "sellable": false,
      "seatVersion": 2
    }
  ]
}
```

---

# 34. 회차별 멤버십 예매 오픈 시간표 조회

## API

`GET /api/v1/shows/{eventId}/shows/{showId}/booking-windows`

## 설명

LIGHTNING/THUNDER/CLOUD/MIST 기준 회차별 예매 오픈 시간을 조회합니다.

## 인증

불필요

## Request

### Path Variable

- `eventId`: 공연 ID
- `showId`: 회차 ID

### Body

없음

## Response

### 성공 응답 (200)

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "bookingWindows": {
      "LIGHTNING": "2026-05-20T18:00:00",
      "THUNDER": "2026-05-20T19:00:00",
      "CLOUD": "2026-05-20T19:30:00",
      "MIST": "2026-05-20T20:00:00"
    },
    "tierPolicies": [
      {
        "tier": "LIGHTNING",
        "presaleOffsetMinutes": 120,
        "bookingFeeWon": 500,
        "openAt": "2026-05-20T18:00:00"
      },
      {
        "tier": "THUNDER",
        "presaleOffsetMinutes": 60,
        "bookingFeeWon": 1000,
        "openAt": "2026-05-20T19:00:00"
      },
      {
        "tier": "CLOUD",
        "presaleOffsetMinutes": 30,
        "bookingFeeWon": 1500,
        "openAt": "2026-05-20T19:30:00"
      },
      {
        "tier": "MIST",
        "presaleOffsetMinutes": 0,
        "bookingFeeWon": 2000,
        "openAt": "2026-05-20T20:00:00"
      }
    ]
  }
}
```

---

# 35. 티켓 좌석 확인용 공연/좌석 정보 조회 (내부 연동)

## API

`GET /api/v1/shows/internal/tickets/info`

## 설명

showId, eventId, X-User-Id 기준으로 공연/좌석/원가 정보를 조회합니다.

양도 서비스 내부 통신용 엔드포인트입니다.

## 인증

필요

- `X-User-Id` 헤더 필요

## Request

### Header 예시

```
X-User-Id: 101
```

### Query 예시

```
GET /api/v1/shows/internal/tickets/info?eventId=100&showId=1001
```

### Query 파라미터 설명

- `eventId`: 공연 ID (필수)
- `showId`: 회차 ID (필수)

### Body

없음

## Response

### 성공 응답 (200)

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "eventId": 100,
    "showId": 1001,
    "eventName": "G-Dragon 2026 MAMA DOME TOUR",
    "showDateTime": "2026-06-01T19:00:00",
    "venue": "잠실주경기장 기본 템플릿",
    "seat": "VIP1-A-1",
    "originalPrice": 220000
  }
}
```

---

# 36. 헬스 체크

## API

`GET /api/v1/health/event`

## 설명

event-service 상태를 확인하는 헬스 체크 엔드포인트입니다.

## 인증

불필요

## Request

### Body

없음

## Response

### 성공 응답 (200)

ApiResponse로 감싸지 않고 직접 ResponseEntity로 반환합니다.

```json
{
  "service": "event-service",
  "status": "ok"
}
```
