# TODO 입력 폼 다이얼로그 전환

## Context

현재 `TodoInput`은 텍스트·마감일·우선순위·카테고리가 한 줄에 나열되어 화면을 많이 차지합니다. 다이얼로그 기반으로 전환하여 목록 영역을 최대 확보하고, 폼 필드를 세로 배치해 가독성을 높입니다.

## 수정 파일

1. **`components/ui/dialog.tsx`** (신규) — `bunx --bun shadcn@latest add dialog`
2. **`components/ui/toggle-group.tsx`** (신규) — `bunx --bun shadcn@latest add toggle-group`
3. **`components/ui/field.tsx`** (기존) — FieldGroup, FieldLabel 등 이미 설치 여부 확인 필요
4. **`components/todo-input.tsx`** — 다이얼로그 기반 폼으로 리팩터링
5. **`components/todo-app.test.tsx`** — 다이얼로그 흐름에 맞게 테스트 수정

## 구현 단계

### Step 1: shadcn 컴포넌트 추가
```bash
bunx --bun shadcn@latest add dialog toggle-group
```
- 추가 후 파일을 읽어서 API 확인

### Step 2: TodoInput 리팩터링 (shadcn 규칙 준수)

**메인 화면**: "할 일 추가" `Button`만 표시

**Dialog 내부 폼 구조** (shadcn 규칙 적용):
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>할 일 추가</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>할 일 추가</DialogTitle>
    </DialogHeader>
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="todo-text">할 일</FieldLabel>
        <Input id="todo-text" />
      </Field>
      <Field>
        <FieldLabel htmlFor="todo-due">마감일</FieldLabel>
        <Input id="todo-due" type="date" />
      </Field>
      <Field>
        <FieldLabel id="priority-label">우선순위</FieldLabel>
        <ToggleGroup aria-labelledby="priority-label">
          <ToggleGroupItem value="high">높음</ToggleGroupItem>
          <ToggleGroupItem value="normal">보통</ToggleGroupItem>
          <ToggleGroupItem value="low">낮음</ToggleGroupItem>
        </ToggleGroup>
      </Field>
      <Field>
        <FieldLabel id="category-label">카테고리</FieldLabel>
        <ToggleGroup aria-labelledby="category-label">
          <ToggleGroupItem value="업무">업무</ToggleGroupItem>
          <ToggleGroupItem value="개인">개인</ToggleGroupItem>
          <ToggleGroupItem value="쇼핑">쇼핑</ToggleGroupItem>
        </ToggleGroup>
      </Field>
    </FieldGroup>
    <DialogFooter>
      <Button onClick={handleAdd}>추가</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**주요 shadcn 규칙 체크리스트**:
- FieldGroup + Field로 폼 레이아웃 (raw div 금지)
- ToggleGroup + ToggleGroupItem으로 옵션 선택 (Button 루프 금지)
- DialogTitle 필수 (접근성)
- gap-* 사용 (space-y-* 금지)
- 시맨틱 컬러 사용 (raw color 금지)

### Step 3: 테스트 수정 (Red-Green-Refactor)
- 기존 테스트에 "할 일 추가" 버튼 클릭 → Dialog 열기 단계 추가
- Dialog 내 입력 필드 및 "추가" 버튼으로 상호작용하도록 수정
- 하나씩 실패 확인(Red) → 통과(Green) → 다음 테스트

## 검증
- `bun run test` — 전체 테스트 통과
- `bun run dev` — 브라우저에서 다이얼로그 동작 확인
