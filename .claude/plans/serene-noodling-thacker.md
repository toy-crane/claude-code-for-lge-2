# Todo App UI 리팩토링 계획

## Context
현재 Todo 앱은 커스텀 색상 클래스(`bg-red-100`, `bg-purple-100` 등)를 직접 사용하고, shadcn Badge가 설치되어 있지만 미사용 상태이며, 필터가 버튼 그룹으로 공간을 많이 차지한다. 이번 리팩토링은 shadcn 공식 컴포넌트와 variant 기반 스타일링으로 통일하고, UI 레이아웃을 개선한다.

---

## 단계 0: shadcn 컴포넌트 설치

```bash
bunx shadcn@latest add dropdown-menu popover calendar
```

- `dropdown-menu`, `popover`, `calendar` 컴포넌트 추가
- `react-day-picker`, `date-fns` 의존성 자동 설치

---

## 단계 1: "+" 아이콘 버튼으로 교체

**파일:** `todo-app.tsx`, `todo-input.tsx`

- `todo-app.tsx`: 상단에 헤더 행 추가 (`<h1>Todo</h1>` + `<TodoInput />`)
- `todo-input.tsx`: DialogTrigger를 `<Button variant="ghost" size="icon" aria-label="할 일 추가"><IconPlus /></Button>`으로 변경
- `aria-label="할 일 추가"` 유지 → 기존 테스트 호환

---

## 단계 2: Badge 컴포넌트로 교체 + 커스텀 색상 제거

**파일:** `todo-item.tsx`

- 커스텀 `<span>` → shadcn `<Badge>` 교체
- 우선순위 매핑:
  - `high` → `variant="destructive"` (위험/긴급)
  - `normal` → `variant="secondary"` (기본)
  - `low` → `variant="outline"` (낮은 강조)
- 카테고리 배지: `variant="default"` (primary 색상)
- `bg-red-100`, `bg-blue-100`, `bg-purple-100` 등 커스텀 색상 전부 제거

---

## 단계 3: 필터 + 정렬을 DropdownMenu로 통합

**파일:** `todo-filter-dropdown.tsx` (신규), `todo-app.tsx`

- 상태 필터(전체/진행중/완료) + 카테고리 필터(전체/업무/개인/쇼핑) + 정렬(최신순/이름순/마감일순)을 하나의 DropdownMenu에 통합
- DropdownMenuLabel로 "상태"/"카테고리"/"정렬" 섹션 구분, DropdownMenuSeparator로 분리
- 필터는 DropdownMenuCheckboxItem, 정렬은 DropdownMenuRadioGroup + DropdownMenuRadioItem 사용
- 트리거: `<Button variant="outline" size="icon"><IconFilter /></Button>`
- 검색바 옆에 배치: `<div className="flex gap-2"><TodoSearch /><TodoFilterDropdown /></div>`
- `todo-filter.tsx`, `todo-category-filter.tsx`, `todo-sort.tsx`는 이 단계에서 삭제
- 테스트 수정 필요 (드롭다운 열기 → 메뉴 아이템 선택 패턴)

---

## 단계 4: Date Picker 교체

**파일:** `todo-input.tsx`

- HTML `<input type="date">` → Popover + Calendar 교체
- `dueDate` 상태를 `Date | undefined`로 변경
- `onAdd` 호출 시 `format(dueDate, "yyyy-MM-dd")`로 문자열 변환
- Calendar에 한국어 로케일(`ko`) 적용
- 테스트 수정 필요 (Calendar 날짜 선택 패턴)

---

## 단계 5: 최종 검증

- 전체 코드에서 커스텀 색상 클래스 grep 확인
- 모든 테스트 통과 확인
- UI 동작 확인

---

## 검증 방법

```bash
bun run test                          # 전체 테스트 실행
bun dev                               # 개발 서버에서 UI 확인
grep -r "bg-red-\|bg-blue-\|bg-purple-\|bg-gray-100" components/  # 커스텀 색상 잔존 확인
```

---

## 결정 사항

- 정렬도 필터 드롭다운에 통합 (UI 일관성)
- 마감일 포맷은 `yyyy-MM-dd` 유지
