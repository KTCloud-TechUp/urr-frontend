# 백엔드 요청 목록

프론트엔드에서 백엔드 팀에 요청할 API 변경·추가·수정 사항을 기록합니다.

> 형식: 요청 내용 / 이유 / 우선순위 (🔴 긴급 / 🟡 보통 / 🟢 낮음)

---

## 대기 중

- VQA 검증 엔드포인트 (🟡 보통)
  - **요청**: 결제 직전 VQA 정답 여부를 서버에서 검증하는 `POST /api/v1/vqa/verify`
  - **스펙 제안**
    - Request: `{ questionId: string, answer: string, userId: number }`
    - Response: `{ pass: boolean }`
  - **이유**: 현재는 프론트 로컬 mock 검증만 가능 → 클라이언트 조작으로 우회 가능. 실효성 있는 봇 차단을 위해 **서버 검증** + 문제 출제도 서버에서 랜덤 제공 필요(`GET /api/v1/vqa/question`).
  - **연관**: `docs/macro-detection.md`의 매크로 탐지 로직과 통합 고려. 오답 반복 시 rate limit/계정 제재 트리거 연계 가능.

- 좌석 가격 / 수수료 / 예매 구분 DB 수정 → **백엔드 수정 예정** 🔴
  - 프론트 기준 전달 완료. 백엔드 실서버 DB 반영 예정
  - **반영 내용**
    - 구역 정가: VIP 165,000 / R석 143,000 / S석 121,000 / A석 99,000
    - 예매 구분: 라이트닝·썬더·클라우드 → 우선예매 / 미스트 → 일반예매
    - `presale_offset_minutes` 오류 수정 (선예매 시점이 역순으로 적용되던 버그)
    - 예매 수수료 (좌석당): 라이트닝 0원 / 썬더 3,000원 / 클라우드 5,000원 / 미스트 8,000원
    - 양도 수수료율: 라이트닝 5% / 썬더 5% / 클라우드 10% / 미스트 10%
  - 우선순위: 🔴 긴급

- `GET /api/v1/ticket/users/reservations` 응답에 `paymentId` 필드 추가 요청
  - **배경**: 취소 API(`POST /api/v1/ticket/reservations/cancel`)가 묶음 예매 전체 취소로 동작하도록 백엔드가 변경됨 (같은 `paymentId`에 묶인 좌석 전부 취소)
  - **문제**: 현재 `MyReservationResponse`에 `paymentId`가 없어 프론트가 묶음 예매 여부를 판단할 수 없음
  - **요청**: `MyReservationResponse`에 `paymentId: Long` 필드 추가
  - **프론트 활용**: 같은 `paymentId`를 가진 예약이 2개 이상이면 취소 모달에 "이 예매 전체(N매)를 취소합니다. 묶음 예매는 개별 취소가 불가합니다." 문구 표시
  - **대안 협의 필요**: `paymentId` 추가가 부담스럽다면, `bundledSeatCount: Int` (같은 결제의 총 좌석 수) 단일 필드 추가로도 가능
  - 우선순위: 🟡 보통

- `/me/sales` WITHDRAWN 항목 포함 요청
  - **조사 결과**: DELETE 호출 시 DB에서 `status = WITHDRAWN`으로 변경되는 건 확인됨. 단, `/me/sales` 조회 시 백엔드가 WITHDRAWN을 필터링하여 제외하므로 새로고침 시 항목이 사라짐. API 문서상 반환 status는 LISTED·COMPLETED만 정의되어 있음
  - **문제**: 프론트에서 로컬 상태로 `status: "cancelled"` 표시는 가능하지만, 페이지 재진입 시 기록이 완전히 소실됨
  - **요청**:
    1. `/me/sales` 응답에 `WITHDRAWN` 상태 항목도 포함하여 반환
    2. API 문서에 `WITHDRAWN` status 추가 및 문서화
  - **프론트 준비**: `toStatus('WITHDRAWN') → 'cancelled'` 매핑은 이미 구현되어 있어, 백엔드 반영 즉시 동작 가능
  - 우선순위: 🟡 보통

---

## 완료

---
