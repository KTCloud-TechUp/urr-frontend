# 결제 연동 가이드 (프론트엔드)

## 프론트 연동 현황

| 흐름 | 연동 파일 | 상태 |
| ---- | --------- | ---- |
| 양도 티켓 구매 (`reserve` → `confirm`) | `TransferPurchaseSidebar.tsx` | ✅ 완료 |
| 멤버십 구독 (`membership` → `payments/confirm`) | `MembershipPaymentStep.tsx` | ✅ 완료 |
| 티켓 예매 결제 | `PaymentView.tsx` | ⚠️ mock 시뮬레이션 → Phase 9 Zustand store 완성 후 실 연동 |
| Toss Payments SDK | `src/features/payment/lib/toss.ts` | ✅ 완료 |

### ⚠️ 참고사항

현재(26.04.04) 결제 서비스에 `POST /api/v1/payments/create` API가 존재하지만 프론트에서 직접 호출하지 않습니다.
각 서비스(양도 요청, 멤버십 구독, 티켓팅 구매)의 구매 요청 API를 호출하면 내부적으로 자동 실행됩니다.

```
❌ 프론트 → POST /api/v1/payments/create  (프론트에서 직접 호출 X)
✅ 프론트 → 각 서비스 구매 API → 내부에서 결제 생성 자동 처리
```

> **Toss SDK 연동 상태**: Toss Payments SDK는 Phase 12에서 연동 예정입니다. 현재는 SDK 없이 인앱 모달(`PaymentDialog`) 기반 플로우로 구현되어 있습니다. `paymentKey`는 Toss 실결제 연동 전까지 `mock_${timestamp}` 임시값 사용 중.

---

### 공통 결제 플로우

프론트의 실제 결제 흐름은 **페이지 리다이렉트 없이** 인앱 모달(`PaymentDialog`) 안에서 처리됩니다.

| 단계 | 주체      | 내용                                                            |
| ---- | --------- | --------------------------------------------------------------- |
| 1    | 프론트 📌 | 각 서비스 구매 요청 API 호출 → `orderId` 수신                   |
| 2    | 프론트    | `PaymentDialog` 모달 오픈 — 이름·전화번호·결제수단·약관 동의 입력 |
| 3    | 프론트    | 사용자가 "결제하기" 클릭 → 처리 중 오버레이 표시 (1.5s)         |
| 4    | 프론트 📌 | `onComplete()` 콜백 실행 → 결제 승인 API 호출                   |
| 5    | 서버      | 최종 결제 결과 반환                                             |

> 📌 표시가 프론트에서 직접 API를 호출하는 시점입니다.

---

### 1. 양도 티켓 구매

**연동 파일**: `src/widgets/transfer/TransferPurchaseSidebar.tsx`

#### Step 1. 📌 사용자가 "결제하기" 클릭 시 호출

```
POST /api/v1/transfers/posts/{id}/reserve?artistId={artistId}
Header: X-User-Id: {userId}
```

**Response**

```json
{
  "orderId": "trf_1234567890_abc",
  "sellingPrice": 10000
}
```

수신한 `orderId`는 컴포넌트 `ref`에 저장합니다 (`sessionStorage` 사용 안 함).

#### Step 2. PaymentDialog 모달 오픈

`orderId` 수신 후 `PaymentDialog` 컴포넌트를 열어 사용자가 주문자 정보(이름, 전화번호), 결제 수단, 약관을 입력합니다.
**이 시점에서는 Toss 결제창으로 이동하지 않습니다.**

#### Step 3. 사용자가 폼 작성 후 "결제하기" 클릭

`PaymentDialog` 내부에서 처리 중 오버레이가 표시되고, 완료 후 `onComplete()` 콜백이 실행됩니다.

#### Step 4. 📌 onComplete 콜백에서 결제 승인 호출

```
POST /api/v1/transfers/posts/confirm
Header: X-User-Id: {userId}
Content-Type: application/json
```

**Request Body**

```json
{
  "paymentKey": "mock_1712345678000",
  "orderId": "trf_1234567890_abc",
  "amount": 10000
}
```

> ⚠️ `paymentKey`는 현재 `mock_${Date.now()}`로 임시 처리 중입니다. Phase 12 Toss SDK 연동 시 실제 Toss `paymentKey`로 교체됩니다.

**Response**

```json
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "paymentKey": "mock_1712345678000",
    "orderId": "trf_1234567890_abc",
    "amount": 10000,
    "method": "CARD",
    "status": "DONE",
    "approvedAt": "2026-04-04T06:51:02"
  }
}
```

#### 실제 코드 흐름

```tsx
// TransferPurchaseSidebar.tsx

const orderIdRef = useRef<string | null>(null)

async function handlePaymentOpen() {
  // Step 1: 예약 API 호출
  const result = await reserveTransferPost(listing.id, artistId, userId)
  orderIdRef.current = result.orderId
  setShowPaymentDialog(true) // Step 2: 모달 오픈
}

async function handlePaymentComplete() {
  // Step 4: onComplete 콜백에서 승인 API 호출
  setShowPaymentDialog(false)
  setStep("processing")
  const orderId = orderIdRef.current ?? ""
  const paymentKey = `mock_${Date.now()}` // Phase 12 이후 Toss 실값으로 교체
  await confirmTransferPost(orderId, paymentKey, userId)
  setStep("complete")
}

// ...

<PaymentDialog
  open={showPaymentDialog}
  title="양도 티켓 결제"
  totalAmount={listing.price}
  onComplete={handlePaymentComplete} // Step 4 연결
  onCancel={() => setShowPaymentDialog(false)}
/>
```

---

### 2. 멤버십 구독

**연동 파일**: `src/features/membership/ui/MembershipPaymentStep.tsx`

#### Step 1. 📌 사용자가 구독 버튼 클릭 시 호출 (미연동, Phase 12 대기)

```
POST /api/v1/artists/{artistId}/membership
Header: X-User-Id: {userId}
```

**Response**

```json
{
  "orderId": "mem_1234567890_abc",
  "amount": 8000
}
```

#### Step 2. PaymentDialog 모달 오픈

양도와 동일하게 `PaymentDialog` 컴포넌트를 열어 사용자 입력을 받습니다.

#### Step 3~4. 이후 양도와 동일한 흐름

`PaymentDialog.onComplete` 콜백 → 결제 승인 API 호출 (`POST /api/v1/payments/confirm`)

> **현재 상태**: `MembershipPaymentStep`은 `PaymentDialog`의 `onComplete` 콜백을 상위 컴포넌트로만 전달합니다. Step 1(구독 API 호출) 및 Step 4(confirm API 호출)은 Phase 12에서 연동 예정입니다.

---

### 3. 티켓 예매 결제

**연동 파일**: `src/widgets/booking/PaymentView.tsx`

예매 결제는 별도의 `PaymentView` 컴포넌트로 구현되어 있으며 `PaymentDialog`를 사용하지 않습니다.

#### UI 플로우

```
좌석 확인 (confirm-seats)
  → 결제 폼 (payment-form): 이름·전화번호·결제수단·약관
    → 처리 중 (processing)
      → 완료: confirmation 단계로 전환
      → 실패: 60초 재시도 타이머 표시
        → 타이머 만료: 좌석 해제 안내
```

> **현재 상태**: 결제 처리가 90% 성공률의 mock 시뮬레이션으로 구현되어 있습니다. 실제 API 호출은 Phase 11-3(예매 확정 API), Phase 12(Payments API) 연동 시 교체됩니다.

---

### PaymentDialog 컴포넌트

**파일**: `src/shared/ui/PaymentDialog.tsx`

```tsx
interface PaymentDialogProps {
  open: boolean
  title: string
  orderItems: { label: string; amount: number }[]
  totalAmount: number
  onComplete: () => void  // 결제 완료 후 실행할 콜백
  onCancel: () => void
  orderDescription?: string
}
```

- `open`: 모달 표시 여부
- `onComplete`: 사용자가 결제 폼을 완성하고 제출했을 때 호출되는 콜백. **실제 API 호출은 이 콜백에서 수행**합니다.
- `onCancel`: 취소 버튼 클릭 또는 바깥 클릭 시 호출

#### 내부 단계

| phase        | 설명                                          |
| ------------ | --------------------------------------------- |
| `form`       | 이름, 전화번호, 결제수단 선택, 약관 동의 입력 |
| `processing` | 처리 중 오버레이 표시 → 1.5초 후 `onComplete` |

---

### 전체 API 목록 (참고용)

**프론트 직접 호출 API**

| 메서드 | 엔드포인트                                        | 용도            | 호출 시점                    |
| ------ | ------------------------------------------------- | --------------- | ---------------------------- |
| POST   | `/api/v1/transfers/posts/{id}/reserve?artistId=`  | 양도 예약       | 결제 버튼 클릭 시            |
| POST   | `/api/v1/transfers/posts/confirm`                 | 양도 결제 승인  | PaymentDialog.onComplete 후  |
| POST   | `/api/v1/artists/{artistId}/membership`           | 멤버십 구독     | 구독 버튼 클릭 시 (미연동)   |
| POST   | `/api/v1/payments/confirm`                        | 결제 승인 (공통) | PaymentDialog.onComplete 후  |
| GET    | `/api/v1/payments/order/{orderId}`                | 결제 조회       | 필요 시                      |

**프론트 직접 호출 X (서버 내부 자동 처리)**

| 메서드 | 엔드포인트                                    | 용도             | 호출 주체       |
| ------ | --------------------------------------------- | ---------------- | --------------- |
| POST   | `/api/v1/payments/create`                     | 결제 생성        | 각 서비스 내부  |
| POST   | `/api/v1/payments/{paymentKey}/cancel`        | 결제 취소        | 각 서비스 내부  |
| POST   | `/api/v1/internal/payments/membership/create` | 멤버십 결제 생성 | 이벤트 서비스   |
| POST   | `/api/v1/internal/payments/ticket/create`     | 티켓 결제 생성   | 티켓 서비스     |
| POST   | `/api/v1/internal/payments/transfer/create`   | 양도 결제 생성   | 커뮤니티 서비스 |
