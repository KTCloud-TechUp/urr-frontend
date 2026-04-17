# 백엔드 요청 목록

프론트엔드에서 백엔드 팀에 요청할 API 변경·추가·수정 사항을 기록합니다.

> 형식: 요청 내용 / 이유 / 우선순위 (🔴 긴급 / 🟡 보통 / 🟢 낮음)

---

## 대기 중

- 예약/결제 API의 `totalAmount` 금액 오류 수정 요청
  - 예약 응답(`POST /api/v1/reservations`)과 결제 확인 응답의 `totalAmount`가 실제 티켓 가격보다 낮은 값으로 내려옴 (예: 티켓 가격 198,000원인데 totalAmount = 165,000원)
  - 결제 위젯에서 Toss에 넘기는 `amount`와 예매 완료 페이지의 총 결제 금액 모두 이 값을 사용하므로, 실 결제 금액이 잘못 청구됨
  - `totalAmount` = 티켓 가격 합계 + 수수료 합계로 올바르게 계산하여 응답해야 함
  - 우선순위: 🔴 긴급

- `POST /api/v1/ticket/reservations/cancel` 500 Internal Server Error 수정 요청
  - 마이페이지에서 예매 취소 시 500 응답 반환
  - 프론트는 스펙대로 `{ eventId, showId, seatId }` body + `X-User-Id` 헤더 전송 (형식 이상 없음)
  - 예상 원인: ① 이미 CONFIRMED(결제완료) 상태인 예약 취소 시 내부 로직 미처리 ② DB에 저장된 seatId 형식과 프론트 전송값 불일치 ③ `X-User-Id` Long 파싱 오류
  - 백엔드 서버 로그 확인 및 원인 파악 요청
  - 우선순위: 🔴 긴급

---

## 완료

---
