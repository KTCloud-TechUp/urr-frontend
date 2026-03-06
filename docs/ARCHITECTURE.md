# URR Frontend Architecture

## Overview

URR은 K-POP 팬덤 기반 티켓팅 플랫폼이다.

핵심 기능

- 아티스트 조회
- 공연 조회
- 대기열 시스템
- 티켓 예매
- 좌석 선택
- 멤버십
- 티켓 양도

Frontend는 **Next.js App Router + TypeScript** 기반으로 개발되며  
아키텍처는 **Feature-Sliced Design (FSD)** 구조를 따른다.

Backend는 **Spring Boot REST API**이다.

---

# Tech Stack

Frontend

- Next.js (App Router)
- React
- TypeScript
- Feature-Sliced Design (FSD)
- TanStack Query (Server State)
- Tailwind CSS, shadcn/ui

Backend

- Spring Boot
- REST API

Infra

- AWS
- RDS

---

# Architecture Style

Frontend는 **Feature-Sliced Design (FSD)** 구조를 따른다.

레이어 구조

app → widgets → features → entities → shared

각 레이어는 단방향 의존성을 가진다.

---

# Directory Structure

src/

app/
widgets/
features/
entities/
shared/

---

# 1. app (Next.js Routing Layer)

src/app

역할

- Next.js 라우팅
- 페이지 정의
- layout 관리

허용 파일

- page.tsx
- layout.tsx
- loading.tsx
- error.tsx
- not-found.tsx
- route.ts

규칙

- page는 최대한 얇게 유지
- 비즈니스 로직은 features/widgets/entities로 이동
- `_components` 사용 최소화

---

# 2. widgets (Page UI Blocks)

src/widgets

페이지를 구성하는 큰 UI 블록.

예

- header
- footer
- concert-list
- queue-panel
- seat-reservation-panel

특징

- entities + features 조합
- 페이지 수준 UI
- 새로운 비즈니스 로직 생성 금지

---

# 3. features (User Actions)

src/features

사용자가 수행하는 행동 단위.

예

- login
- signup
- join-membership
- enter-queue
- select-seat
- checkout
- create-transfer
- request-transfer

구조

feature/
api/
model/
ui/
lib/

규칙

- mutation API는 feature에 위치
- 행동 중심 로직 관리

---

# 4. entities (Domain Models)

src/entities

도메인 명사 단위.

예

- user
- artist
- concert
- ticket
- membership
- queue
- transfer

구조

entity/
model/
api/
ui/
lib/

규칙

- 조회 API는 entities에 위치
- 도메인 타입 정의
- entity는 사용자 행동 로직을 가지지 않는다

---

# 5. shared (Common Infrastructure)

src/shared

진짜 공용 코드만 위치한다.

구성

shared/
api/
ui/
hooks/
lib/
config/
types/
styles/

허용

- API client
- axios interceptors
- 공용 UI 컴포넌트
- 공용 util 함수
- config
- 공용 타입

좋은 예

shared/api/client.ts
shared/ui/button.tsx
shared/lib/format.ts
shared/hooks/use-debounce.ts

금지

shared/api/auth.ts
shared/hooks/use-auth.ts
shared/api/concert.ts

shared에는 **도메인 로직을 넣지 않는다.**

---

# API Placement Rules

shared/api

공용 네트워크 인프라

shared/api/client.ts
shared/api/interceptors.ts
shared/api/error-handler.ts

조회 API

entities/\*/api

예

entities/concert/api/get-concert.ts
entities/user/api/get-me.ts
entities/artist/api/get-artists.ts

mutation API

features/\*/api

예

features/auth/login/api/post-login.ts
features/ticketing/select-seat/api/post-hold-seat.ts
features/membership/join-membership/api/post-join-membership.ts

---

# Import Rules

허용

app → widgets → features → entities → shared
widgets → features → entities → shared
features → entities → shared
entities → shared

금지

shared → entities/features/widgets/app

feature 간 직접 import는 최소화한다.

---

# State Management

Server State

- TanStack Query

사용 예

- 공연 목록
- 아티스트 목록
- 티켓 목록
- 멤버십 정보

Local State

- React State

사용 예

- form 상태
- UI 상태

Global State (필요 시)

- Zustand

사용 예

- 로그인 상태
- queue 상태

---

# Authentication Architecture

인증 방식

JWT 기반 인증

구성

- access token
- refresh token

토큰 처리

- axios interceptor
- refresh token 재발급

로그인 흐름

login → access token 발급 → API 인증 → refresh token 갱신

---

# Ticketing Flow

티켓 예매 흐름

1 대기열 진입
2 queue token 발급
3 queue polling
4 예매 페이지 진입
5 좌석 선택
6 좌석 hold
7 결제
8 티켓 생성

---

# Rendering Strategy

SSR

- 공연 상세
- 마이페이지

ISR

- 공연 목록
- 아티스트 목록

CSR

- 대기열
- 좌석 선택
- 인터랙션 UI

---

# Naming Conventions

API

get-concert.ts
post-login.ts
post-hold-seat.ts

Hooks

use-login-form.ts
use-seat-selection.ts

UI

login-form.tsx
seat-map.tsx
concert-card.tsx

Types

types.ts
schema.ts

---

# Development Principles

우선순위

1 유지보수성  
2 일관성  
3 단순함  
4 FSD 규칙

과도한 추상화 금지

---

# Important Rules

금지

- shared에 도메인 API 생성
- shared/hooks에 도메인 훅 생성
- page.tsx에 비즈니스 로직 작성
- feature 간 강한 결합
- 과도한 파일 분리

애매하면

shared ❌
features/entities ✅

shared는 **마지막 선택지**이다.
