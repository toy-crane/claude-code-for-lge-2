# Todo에 URL 메타데이터 기능 추가

## Context
Todo 폼에 선택적 URL 입력 필드를 추가하고, 입력된 URL에서 defuddle CLI로 메타데이터(title, description)를 추출하여 todo의 description에 저장하는 기능.

## 변경 계획

### 1. defuddle 전역 설치
- `npm install -g defuddle` (이미 설치되어 있지 않다면)

### 2. Todo 타입에 `description` 필드 추가
- **파일**: `hooks/use-todos.ts`
- `Todo` 타입에 `description?: string` 추가
- `addTodo` 함수 시그니처에 `description` 파라미터 추가

### 3. API Route 생성: URL 메타데이터 추출
- **파일**: `app/api/metadata/route.ts` (새로 생성)
- POST 요청으로 URL을 받음
- 서버에서 `defuddle parse <url> --json` 실행하여 title, description 추출
- **응답에서 title, description만 pick하여 반환** (`server-serialization` 규칙: 불필요한 데이터 직렬화 방지)
- **에러 처리**: try-catch로 감싸고, 실패 시 적절한 HTTP 상태 코드(400/500)와 에러 메시지 반환

### 4. Todo 폼에 URL 입력 필드 추가
- **파일**: `components/todo-input.tsx`
- 선택적 URL 입력 필드 추가
- URL 입력 시 API 호출하여 메타데이터 가져오기
- **`useTransition`으로 로딩 상태 관리** (`rendering-usetransition-loading` 규칙: 수동 useState 대신 isPending 사용)
- **에러 발생 시 사용자에게 피드백 표시** (toast 또는 인라인 메시지)
- 가져온 메타데이터를 description으로 자동 설정

### 5. Todo 항목에 description 표시
- **파일**: `components/todo-item.tsx`
- description이 있으면 text 아래에 표시

### 6. 테스트 작성
- **파일**: `components/todo-app.test.tsx`
- URL 없이 추가 → 기존과 동일하게 동작
- URL 입력 시 description이 표시되는지 확인
- **API 실패 시 에러 처리 테스트**
- **로딩 중 상태 표시 테스트**

## 수정 파일 목록
1. `hooks/use-todos.ts` — Todo 타입, addTodo 수정
2. `app/api/metadata/route.ts` — 새로 생성 (defuddle 실행)
3. `components/todo-input.tsx` — URL 입력 필드 추가
4. `components/todo-item.tsx` — description 표시
5. `components/todo-app.test.tsx` — 테스트 추가

## 검증 방법
1. `bun run test`로 테스트 통과 확인
2. 브라우저에서 URL 없이 todo 추가 → 기존과 동일
3. 브라우저에서 URL 입력 후 todo 추가 → description에 메타데이터 표시
