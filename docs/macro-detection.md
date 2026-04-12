# 매크로 탐지 연동 가이드

> 최종 수정: 2026-04-12  
> 관련 스펙: 백엔드 노션 macro 페이지 (정리 예정)

---

## 연동 플로우

```
[좌석확인 모달 - "결제하기" 클릭]
        ↓
  매크로 탐지 API 호출
  POST /api/v1/macro-detection (엔드포인트 미확정)
        ↓
  status: 0 → 통과 / 그 외 → 차단
        ↓ (통과)
[주문 결제 모달 - 주문자 정보 입력]
        ↓
  티켓 예매 API 호출  ← macroDetectionPassed: true 포함
  POST /ticket/reservations
        ↓
  서버에서 boolean 재검증
  성공 → 좌석 선점 완료 / 실패 → 에러 반환
```

---

## API 스펙

### 1. 매크로 탐지 API

> ⚠️ 엔드포인트·Request 필드는 백엔드 노션 정리 후 업데이트 필요

| 항목 | 내용 |
|------|------|
| Method | `POST` (미확정) |
| Endpoint | TBD |
| Auth | Bearer 토큰 (추정) |

**Response**
```json
{
  "status": 0,
  "message": 1.3841613108244333
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `status` | `number` | 의미 미확정 |
| `message` | `number` | **판별 기준값** — 사람 vs 매크로 구분에 사용되는 float 점수 |

**프론트 처리**: `message` 값의 임계값(threshold) 기준으로 통과 여부 판단  
> ⚠️ 임계값 및 비교 방향 (`message >= X` or `message <= X`) 백엔드 확인 필요  
> ⚠️ VQA(시각적 질문 응답) 연동 여부 아직 미확인

---

### 2. 티켓 예매 API — Request 변경사항

기존 `POST /ticket/reservations` body에 필드 추가 필요.

**현재 Request body** (`src/features/booking/api/bookTicket.ts`)
```json
{
  "eventId": 1,
  "showId": 2,
  "artistId": 3,
  "seatIds": ["A-1-1"],
  "holdSeconds": 300
}
```

**변경 후 Request body**
```json
{
  "eventId": 1,
  "showId": 2,
  "artistId": 3,
  "seatIds": ["A-1-1"],
  "holdSeconds": 300,
  "macroDetectionPassed": true
}
```

> ⚠️ 필드명(`macroDetectionPassed`)은 백엔드 확정 후 맞출 것

---

## 프론트엔드 작업 목록

### 1. 매크로 탐지 API 함수 생성
- **파일**: `src/features/booking/api/detectMacro.ts` (신규)
- Request/Response 타입 정의
- `apiRequest()` 래핑

```ts
// 예시 구조 (엔드포인트·파라미터 확정 후 구현)
export interface DetectMacroResponse {
  status: number;
  message: number; // confidence score
}

export async function detectMacro(/* params TBD */): Promise<DetectMacroResponse> {
  // ...
}
```

---

### 2. `bookTicket.ts` — Request 타입 및 body 수정
- **파일**: `src/features/booking/api/bookTicket.ts`
- `BookTicketParams`에 `macroDetectionPassed: boolean` 추가
- `apiRequest` body에 해당 필드 포함

```ts
export interface BookTicketParams {
  // ... 기존 필드
  macroDetectionPassed: boolean; // 추가
}
```

---

### 3. `PaymentView.tsx` — 매크로 탐지 호출 시점 추가
- **파일**: `src/widgets/booking/PaymentView.tsx`
- **변경 함수**: `handleGoToPayment` (현재 L90)
- 기존: `setPhase("payment-form")` 즉시 실행
- 변경: 매크로 탐지 API 호출 → 통과 시 `payment-form` 진입, 실패 시 에러 처리

**처리 흐름**
```
handleGoToPayment 클릭
  → loading 상태 표시 (버튼 비활성화 or 스피너)
  → detectMacro() 호출
  → status === 0 → setPhase("payment-form")
  → 그 외 → 매크로 탐지 실패 UI 표시 (phase 추가 필요)
```

**추가할 Phase**
```ts
type PaymentPhase =
  | "confirm-seats"
  | "payment-form"
  | "processing"
  | "failed"
  | "failed-expired"
  | "macro-failed"; // 신규
```

---

### 4. 에러 UI — 매크로 탐지 실패 화면
- **phase**: `macro-failed`
- 안내 문구 확정 필요 (예: "비정상적인 접근이 감지되었습니다. 다시 시도해주세요.")
- 버튼: 예매 종료 / 재시도 여부는 기획 확인 필요

---

## 미확정 사항 (백엔드 확인 필요)

| 항목 | 상태 |
|------|------|
| 매크로 탐지 엔드포인트 | 노션 정리 예정 |
| 매크로 탐지 Request 필드 (userId, sessionId 등) | 노션 정리 예정 |
| 티켓 예매 Request 추가 필드명 (`macroDetectionPassed` or 다른 이름) | 확인 필요 |
| `status` 필드 의미 | 확인 필요 |
| `message` 임계값 및 비교 방향 (`>= X` or `<= X`) | 확인 필요 |
| VQA(시각적 질문 응답) 연동 여부 및 스펙 | 미확인 |
| 매크로 탐지 실패 시 재시도 허용 여부 | 기획 확인 필요 |

---

## 관련 파일

| 파일 | 설명 |
|------|------|
| `src/features/booking/api/bookTicket.ts` | 티켓 예매 API (수정 필요) |
| `src/features/booking/api/detectMacro.ts` | 매크로 탐지 API (신규 생성) |
| `src/widgets/booking/PaymentView.tsx` | 결제 모달 (수정 필요) |
