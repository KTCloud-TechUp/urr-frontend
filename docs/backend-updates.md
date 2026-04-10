# 백엔드 업데이트 수신 로그

백엔드 팀에서 전달받은 완료/변경/이슈 사항을 기록합니다.
프론트엔드 대응 작업은 각 항목의 **프론트 대응** 섹션에 기재합니다.

> 상태: ✅ 완료 / 🔶 진행 중 / 🔲 대기 / ⚠️ 이슈

---

## 2026-04-09

---

### 1. 회원가입 마케팅 동의 필드 추가

**백엔드 완료 내용**

- 회원가입 시 기존 화면과 request 필드가 불일치하는 문제 해결
- 온보딩 페이지에서 홈으로 이동 불가 문제 해결
- 회원가입 request에 마케팅 동의(`marketing_consent`) 필드 추가
  - `null` 전송 시 서버에서 `false`로 처리

**프론트 대응** ✅

- [] `register` API 함수(`src/features/auth/api/register.ts`) — `marketingConsent: boolean` 필드 추가
- [] 온보딩 약관 동의 화면에서 마케팅 동의 체크박스 → `marketingConsent` 값 전달
- [] 미체크 시 `false` 기본값 전송 확인

---

### 3. 소셜로그인 ↔ 일반로그인 전환 시 계정 혼선 이슈

**백엔드 전달 내용**

- 소셜로그인 후 로그아웃 → 일반로그인 시 소셜 계정이 유지되는 현상
  - 소셜 → 일반 (새로고침 후 정상): 🔶 조사 중
  - 일반 → 소셜 (정상): ✅
  - 일반 → 일반 (새로고침 후 정상): 🔶 조사 중
- 로그아웃 후 refreshToken·accessToken이 쿠키/세션에서 정상 삭제되는 것은 확인됨
- 백엔드 팀이 추가 조사 진행 중

**현상 요약**

> 로그인 전환 후 페이지를 한 번 새로고침하면 정상적으로 사용자가 바뀜.
> → 토큰 삭제는 됐지만 **클라이언트 메모리(module-level accessToken)** 또는 React Query 캐시가 남아있을 가능성.

**프론트 대응** ✅

- [] `logout` 이후 `accessToken` module-level 변수 초기화 확인 (`src/shared/api/tokenStore.ts`) — `clearToken()` 정상 작동 확인
- [] `logout` 이후 `sessionStorage` 완전 초기화 확인 — `clearToken()` 내 `removeItem(STORAGE_KEY)` 정상 작동 확인
- [] `logout` 이후 TanStack Query `queryClient.clear()` 호출 — `SettingsTab.tsx` 로그아웃 핸들러에 추가 / `AccountDeleteDialog.tsx` 탈퇴 핸들러에도 동일 적용
- [] 소셜 OAuth 콜백(`/auth/callback`) 진입 시 기존 accessToken 잔존 여부 — `SocialCallbackWidget.tsx` 새 토큰 세팅 전 `clearToken()` + `queryClient.clear()` 추가 (카카오·네이버 공통)

---

### 4. 공연 상세 조회 API 수정 버전 추가

**백엔드 완료 내용**

- `GET /api/v1/artists/{artistId}/events/{eventId}` 수정 버전 배포

**기존 스펙** (`docs/api/event_api.md` #18)

- 엔드포인트: `GET /api/v1/artists/{artistId}/events/{eventId}`
- 주요 응답 필드: `eventId`, `artistId`, `artistName`, `title`, `subtitle`, `description`, `venueTemplateId`, `venueTemplateName`, `venueAddress`, `posterImageUrl`, `category`, `tags`, `openDate`, `endDate`, `active`, `runtime`, `ageRating`, `notices`, `identityVerification`, `castInfo`, `cancellationPolicy`, `ticketDelivery`, `sections`, `organizer`

**프론트 대응** 🔲

- [ ] ⚠️ **수정 스펙 미수령**: 변경된 응답 필드·구조 백엔드 팀에 요청 필요
- [ ] 스펙 수령 후 `docs/api/event_api.md` #18 업데이트
- [ ] `src/features/event/api/getEventDetail.ts` — 변경된 타입 반영 (`EventSummary` 인터페이스 포함)
- [ ] `src/features/show/api/getShowDetail.ts` — 연관 변경 여부 확인

---

## 참고

- 백엔드 팀에 전달할 사항은 `docs/backend-requests.md`에 작성
- API 스펙 변경 수령 후에는 `docs/api/` 하위 파일도 함께 업데이트
