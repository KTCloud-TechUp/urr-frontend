# 프론트 연동 현황

| 메서드 | 엔드포인트 | 연동 상태 |
| ------ | ---------- | --------- |
| POST | `/api/v1/artists` (ADMIN) | — 프론트 해당 없음 |
| GET | `/api/v1/artists` | ✅ 완료 (`getArtists`) |
| GET | `/api/v1/artists/{artistId}` | ✅ 완료 (`getArtist`) |
| POST | `/api/v1/artists/{artistId}/membership` | ✅ 완료 (`subscribeMembership`) |
| POST | `/api/v1/artists/memberships/activate` | ✅ 완료 (`activateMembership`) |
| POST | `/api/v1/artists/memberships/cancel` | ✅ 완료 (`cancelMembership`) |
| POST | `/api/v1/artists/{artistId}/follow` | ✅ 완료 (`followArtist`) |
| DELETE | `/api/v1/artists/{artistId}/follow` | ✅ 완료 (`unfollowArtist`) |
| GET | `/api/v1/artists/followings` | 🔲 미착수 |
| GET | `/api/v1/membership/artists/{artistId}/membership-policies` | 🔲 미착수 |
| GET | `/api/v1/membership/events/{eventId}/shows/{showId}/presale-policy` | ✅ 완료 (`getPresalePolicy`) |
| GET | `/api/v1/membership` | ✅ 완료 (`getMemberships`) |
| GET | `/api/v1/membership/{membershipId}` | 🔲 미착수 |
| PATCH | `/api/v1/membership/{membershipId}/nickname` | ✅ 완료 (`updateNickname`) |
| POST | `/api/v1/artists/{artistId}/events` (ADMIN) | — 프론트 해당 없음 |
| GET | `/api/v1/artists/{artistId}/events` | ✅ 완료 (`getArtistEvents`) |
| GET | `/api/v1/artists/{artistId}/events/{eventId}` | ✅ 완료 (`getEventDetail`) |
| GET | `/api/v1/events` | ✅ 완료 (`getEvents`) |
| GET | `/api/v1/events/home` | ✅ 완료 (`getHome`) |
| POST | `/api/v1/events/venues` (ADMIN) | — 프론트 해당 없음 |
| GET | `/api/v1/events/venues` | ✅ 완료 (`getVenues`) |
| GET | `/api/v1/events/venues/{venueTemplateId}` | ✅ 완료 (`getVenueDetail`) |
| POST | `/api/v1/shows/{eventId}/shows` (ADMIN) | — 프론트 해당 없음 |
| GET | `/api/v1/shows/{eventId}/shows` | ✅ 완료 (`getShows`) |
| GET | `/api/v1/shows/{eventId}/shows/{showId}` | 🔲 미착수 |
| GET | `/api/v1/shows/{eventId}/shows/{showId}/seatmap` | 🔲 미착수 |
| GET | `/api/v1/shows/{showId}/sections` | 🔲 미착수 |

> ⚠️ 추가 연동 완료된 엔드포인트 (이 파일에 명세 없음):  
> `GET /api/v1/shows/{eventId}/shows/{showId}/seats/summary` → `getSeatsSummary` ✅  
> `GET /api/v1/shows/{eventId}/shows/{showId}/seats/availability` → `getSeatsAvailability` ✅

---

# 1. 아티스트 생성 (ADMIN)

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
- `category`: 아티스트 카테고리 (`BOYGROUP`, `GIRLGROUP`, `SOLO`, `BAND`)

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
    "category":"boygroup"
  }
}
```

---

# 3. 아티스트 목록 조회

## API

`GET /api/v1/artists`

## 설명

아티스트 목록을 조회합니다.

## 인증

불필요

## Request

### Query 예시

```
GET /api/v1/artists?category=BOYGROUP
```

### Query 파라미터 설명

- `category` (optional): 아티스트 카테고리 (`BOYGROUP`, `GIRLGROUP`, `SOLO`, `BAND`)

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
    "id":1,
    "name":"BIGBANG",
    "profileImageUrl":"https://cdn.example.com/artists/bigbang.png",
    "description":"2010년대를 빛낸 인기 K-POP 그룹",
    "followerCount":12500,
    "bio":"전 세계 팬들과 소통하는 아티스트",
    "bannerImageUrl":"https://cdn.example.com/artists/bigbang-banner.png",
    "category":"boygroup"
  }
}
```

---

# 5. 아티스트 멤버십 구독

## API

`POST /api/v1/artists/{artistId}/membership`

## 설명

특정 아티스트의 멤버십을 구독합니다.

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

- `orderId`: 멤버십 주문 ID
- `paymentId`: 결제 ID

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

- `orderId`: 멤버십 주문 ID
- `reason`: 취소 사유

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
        "bookingFeeWon":1000
      },
      {
        "tier":"THUNDER",
        "presaleOffsetMinutes":120,
        "bookingFeeWon":500
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
  "data": [
    {
      "membershipId":9001,
      "artistId":1,
      "artistName":"BIGBANG",
      "nickname":"VIP_팬",
      "tier":"LIGHTNING",
      "tierLevel":4,
      "tierProgressPercent":100,
      "status":"ACTIVE",
      "startDate":"2026-03-01",
      "endDate":"2027-02-28",
      "active":true
    },
    {
      "membershipId":9002,
      "artistId":2,
      "artistName":"NewJeans",
      "nickname":"버니즈",
      "tier":"MIST",
      "tierLevel":1,
      "tierProgressPercent":25,
      "status":"PENDING",
      "startDate":null,
      "endDate":null,
      "active":false
    }
  ]
}
```

---

# 14. 내 멤버십 상세 조회

## API

`GET /api/v1/membership/{membershipId}`

## 설명

특정 멤버십의 상세 정보를 조회합니다.

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

- `nickname`: 변경할 닉네임

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

# 16. 공연 생성 (ADMIN)

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

# 17. 아티스트 공연 목록 조회

## API

`GET /api/v1/artists/{artistId}/events`

## 설명

특정 아티스트의 공연 목록을 조회합니다.

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
    },
    {
      "eventId":101,
      "artistId":1,
      "artistName":"BIGBANG",
      "title":"BIGBANG FANMEETING 2026",
      "subtitle":"HELLO VIP",
      "description":"팬미팅",
      "venueTemplateId":11,
      "venueTemplateName":"KSPO 돔 템플릿",
      "venueAddress":"서울특별시 송파구 올림픽로 424",
      "posterImageUrl":"https://cdn.example.com/posters/bb-fm-2026.png",
      "category":"fanmeeting",
      "tags": ["FAN","LIMITED"],
      "openDate":"2026-06-01",
      "endDate":"2026-06-01",
      "active":true,
      "runtime":"약 90분",
      "ageRating":"전체관람가",
      "notices": ["지정석 공연","지연 입장 가능"],
      "identityVerification": ["실물 신분증 필수","예매자 본인 확인"],
      "castInfo":"BIGBANG",
      "cancellationPolicy": [
        { "period":"공연 7일 전", "fee":"수수료 없음" },
        { "period":"공연 1일 전", "fee":"티켓금액의 20%" }
      ],
      "ticketDelivery": ["모바일 티켓","현장 수령"],
      "sections": [
        { "name":"R", "price":132000, "totalSeats":2500 },
        { "name":"S", "price":99000, "totalSeats":3000 }
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

# 18. 공연 상세 조회

## API

`GET /api/v1/artists/{artistId}/events/{eventId}`

## 설명

특정 공연의 상세 정보를 조회합니다.

## 인증

불필요

## Request

### Path Variable

- `artistId`: 아티스트 ID
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

# 19. 전체 공연 목록 조회

## API

`GET /api/v1/events`

## 설명

전체 공연 목록을 조회합니다.

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
      "title":"G-Dragon 2026 MAMA DOME TOUR"
    },
    {
      "eventId":101,
      "artistId":2,
      "artistName":"NewJeans",
      "title":"NewJeans Summer Live 2026"
    }
  ]
}
```

---

# 20. 공연장 템플릿 생성 (ADMIN)

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
  }
}
```

### 필드 설명

- `name`: 템플릿 이름
- `seatmapJson`: 좌석맵 JSON
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
    "seatmapJson": "{\"version\":1,\"sections\":[{\"name\":\"VIP\",\"seats\":[{\"row\":\"A\",\"number\":1},{\"row\":\"A\",\"number\":2},{\"row\":\"A\",\"number\":3}]},{\"name\":\"R\",\"seats\":[{\"row\":\"B\",\"number\":1},{\"row\":\"B\",\"number\":2},{\"row\":\"B\",\"number\":3}]},{\"name\":\"S\",\"seats\":[{\"row\":\"C\",\"number\":1},{\"row\":\"C\",\"number\":2}]}]}"
  }
}
```

---

# 21. 공연장 템플릿 목록 조회

## API

`GET /api/v1/events/venues`

## 설명

공연장 템플릿 목록을 조회합니다.

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

# 22. 공연장 템플릿 상세 조회

## API

`GET /api/v1/events/venues/{venueTemplateId}`

## 설명

특정 공연장 템플릿의 상세 정보를 조회합니다.

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

# 23. 공연 회차 생성 (ADMIN)

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
  "seatmapJson": {
    "sections": [
      { "code":"VIP", "name":"VIP" },
      { "code":"R", "name":"R" }
    ]
  },
  "blockedSeats": [
    { "section":"VIP", "row":"A", "number":1 },
    { "section":"R", "row":"B", "number":10 }
  ]
}
```

### 필드 설명

- `sessionNo`: 회차 번호
- `startAt`: 공연 시작 일시
- `endAt`: 공연 종료 일시
- `capacity`: 전체 좌석 수
- `saleOpenAt`: 판매 시작 일시
- `saleCloseAt`: 판매 종료 일시
- `seatmapJson`: 회차별 좌석맵 JSON
- `blockedSeats`: 판매 제외 좌석 목록

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

# 24. 공연 회차 목록 조회

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
        { "tier":"MIST", "opensAt":"2026-05-20T19:30:00", "fee":1000 }
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

# 25. 공연 회차 상세 조회

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

# 26. 공연 회차 좌석 메타데이터 조회

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

# 27. 회차별 가격/구역 정책 조회

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
        "code":"VIP",
        "name":"VIP",
        "price":220000,
        "color":"#FF4D4F",
        "displayOrder":1
      },
      {
        "code":"R",
        "name":"R",
        "price":165000,
        "color":"#1890FF",
        "displayOrder":2
      }
    ]
  }
}
```

---

# 28. Home 조회

`GET /api/v1/events/home`

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
      },
      {
        "rank": 2,
        "eventId": 12,
        "eventTitle": "BIGBANG 2026 WORLD TOUR",
        "artistId": 2,
        "artistName": "빅뱅",
        "posterImageUrl": "https://cdn.example.com/posters/bigbang-tour.png",
        "openDate": "2026-04-18",
        "endDate": "2026-04-19"
      },
      {
        "rank": 3,
        "eventId": 13,
        "eventTitle": "NOVA FIRST FAN-CON",
        "artistId": 3,
        "artistName": "NOVA",
        "posterImageUrl": "https://cdn.example.com/posters/nova-fancon.png",
        "openDate": "2026-04-22",
        "endDate": "2026-04-22"
      },
      {
        "rank": 4,
        "eventId": 11,
        "eventTitle": "BTS Yet To Come Encore",
        "artistId": 1,
        "artistName": "BTS",
        "posterImageUrl": "https://cdn.example.com/posters/bts-encore.png",
        "openDate": "2026-04-20",
        "endDate": "2026-04-21"
      }
    ],
    "popularArtists": [
      {
        "artistId": 2,
        "artistName": "빅뱅",
        "profileImageUrl": "https://cdn.example.com/artists/bigbang.png",
        "followerCount": 3,
        "category": "boygroup"
      },
      {
        "artistId": 3,
        "artistName": "NOVA",
        "profileImageUrl": "https://cdn.example.com/artists/nova-boys.png",
        "followerCount": 2,
        "category": "girlgroup"
      },
      {
        "artistId": 1,
        "artistName": "BTS",
        "profileImageUrl": "https://cdn.example.com/artists/bts.png",
        "followerCount": 0,
        "category": "boygroup"
      },
      {
        "artistId": 4,
        "artistName": "악동뮤지션",
        "profileImageUrl": "https://cdn.example.com/artists/bts.png",
        "followerCount": 0,
        "category": "coedgroup"
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
      },
      {
        "eventId": 12,
        "eventTitle": "BIGBANG 2026 WORLD TOUR",
        "artistId": 2,
        "artistName": "빅뱅",
        "posterImageUrl": "https://cdn.example.com/posters/bigbang-tour.png",
        "venueAddress": "KSPO DOME",
        "openDate": "2026-04-18",
        "endDate": "2026-04-19"
      },
      {
        "eventId": 11,
        "eventTitle": "BTS Yet To Come Encore",
        "artistId": 1,
        "artistName": "BTS",
        "posterImageUrl": "https://cdn.example.com/posters/bts-encore.png",
        "venueAddress": "잠실종합운동장 주경기장",
        "openDate": "2026-04-20",
        "endDate": "2026-04-21"
      },
      {
        "eventId": 13,
        "eventTitle": "NOVA FIRST FAN-CON",
        "artistId": 3,
        "artistName": "NOVA",
        "posterImageUrl": "https://cdn.example.com/posters/nova-fancon.png",
        "venueAddress": "올림픽공원 핸드볼경기장",
        "openDate": "2026-04-22",
        "endDate": "2026-04-22"
      }
    ],
    "presaleOpeningSoon": [],
    "newArtists": [
      {
        "artistId": 4,
        "artistName": "악동뮤지션",
        "profileImageUrl": "https://cdn.example.com/artists/bts.png",
        "followerCount": 0,
        "category": "coedgroup"
      },
      {
        "artistId": 3,
        "artistName": "NOVA",
        "profileImageUrl": "https://cdn.example.com/artists/nova-boys.png",
        "followerCount": 2,
        "category": "girlgroup"
      },
      {
        "artistId": 2,
        "artistName": "빅뱅",
        "profileImageUrl": "https://cdn.example.com/artists/bigbang.png",
        "followerCount": 3,
        "category": "boygroup"
      },
      {
        "artistId": 1,
        "artistName": "BTS",
        "profileImageUrl": "https://cdn.example.com/artists/bts.png",
        "followerCount": 0,
        "category": "boygroup"
      }
    ]
  }
}
```

---

# 29. 공연장 템플릿 생성

이런 형식이 괜찮은지 정도만 확인해주세요!

request

```json
{
  "name": "URR KSPO DOME STYLE V1",
  "tiers": [
    {
      "tierCode": "VIP",
      "zones": [
        {
          "zoneNo": 1,
          "rowStart": "A",
          "rowEnd": "W",
          "colStart": 1,
          "colEnd": 8
        },
        {
          "zoneNo": 2,
          "rowStart": "A",
          "rowEnd": "F",
          "colStart": 1,
          "colEnd": 16
        },
        {
          "zoneNo": 3,
          "rowStart": "A",
          "rowEnd": "M",
          "colStart": 1,
          "colEnd": 10
        }
      ]
    },
    {
      "tierCode": "S",
      "zones": [
        {
          "zoneNo": 1,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 18
        },
        {
          "zoneNo": 2,
          "rowStart": "A",
          "rowEnd": "K",
          "colStart": 1,
          "colEnd": 18
        },
        {
          "zoneNo": 3,
          "rowStart": "A",
          "rowEnd": "K",
          "colStart": 1,
          "colEnd": 18
        },
        {
          "zoneNo": 4,
          "rowStart": "A",
          "rowEnd": "J",
          "colStart": 1,
          "colEnd": 18
        },
        {
          "zoneNo": 5,
          "rowStart": "A",
          "rowEnd": "J",
          "colStart": 1,
          "colEnd": 18
        },
        {
          "zoneNo": 6,
          "rowStart": "A",
          "rowEnd": "I",
          "colStart": 1,
          "colEnd": 18
        },
        {
          "zoneNo": 7,
          "rowStart": "A",
          "rowEnd": "I",
          "colStart": 1,
          "colEnd": 18
        },
        {
          "zoneNo": 8,
          "rowStart": "A",
          "rowEnd": "H",
          "colStart": 1,
          "colEnd": 18
        }
      ]
    },
    {
      "tierCode": "R",
      "zones": [
        {
          "zoneNo": 1,
          "rowStart": "A",
          "rowEnd": "J",
          "colStart": 1,
          "colEnd": 16
        },
        {
          "zoneNo": 2,
          "rowStart": "A",
          "rowEnd": "J",
          "colStart": 1,
          "colEnd": 16
        },
        {
          "zoneNo": 3,
          "rowStart": "A",
          "rowEnd": "J",
          "colStart": 1,
          "colEnd": 16
        },
        {
          "zoneNo": 4,
          "rowStart": "A",
          "rowEnd": "I",
          "colStart": 1,
          "colEnd": 16
        },
        {
          "zoneNo": 5,
          "rowStart": "A",
          "rowEnd": "I",
          "colStart": 1,
          "colEnd": 16
        },
        {
          "zoneNo": 6,
          "rowStart": "A",
          "rowEnd": "H",
          "colStart": 1,
          "colEnd": 16
        },
        {
          "zoneNo": 7,
          "rowStart": "A",
          "rowEnd": "H",
          "colStart": 1,
          "colEnd": 16
        }
      ]
    },
    {
      "tierCode": "A",
      "zones": [
        {
          "zoneNo": 1,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 2,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 3,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 4,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 5,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 6,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 7,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 8,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 9,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 10,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 11,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 12,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 13,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 14,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 15,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 16,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 17,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 18,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 19,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        },
        {
          "zoneNo": 20,
          "rowStart": "A",
          "rowEnd": "L",
          "colStart": 1,
          "colEnd": 22
        }
      ]
    }
  ]
}
```

---

# 30. 특정회차 잔여석 전체 요약 조회

GET /api/v1/shows/{eventId}/shows/{showId}/seats/summary

### Path Parameter

| 파라미터명 | 타입   | 필수 여부 | 설명         |
| ---------- | ------ | --------- | ------------ |
| eventId    | number | 필수      | 공연 ID      |
| showId     | number | 필수      | 공연 회차 ID |

Response Body

tier: 석(VIP,A,S,R)

zoneNo: 구역(1,2,3,4,5…) / (행렬구분이 아님)

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
          },
          {
            "sectionCode": "S2",
            "zoneNo": 2,
            "totalSeats": 198,
            "sellableSeats": 198,
            "bookableSeats": 198
          },
          {
            "sectionCode": "S3",
            "zoneNo": 3,
            "totalSeats": 198,
            "sellableSeats": 198,
            "bookableSeats": 198
          },
          {
            "sectionCode": "S4",
            "zoneNo": 4,
            "totalSeats": 180,
            "sellableSeats": 180,
            "bookableSeats": 180
          },
          {
            "sectionCode": "S5",
            "zoneNo": 5,
            "totalSeats": 180,
            "sellableSeats": 180,
            "bookableSeats": 180
          },
          {
            "sectionCode": "S6",
            "zoneNo": 6,
            "totalSeats": 162,
            "sellableSeats": 162,
            "bookableSeats": 162
          },
          {
            "sectionCode": "S7",
            "zoneNo": 7,
            "totalSeats": 162,
            "sellableSeats": 162,
            "bookableSeats": 162
          },
          {
            "sectionCode": "S8",
            "zoneNo": 8,
            "totalSeats": 144,
            "sellableSeats": 144,
            "bookableSeats": 144
          }
        ]
      },
      {
        "tier": "R",
        "totalSeats": 1024,
        "sellableSeats": 1024,
        "bookableSeats": 1024,
        "zones": [
          {
            "sectionCode": "R1",
            "zoneNo": 1,
            "totalSeats": 160,
            "sellableSeats": 160,
            "bookableSeats": 160
          },
          {
            "sectionCode": "R2",
            "zoneNo": 2,
            "totalSeats": 160,
            "sellableSeats": 160,
            "bookableSeats": 160
          },
          {
            "sectionCode": "R3",
            "zoneNo": 3,
            "totalSeats": 160,
            "sellableSeats": 160,
            "bookableSeats": 160
          },
          {
            "sectionCode": "R4",
            "zoneNo": 4,
            "totalSeats": 144,
            "sellableSeats": 144,
            "bookableSeats": 144
          },
          {
            "sectionCode": "R5",
            "zoneNo": 5,
            "totalSeats": 144,
            "sellableSeats": 144,
            "bookableSeats": 144
          },
          {
            "sectionCode": "R6",
            "zoneNo": 6,
            "totalSeats": 128,
            "sellableSeats": 128,
            "bookableSeats": 128
          },
          {
            "sectionCode": "R7",
            "zoneNo": 7,
            "totalSeats": 128,
            "sellableSeats": 128,
            "bookableSeats": 128
          }
        ]
      },
      {
        "tier": "A",
        "totalSeats": 5280,
        "sellableSeats": 5280,
        "bookableSeats": 5280,
        "zones": [
          {
            "sectionCode": "A1",
            "zoneNo": 1,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A2",
            "zoneNo": 2,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A3",
            "zoneNo": 3,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A4",
            "zoneNo": 4,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A5",
            "zoneNo": 5,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A6",
            "zoneNo": 6,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A7",
            "zoneNo": 7,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A8",
            "zoneNo": 8,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A9",
            "zoneNo": 9,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A10",
            "zoneNo": 10,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A11",
            "zoneNo": 11,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A12",
            "zoneNo": 12,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A13",
            "zoneNo": 13,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A14",
            "zoneNo": 14,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A15",
            "zoneNo": 15,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A16",
            "zoneNo": 16,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A17",
            "zoneNo": 17,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A18",
            "zoneNo": 18,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A19",
            "zoneNo": 19,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          },
          {
            "sectionCode": "A20",
            "zoneNo": 20,
            "totalSeats": 264,
            "sellableSeats": 264,
            "bookableSeats": 264
          }
        ]
      }
    ]
  }
}
```

---

# 31. 특정 티어/구역 예매 가능 좌석 조회

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

### Response

### Response Body

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "eventId": 14,
    "showId": 2,
    "tier": "VIP",
    "zoneNo": 1,
    "sectionCode": "VIP1",
    "totalSeats": 184,
    "sellableSeats": 183,
    "bookableSeats": 183,
    "seats": [
      {
        "seatId": "VIP1-A-1",
        "row": "A",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-A-2",
        "row": "A",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-A-3",
        "row": "A",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-A-4",
        "row": "A",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-A-5",
        "row": "A",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-A-6",
        "row": "A",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-A-7",
        "row": "A",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-A-8",
        "row": "A",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-B-1",
        "row": "B",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-B-2",
        "row": "B",
        "number": 2,
        "sellable": false,
        "ticketStatus": "AVAILABLE",
        "bookable": false
      },
      {
        "seatId": "VIP1-B-3",
        "row": "B",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-B-4",
        "row": "B",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-B-5",
        "row": "B",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-B-6",
        "row": "B",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-B-7",
        "row": "B",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-B-8",
        "row": "B",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-C-1",
        "row": "C",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-C-2",
        "row": "C",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-C-3",
        "row": "C",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-C-4",
        "row": "C",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-C-5",
        "row": "C",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-C-6",
        "row": "C",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-C-7",
        "row": "C",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-C-8",
        "row": "C",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-D-1",
        "row": "D",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-D-2",
        "row": "D",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-D-3",
        "row": "D",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-D-4",
        "row": "D",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-D-5",
        "row": "D",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-D-6",
        "row": "D",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-D-7",
        "row": "D",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-D-8",
        "row": "D",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-E-1",
        "row": "E",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-E-2",
        "row": "E",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-E-3",
        "row": "E",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-E-4",
        "row": "E",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-E-5",
        "row": "E",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-E-6",
        "row": "E",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-E-7",
        "row": "E",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-E-8",
        "row": "E",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-F-1",
        "row": "F",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-F-2",
        "row": "F",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-F-3",
        "row": "F",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-F-4",
        "row": "F",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-F-5",
        "row": "F",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-F-6",
        "row": "F",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-F-7",
        "row": "F",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-F-8",
        "row": "F",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-G-1",
        "row": "G",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-G-2",
        "row": "G",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-G-3",
        "row": "G",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-G-4",
        "row": "G",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-G-5",
        "row": "G",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-G-6",
        "row": "G",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-G-7",
        "row": "G",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-G-8",
        "row": "G",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-H-1",
        "row": "H",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-H-2",
        "row": "H",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-H-3",
        "row": "H",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-H-4",
        "row": "H",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-H-5",
        "row": "H",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-H-6",
        "row": "H",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-H-7",
        "row": "H",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-H-8",
        "row": "H",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-I-1",
        "row": "I",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-I-2",
        "row": "I",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-I-3",
        "row": "I",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-I-4",
        "row": "I",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-I-5",
        "row": "I",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-I-6",
        "row": "I",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-I-7",
        "row": "I",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-I-8",
        "row": "I",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-J-1",
        "row": "J",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-J-2",
        "row": "J",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-J-3",
        "row": "J",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-J-4",
        "row": "J",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-J-5",
        "row": "J",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-J-6",
        "row": "J",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-J-7",
        "row": "J",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-J-8",
        "row": "J",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-K-1",
        "row": "K",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-K-2",
        "row": "K",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-K-3",
        "row": "K",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-K-4",
        "row": "K",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-K-5",
        "row": "K",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-K-6",
        "row": "K",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-K-7",
        "row": "K",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-K-8",
        "row": "K",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-L-1",
        "row": "L",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-L-2",
        "row": "L",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-L-3",
        "row": "L",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-L-4",
        "row": "L",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-L-5",
        "row": "L",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-L-6",
        "row": "L",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-L-7",
        "row": "L",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-L-8",
        "row": "L",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-M-1",
        "row": "M",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-M-2",
        "row": "M",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-M-3",
        "row": "M",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-M-4",
        "row": "M",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-M-5",
        "row": "M",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-M-6",
        "row": "M",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-M-7",
        "row": "M",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-M-8",
        "row": "M",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-N-1",
        "row": "N",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-N-2",
        "row": "N",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-N-3",
        "row": "N",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-N-4",
        "row": "N",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-N-5",
        "row": "N",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-N-6",
        "row": "N",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-N-7",
        "row": "N",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-N-8",
        "row": "N",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-O-1",
        "row": "O",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-O-2",
        "row": "O",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-O-3",
        "row": "O",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-O-4",
        "row": "O",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-O-5",
        "row": "O",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-O-6",
        "row": "O",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-O-7",
        "row": "O",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-O-8",
        "row": "O",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-P-1",
        "row": "P",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-P-2",
        "row": "P",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-P-3",
        "row": "P",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-P-4",
        "row": "P",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-P-5",
        "row": "P",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-P-6",
        "row": "P",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-P-7",
        "row": "P",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-P-8",
        "row": "P",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-Q-1",
        "row": "Q",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-Q-2",
        "row": "Q",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-Q-3",
        "row": "Q",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-Q-4",
        "row": "Q",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-Q-5",
        "row": "Q",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-Q-6",
        "row": "Q",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-Q-7",
        "row": "Q",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-Q-8",
        "row": "Q",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-R-1",
        "row": "R",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-R-2",
        "row": "R",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-R-3",
        "row": "R",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-R-4",
        "row": "R",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-R-5",
        "row": "R",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-R-6",
        "row": "R",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-R-7",
        "row": "R",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-R-8",
        "row": "R",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-S-1",
        "row": "S",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-S-2",
        "row": "S",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-S-3",
        "row": "S",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-S-4",
        "row": "S",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-S-5",
        "row": "S",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-S-6",
        "row": "S",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-S-7",
        "row": "S",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-S-8",
        "row": "S",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-T-1",
        "row": "T",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-T-2",
        "row": "T",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-T-3",
        "row": "T",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-T-4",
        "row": "T",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-T-5",
        "row": "T",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-T-6",
        "row": "T",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-T-7",
        "row": "T",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-T-8",
        "row": "T",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-U-1",
        "row": "U",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-U-2",
        "row": "U",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-U-3",
        "row": "U",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-U-4",
        "row": "U",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-U-5",
        "row": "U",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-U-6",
        "row": "U",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-U-7",
        "row": "U",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-U-8",
        "row": "U",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-V-1",
        "row": "V",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-V-2",
        "row": "V",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-V-3",
        "row": "V",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-V-4",
        "row": "V",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-V-5",
        "row": "V",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-V-6",
        "row": "V",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-V-7",
        "row": "V",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-V-8",
        "row": "V",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-W-1",
        "row": "W",
        "number": 1,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-W-2",
        "row": "W",
        "number": 2,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-W-3",
        "row": "W",
        "number": 3,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-W-4",
        "row": "W",
        "number": 4,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-W-5",
        "row": "W",
        "number": 5,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-W-6",
        "row": "W",
        "number": 6,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-W-7",
        "row": "W",
        "number": 7,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      },
      {
        "seatId": "VIP1-W-8",
        "row": "W",
        "number": 8,
        "sellable": true,
        "ticketStatus": "AVAILABLE",
        "bookable": true
      }
    ]
  }
}
```
