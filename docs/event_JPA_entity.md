# URR 이벤트 서비스 — JPA Entity & 시드 데이터 SQL

---

## SQL 재생성 프롬프트

```
docs/event_JPA_entity.md의 테이블 구조와
src/shared/lib/mocks/ 데이터를 기반으로,
docs/event.sql 파일을 전부 지우고 새로 작성해 주세요.

[전제 조건]
- 테이블은 Hibernate를 통해 이미 생성된 상태
- MySQL 기준 SQL 문법
- Entity 필드명 = DB 컬럼명

[규칙]
- null 값은 명시적으로 NULL
- enum은 문자열로 저장
- 날짜/시간은 MySQL DATETIME 형식
- 외래키는 mock 데이터 ID 기준으로 맞춤
- bulk insert 형태로 작성
- INSERT 순서: artists → venue_templates → membership_policies → events → shows → show_section_policies → artist_follows → artist_memberships

[출력]
- docs/event.sql 파일 전체를 교체
- 테이블 단위로 구분 (-- 주석), 실행 가능한 SQL만 작성
```

---

## 테이블 구조 (MySQL_JPA Entity 기반)

> Spring Boot JPA Entity 기반 MySQL 테이블 정의서  
> INSERT SQL 작성 시 참고용

---

### 공통 사항

- 모든 테이블(★ 예외 있음)에 `created_at DATETIME`, `updated_at DATETIME` 컬럼이 자동 포함됩니다 (`BaseTimeEntity`).
- `id`는 모두 `BIGINT AUTO_INCREMENT PK`입니다.
- Enum 값은 **문자열 그대로** 저장됩니다 (`EnumType.STRING`).

---

### INSERT 순서 (FK 의존성)

```
1. artists
2. venue_templates
3. membership_policies  → artists
4. events               → artists, venue_templates
5. shows                → events
6. show_section_policies → shows
7. artist_follows       → artists
8. artist_memberships   → artists
```

---

### 1. `artists`

| 컬럼                | 타입          | 제약               | 비고             |
| ------------------- | ------------- | ------------------ | ---------------- |
| `id`                | BIGINT        | PK, AUTO_INCREMENT |                  |
| `name`              | VARCHAR(80)   | NOT NULL, UNIQUE   |                  |
| `profile_image_url` | VARCHAR(500)  |                    |                  |
| `description`       | VARCHAR(1000) |                    |                  |
| `bio`               | VARCHAR(1000) |                    |                  |
| `banner_image_url`  | VARCHAR(500)  |                    |                  |
| `category`          | VARCHAR(20)   |                    | Enum → 아래 참고 |
| `created_at`        | DATETIME      |                    |                  |
| `updated_at`        | DATETIME      |                    |                  |

**`category` Enum**

```
BOYGROUP | GIRLGROUP | SOLO | BAND | COEDGROUP | ETC
```

---

### 2. `venue_templates`

| 컬럼            | 타입         | 제약               | 비고           |
| --------------- | ------------ | ------------------ | -------------- |
| `id`            | BIGINT       | PK, AUTO_INCREMENT |                |
| `name`          | VARCHAR(120) | NOT NULL, UNIQUE   |                |
| `seatmap_json`  | JSON         | NOT NULL           | 구역 구성 정보 |
| `base_capacity` | INT          | NOT NULL           | 기본 수용 인원 |
| `active`        | BOOLEAN      | NOT NULL           |                |
| `created_at`    | DATETIME     |                    |                |
| `updated_at`    | DATETIME     |                    |                |

**`seatmap_json` 예시**

```json
{
  "sections": [
    { "code": "VIP", "name": "VIP 구역" },
    { "code": "R", "name": "R석" },
    { "code": "S", "name": "S석" },
    { "code": "A", "name": "A석" }
  ]
}
```

---

### 3. `events`

| 컬럼                         | 타입          | 제약                           | 비고                  |
| ---------------------------- | ------------- | ------------------------------ | --------------------- |
| `id`                         | BIGINT        | PK, AUTO_INCREMENT             |                       |
| `artist_id`                  | BIGINT        | NOT NULL, FK → artists         |                       |
| `venue_template_id`          | BIGINT        | NOT NULL, FK → venue_templates |                       |
| `title`                      | VARCHAR(120)  | NOT NULL                       |                       |
| `description`                | VARCHAR(2000) |                                |                       |
| `open_date`                  | DATE          | NOT NULL                       | 예매 오픈 기준일      |
| `end_date`                   | DATE          |                                |                       |
| `active`                     | BOOLEAN       | NOT NULL                       |                       |
| `poster_image_url`           | VARCHAR(500)  |                                |                       |
| `category`                   | VARCHAR(20)   | NOT NULL                       | Enum → 아래 참고      |
| `tags_json`                  | JSON          |                                | Enum 배열 → 아래 참고 |
| `runtime`                    | VARCHAR(120)  |                                | 예: `"150분"`         |
| `age_rating`                 | VARCHAR(120)  |                                | 예: `"만 7세 이상"`   |
| `venue_address`              | VARCHAR(500)  |                                |                       |
| `subtitle`                   | VARCHAR(255)  |                                |                       |
| `notices_json`               | JSON          |                                | 문자열 배열           |
| `identity_verification_json` | JSON          |                                | 문자열 배열           |
| `cast_info`                  | VARCHAR(2000) |                                |                       |
| `cancellation_policy_json`   | JSON          |                                | 객체 배열             |
| `ticket_delivery_json`       | JSON          |                                | 문자열 배열           |
| `sections_json`              | JSON          |                                | 구역별 가격 배열      |
| `organizer_json`             | JSON          |                                | 주최사 정보           |
| `created_at`                 | DATETIME      |                                |                       |
| `updated_at`                 | DATETIME      |                                |                       |

**`category` Enum**

```
CONCERT | FANMEETING | FESTIVAL | MUSICAL | ETC
```

**`tags_json` Enum 값** (배열 형태로 저장)

```
HOT | NEW | PRE_SALE | TRANSFER_AVAILABLE
```

예시: `'["HOT", "NEW"]'`

**JSON 컬럼 예시**

```json
// notices_json
["본 공연은 우천 시에도 진행됩니다.", "공연 시작 후 30분 이후에는 입장이 제한될 수 있습니다."]

// cancellation_policy_json
[
  { "period": "관람일 기준 7일 전", "fee": "없음" },
  { "period": "관람일 기준 3~6일 전", "fee": "10%" },
  { "period": "관람 당일", "fee": "취소 불가" }
]

// sections_json
[
  { "code": "VIP", "name": "VIP 구역", "price": 165000 },
  { "code": "R",   "name": "R석",     "price": 143000 }
]

// organizer_json
{ "host": "YG Entertainment", "manager": "URR 티켓팅", "contact": "1588-0000", "email": "support@urr.kr" }
```

---

### 4. `shows`

| 컬럼              | 타입        | 제약                  | 비고                   |
| ----------------- | ----------- | --------------------- | ---------------------- |
| `id`              | BIGINT      | PK, AUTO_INCREMENT    |                        |
| `event_id`        | BIGINT      | NOT NULL, FK → events |                        |
| `session_no`      | INT         | NOT NULL              | 1회차=1, 2회차=2, ...  |
| `start_at`        | DATETIME    | NOT NULL              |                        |
| `end_at`          | DATETIME    | NOT NULL              |                        |
| `capacity`        | INT         | NOT NULL              | 해당 회차 수용 인원    |
| `active`          | BOOLEAN     | NOT NULL              |                        |
| `sale_open_at`    | DATETIME    |                       | 예매 시작 일시         |
| `sale_close_at`   | DATETIME    |                       | 예매 마감 일시         |
| `status`          | VARCHAR(30) | NOT NULL              | Enum → 아래 참고       |
| `seatmap_json`    | JSON        |                       | 좌석 배치도 (nullable) |
| `seatmap_version` | BIGINT      | NOT NULL              | 기본값 1               |
| `created_at`      | DATETIME    |                       |                        |
| `updated_at`      | DATETIME    |                       |                        |

**`status` Enum**

```
DRAFT | OPEN | CLOSED | CANCELED
```

---

### 5. `show_section_policies`

| 컬럼            | 타입        | 제약                 | 비고                                 |
| --------------- | ----------- | -------------------- | ------------------------------------ |
| `id`            | BIGINT      | PK, AUTO_INCREMENT   |                                      |
| `show_id`       | BIGINT      | NOT NULL, FK → shows |                                      |
| `code`          | VARCHAR(30) | NOT NULL             | 구역 코드 (예: `VIP`, `R`, `S`, `A`) |
| `name`          | VARCHAR(60) | NOT NULL             | 구역 이름 (예: `VIP 구역`, `R석`)    |
| `price`         | BIGINT      | NOT NULL             | 가격 (원)                            |
| `color`         | VARCHAR(20) |                      | HEX 색상 코드                        |
| `display_order` | INT         | NOT NULL             | 표시 순서 (1부터 시작)               |
| `active`        | BOOLEAN     | NOT NULL             |                                      |
| `created_at`    | DATETIME    |                      |                                      |
| `updated_at`    | DATETIME    |                      |                                      |

---

### 6. `membership_policies`

| 컬럼                     | 타입        | 제약                   | 비고                                       |
| ------------------------ | ----------- | ---------------------- | ------------------------------------------ |
| `id`                     | BIGINT      | PK, AUTO_INCREMENT     |                                            |
| `artist_id`              | BIGINT      | NOT NULL, FK → artists |                                            |
| `tier`                   | VARCHAR(20) | NOT NULL               | Enum → 아래 참고                           |
| `presale_offset_minutes` | INT         | NOT NULL               | 선예매 오프셋(분). 높을수록 일찍 예매 가능 |
| `booking_fee_won`        | INT         | NOT NULL               | 예매 수수료 (원)                           |
| `created_at`             | DATETIME    |                        |                                            |
| `updated_at`             | DATETIME    |                        |                                            |

**UNIQUE** `(artist_id, tier)`

**`tier` Enum** (레벨 순서)

```
LIGHTNING(1) > THUNDER(2) > CLOUD(3) > MIST(4)
```

> 숫자가 낮을수록 높은 등급 (LIGHTNING이 최고 등급)

---

### 7. `artist_follows`

| 컬럼         | 타입     | 제약                   | 비고                 |
| ------------ | -------- | ---------------------- | -------------------- |
| `id`         | BIGINT   | PK, AUTO_INCREMENT     |                      |
| `artist_id`  | BIGINT   | NOT NULL, FK → artists |                      |
| `user_id`    | BIGINT   | NOT NULL               | user-service FK 없음 |
| `created_at` | DATETIME |                        |                      |
| `updated_at` | DATETIME |                        |                      |

**UNIQUE** `(artist_id, user_id)`

---

### 8. `artist_memberships`

> ⚠️ 이 테이블은 **`created_at`, `updated_at` 컬럼이 없습니다.**  
> (`BaseTimeEntity` 미상속)

| 컬럼                 | 타입        | 제약                   | 비고                                       |
| -------------------- | ----------- | ---------------------- | ------------------------------------------ |
| `id`                 | BIGINT      | PK, AUTO_INCREMENT     |                                            |
| `artist_id`          | BIGINT      | NOT NULL, FK → artists |                                            |
| `user_id`            | BIGINT      | NOT NULL               | user-service FK 없음                       |
| `nickname`           | VARCHAR(40) |                        | 멤버십 닉네임                              |
| `tier`               | VARCHAR(20) | NOT NULL               | Enum: `MIST / CLOUD / THUNDER / LIGHTNING` |
| `status`             | VARCHAR(20) | NOT NULL               | Enum → 아래 참고                           |
| `order_id`           | VARCHAR(40) | NOT NULL, UNIQUE       | 결제 연동 키                               |
| `payment_id`         | VARCHAR(80) |                        | payment-service 결제 식별자                |
| `pending_expires_at` | DATETIME    | NOT NULL               | 결제 미완료 만료 시각                      |
| `start_date`         | DATE        |                        | 구독 시작일                                |
| `end_date`           | DATE        |                        | 구독 종료일 (보통 시작일 +1년)             |

**UNIQUE** `(artist_id, user_id, status)` — 동일 아티스트 중복 ACTIVE 방지

**`status` Enum**

```
ACTIVE | CANCELED | EXPIRED | PENDING
```

---

## 시드 데이터 INSERT SQL

SQL 파일: **[docs/event.sql](./event.sql)**
