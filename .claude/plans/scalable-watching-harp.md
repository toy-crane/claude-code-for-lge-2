# Todo 앱 UI 개선: 5개 컴포넌트 적용

## Context
현재 Todo 앱은 기능적으로 완성되어 있지만, 로딩 상태가 텍스트뿐이고, 우선순위/카테고리가 커스텀 span으로 되어 있으며, 사용자 피드백(토스트)이 없고, 리스트 애니메이션이 없어 시각적으로 밋밋하다. shadcn/magicui 레지스트리의 컴포넌트를 활용해 UX를 개선한다.

---

## 구현 순서

### Step 1: Badge 설치 및 적용
**설치**: `bunx --bun shadcn@latest add badge`
**수정 파일**: `components/todo-item.tsx`

- 우선순위 span → Badge 교체
  - high → `variant="destructive"`
  - normal → `variant="secondary"`
  - low → `variant="outline"` + `className="border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300"`
- 카테고리 span → `<Badge variant="default">`로 교체
- 레이아웃 클래스(`shrink-0`)는 Badge의 className으로 유지

### Step 2: Skeleton 설치 및 적용
**설치**: `bunx --bun shadcn@latest add skeleton`
**수정 파일**: `components/todo-app.tsx`

- `isLoaded === false` 시 `<p>불러오는 중...</p>` → Skeleton UI로 교체
- TodoInput 버튼, 검색바, 필터, Todo 아이템 3개의 스켈레톤 모양 구성

### Step 3: Progress 설치 및 적용
**설치**: `bunx --bun shadcn@latest add progress`
**수정 파일**: `components/todo-app.tsx`

- 전체 todos 기준 완료율 계산: `completedCount / todos.length * 100`
- TodoInput과 TodoSearch 사이에 Progress 바 + "완료율 N/M" 텍스트 배치
- `todos.length === 0`이면 Progress 숨김

### Step 4: Sonner 설치 및 적용
**설치**: `bunx --bun shadcn@latest add sonner`
**수정 파일 2개**:

1. `app/layout.tsx` — `<Toaster />` 추가 (ThemeProvider 내부)
2. `components/todo-app.tsx` — toast 호출 래퍼 함수 작성
   - `handleAdd`: "할 일이 추가되었습니다"
   - `handleToggle`: 완료 ↔ 미완료 상태에 따라 메시지 분기
   - `handleDelete`: "삭제되었습니다"

### Step 5: Animated List 설치 및 적용
**설치**: `bunx --bun shadcn@latest add @magicui/animated-list`
**수정 파일**: `components/todo-list.tsx`

- `"use client"` 지시문 추가
- 기존 `<div>` → `<AnimatedList>`로 교체
- 설치 후 AnimatedList의 실제 API 확인 필요 (delay prop 등)
- `divide-y` 호환성 확인 → 비호환 시 각 TodoItem에 border-b 적용

---

## 주의사항

- **테스트 영향**: AnimatedList가 순차 렌더링하면 기존 테스트(checkbox 개수 확인)가 깨질 수 있음. 필요 시 테스트에서 AnimatedList를 mock 처리
- **toast 테스트**: 기존 테스트는 toast를 검증하지 않으므로 영향 없음. Toaster 미렌더링 시 toast 호출은 무시됨
- **Badge variant**: low 우선순위는 기본 variant에 파란색이 없으므로 outline + className으로 처리

---

## 검증 방법
1. `bun run dev`로 개발 서버 실행 후 브라우저에서 확인
2. 각 기능 수동 테스트:
   - 로딩 시 Skeleton 표시 확인
   - 할 일 추가/완료/삭제 시 toast 알림 확인
   - 우선순위/카테고리 Badge 스타일 확인
   - Progress 바 완료율 반영 확인
   - 리스트 아이템 애니메이션 확인
3. `bun test` 실행하여 기존 테스트 통과 확인
