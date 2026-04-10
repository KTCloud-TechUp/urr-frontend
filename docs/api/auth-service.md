# Auth Service 연동 현황

> 마지막 확인: 2026-04-10 / 마지막 수정: 2026-04-10

| # | API | 메서드 | 엔드포인트 | 연동 파일 | 상태 | 비고 |
|---|-----|--------|-----------|----------|------|------|
| 1 | 카카오 OAuth 로그인 | POST | `/api/v1/auth/oauth/kakao` | `features/auth/api/kakaoLogin.ts` | ✅ 연동됨 | request body에 `rejoinConfirmed` 미포함 — 409 수신 후 /rejoin으로 처리 |
| 2 | 카카오 OAuth 재가입 확정 | POST | `/api/v1/auth/oauth/kakao/rejoin` | `features/auth/api/kakaoRejoin.ts` | ✅ 연동됨 | |
| 3 | 내 정보 조회 | GET | `/api/v1/auth/me` | `features/auth/api/me.ts` | ✅ 연동됨 | |
| 4 | 내 이름 변경 | PATCH | `/api/v1/auth/me/name` | `features/auth/api/updateName.ts` | ✅ 연동됨 | |
| 5 | 동의 설정 변경 | PATCH | `/api/v1/auth/me/consents` | `features/auth/api/updateConsents.ts` | ✅ 연동됨 | |
| 6 | 로그아웃 | POST | `/api/v1/auth/logout` | `features/auth/api/logout.ts` | ✅ 연동됨 | |
| 7 | 토큰 재발급 | POST | `/api/v1/auth/token/reissue` | `features/auth/api/reissue.ts` + `shared/api/interceptor.ts` | ✅ 연동됨 | |
| 8 | 회원 탈퇴 | DELETE | `/api/v1/auth/me` | `features/auth/api/deleteAccount.ts` | ✅ 연동됨 | |
| 9 | 일반 회원가입 | POST | `/api/v1/auth/register` | `features/auth/api/register.ts` | ✅ 연동됨 | 응답 HTTP 201이지만 fetchWithAuth가 2xx 전체 허용하므로 무해 |
| 10 | 일반 로그인 | POST | `/api/v1/auth/login` | `features/auth/api/login.ts` | ✅ 연동됨 | |
| 11 | 소셜 온보딩 완료 | POST | `/api/v1/auth/onboarding/social` | `features/auth/api/socialOnboarding.ts` | ✅ 연동됨 | |
| 12 | 이메일 인증번호 발송 | POST | `/api/v1/auth/sms/send` | `features/auth/api/smsSend.ts` | ⚠️ 스펙 불일치 | 스펙: `email` 필드 → 코드: `phoneNumber` 필드 사용 중 |
| 13 | 이메일 인증번호 검증 | POST | `/api/v1/auth/sms/verify` | `features/auth/api/smsVerify.ts` | ⚠️ 스펙 불일치 | 스펙: `{email, code}` → 코드: `{phoneNumber, code}` 사용 중 |

---

# 1. 카카오 OAuth 로그인

## API

`POST /api/v1/auth/oauth/kakao`

## 설명

카카오 인가 코드를 받아 로그인 처리

카카오로 시작하기 눌렀을때 호출

1. 처음 회원가입이 안된 사람인경우
    1. 카카오 인증 → DB에 저장 → 온보딩으로 리다이렉트
2. 회원인 경우
    1. 온보딩이 안된경우 → 온보딩 페이지로
    2. 온보딩이 된 경우 → 로그인 성공

## 인증

불필요

## Request

### Body

```
{
  "code":"a1b2c3-kakao-auth-code",
  "redirectUri":"https://www.urr.guru/auth/callback/kakao",
  "rejoinConfirmed":false
}
```

### 필드 설명

- `code`: 카카오 인가 코드
- `redirectUri`: 카카오 로그인 리다이렉트 URI
- `rejoinConfirmed`: 재가입 확정 여부

## Response

### 성공 응답 (200)

> **주의:** `Set-Cookie: refresh_token=...; HttpOnly; ...` 헤더가 포함
> 

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "tokens": {
      "accessToken":"eyJhbGciOi...",
      "tokenType":"Bearer",
      "expiresInSeconds":3600
    },
    "user": {
      "userId":101,
      "email":"kakao-user@urr.guru",
      "nickname":"우르유저",
      "role":"USER",
      "onboardingCompleted":false,
      "marketingConsent":false,
      "pushConsent":false,
      "smsConsent":false
    },
    "onboardingRequired":true,
    "nextPath":"/onboarding"
  }
}
```

---

# 2. 카카오 OAuth 재가입 확정

## API

`POST /api/v1/auth/oauth/kakao/rejoin`

## 설명

탈퇴 이력 계정의 재가입 확정 처리

## 인증

불필요

## Request

### Body

```
{
  "rejoinToken":"eyJhbGciOi...",
  "agree":true
}
```

### 필드 설명

- `rejoinToken`: 재가입 처리용 토큰
- `agree`: 재가입 동의 여부

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "tokens": {
      "accessToken":"eyJhbGciOi...",
      "tokenType":"Bearer",
      "expiresInSeconds":3600
    },
    "user": {
      "userId":101,
      "email":"user@urr.guru",
      "nickname":"복구유저",
      "role":"USER",
      "onboardingCompleted":false,
      "marketingConsent":true,
      "pushConsent":true,
      "smsConsent":false
    },
    "onboardingRequired":true,
    "nextPath":"/onboarding"
  }
}
```

---

# 3. 내 정보 조회

## API

`GET /api/v1/auth/me`

## 설명

현재 로그인한 사용자 정보 조회

해당 유저의 멤버십목록, 유저세팅 조회

## 인증

필요

- 게이트웨이 헤더 사용

## Request

### Header 예시

```
X-User-Id: 12
```

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
    "userId": 123,
    "email": "user@example.com",
    "nickname": "우르르",
    "role": "USER",
    "onboardingCompleted": true,
    "marketingConsent": false,
    "pushConsent": true,
    "smsConsent": false,
    "memberships": [
      {
        "artistId": 10,
        "artistName": "ARTIST_A",
        "tier": "GOLD",
        "endDate": "2026-12-31"
      },
      {
        "artistId": 11,
        "artistName": "ARTIST_B",
        "tier": "BASIC",
        "endDate": "2026-06-30"
      }
    ]
  }
}
```

---

# 4. 내 이름 변경

## API

`PATCH /api/v1/auth/me/name`

## 설명

마이페이지에서 이름 수정시 사용

## 인증

필요

## Request

### Header 예시

```
X-User-Id: 12
```

### Body

```
{
  "name":"변경된이름"
}
```

### 필드 설명

- `name`: 변경할 이름

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

# 5. 동의 설정 변경

## API

`PATCH /api/v1/auth/me/consents`

## 설명

마이페이시 세팅에서 마케팅/푸시/SMS 동의 여부 변경

## 인증

필요

## Request

### Header 예시

```
X-User-Id: 12
```

### Body

```
{
  "marketingConsent":true,
  "pushConsent":false,
  "smsConsent":true
}
```

### 필드 설명

- `marketingConsent`: 마케팅 수신 동의 여부
- `pushConsent`: 푸시 알림 동의 여부
- `smsConsent`: SMS 수신 동의 여부

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

# 6. 로그아웃

## API

`POST /api/v1/auth/logout`

## 설명

리프레시 토큰을 기반으로 로그아웃 처리

## 인증

`refresh_token` 쿠키 필요

## Request

### Cookie 예시

```
Cookie: refresh_token=<refresh-token>
```

### Body

없음

## Response

### 성공 응답 (200)

> **주의:** `Set-Cookie` 헤더로 `refresh_token` 쿠키가 삭제 처리됨
> 

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data":null
}
```

---

# 7. 토큰 재발급

## API

`POST /api/v1/auth/token/reissue`

## 설명

토큰 만료시 refresh_token 쿠키를 이용해 access token 재발급

## 인증

`refresh_token` 쿠키 필요

## Request

### Cookie 예시

```
Cookie: refresh_token=<refresh-token>
```

### Body

없음

## Response

### 성공 응답 (200)

> **주의:** 신규 `refresh_token`이 `Set-Cookie`로 다시 설정
> 

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "tokens": {
      "accessToken":"eyJhbGciOi...",
      "tokenType":"Bearer",
      "expiresInSeconds":3600
    },
    "user": {
      "userId":101,
      "email":"user@urr.guru",
      "nickname":"우르",
      "role":"USER",
      "onboardingCompleted":true,
      "marketingConsent":true,
      "pushConsent":false,
      "smsConsent":true
    },
    "onboardingRequired":false,
    "nextPath":"/home"
  }
}
```

---

# 8. 회원 탈퇴

## API

`DELETE /api/v1/auth/me`

## 설명

현재 로그인한 사용자 계정 탈퇴 처리

## 인증

필요

## Request

### Header 예시

```
X-User-Id: 12
```

### Body

없음

## Response

### 성공 응답 (200)

> **주의:** `Set-Cookie` 헤더로 `refresh_token` 쿠키가 삭제 처리됨
> 

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data":null
}
```

---

# 9. 일반 회원가입 (이메일/비밀번호)

## API

`POST /api/v1/auth/register`

## 설명

이메일/비밀번호 기반 일반 회원가입

회원가입 버튼을 누르고, 이메일 인증 이후 최종 가입하기 버튼을 눌러서 호출

회원가입시 온보딩이 자동으로 true로 설정

## 인증

불필요

## Request

### Body

```
{
  "email":"newuser@urr.guru",
  "password":"Passw0rd!",
  "name":"신규유저",
  "birthDate":"1998-05-11",
  "phone":"01012345678",
  "gender":"FEMALE",
  "marketingConsent":false
}
```

### 필드 설명

- `email`: 이메일
- `password`: 비밀번호
- `name`: 이름
- `birthDate`: 생년월일
- `phone`: 휴대폰 번호
- `gender`: 성별 (`MALE`, `FEMALE`, `OTHER`)
- `marketingConsent`: 마케팅 수신 동의 여부 (Boolean)

## Response

### 성공 응답 (201)

> **주의:** HTTP 상태 코드는 201 Created. `Set-Cookie: refresh_token=...; HttpOnly; ...` 헤더가 포함
> 

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "tokens": {
      "accessToken":"eyJhbGciOi...",
      "tokenType":"Bearer",
      "expiresInSeconds":3600
    },
    "user": {
      "userId":202,
      "email":"newuser@urr.guru",
      "nickname":"신규유저",
      "role":"USER",
      "onboardingCompleted":true,
      "marketingConsent":false,
      "pushConsent":false,
      "smsConsent":false
    },
    "onboardingRequired":true,
    "nextPath":"/home"
  }
}
```

---

# 10. 일반 로그인 (이메일/비밀번호)

## API

`POST /api/v1/auth/login`

## 설명

이메일/비밀번호 기반 로그인

이메일 / 비밀번호 입력 후 로그인 버튼 눌러서 호출

## 인증

불필요

## Request

### Body

```
{
  "email":"user@urr.guru",
  "password":"Passw0rd!"
}
```

### 필드 설명

- `email`: 로그인 이메일
- `password`: 비밀번호

## Response

### 성공 응답 (200)

> **주의:** `Set-Cookie: refresh_token=...; HttpOnly; ...` 헤더가 포함
> 

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "tokens": {
      "accessToken":"eyJhbGciOi...",
      "tokenType":"Bearer",
      "expiresInSeconds":3600
    },
    "user": {
      "userId":101,
      "email":"user@urr.guru",
      "nickname":"우르",
      "role":"USER",
      "onboardingCompleted":true,
      "marketingConsent":true,
      "pushConsent":false,
      "smsConsent":true
    },
    "onboardingRequired":false,
    "nextPath":"/home"
  }
}
```

---

# 11. 소셜 온보딩 완료

## API

`POST /api/v1/auth/onboarding/social`

## 설명

소셜 로그인시 온보딩상태가 true가 아니면 자동 호출

## 인증

필요

## Request

### Header 예시

```
X-User-Id: 12
```

### Body

```
{
  "nickname":"새닉네임",
  "birthDate":"1999-12-31",
  "phone":"01077778888",
  "gender":"MALE"
}
```

### 필드 설명

- `nickname`: 닉네임
- `birthDate`: 생년월일
- `phone`: 휴대폰 번호
- `gender`: 성별 (`MALE`, `FEMALE`, `OTHER`)

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

# 12. 이메일 인증번호 발송

## API

`POST /api/v1/auth/sms/send`

## 설명

입력된 이메일 주소로 인증번호 전송

> **참고:** URL 경로는 `/sms/send`이지만 실제로는 이메일 기반 인증번호 발송임
> 

인증번호 전송을 누를 시 호출

## 인증

불필요

## Request

### Body

```
{
  "email":"user5@test.com"
}
```

### 필드 설명

- `email`: 인증번호를 받을 이메일 주소

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

### 실패 예시 (형식 오류)

```
{
  "isSuccess":false,
  "statusCode":400,
  "message":"형식이 올바르지 않습니다.",
  "data":null
}
```

---

# 13. 이메일 인증번호 검증

## API

`POST /api/v1/auth/sms/verify`

## 설명

발송된 이메일 인증번호 검증

> **참고:** URL 경로는 `/sms/verify`이지만 실제로는 이메일 기반 인증번호 검증임
> 

전송된 인증번호를 입력하고 확인버튼을 누르면 호출

## 인증

불필요

## Request

### Body

```
{
  "email":"user5@test.com",
  "code":"492817"
}
```

### 필드 설명

- `email`: 인증번호를 받은 이메일 주소
- `code`: 입력한 인증번호

## Response

### 성공 응답 (200)

```
{
  "isSuccess":true,
  "statusCode":200,
  "message":"OK",
  "data": {
    "verified":true
  }
}
```

### 실패 예시 (인증번호 불일치)

```
{
  "isSuccess":false,
  "statusCode":400,
  "message":"인증번호가 일치하지 않습니다.",
  "data":null
}
```
