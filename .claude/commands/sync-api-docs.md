# sync-api-docs

`docs/api/` 문서와 실제 백엔드 코드를 비교해 문서를 최신 상태로 업데이트합니다.

## 실행 순서

### 1. 대상 파일 결정

`$ARGUMENTS`가 있으면 해당 서비스만, 없으면 `docs/api/` 아래 모든 `*-service.md`를 처리합니다.

예: `/sync-api-docs auth` → `docs/api/auth-service.md`만 처리  
예: `/sync-api-docs` → 전체 처리

### 2. 각 문서에 대해 반복 실행

각 `docs/api/*-service.md` 파일에 대해 아래 단계를 순서대로 실행하세요.

#### 2-1. 문서 읽기

해당 `-service.md` 파일을 읽어 다음을 파악합니다:
- 상단 `> 백엔드 코드 경로:` 에서 백엔드 서비스 루트 경로 추출
- 문서화된 각 엔드포인트의 HTTP 메서드, 경로, Request Body, Response Body

#### 2-2. 백엔드 컨트롤러 파일 탐색

추출한 경로 하위에서 Controller 파일들을 찾습니다:
```
find <백엔드경로>/src/main/java -name "*Controller.java"
```

각 Controller 파일을 읽어 `@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping`, `@DeleteMapping`, `@RequestMapping` 어노테이션으로 엔드포인트를 식별합니다.

#### 2-3. Request/Response DTO 파일 탐색

Controller에서 파라미터로 쓰인 `@RequestBody` 타입명과 반환 타입명을 추출합니다.  
해당 DTO 클래스 파일을 `find` 또는 `grep`으로 찾아 실제 필드 목록을 확인합니다.

- Request DTO: `@RequestBody` 파라미터 타입
- Response DTO: `ApiResponse<T>` 또는 직접 반환 타입 `T`의 필드

#### 2-4. 차이점 비교

문서의 Request/Response Body와 실제 DTO 필드를 비교합니다:

| 비교 항목 | 확인 내용 |
|-----------|-----------|
| Request 필드명 | 문서 ↔ DTO 필드명 일치 여부 |
| Request 필드 타입 | 문서 ↔ DTO Java 타입 일치 여부 |
| Response 필드명 | 문서 ↔ DTO/record 필드 일치 여부 |
| 신규 필드 | DTO에 있지만 문서에 없는 필드 |
| 삭제 필드 | 문서에 있지만 DTO에 없는 필드 |
| HTTP 메서드/경로 | 문서 ↔ 어노테이션 일치 여부 |

#### 2-5. 문서 업데이트

차이가 발견된 경우에만 해당 `-service.md` 파일을 수정합니다:

1. **변경 내용만 최소 수정** — 관련 섹션(Request Body / Response Body / 필드 설명)만 업데이트
2. **상단 테이블 상태 컬럼** — 스펙 불일치 발견 시 `⚠️ 스펙 불일치`, 일치하면 `✅ 연동됨`으로 수정
3. **마지막 확인 날짜** — 상단 `> 마지막 확인:` 을 오늘 날짜(YYYY-MM-DD)로 업데이트
4. **비고 컬럼** — 변경 이유를 간결하게 기재 (예: "DTO 필드명 변경: `email` → `phoneNumber`")

### 3. 완료 보고

처리한 문서별로 아래 형식으로 보고합니다:

```
## auth-service.md
- ✅ POST /api/v1/auth/oauth/kakao — 일치
- ⚠️ POST /api/v1/auth/sms/send — Request Body 수정: `email` → `phoneNumber`
- ✅ GET /api/v1/auth/me — 일치
...

## event-service.md
- (변경 없음)
```

## 주의사항

- **프론트엔드 코드는 수정하지 않습니다** — `docs/api/` 문서만 업데이트합니다
- DTO 파일을 찾지 못하면 해당 엔드포인트는 건너뛰고 보고서에 `❓ DTO 파일 미발견`으로 표시합니다
- `ApiResponse<T>` 래퍼 안의 `data` 필드 타입을 확인해야 실제 응답 구조를 알 수 있습니다
- Spring의 `record` 타입도 DTO로 간주합니다
- 필드 순서 차이는 무시합니다 (구조가 같으면 일치로 판정)
