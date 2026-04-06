# 백엔드 요청 목록

프론트엔드에서 백엔드 팀에 요청할 API 변경·추가·수정 사항을 기록합니다.

> 형식: 요청 내용 / 이유 / 우선순위 (🔴 긴급 / 🟡 보통 / 🟢 낮음)

---

## 대기 중

### `GET /ticket/users/reservations` 응답에 `transferEligible` 필드 추가 요청

- **요청**: 예약 목록 응답의 각 항목에 `transferEligible: boolean` 필드 추가
- **이유**: 티켓 월렛에서 "양도 등록" 버튼 노출 조건을 판단하려면 양도 가능 여부가 필요함. 현재 `GET /ticket/internal/transfers/{reservationId}/eligibility`가 별도 존재하나, `internal` 경로라 프론트에서 직접 호출하기 부적절하고, N개 티켓마다 N번 추가 호출이 발생하는 N+1 문제가 생김. 목록 응답에 포함하면 한 번에 해결 가능.
- **우선순위**: 🟡 보통

---

## 보류 (프론트에서 해결)

### [해결됨] 홈 히어로 배너 API 추가

`GET /events/home`에 배너 전용 필드가 없어 요청 예정이었으나,  
`trendingEvents` 상위 4개 + `GET /artists`의 `bannerImageUrl` 매핑으로 프론트에서 해결.  
별도 API 요청 불필요.

---

## 완료

_없음_
